import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { ProjectStatusEnum } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  @ApiProperty({
    description: 'Name of project',
    example: 'ReProgramming',
    required: true
  })
  name: string

  @IsEnum(ProjectStatusEnum)
  @IsOptional()
  @ApiProperty({
    description: 'the status',
    example: 'Enable',
    required: false
  })
  status: ProjectStatusEnum
}
