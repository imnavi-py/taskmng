import { IsString, IsOptional, IsNotEmpty, IsObject } from 'class-validator'

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

  params: Record<string, any>

  // @IsNotEmpty()
  // @IsString()
  // basicParams: string

  // @IsOptional()
  // @IsString()
  // additionalParams?: string
}
