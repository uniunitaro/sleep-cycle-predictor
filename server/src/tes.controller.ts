import { Controller, Get } from '@nestjs/common'

@Controller('tes')
export class TesController {
  @Get()
  async tes() {
    return { yes: 'takasu' }
  }
}
