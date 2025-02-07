import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { CreateAgentDto } from './dto/create-agent.dto'
import { PrismaService } from '~/common/modules/prisma/prisma.service'
import { Agent, workStatusEnum } from '@prisma/client'

@Injectable()
export class AgentService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService
  ) {}

  async createAgent(data: CreateAgentDto, queryParams: Record<string, any>) {
    const agent = await this.prisma.agent.create({
      data: {
        webhook: data.webhook,
        logo: data.logo,
        title: data.title,
        description: data.description,
        params: queryParams
      }
    })
    try {
      const response = await this.httpService.axiosRef.post(data.webhook, queryParams)

      if (response.status === 200) {
        await this.updateAgentStatus(agent.id, workStatusEnum.ok)
      }
    } catch {
      await this.updateAgentStatus(agent.id, workStatusEnum.faild)
      throw new BadRequestException('Failed to send data to webhook: Webhook not reachable')
    }

    return agent
  }

  async findById(id: number): Promise<Omit<Agent, 'webhook'>> {
    const agent = await this.prisma.agent.findUnique({
      where: { id }
    })
    if (!agent) {
      throw new NotFoundException(`Agent ${id} not found`)
    }
    const { webhook: _, ...result } = agent
    return result
  }

  async findAll() {
    const agents = await this.prisma.agent.findMany()
    return agents.map(({ webhook, ...result }) => result)
  }

  private async updateAgentStatus(agentId: number, status: workStatusEnum) {
    return this.prisma.agent.update({
      where: { id: agentId },
      data: { status: status }
    })
  }
}
