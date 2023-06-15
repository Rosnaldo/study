import { Controller, Get, Response, StreamableFile } from '@nestjs/common';
import { Transform, Readable } from 'stream';
import * as fs from 'fs';

const uppercase = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});

@Controller('stream2')
export class AppController2 {
  @Get()
  async get(@Response({ passthrough: true }) res): Promise<StreamableFile> {
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=ko.txt',
    });

    const stream = await Readable.from(['file1', 'file2', 'file3']);

    const streamed = stream
      .on('data', (data) => {
        console.log(data);
      })
      .pipe(uppercase);

    return new StreamableFile(streamed);
  }
}
