import puppeteer from 'puppeteer';
import * as path from 'path';
import express from 'express';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;



app.use(express.static(path.dirname(__dirname)));
const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
  test(port);
});

async function test(port) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', (msg) => {
    // Total Hack!
    console.log(...msg.args().map(v => v.toString().substr(9)));
  });

  // Get the "viewport" of the page, as reported by the page.
  page.on('domcontentloaded', async() => {
    const failures = await page.evaluate(() => {
      return window.testsPromiseInfo.promise;
    });

    await browser.close();
    server.close();

    process.exit(failures ? 1 : 0);  // eslint-disable-line
  });

  await page.goto(`http://localhost:${port}/test/index.html?reporter=spec`);
}
