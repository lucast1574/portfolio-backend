import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectType, CreateProjectInput, UpdateProjectInput } from './project.dto';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

const toGql = (p: any, locale: 'es' | 'en' = 'es'): any => {
  if (!p) return null;
  const obj = p.toObject ? p.toObject() : p;
  const i18nNode = obj.i18n?.[locale] || obj.i18n?.es || obj.i18n?.en || {};
  return {
    id: obj._id.toString(),
    slug: obj.slug,
    order: obj.order,
    featured: obj.featured,
    color: obj.color,
    i18n: {
      name: i18nNode.name || '',
      tagline: i18nNode.tagline || '',
      description: i18nNode.description || '',
      longDescription: i18nNode.longDescription || '',
    },
    repos: obj.repos || [],
    links: obj.links || {},
    isMobile: obj.isMobile,
    tech: obj.tech || [],
    screenshots: (obj.screenshots || []).map((s: any) => ({
      url: s.url,
      caption: s.caption?.[locale]?.name || s.caption?.es?.name || '',
    })),
    thumbnail: obj.thumbnail,
    year: obj.year,
    visible: obj.visible,
  };
};

@Resolver(() => ProjectType)
export class ProjectsResolver {
  constructor(private svc: ProjectsService) {}

  @Query(() => [ProjectType])
  async projects(
    @Args('locale', { defaultValue: 'es' }) locale: string,
    @Args('includeHidden', { defaultValue: false }) includeHidden: boolean,
  ) {
    const docs = await this.svc.findAll(includeHidden);
    const loc = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';
    return docs.map((d) => toGql(d, loc));
  }

  @Query(() => ProjectType, { nullable: true })
  async project(
    @Args('idOrSlug') idOrSlug: string,
    @Args('locale', { defaultValue: 'es' }) locale: string,
  ) {
    const doc = await this.svc.findOne(idOrSlug);
    return doc ? toGql(doc, (locale === 'en' ? 'en' : 'es') as any) : null;
  }

  @Mutation(() => ProjectType)
  @UseGuards(GqlAuthGuard)
  async createProject(@Args('input') input: CreateProjectInput) {
    const doc = await this.svc.create(input);
    return toGql(doc, 'es');
  }

  @Mutation(() => ProjectType)
  @UseGuards(GqlAuthGuard)
  async updateProject(@Args('input') input: UpdateProjectInput) {
    const { id, ...rest } = input;
    const doc = await this.svc.update(id, rest);
    return toGql(doc, 'es');
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteProject(@Args('id') id: string) {
    return this.svc.remove(id);
  }
}
