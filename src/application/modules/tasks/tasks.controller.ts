import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  HttpStatus,
  Put,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { TasksService } from './tasks.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { TaskStatusEnum } from '@prisma/client'
import { Response } from 'express'
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { SwaggerDocumentation } from '~/common/framework/swagger/swagger.utils'
import { CreateProjectDto } from '../projects/dto/create-project.dto'

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @SwaggerDocumentation(
    { dto: CreateTaskDto, message: 'Project created!', statusCode: 201, success: true },
    ApiOperation({ summary: 'Create a new Task' })
  )
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @Res() res: Response) {
    const createTask = await this.tasksService.create(createTaskDto)
    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: createTask,
      message: 'Project created!'
    })
  }

  @ApiOperation({ summary: 'Get all Tasks' })
  @ApiResponse({ status: 200, description: 'Successfully fetched all Tasks' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter tasks by status' })
  @ApiQuery({ name: 'title', required: false, description: 'Filter tasks by title' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit number of tasks per page' })
  @ApiQuery({ name: 'projectId', required: false, type: Number, description: 'Filter tasks by project ID' })
  @Get()
  async findAll(
    @Res() res: Response,
    @Query('status') status?: TaskStatusEnum,
    @Query('title') title?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('projectId') projectId?: number
  ) {
    const projectIdNum = projectId ? Number(projectId) : undefined
    console.log('Filters:', { status, title, projectIdNum })
    try {
      const tasks = await this.tasksService.findAll(
        { status, title, projectId: projectIdNum },
        { page: Number(page), limit: Number(limit) }
      )
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: tasks,
        message: 'All tasks fetched!'
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

  @ApiOperation({ summary: 'Get a Task by id' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Successfully fetched Task by id' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const task = await this.tasksService.findOne(+id)
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: task,
        message: 'The task found!'
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

  @ApiParam({ name: 'id', description: 'Task ID' })
  @SwaggerDocumentation(
    { dto: UpdateTaskDto, message: 'Task updated successfully', statusCode: 200, success: true },
    ApiOperation({ summary: 'Update an existing Task' })
  )
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Res() res: Response) {
    try {
      const updateTask = await this.tasksService.update(+id, updateTaskDto)
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: updateTask,
        message: 'Project updated!'
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

  @ApiOperation({ summary: 'Delete a Task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Successfully deleted Task' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const deleteTask = await this.tasksService.remove(+id)
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Task deleted!'
    })
  }
}
