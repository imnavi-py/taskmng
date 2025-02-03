import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { setupDocument } from './common/framework/swagger/swagger.setup'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  setupDocument(app, 'api')
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
