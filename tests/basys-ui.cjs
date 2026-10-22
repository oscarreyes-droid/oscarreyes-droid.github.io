const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE || '/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage'],env:{...process.env,XDG_CACHE_HOME:'/tmp/oscar-cache',XDG_CONFIG_HOME:'/tmp/oscar-config'}});
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.clock.install();
async function advance(ms){await page.clock.runFor(ms);}
await page.goto(process.env.BASE_URL || 'http://127.0.0.1:8000/',{waitUntil:'networkidle'});
await page.locator('#basys3-demo > summary').click();await advance(50);
if (!await page.locator('.basys-accessible').evaluate(el=>el.open)) await page.locator('.basys-accessible > summary').click();
const val=()=>page.locator('[data-value]').textContent();const state=()=>page.locator('[data-state]').textContent();
assert.equal(await val(),'00.00');assert.equal(await page.locator('[data-switch]').count(),16);assert.equal(await page.locator('[data-switch]:disabled').count(),6);
await page.locator('[data-start]').click();await advance(1100);assert.equal(await state(),'COUNT UP');assert.ok(Number(await val())>=.9);
await page.locator('[data-start]').click();await advance(150);assert.equal(await state(),'PAUSED');const paused=await val();await advance(600);assert.equal(await val(),paused);
await page.locator('[data-start]').click();await advance(300);assert.notEqual(await val(),paused);
await page.locator('[data-mode]').selectOption('3');await page.locator('[data-preset]').fill('5');await page.locator('[data-load]').click();assert.equal(await val(),'05.00');
assert.equal(await page.locator('[data-preset-bits]').textContent(),'0000 0101');
await page.locator('[data-speed]').selectOption('10');await page.locator('[data-start]').click();await advance(800);assert.equal(await val(),'00.00');assert.equal(await state(),'ZERO');
await page.locator('[data-reset]').click();assert.equal(await val(),'05.00');
await page.locator('[data-mode]').selectOption('2');assert.equal(await val(),'99.99');
await page.locator('[data-start]').click();await advance(200);assert.ok(Number(await val())<99.99);
await page.locator('[data-mode]').selectOption('1');assert.equal(await val(),'05.00');
await page.locator('[data-speed]').selectOption('100');await page.locator('[data-start]').click();await advance(1200);assert.equal(await val(),'99.99');assert.equal(await state(),'MAXIMUM');
await page.locator('[data-reset]').click();assert.equal(await val(),'05.00');
// Real switch bits, invalid BCD, and reset-required mode changes.
await page.locator('[data-switch="11"]').click();await advance(40);assert.match(await page.locator('[data-feedback]').innerText(),/Invalid BCD/);
await page.locator('[data-switch="11"]').click();await advance(40);assert.equal(await val(),'05.00');
await page.locator('[data-switch="1"]').click();assert.equal(await state(),'HOLD UP');await page.locator('[data-reset]').click();assert.equal(await state(),'HOLD DOWN');
// Closing must freeze the entire simulation and release animation work.
await page.locator('[data-speed]').selectOption('1');
await page.locator('[data-reset]').click();
await page.locator('[data-start]').click();await advance(150);await page.locator('#basys3-demo > summary').click();await advance(50);
if (!await page.locator('.basys-accessible').evaluate(el=>el.open)) await page.locator('.basys-accessible > summary').click();const closed=await val();await advance(500);assert.equal(await val(),closed);
await page.locator('#basys3-demo > summary').click();await advance(200);assert.notEqual(await val(),closed);
await page.locator('[data-reset]').click();await page.locator('[data-speed]').selectOption('1');
for(const width of [1440,768,390,320]){
await page.setViewportSize({width,height:1000});await page.locator('#basys3-demo').scrollIntoViewIfNeeded();await advance(500);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Page overflow '+width);
assert.ok(await page.locator('.basys-display polygon.on').count()>0);
await page.locator('#basys3-demo').screenshot({path:'/tmp/basys-'+width+'.png'});
console.log('PASS '+width+'px board and controls, readable display, no page overflow');
}
// Native switches work with keyboard, including while board is horizontally scrolled.
const sw=page.locator('[data-switch="0"]');await sw.focus();const before=await sw.getAttribute('aria-checked');await page.keyboard.press('Space');assert.notEqual(await sw.getAttribute('aria-checked'),before);
assert.deepEqual(errors,[]);console.log('PASS all four modes, pause/resume, presets, limits, reset, invalid BCD, raw switches, close/reopen, keyboard controls and no JS errors');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
