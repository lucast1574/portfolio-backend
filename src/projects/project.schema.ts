import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class I18nText {
  @Prop() name: string;
  @Prop() tagline: string;
  @Prop() description: string;
  @Prop() longDescription: string;
}
const I18nTextSchema = SchemaFactory.createForClass(I18nText);

@Schema({ _id: false })
class I18nMap {
  @Prop({ type: I18nTextSchema }) es: I18nText;
  @Prop({ type: I18nTextSchema }) en: I18nText;
}
const I18nMapSchema = SchemaFactory.createForClass(I18nMap);

@Schema({ _id: false })
class Repo {
  @Prop({ required: true }) type: string;
  @Prop({ required: true }) url: string;
  @Prop() label?: string;
  @Prop({ default: true }) isPublic: boolean;
}
const RepoSchema = SchemaFactory.createForClass(Repo);

@Schema({ _id: false })
class Links {
  @Prop() web?: string;
  @Prop() playStore?: string;
  @Prop() appStore?: string;
  @Prop() windows?: string;
  @Prop() macOS?: string;
  @Prop() linux?: string;
  @Prop() msStore?: string;
}
const LinksSchema = SchemaFactory.createForClass(Links);

@Schema({ _id: false })
class Screenshot {
  @Prop({ required: true }) url: string;
  @Prop({ type: I18nMapSchema }) caption?: any;
}
const ScreenshotSchema = SchemaFactory.createForClass(Screenshot);

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ default: 0, index: true })
  order: number;

  @Prop({ default: false })
  featured: boolean;

  @Prop({ default: '#6366f1' })
  color: string;

  @Prop({ type: I18nMapSchema, required: true })
  i18n: any;

  @Prop({ type: [RepoSchema], default: [] })
  repos: any[];

  @Prop({ type: LinksSchema, default: {} })
  links: any;

  @Prop({ default: false })
  isMobile: boolean;

  @Prop({ type: [String], default: [] })
  tech: string[];

  @Prop({ type: [ScreenshotSchema], default: [] })
  screenshots: any[];

  @Prop()
  thumbnail?: string;

  @Prop()
  year?: number;

  @Prop({ default: true })
  visible: boolean;
}

export type ProjectDocument = Project & Document;
export const ProjectSchema = SchemaFactory.createForClass(Project);
