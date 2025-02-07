import { Controller, Post, Body, Query, BadRequestException, Get, Param } from '@nestjs/common'
import { AgentService } from './agent.service'
import { CreateAgentDto } from './dto/create-agent.dto'

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  async handleAgent(@Body() createAgentDto: CreateAgentDto, @Query() queryParams: Record<string, any>) {
    if (!queryParams || Object.keys(queryParams).length === 0) {
      throw new BadRequestException('Query params are required in the request')
    }
    return this.agentService.createAgent(createAgentDto, queryParams)
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
