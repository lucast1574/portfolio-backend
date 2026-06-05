import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProposalType {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  title: string;

  @Field()
  message: string;

  @Field()
  status: string;

  @Field()
  createdAt: Date;
}

@InputType()
export class CreateProposalInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  title: string;

  @Field()
  message: string;
}
