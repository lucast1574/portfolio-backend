import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Proposal, ProposalSchema } from './proposal.schema';
import { ProposalsService } from './proposals.service';
import { ProposalsResolver } from './proposals.resolver';
import { SiteConfigModule } from '../site-config/site-config.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Proposal.name, schema: ProposalSchema }]),
    SiteConfigModule,
  ],
  providers: [ProposalsService, ProposalsResolver],
})
export class ProposalsModule {}
