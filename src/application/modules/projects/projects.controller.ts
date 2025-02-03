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
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { SwaggerDocumentation } from '~/common/framework/swagger/swagger.utils'

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @SwaggerDocumentation(
    { dto: CreateProjectDto, message: 'Project created successfully', statusCode: 201, success: true },
    ApiOperation({ summary: 'Create a new Project' })
  )
  @Post()
  async create(@Body() createProjectDto: CreateProjectDto, @Res() res: Response) {
    const createProject = await this.projectsService.create(createProjectDto)
    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: createProject,
      message: 'Project created!'
    })
  }

  @ApiOperation({ summary: 'Get all Projects' })
  @ApiResponse({ status: 200, description: 'Successfully fetched all Projects' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter tasks by status' })
  @ApiQuery({ name: 'name', required: false, description: 'Filter tasks by title' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit number of tasks per page' })
  @Get()
  async findAll(
    @Res() res: Response,
    @Query('status') status?: ProjectStatusEnum,
    @Query('name') name?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
    // @Query('sortField') sortField?: string
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
      }
    }
  }

  @ApiOperation({ summary: 'Get a Project by id' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Successfully fetched Project by id' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const project = await this.projectsService.findOne(+id)
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: project,
      message: 'Project found!'
    })
  }

  @ApiParam({ name: 'id', description: 'Project ID' })
  @SwaggerDocumentation(
    { dto: UpdateProjectDto, message: 'Project updated successfully', statusCode: 200, success: true },
    ApiOperation({ summary: 'Update an existing Project' })
  )
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Res() res: Response) {
    const updateProject = await this.projectsService.update(+id, updateProjectDto)
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: updateProject,
      message: 'Project updated!'
    })
  }

  @ApiOperation({ summary: 'Delete a Project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Successfully deleted Project' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const deleteProject = await this.projectsService.remove(+id)
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Project deleted!'
    })
  }
}
