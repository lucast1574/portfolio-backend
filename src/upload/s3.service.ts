import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

/**
 * Thin S3-compatible client wrapper. Works against MinIO (s3.nexode.app)
 * or any S3-compatible service. All config is env-driven.
 *
 * Required env vars:
 *   S3_ENDPOINT          e.g. https://s3.nexode.app
 *   S3_REGION            e.g. us-east-1
 *   S3_ACCESS_KEY_ID
 *   S3_SECRET_ACCESS_KEY
 *   S3_BUCKET            e.g. portfolio-assets
 *   S3_PUBLIC_BASE_URL   public URL prefix used to build returned URLs
 *                        (e.g. https://s3.nexode.app/portfolio-assets
 *                         or https://cdn.santillan.pro)
 */
@Injectable()
export class S3Service implements OnModuleInit {
  private readonly logger = new Logger(S3Service.name);
  private client: S3Client;
  bucket: string;
  publicBaseUrl: string;
  enabled = false;

  onModuleInit() {
    const endpoint = process.env.S3_ENDPOINT;
    const region = process.env.S3_REGION || 'us-east-1';
    const accessKeyId = process.env.S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
    this.bucket = process.env.S3_BUCKET || '';
    this.publicBaseUrl = (process.env.S3_PUBLIC_BASE_URL || '').replace(/\/+$/, '');

    if (!endpoint || !accessKeyId || !secretAccessKey || !this.bucket) {
      this.logger.warn(
        'S3 upload disabled: missing S3_ENDPOINT / S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY / S3_BUCKET',
      );
      return;
    }

    this.client = new S3Client({
      endpoint,
      region,
      credentials: { accessKeyId, secretAccessKey },
      // Path-style works with both MinIO and AWS S3 in current SDK
      forcePathStyle: true,
    });
    this.enabled = true;
    this.logger.log(
      `S3 upload ready → bucket=${this.bucket}, endpoint=${endpoint}, publicBase=${this.publicBaseUrl || '(derived from endpoint+bucket)'}`,
    );
  }

  /** Build the public URL for a stored object key. */
  publicUrl(key: string): string {
    if (this.publicBaseUrl) return `${this.publicBaseUrl}/${key}`;
    const endpoint = (process.env.S3_ENDPOINT || '').replace(/\/+$/, '');
    return `${endpoint}/${this.bucket}/${key}`;
  }

  async putObject(params: {
    key: string;
    body: Buffer;
    contentType: string;
    cacheControl?: string;
  }): Promise<{ url: string; key: string }> {
    if (!this.enabled) {
      throw new Error('S3 not configured on this server');
    }
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: params.key,
        Body: params.body,
        ContentType: params.contentType,
        CacheControl: params.cacheControl || 'public, max-age=31536000, immutable',
        ACL: 'public-read',
      }),
    );
    return { url: this.publicUrl(params.key), key: params.key };
  }
}
