import { Module } from '@nestjs/common'
import { TasksModule } from './application/modules/tasks/tasks.module'
import { ProjectsModule } from './application/modules/projects/projects.module'

@Module({
  imports: [TasksModule, ProjectsModule]
})
export class AppModule {}
