const Readable = require('readable-stream')

const items = ['1\n', '2\n', '3\n'];
const stream = new Readable({
  objectMode: true,
  async read() {
    const item = await new Promise((resolve) => {
      const newItem = items.pop()
      setTimeout(() => {
        resolve(newItem)
      }, 1000)
    });
    if (!item) {
      this.push(null);
      return;
    }
    this.push(item);
  },
});

;(async () => {
  stream.pipe(process.stdout);
})()
