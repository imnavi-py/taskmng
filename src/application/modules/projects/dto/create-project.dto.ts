import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'
import { ProjectStatusEnum } from '@prisma/client'

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  name: string

  @IsEnum(ProjectStatusEnum)
  status: ProjectStatusEnum
}
