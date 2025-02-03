import { ApiProperty } from '@nestjs/swagger'
import { TaskStatusEnum } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export class CreateTaskDto {
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
