import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { CreateAgentDto } from './dto/create-agent.dto'
import { PrismaService } from '~/common/modules/prisma/prisma.service'
import { Agent } from '@prisma/client'
import { randomInt } from 'crypto'
import FormData = require('form-data')
import * as mime from 'mime-types'

interface ResponseData {
  file?: string
}
@Injectable()
export class AgentService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService
  ) {}

  async createAgent(data: CreateAgentDto, file?: Express.Multer.File) {
    let fileBuffer: Buffer | null = null
    let fileName: string | null = null
    let fileType: string = 'unknown'
    let fileResponse: Buffer | null = null
    if (file) {
      console.log('have file')
      fileBuffer = file.buffer
      fileName = file.originalname
      fileType = file.mimetype
    }
    const agent = await this.prisma.agent.create({
      data: {
        webhook: data.webhook,
        logo: data.logo,
        title: data.title,
        description: data.description,
        params: data.params,
        file: fileBuffer,
        file_response: fileResponse
      }
    })

    const formData = new FormData()
    formData.append('params', JSON.stringify(data.params))
    if (fileBuffer != null) {
      formData.append('file', fileBuffer, fileName || 'uploaded_file')
    }

    try {
      const response = await this.httpService.axiosRef.post<ResponseData>(data.webhook, formData)
      console.log('axiosRef')
      console.log(response.status)
      if (response.status === 200) {
        console.log(response.data.file)
        // let fileInResponse: Buffer | null = null
        if (response.data && response.data.file) {
          console.log('1')
          fileResponse = Buffer.from(response.data.file, 'base64')
        }
        console.log('2')
        await this.updateAgentField(agent.id, 'ok', fileResponse)
        console.log('updateAgent')
        const updatedAgent = await this.prisma.agent.findUnique({
          where: { id: agent.id }
        })
        return {
          updatedAgent,
          msg: 'ok'
          // file: fileBuffer,
          // file_Type: fileType,
          // file_response: fileInResponse
        }
      }
    } catch (error) {
      await this.updateAgentField(agent.id, 'faild')
      throw new BadRequestException(`An error Accourded: ${error}`)
    }
  }

  async findById(id: number): Promise<Pick<Agent, 'params' | 'file' | 'file_response'>> {
    const agent = await this.prisma.agent.findUnique({
      where: { id },
      select: { params: true, file: true, file_response: true }
    })

    if (!agent) {
      throw new NotFoundException(`Agent ${id} not found`)
    }
    return agent
    // // const { webhook: _, ...result } = agent
    // const parameters = agent.params as { promptType?: string }
    // if (parameters.promptType === 'TEXT') {
    //   return {
    //     params: agent.params
    //   }
    // } else {
    //   return agent
    // }
  }

  async findAll() {
    const agents = await this.prisma.agent.findMany()
    return agents.map(({ webhook, ...result }) => result)
  }

  private async updateAgentField(agentId: number, status: 'ok' | 'faild', editedFile?: Buffer | null) {
    return this.prisma.agent.update({
      where: { id: agentId },
      data: { status: status, file_response: editedFile }
    })
  }
}
