import { IsString, IsOptional, IsNotEmpty } from 'class-validator'

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

  // @IsNotEmpty()
  // @IsString()
  // basicParams: string

  // @IsOptional()
  // @IsString()
  // additionalParams?: string
}
