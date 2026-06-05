import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { ProposalType, CreateProposalInput } from './proposal.dto';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

const toGql = (p: any): any => {
  if (!p) return null;
  const obj = p.toObject ? p.toObject() : p;
  return {
    id: obj._id.toString(),
    name: obj.name,
    email: obj.email,
    title: obj.title,
    message: obj.message,
    status: obj.status,
    createdAt: obj.createdAt,
  };
};

@Resolver(() => ProposalType)
export class ProposalsResolver {
  constructor(private svc: ProposalsService) {}

  @Query(() => [ProposalType])
  @UseGuards(GqlAuthGuard)
  async proposals() {
    const docs = await this.svc.findAll();
    return docs.map(toGql);
  }

  @Mutation(() => ProposalType)
  async createProposal(@Args('input') input: CreateProposalInput) {
    const doc = await this.svc.create(input);
    return toGql(doc);
  }

  @Mutation(() => ProposalType)
  @UseGuards(GqlAuthGuard)
  async acceptProposal(@Args('id') id: string) {
    const doc = await this.svc.accept(id);
    return toGql(doc);
  }

  @Mutation(() => ProposalType)
  @UseGuards(GqlAuthGuard)
  async rejectProposal(@Args('id') id: string) {
    const doc = await this.svc.reject(id);
    return toGql(doc);
  }

  @Mutation(() => ProposalType)
  @UseGuards(GqlAuthGuard)
  async completeProposal(@Args('id') id: string) {
    const doc = await this.svc.complete(id);
    return toGql(doc);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteProposal(@Args('id') id: string) {
    return this.svc.remove(id);
  }
}
