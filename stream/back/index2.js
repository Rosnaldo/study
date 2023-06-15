const fs = require('fs')
const PDFMerger = require('pdf-merger-js')
const { pipeline } = require('stream/promises')

;(async () => {
  const f1 = fs.readFileSync('mei.pdf');
  const f2 = fs.readFileSync('mei.pdf');

  await pipeline([
    async function * () {
      yield 'mei.pdf';
      yield 'mei.pdf';
    },
    async function (source) {
      const merger = new PDFMerger();
      for await (const chunk of source) {
        await merger.add(chunk);
      }
      const f3 = await merger.saveAsBuffer();

      fs.writeFileSync('merged.pdf', f3)
    }
  ]);
})();
