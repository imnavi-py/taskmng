import { PartialType } from '@nestjs/swagger'
import { CreateProjectDto } from './create-project.dto'
import { IsEnum, IsString } from 'class-validator'
import { ProjectStatusEnum } from '@prisma/client'

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  username: string
  stauts: ProjectStatusEnum
}
