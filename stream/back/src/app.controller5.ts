import { Controller, Get, Response, StreamableFile } from '@nestjs/common';
import { Readable } from 'stream';
import * as fs from 'fs';

@Controller('stream5')
export class AppController4 {
  @Get()
  async get(@Response({ passthrough: true }) res): Promise<StreamableFile> {
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=ko.pdf',
    });

    const streamed = await Readable.from([
      fs.readFileSync(`${__dirname}/mei.pdf`),
      // fs.readFileSync(`${__dirname}/mei.pdf`),
      // fs.readFileSync(`${__dirname}/mei.pdf`),
    ])

    return new StreamableFile(streamed);
  }
}
