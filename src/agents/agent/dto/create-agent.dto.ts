import { IsString, IsOptional, IsNotEmpty, IsObject, IsJSON } from 'class-validator'

export class CreateAgentDto {
  @IsNotEmpty()
  @IsString()
  webhook: string

  @IsOptional()
  @IsString()
  logo?: string

  @IsNotEmpty()
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsNotEmpty()
  @IsObject()
  params: object

  @IsOptional()
  @IsString()
  file?: string

  // @IsNotEmpty()
  // @IsString()
  // basicParams: string

  // @IsOptional()
  // @IsString()
  // additionalParams?: string
}
