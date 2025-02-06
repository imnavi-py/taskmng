import { Module } from '@nestjs/common'
import { AgentController } from './agent.controller'
import { AgentService } from './agent.service'
import { HttpModule } from '@nestjs/axios'
import { PrismaService } from '~/common/modules/prisma/prisma.service'

@Module({
  imports: [HttpModule],
  controllers: [AgentController],
  providers: [AgentService, PrismaService]
})
export class AgentModule {}
