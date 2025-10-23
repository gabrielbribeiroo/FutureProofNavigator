const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function htmlToPdf(browser, inputPath, outputPath) {
  const page = await browser.newPage();
  const fileUrl = 'file://' + inputPath.replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outputPath, format: 'A4', printBackground: true, margin: { top: '14mm', right: '12mm', bottom: '14mm', left: '12mm' } });
  await page.close();
}

(async () => {
  const root = path.resolve(__dirname, '..');
  const templatesDir = path.join(root, 'reports', 'templates');
  const outDir = path.join(root, 'reports');
  const mapping = [
    { in: 'tecnologia.html', out: 'tecnologia.pdf' },
    { in: 'publicidade.html', out: 'publicidade.pdf' },
    { in: 'financas.html', out: 'financas.pdf' },
    { in: 'construcao.html', out: 'construcao.pdf' },
    { in: 'saude.html', out: 'saude.pdf' },
    { in: 'educacao.html', out: 'educacao.pdf' },
    { in: 'industria.html', out: 'industria.pdf' },
    { in: 'servicos.html', out: 'servicos.pdf' },
    { in: 'comercio.html', out: 'comercio.pdf' },
    { in: 'governo.html', out: 'governo.pdf' },
    { in: 'logistica.html', out: 'logistica.pdf' },
    { in: 'empreendedor.html', out: 'empreendedor.pdf' },
    { in: 'direito.html', out: 'direito.pdf' },
    { in: 'outra.html', out: 'outra.pdf' }
  ];

  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  try {
    for (const m of mapping) {
      const inPath = path.join(templatesDir, m.in);
      const outPath = path.join(outDir, m.out);
      if (!fs.existsSync(inPath)) {
        console.warn('Template missing:', inPath);
        continue;
      }
      await htmlToPdf(browser, inPath, outPath);
      console.log('Generated', outPath);
    }
  } finally {
    await browser.close();
  }
})();
