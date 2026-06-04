import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SiteConfig, SiteConfigSchema } from './site-config.schema';
import { SiteConfigService } from './site-config.service';
import { SiteConfigResolver } from './site-config.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: SiteConfig.name, schema: SiteConfigSchema }])],
  providers: [SiteConfigService, SiteConfigResolver],
  exports: [SiteConfigService],
})
export class SiteConfigModule {}
