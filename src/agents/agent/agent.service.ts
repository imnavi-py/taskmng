import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { CreateAgentDto } from './dto/create-agent.dto'
import { PrismaService } from '~/common/modules/prisma/prisma.service'

type WebhookResponse = {
  status: number
  data: any
}

@Injectable()
export class AgentService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService
  ) {}

  async createAgent(data: CreateAgentDto) {
    if (!data.params || Object.keys(data.params).length === 0) {
      throw new Error('params is required and cannot be empty')
    }

    return this.prisma.agent.create({
      data: {
        webhook: data.webhook,
        logo: data.logo,
        title: data.title,
        description: data.description,
        params: data.params
      }
    })
  }

  async findById(agentId: number) {
    return this.prisma.agent.findUnique({
      where: { id: agentId }
    })
  }

  async findAll() {
    return this.prisma.agent.findMany()
  }

  async sendToWebhook(
    webhookUrl: string,
    payload: { logo?: string; title: string; description?: string },
    agentId: number,
    queryParams: Record<string, any>
  ): Promise<WebhookResponse> {
    const urlWithParams = new URL(webhookUrl)

    Object.keys(queryParams).forEach(key => {
      urlWithParams.searchParams.append(key, queryParams[key])
    })

    try {
      const response = await this.httpService.axiosRef.post<WebhookResponse>(urlWithParams.toString(), payload)

      if (response.status !== 200) {
        await this.updateAgentStatus(agentId, 'faild')
        throw new Error('Webhook responded with a non-200 status code')
      }

      return { status: response.status, data: response.data }
    } catch (error) {
      await this.updateAgentStatus(agentId, 'faild')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw error.response?.data || error.message
    }
  }

  private async updateAgentStatus(agentId: number, status: 'ok' | 'faild') {
    return this.prisma.agent.update({
      where: { id: agentId },
      data: { is_worked: status }
    })
  }
}
