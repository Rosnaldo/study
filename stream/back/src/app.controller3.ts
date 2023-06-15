import { Controller, Get } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';

const pagePdf = async (htmlFile: string, write: string) => {
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

@Controller('stream3')
export class AppController3 {
  @Get()
  async get(): Promise<void> {
    await Promise.all([
      pagePdf(`${__dirname}/certificate.html`, `${__dirname}/certificate3.pdf`),
    ]);
  }
}
