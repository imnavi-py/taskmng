import { IsEnum, IsString } from 'class-validator'
import { ProjectStatusEnum } from '@prisma/client'

export class CreateProjectDto {
  @IsString()
  name: string

  @IsEnum(ProjectStatusEnum)
  status: ProjectStatusEnum
}
