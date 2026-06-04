import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class I18nProfile {
  @Prop() name: string;
  @Prop() role: string;
  @Prop() bio: string;
}
const I18nProfileSchema = SchemaFactory.createForClass(I18nProfile);

@Schema({ _id: false })
class I18nMap {
  @Prop({ type: I18nProfileSchema }) es: I18nProfile;
  @Prop({ type: I18nProfileSchema }) en: I18nProfile;
}
const I18nMapSchema = SchemaFactory.createForClass(I18nMap);

@Schema({ _id: false })
class Social {
  @Prop() github?: string;
  @Prop() linkedin?: string;
  @Prop() youtube?: string;
  @Prop() email?: string;
}
const SocialSchema = SchemaFactory.createForClass(Social);

@Schema({ timestamps: true })
export class SiteConfig {
  @Prop({ default: 'main', unique: true })
  key: string;

  @Prop({ type: I18nMapSchema })
  i18n: any;

  @Prop({ type: SocialSchema, default: {} })
  social: any;

  @Prop()
  avatar?: string;
}

export type SiteConfigDocument = SiteConfig & Document;
export const SiteConfigSchema = SchemaFactory.createForClass(SiteConfig);
