import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateTaskDto } from './create-task.dto'
import { TaskStatusEnum } from '@prisma/client'
import { IsString, MinLength, IsNotEmpty, IsEnum, IsOptional } from 'class-validator'

export class UpdateTaskDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The title of the task',
    example: 'Test Task',
    required: true
  })
  title: string

  @IsString()
  @MinLength(10)
  @ApiProperty({
    description: 'Explain ...',
    example: 'have to complate TODO',
    required: false
  })
  description: string

  @IsEnum(TaskStatusEnum)
  @IsOptional()
  @ApiProperty({
    description: 'set status',
    example: 'Set',
    required: false
  })
  status: TaskStatusEnum

  @IsNotEmpty()
  @ApiProperty({
    description: 'the project id',
    example: 1,
    required: true
  })
  projectId: number
}
