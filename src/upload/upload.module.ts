import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from '../auth/auth.module';
import { UploadController } from './upload.controller';
import { S3Service } from './s3.service';

@Module({
  imports: [
    AuthModule,
    MulterModule.register({
      limits: {
        // 4 MB max per file — logos must be small.
        fileSize: 4 * 1024 * 1024,
      },
    }),
  ],
  controllers: [UploadController],
  providers: [S3Service],
})
export class UploadModule {}
