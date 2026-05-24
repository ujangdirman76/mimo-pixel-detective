
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const pages_list = [
    { url: 'http://localhost:3000', name: 'homepage' },
    { url: 'http://localhost:3000/crime-scene', name: 'crime-scene' },
    { url: 'http://localhost:3000/suspects', name: 'suspects' },
    { url: 'http://localhost:3000/clues', name: 'clues' },
    { url: 'http://localhost:3000/verdict', name: 'verdict' },
    { url: 'http://localhost:3000/results', name: 'results' }
  ];
  
  for (const p of pages_list) {
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 1024 });
      await page.goto(p.url, { waitUntil: 'networkidle2', timeout: 15000 });
      await page.screenshot({ path: `/tmp/mimo-screenshots/${p.name}.png`, fullPage: true });
      console.log(`✓ ${p.name}.png`);
      await page.close();
    } catch (e) {
      console.log(`✗ ${p.name}: ${e.message}`);
    }
  }
  
  await browser.close();
  console.log('\n✅ All screenshots completed');
})();
