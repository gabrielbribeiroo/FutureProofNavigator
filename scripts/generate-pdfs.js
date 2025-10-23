// Generates PDFs from report HTMLs using Puppeteer
// Usage: node scripts/generate-pdfs.js
const path = require('path');
const fs = require('fs');

async function run() {
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: puppeteer.executablePath?.()
  });
  const page = await browser.newPage();

  const root = process.cwd();
  const items = [
    { html: 'reports/industria.html', pdf: 'reports/industria.pdf' },
    { html: 'reports/servicos.html', pdf: 'reports/servicos.pdf' },
    { html: 'reports/comercio.html', pdf: 'reports/comercio.pdf' },
    { html: 'reports/governo.html', pdf: 'reports/governo.pdf' },
    { html: 'reports/logistica.html', pdf: 'reports/logistica.pdf' },
    { html: 'reports/empreendedor.html', pdf: 'reports/empreendedor.pdf' },
  ];

  for (const item of items) {
    const htmlPath = path.resolve(root, item.html);
    const pdfPath = path.resolve(root, item.pdf);
    if (!fs.existsSync(htmlPath)) {
      console.warn(`[skip] HTML not found: ${item.html}`);
      continue;
    }
    const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
    console.log(`[pdf] ${item.html} -> ${item.pdf}`);
    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
  }

  await browser.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
