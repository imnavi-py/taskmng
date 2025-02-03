import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  BadRequestException,
  Res,
  HttpStatus
} from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { Project, ProjectStatusEnum } from '@prisma/client'
import { Response } from 'express'

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto)
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Query('status') status?: ProjectStatusEnum,
    @Query('name') name?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortField') sortField?: string
    // @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) {
    try {
      const projects = await this.projectsService.findAll(
        { status, name },
        { page: Number(page), limit: Number(limit) }
        // { field: sortField, order: sortOrder }
      )
      // TODO Clean the Responses
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: projects,
        message: 'Projects Founded!'
      })
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message
        })
      } else {
        throw new BadRequestException('An unknown error occurred')
      }
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id)
  }
}
