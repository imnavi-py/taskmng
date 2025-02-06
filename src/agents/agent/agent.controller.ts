import { Controller, Post, Body } from '@nestjs/common'
import { AgentService } from './agent.service'
import { CreateAgentDto } from './dto/create-agent.dto'

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  async handleAgent(@Body() createAgentDto: CreateAgentDto) {
    const savedAgent = await this.agentService.saveAgentData(createAgentDto)
    const { webhook, ...payload } = createAgentDto
    const response = await this.agentService.sendToWebhook(webhook, payload)

    return {
      savedAgent,
      webhookResponse: response
    }
  }
}
