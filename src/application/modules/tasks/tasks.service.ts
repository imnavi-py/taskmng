import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { PrismaService } from '~/common/modules/prisma/prisma.service'
import { Task, TaskStatusEnum } from '@prisma/client'
import { connect } from 'http2'

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto): Promise<CreateTaskDto> {
    const { projectId, ...taskData } = createTaskDto

    try {
      const newTask = await this.prisma.task.create({
        data: {
          ...taskData,
          project: { connect: { id: projectId } }
        },
        include: {
          project: true
        }
      })

      // const { projectId: _, ...result } = newTask
      return newTask
    } catch (error) {
      throw new BadRequestException('Error on Creating project')
    }
  }

  async findAll(
    filters?: { status?: TaskStatusEnum; title?: string; projectId?: number },
    pagination?: { page: number; limit: number }
  ): Promise<Task[]> {
    const page = pagination?.page || 1
    const limit = pagination?.limit || 10
    const skip = (page - 1) * limit

    try {
      const tasks = await this.prisma.task.findMany({
        where: {
          ...(filters?.status && { status: filters.status }),
          ...(filters?.title && { title: { contains: filters.title, mode: 'insensitive' } }),
          ...(filters?.projectId && { projectId: filters.projectId })
        },
        include: {
          project: true
        },
        skip,
        take: limit
      })

      return tasks
    } catch (error) {
      throw new BadRequestException('Error fetching tasks')
    }
  }

  async findOne(id: number) {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id },
        include: { project: true }
      })
      if (!task) {
        throw new NotFoundException(`Project ${id} not found`)
      }
      return task
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new BadRequestException(`Error fetching project ${id}`)
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<UpdateTaskDto> {
    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
      include: { project: true }
    })
  }

  async remove(id: number) {
    try {
      const deleteTask = await this.prisma.task.delete({
        where: { id },
        include: { project: true }
      })
      if (!deleteTask) {
        throw new NotFoundException(`Project ${id} not found`)
      }
      return deleteTask
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new BadRequestException(`Task ${id} not found`)
    }
  }
}
