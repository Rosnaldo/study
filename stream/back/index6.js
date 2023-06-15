const puppeteer = require('puppeteer');
const fs = require('fs');

const pagePdf = async (htmlFile, write) => {
  const html = fs.readFileSync(htmlFile).toString();

  const browser = await puppeteer.launch({
    product: 'chrome',
  });
  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(0);
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    landscape: true,
    timeout: 0,
  });

  fs.writeFileSync(write, pdf);
};

;(async () => {
  await pagePdf(`${__dirname}/Evento Cholet.html`, `${__dirname}/certificate3.pdf`);
})()