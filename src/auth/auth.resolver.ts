import { Args, Context, Field, Mutation, ObjectType, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';
import * as bcrypt from 'bcrypt';
import { ForbiddenException } from '@nestjs/common';

@ObjectType()
class LoginResult {
  @Field() token: string;
  @Field() username: string;
}

@Resolver()
export class AuthResolver {
  constructor(
    private auth: AuthService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  @Mutation(() => Boolean)
  async bootstrapAdmin(
    @Args('username') username: string,
    @Args('password') password: string,
    @Args('secret') secret: string,
  ): Promise<boolean> {
    const expected = process.env.BOOTSTRAP_SECRET;
    if (!expected || secret !== expected) throw new ForbiddenException();
    const count = await this.userModel.countDocuments();
    if (count > 0) throw new ForbiddenException('Already bootstrapped');
    await this.userModel.create({ username, passwordHash: await bcrypt.hash(password, 12) });
    return true;
  }

  @Mutation(() => LoginResult)
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
    @Context() ctx: any,
  ): Promise<LoginResult> {
    const r = await this.auth.login(username, password);
    const res: Response = ctx.res;
    const secure = process.env.NODE_ENV === 'production';
    res.cookie('pf_token', r.token, {
      httpOnly: true,
      secure,
      sameSite: secure ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    return r;
  }

  @Mutation(() => Boolean)
  async logout(@Context() ctx: any): Promise<boolean> {
    ctx.res.clearCookie('pf_token', { path: '/' });
    return true;
  }
}
