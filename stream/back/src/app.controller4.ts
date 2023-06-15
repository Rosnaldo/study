import { Controller, Get, Response, StreamableFile } from '@nestjs/common';
import * as fs from 'fs';
import * as https from 'https';
import * as request from 'request';

@Controller('stream4')
export class AppController4 {
  @Get()
  async get(@Response({ passthrough: true }) res): Promise<StreamableFile> {
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=ko.pdf',
    });

    const url =
      'https://d3oxps9anx9c4v.cloudfront.net/d334d33a-f426-47f4-9761-26f27ad47f2b-originalname';

    return new StreamableFile(request.get(url));
  }
}
