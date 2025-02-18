import {
  Controller,
  Post,
  Body,
  Query,
  BadRequestException,
  Get,
  Param,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common'
import { AgentService } from './agent.service'
import { CreateAgentDto } from './dto/create-agent.dto'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handleAgent(@Body() createAgentDto: CreateAgentDto, @UploadedFile() file?: Express.Multer.File) {
    console.log('Received JSON Data:', createAgentDto)
    // if (file) {
    //   console.log('Received File:', file.originalname)
    // }
    // console.log(createAgentDto.params)
    // console.log('Data received successfully')
    return await this.agentService.createAgent(createAgentDto, file)
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
