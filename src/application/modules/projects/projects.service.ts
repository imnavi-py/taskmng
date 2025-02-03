import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { PrismaService } from '~/common/modules/prisma/prisma.service'
import { Project, ProjectStatusEnum } from '@prisma/client'
import { query } from 'express'

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    try {
      const newProject = this.prisma.project.create({
        data: createProjectDto
      })
      return await newProject
    } catch (error) {
      throw new BadRequestException('Error on Creating project')
    }
  }

  async findAll(
    filters?: { status?: ProjectStatusEnum; name?: string },
    pagination?: { limit: number; page: number }
  ): Promise<Project[]> {
    try {
      // Default pagination values
      const page = pagination?.page || 1
      const limit = pagination?.limit || 10
      const skip = (page - 1) * limit
      // Building Prisma Query
      const projects = await this.prisma.project.findMany({
        where: {
          ...(filters?.status && { status: filters.status }),
          ...(filters?.name && { name: { contains: filters.name, mode: 'insensitive' } })
        },
        skip,
        take: limit
      })

      return projects
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(`Error fetching projects: ${error.message}`)
      } else {
        throw new BadRequestException('An unknown error occurred')
      }
    }
  }
  async findOne(id: number): Promise<Project> {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id },
        include: { tasks: true }
      })

      if (!project) {
        throw new NotFoundException(`Project ${id} not found`)
      }

      return project
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new BadRequestException(`Error fetching project ${id}`)
    }
  }

  update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto
    })
  }

  remove(id: number): Promise<Project> {
    return this.prisma.project.delete({
      where: { id }
    })
  }
}
