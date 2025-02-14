import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { CreateAgentDto } from './dto/create-agent.dto'
import { PrismaService } from '~/common/modules/prisma/prisma.service'
import { Agent } from '@prisma/client'
import { randomInt } from 'crypto'
import FormData = require('form-data')
import * as mime from 'mime-types'

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
    if (file) {
      console.log('have file')
      fileBuffer = file.buffer
      fileName = file.originalname
      fileType = file.mimetype
    }

    if (!file && data.file) {
      try {
        fileBuffer = Buffer.from(data.file, 'base64')
        fileName = 'uploadedFile' + randomInt(0, 100000).toString()
        const mimeType = mime.lookup(fileName)
        fileType = mimeType ? mimeType.toString() : 'application/octet-stream'
      } catch (error) {
        throw new BadRequestException('Bad file format!')
      }
    }
    const agent = await this.prisma.agent.create({
      data: {
        webhook: data.webhook,
        logo: data.logo,
        title: data.title,
        description: data.description,
        params: data.params,
        file: fileBuffer
      }
    })

    if (fileBuffer) {
      const formData = new FormData()
      formData.append('file', fileBuffer, fileName || 'uploaded_file')
      formData.append('params', JSON.stringify(data.params))

      try {
        const response = await this.httpService.axiosRef.post(data.webhook, formData)
        if (response.status === 200) {
          await this.updateAgentStatus(agent.id, 'ok')
          return {
            agent,
            msg: 'ok',
            file: fileBuffer,
            file_Type: fileType
          }
        }
      } catch (error) {
        await this.updateAgentStatus(agent.id, 'faild')
        throw new BadRequestException(`An error Accourded: ${error}`)
      }
    } else {
      console.log(data.params)
      try {
        const response = await this.httpService.axiosRef.post(data.webhook, data.params)

        if (response.status === 200) {
          await this.updateAgentStatus(agent.id, 'ok')
        }
      } catch {
        await this.updateAgentStatus(agent.id, 'faild')
        throw new BadRequestException('Failed to send data to webhook: Webhook not reachable')
      }

      return {
        agent,
        msg: 'ok'
      }
    }
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

  private async updateAgentStatus(agentId: number, status: 'ok' | 'faild') {
    return this.prisma.agent.update({
      where: { id: agentId },
      data: { status: status }
    })
  }
}
