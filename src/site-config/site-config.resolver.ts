import { Args, Field, InputType, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SiteConfigService } from './site-config.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@ObjectType()
class Profile {
  @Field() name: string;
  @Field() role: string;
  @Field() bio: string;
}

@ObjectType()
class Social {
  @Field({ nullable: true }) github?: string;
  @Field({ nullable: true }) linkedin?: string;
  @Field({ nullable: true }) youtube?: string;
  @Field({ nullable: true }) email?: string;
}

@ObjectType()
class SiteConfigType {
  @Field(() => Profile) profile: Profile;
  @Field(() => Social) social: Social;
  @Field({ nullable: true }) avatar?: string;
}

@InputType()
class ProfileInput {
  @Field() name: string;
  @Field() role: string;
  @Field() bio: string;
}

@InputType()
class SocialInput {
  @Field({ nullable: true }) github?: string;
  @Field({ nullable: true }) linkedin?: string;
  @Field({ nullable: true }) youtube?: string;
  @Field({ nullable: true }) email?: string;
}

@InputType()
class UpdateSiteConfigInput {
  @Field(() => ProfileInput, { nullable: true }) profileEs?: ProfileInput;
  @Field(() => ProfileInput, { nullable: true }) profileEn?: ProfileInput;
  @Field(() => SocialInput, { nullable: true }) social?: SocialInput;
  @Field({ nullable: true }) avatar?: string;
}

@Resolver()
export class SiteConfigResolver {
  constructor(private svc: SiteConfigService) {}

  @Query(() => SiteConfigType)
  async siteConfig(@Args('locale', { defaultValue: 'es' }) locale: string) {
    const doc: any = await this.svc.get();
    const loc = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';
    const p = doc.i18n?.[loc] || doc.i18n?.es || {};
    return {
      profile: { name: p.name || '', role: p.role || '', bio: p.bio || '' },
      social: doc.social || {},
      avatar: doc.avatar,
    };
  }

  @Mutation(() => SiteConfigType)
  @UseGuards(GqlAuthGuard)
  async updateSiteConfig(@Args('input') input: UpdateSiteConfigInput) {
    const current: any = await this.svc.get();
    const i18n = { ...(current.i18n || {}) };
    if (input.profileEs) i18n.es = input.profileEs;
    if (input.profileEn) i18n.en = input.profileEn;
    const social = input.social ? { ...(current.social || {}), ...input.social } : current.social;
    const avatar = input.avatar !== undefined ? input.avatar : current.avatar;
    const doc: any = await this.svc.update({ i18n, social, avatar });
    return {
      profile: { name: doc.i18n.es.name, role: doc.i18n.es.role, bio: doc.i18n.es.bio },
      social: doc.social,
      avatar: doc.avatar,
    };
  }
}
