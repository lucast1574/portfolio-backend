import { Field, ObjectType, InputType, Int } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class I18nText {
  @Field({ nullable: true }) name?: string;
  @Field({ nullable: true }) tagline?: string;
  @Field({ nullable: true }) description?: string;
  @Field({ nullable: true }) longDescription?: string;
}

@ObjectType()
export class Repo {
  @Field() type: string;
  @Field() url: string;
  @Field({ nullable: true }) label?: string;
  @Field() isPublic: boolean;
}

@ObjectType()
export class Links {
  @Field({ nullable: true }) web?: string;
  @Field({ nullable: true }) playStore?: string;
  @Field({ nullable: true }) appStore?: string;
}

@ObjectType()
export class Screenshot {
  @Field() url: string;
  @Field({ nullable: true }) caption?: string;
}

@ObjectType()
export class ProjectType {
  @Field() id: string;
  @Field() slug: string;
  @Field(() => Int) order: number;
  @Field() featured: boolean;
  @Field() color: string;
  @Field(() => I18nText) i18n: I18nText;
  @Field(() => [Repo]) repos: Repo[];
  @Field(() => Links) links: Links;
  @Field() isMobile: boolean;
  @Field(() => [String]) tech: string[];
  @Field(() => [Screenshot]) screenshots: Screenshot[];
  @Field({ nullable: true }) thumbnail?: string;
  @Field(() => Int, { nullable: true }) year?: number;
  @Field() visible: boolean;
}

@InputType()
class I18nTextInput {
  @Field() name: string;
  @Field({ nullable: true }) tagline?: string;
  @Field({ nullable: true }) description?: string;
  @Field({ nullable: true }) longDescription?: string;
}

@InputType()
class I18nMapInput {
  @Field(() => I18nTextInput) es: I18nTextInput;
  @Field(() => I18nTextInput) en: I18nTextInput;
}

@InputType()
class RepoInput {
  @Field() type: string;
  @Field() url: string;
  @Field({ nullable: true }) label?: string;
  @Field({ defaultValue: true }) isPublic: boolean;
}

@InputType()
class LinksInput {
  @Field({ nullable: true }) web?: string;
  @Field({ nullable: true }) playStore?: string;
  @Field({ nullable: true }) appStore?: string;
}

@InputType()
class ScreenshotInput {
  @Field() url: string;
  @Field({ nullable: true }) captionEs?: string;
  @Field({ nullable: true }) captionEn?: string;
}

@InputType()
export class CreateProjectInput {
  @Field() slug: string;
  @Field(() => Int, { defaultValue: 0 }) order: number;
  @Field({ defaultValue: false }) featured: boolean;
  @Field({ defaultValue: '#6366f1' }) color: string;
  @Field(() => I18nMapInput) i18n: I18nMapInput;
  @Field(() => [RepoInput], { defaultValue: [] }) repos: RepoInput[];
  @Field(() => LinksInput, { nullable: true }) links?: LinksInput;
  @Field({ defaultValue: false }) isMobile: boolean;
  @Field(() => [String], { defaultValue: [] }) tech: string[];
  @Field(() => [ScreenshotInput], { defaultValue: [] }) screenshots: ScreenshotInput[];
  @Field({ nullable: true }) thumbnail?: string;
  @Field(() => Int, { nullable: true }) year?: number;
  @Field({ defaultValue: true }) visible: boolean;
}

@InputType()
export class UpdateProjectInput {
  @Field() id: string;
  @Field({ nullable: true }) slug?: string;
  @Field(() => Int, { nullable: true }) order?: number;
  @Field({ nullable: true }) featured?: boolean;
  @Field({ nullable: true }) color?: string;
  @Field(() => I18nMapInput, { nullable: true }) i18n?: I18nMapInput;
  @Field(() => [RepoInput], { nullable: true }) repos?: RepoInput[];
  @Field(() => LinksInput, { nullable: true }) links?: LinksInput;
  @Field({ nullable: true }) isMobile?: boolean;
  @Field(() => [String], { nullable: true }) tech?: string[];
  @Field(() => [ScreenshotInput], { nullable: true }) screenshots?: ScreenshotInput[];
  @Field({ nullable: true }) thumbnail?: string;
  @Field(() => Int, { nullable: true }) year?: number;
  @Field({ nullable: true }) visible?: boolean;
}
