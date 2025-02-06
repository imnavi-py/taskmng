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

  async saveAgentData(data: CreateAgentDto) {
    return this.prisma.agent.create({
      data
    })
  }

  async sendToWebhook(
    webhookUrl: string,
    payload: { logo?: string; title: string; description?: string }
  ): Promise<WebhookResponse> {
    try {
      const response = await this.httpService.axiosRef.post(webhookUrl, payload)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { status: response.status, data: response.data }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw error.response?.data || error.message
    }
  }
}
