import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class CustomPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value, metadata)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value
  }
}
