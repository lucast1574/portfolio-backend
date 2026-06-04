import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { AppModule } from './app.module';
import { User } from './users/user.schema';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userModel: any = app.get(getModelToken(User.name));
  const username = process.env.SEED_USERNAME || 'lucas';
  const password = process.env.SEED_PASSWORD;
  if (!password) {
    console.error('SEED_PASSWORD env var required');
    await app.close();
    process.exit(1);
  }
  const existing = await userModel.findOne({ username });
  if (existing) {
    console.log(`User ${username} already exists, updating password...`);
    existing.passwordHash = await bcrypt.hash(password, 12);
    await existing.save();
  } else {
    await userModel.create({ username, passwordHash: await bcrypt.hash(password, 12) });
    console.log(`Created user ${username}`);
  }
  await app.close();
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
