import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './project.schema';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private model: Model<ProjectDocument>) {}

  findAll(includeHidden = false) {
    const q = includeHidden ? {} : { visible: true };
    return this.model.find(q).sort({ order: 1, createdAt: -1 }).exec();
  }

  findOne(idOrSlug: string) {
    const isObjectId = /^[a-f0-9]{24}$/i.test(idOrSlug);
    return isObjectId
      ? this.model.findById(idOrSlug).exec()
      : this.model.findOne({ slug: idOrSlug }).exec();
  }

  create(data: any) {
    const doc: any = { ...data };
    if (data.screenshots) {
      doc.screenshots = data.screenshots.map((s: any) => ({
        url: s.url,
        caption: { es: { name: s.captionEs || '' }, en: { name: s.captionEn || '' } },
      }));
    }
    return this.model.create(doc);
  }

  async update(id: string, data: any) {
    const doc: any = { ...data };
    if (data.screenshots) {
      doc.screenshots = data.screenshots.map((s: any) => ({
        url: s.url,
        caption: { es: { name: s.captionEs || '' }, en: { name: s.captionEn || '' } },
      }));
    }
    const r = await this.model.findByIdAndUpdate(id, doc, { new: true }).exec();
    if (!r) throw new NotFoundException();
    return r;
  }

  async remove(id: string) {
    const r = await this.model.findByIdAndDelete(id).exec();
    return !!r;
  }
}
