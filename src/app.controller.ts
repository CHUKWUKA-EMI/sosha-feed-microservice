import { Controller, Get, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('imagekitAuth')
  @HttpCode(200)
  getHello() {
    const result = imagekit.getAuthenticationParameters();
    return result;
  }
}
