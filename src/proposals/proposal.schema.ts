import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Proposal {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: 'pending' })
  status: string; // 'pending', 'accepted', 'rejected', 'completed'
}

export type ProposalDocument = Proposal & Document;
export const ProposalSchema = SchemaFactory.createForClass(Proposal);
