import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}

  findByUsername(username: string) {
    return this.model.findOne({ username }).exec();
  }

  async touchLogin(id: string) {
    await this.model.updateOne({ _id: id }, { lastLogin: new Date() }).exec();
  }
}
