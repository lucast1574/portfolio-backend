import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SiteConfig, SiteConfigDocument } from './site-config.schema';

@Injectable()
export class SiteConfigService {
  constructor(@InjectModel(SiteConfig.name) private model: Model<SiteConfigDocument>) {}

  async get() {
    let doc = await this.model.findOne({ key: 'main' }).exec();
    if (!doc) {
      doc = await this.model.create({
        key: 'main',
        i18n: {
          es: { name: 'Lucas Santillan', role: 'Full Stack Developer', bio: '' },
          en: { name: 'Lucas Santillan', role: 'Full Stack Developer', bio: '' },
        },
        social: { github: 'https://github.com/lucast1574' },
      });
    }
    return doc;
  }

  async update(patch: any) {
    return this.model.findOneAndUpdate({ key: 'main' }, patch, { new: true, upsert: true }).exec();
  }
}
