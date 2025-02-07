import { Controller, Post, Body, Query, BadRequestException, Get, Param } from '@nestjs/common'
import { AgentService } from './agent.service'
import { CreateAgentDto } from './dto/create-agent.dto'

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  async handleAgent(@Body() createAgentDto: CreateAgentDto, @Query() queryParams: Record<string, any>) {
    if (!queryParams) {
      throw new BadRequestException('Query params are required in the request')
    }

    const savedAgent = await this.agentService.createAgent({
      ...createAgentDto,
      params: queryParams
    })

    const { webhook, ...payload } = createAgentDto

    try {
      const response = await this.agentService.sendToWebhook(webhook, payload, savedAgent.id, queryParams)

      return {
        result: response
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(error.message || 'An error occurred while sending data to the webhook')
    }
  }

  @Get()
  async findAll() {
    const agents = await this.agentService.findAll()
    return agents
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const agent = await this.agentService.findById(+id)
    if (!agent) {
      throw new BadRequestException('Agent not found')
    }
    return agent
  }
}
