import { Module } from '@nestjs/common'
import { TasksModule } from './application/modules/tasks/tasks.module'
import { ProjectsModule } from './application/modules/projects/projects.module'
import { PrismaModule } from './common/modules/prisma/prisma.module'
import { AgentModule } from './agents/agent/agent.module';

@Module({
  imports: [TasksModule, ProjectsModule, PrismaModule, AgentModule]
})
export class AppModule {}
