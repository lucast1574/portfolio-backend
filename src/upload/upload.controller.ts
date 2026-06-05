import {
  BadRequestException,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Logger,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { randomBytes } from 'crypto';
import { S3Service } from './s3.service';

const ALLOWED_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
  'image/gif',
]);
const EXT_BY_MIME: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/gif': 'gif',
};

function sanitizeSlug(input: string): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

@Controller('upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);
  constructor(private readonly s3: S3Service) {}

  /**
   * POST /upload/logo?slug=<optional>
   * multipart/form-data with field name "file".
   * Requires admin JWT (cookie pf_token or Bearer).
   * Returns { url, key }.
   */
  @Post('logo')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogo(
    @UploadedFile() file: Express.Multer.File,
    @Query('slug') slug?: string,
  ): Promise<{ url: string; key: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded (field name must be "file")');
    }
    const mime = (file.mimetype || '').toLowerCase();
    if (!ALLOWED_MIME.has(mime)) {
      throw new BadRequestException(
        `Unsupported file type: ${mime || 'unknown'}. Allowed: PNG, JPG, WebP, SVG, GIF.`,
      );
    }
    if (file.size <= 0) throw new BadRequestException('Empty file');
    if (!this.s3.enabled) {
      throw new InternalServerErrorException(
        'Object storage is not configured on this server. Ask the admin to set S3_* env vars.',
      );
    }

    const ext = EXT_BY_MIME[mime] || 'bin';
    const prefix = sanitizeSlug(slug || '') || 'logo';
    const rand = randomBytes(4).toString('hex');
    const stamp = Date.now().toString(36);
    const key = `logos/${prefix}-${stamp}-${rand}.${ext}`;

    try {
      const out = await this.s3.putObject({
        key,
        body: file.buffer,
        contentType: mime,
      });
      this.logger.log(`Uploaded logo → ${out.url} (${file.size} bytes)`);
      return out;
    } catch (err: any) {
      this.logger.error(`Logo upload failed: ${err?.message || err}`, err?.stack);
      throw new InternalServerErrorException(
        `Upload failed: ${err?.message || 'unknown error'}`,
      );
    }
  }
}
