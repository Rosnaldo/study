import { Controller, Get, Response, StreamableFile } from '@nestjs/common';
import { Readable, Writable } from 'stream';
import * as EventEmitter from 'events';
import * as fs from 'fs';

class DataEmitter extends EventEmitter {
  constructor() {
    super();

    const f1 = fs.readFileSync(`${__dirname}/da.pdf`);
    const f2 = fs.readFileSync(`${__dirname}/da.pdf`);

    const data = [f1, f2];
    // Every second, emit an event with a chunk of data
    const interval = setInterval(() => {
      this.emit('chunk', data.splice(0, 1)[0]);

      // Once there are no more items, emit an event
      // notifying that that is the case
      if (!data.length) {
        this.emit('done');
        clearInterval(interval);
      }
    }, 1e3);
  }
}

class MyReadable extends Readable {
  // Keep track of whether or not the listeners have already
  // been added to the data emitter.
  #registered = false;

  _read() {
    // If the listeners have already been registered, do
    // absolutely nothing.
    if (this.#registered) return;

    // "Notify" the client via websockets that we're ready
    // to start streaming the data chunks.
    const emitter = new DataEmitter();

    const handler = (chunk: Buffer) => {
      this.push(chunk);
    };

    emitter.on('chunk', handler);

    emitter.once('done', () => {
      this.push(null);
      // Clean up the listener once it's done (this is
      // assuming the #emitter object will still be used
      // in the future).
      // emitter.off('chunk', handler);
    });

    // Mark the listeners as registered.
    this.#registered = true;
  }
}

@Controller('stream')
export class AppController {
  @Get()
  async get(@Response({ passthrough: true }) res): Promise<StreamableFile> {
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=ko.pdf',
    });

    const readable = new Readable();
    const writable = new Writable();
    // writable._write = (data, encoding, callback) => {
    //   const dds = Math.random();
    //   console.log('write');
    //   if (data) {
    //     fs.writeFileSync(`${__dirname}/do${dds}.pdf`, data);
    //   }
    //   callback();
    // };
    // writable.on('end', () => console.log('write finished'));



    const f1 = fs.readFileSync(`${__dirname}/generate1.pdf`);
    const f2 = fs.readFileSync(`${__dirname}/generate1.pdf`);
    const f3 = fs.readFileSync(`${__dirname}/generate1.pdf`);

    const files = [f1, f2, f3];
    readable._read = () => {
      console.log('_read')
      if (files.length) {
        return readable.push(files.splice(0, 1)[0]);
      }
      return readable.push(null);
    };

    // readable.on('readable', () => {
    //   console.log('readable');
    // });

    readable.on('end', () => console.log('read finished'));

    // readable.pipe(writable);

    return new StreamableFile(readable);
  }
}
