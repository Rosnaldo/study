const util = require('util');
const stream = require('stream');
const fs = require('fs');
const { once } = require('events');

const finished = util.promisify(stream.finished);

async function writeIterableToFile(iterable, filePath) {
  const writable = fs.createWriteStream(filePath, { encoding: 'utf8' });
  for await (const chunk of iterable) {
    if (!writable.write(chunk)) {
      // Handle backpressure
      await once(writable, 'drain');
    }
  }
  writable.end();
  await finished(writable);
}

;(async () => {
  await writeIterableToFile(['One', ' line of text.\n'], 'log.txt');
})();
