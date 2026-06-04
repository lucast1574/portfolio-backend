import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './project.schema';
import { ProjectsService } from './projects.service';
import { ProjectsResolver } from './projects.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }])],
  providers: [ProjectsService, ProjectsResolver],
})
export class ProjectsModule {}
