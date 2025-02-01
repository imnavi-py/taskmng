import { Injectable } from '@nestjs/common'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { PrismaService } from '~/common/modules/prisma/prisma.service'
import { Project } from '@prisma/client'

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createProjectDto: CreateProjectDto): Promise<Project> {
    return this.prisma.project.create({
      data: createProjectDto
    })
  }

  findAll(): Promise<Project[]> {
    return this.prisma.project.findMany({
      include: {
        tasks: true
      }
    })
  }

  findOne(id: number): Promise<Project> {
    return this.prisma.project.findUniqueOrThrow({
      where: { id },
      include: {
        tasks: true
      }
    })
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
