import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'

interface SwaggerOptions {
  dto?: any
  message: string
  statusCode: number
  success: boolean
}
//have to fix type any
export function SwaggerDocumentation(options: SwaggerOptions, ...operation: any[]) {
  const decorators = [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    ApiOperation({ summary: operation[0]?.summary || 'API Operation' }),
    ApiResponse({
      status: options.statusCode,
      description: options.message,
      schema: {
        properties: {
          statusCode: { type: 'boolean', example: options.statusCode },
          message: { type: 'string', example: options.message }
        }
      }
    }),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ...operation
  ]

  if (options.dto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    decorators.push(ApiBody({ type: options.dto }))
  }

  //have to fix type any on decorators
  return applyDecorators(...decorators)
}
