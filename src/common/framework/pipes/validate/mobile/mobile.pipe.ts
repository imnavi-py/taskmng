/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class MobilePipe implements PipeTransform {
  constructor(private readonly mobileLength: number) {}
  transform(value: any, metadata: ArgumentMetadata) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const mobile: string = value.mobile
    console.log(mobile)

    if (mobile) {
      if (mobile.length != this.mobileLength)
        throw new BadRequestException(`validation failed, mobile length is not ${this.mobileLength} character!`)
      if (mobile.startsWith('0912')) value.operator = 'همراه اول'
      else if (mobile.startsWith('0903')) value.operator = 'ایرانسل'
      else if (mobile.startsWith('0990')) value.operator = 'رایتل'
    }
    console.log(metadata)
    console.log(value)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value
  }
}
