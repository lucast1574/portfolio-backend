import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Proposal, ProposalDocument } from './proposal.schema';
import { SiteConfigService } from '../site-config/site-config.service';

@Injectable()
export class ProposalsService {
  constructor(
    @InjectModel(Proposal.name) private model: Model<ProposalDocument>,
    private siteConfigSvc: SiteConfigService,
  ) {}

  async create(data: any) {
    return this.model.create(data);
  }

  async findAll() {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    return this.model.findById(id).exec();
  }

  async accept(id: string) {
    const proposal = await this.model.findById(id);
    if (!proposal) throw new NotFoundException('Proposal not found');

    proposal.status = 'accepted';
    await proposal.save();

    // Update site config to reflect that we are working on this proposal
    await this.siteConfigSvc.update({
      workingOn: {
        title: proposal.title,
        name: proposal.name,
        proposalId: proposal._id.toString(),
      },
    });

    return proposal;
  }

  async reject(id: string) {
    const proposal = await this.model.findById(id);
    if (!proposal) throw new NotFoundException('Proposal not found');

    proposal.status = 'rejected';
    await proposal.save();

    // If this proposal was the one being worked on, clear it
    const config = await this.siteConfigSvc.get();
    if (config.workingOn?.proposalId === id) {
      await this.siteConfigSvc.update({ clearWorkingOn: true });
    }

    return proposal;
  }

  async complete(id: string) {
    const proposal = await this.model.findById(id);
    if (!proposal) throw new NotFoundException('Proposal not found');

    proposal.status = 'completed';
    await proposal.save();

    // Clear the active work status on the website
    const config = await this.siteConfigSvc.get();
    if (config.workingOn?.proposalId === id) {
      await this.siteConfigSvc.update({ clearWorkingOn: true });
    }

    return proposal;
  }

  async remove(id: string) {
    const r = await this.model.findByIdAndDelete(id).exec();
    if (r) {
      const config = await this.siteConfigSvc.get();
      if (config.workingOn?.proposalId === id) {
        await this.siteConfigSvc.update({ clearWorkingOn: true });
      }
    }
    return !!r;
  }
}
