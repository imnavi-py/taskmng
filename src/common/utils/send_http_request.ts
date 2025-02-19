// import * as FormData from 'form-data'
// import { HttpService } from '@nestjs/axios'

// export async function sendHttpRequest(
//   httpService: HttpService,
//   webhook: string,
//   formData: FormData
// ): Promise<ResponseData> {
//   try {
//     const response = await httpService.axiosRef.post<ResponseData>(webhook, formData)
//     if (response.status === 200 && response.data?.file) {
//       return response.data
//     }
//     throw new Error('Invalid response from server')
//   } catch (error) {
//     throw new Error(`Failed to send HTTP request: ${error.message}`)
//   }
// }
