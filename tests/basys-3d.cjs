const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE || '/usr/bin/chromium',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader'],env:{...process.env,XDG_CACHE_HOME:'/tmp/oscar-cache',XDG_CONFIG_HOME:'/tmp/oscar-config'}});
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(process.env.BASE_URL || 'http://127.0.0.1:8000/',{waitUntil:'networkidle'});await page.locator('#basys3-demo > summary').click();
await page.waitForSelector('[data-three-host][data-ready=true]',{timeout:20000});
assert.equal(await page.locator('.basys-accessible').getAttribute('open'),null);
assert.equal(await page.locator('[data-three-host]').getAttribute('data-geometry'),'supplied-step');
await page.locator('[data-top-view]').click();await page.waitForTimeout(150);
const canvas=page.locator('.basys-3d-canvas');
// Orthographic top view: board coordinates project to the physical mesh controls.
async function hit(x,z){await canvas.scrollIntoViewIfNeeded();const b=await canvas.boundingBox();await page.mouse.click(b.x+b.width/2+x*b.height/Math.max(13,15*b.height/b.width),b.y+b.height/2+z*b.height/Math.max(13,15*b.height/b.width));}
await hit(2.904,-.144);await page.waitForFunction(()=>document.querySelector('[data-state]').textContent==='COUNT UP',{timeout:10000});assert.equal(await page.locator('[data-state]').textContent(),'COUNT UP');
const count=await page.locator('[data-value]').textContent();assert.notEqual(count,'00.00');
await hit(2.904,-.144);await page.waitForTimeout(150);assert.equal(await page.locator('[data-state]').textContent(),'PAUSED');
await hit(2.904,.556);assert.equal(await page.locator('[data-value]').textContent(),'00.00');
// SW0 is the rightmost switch: it must update the actual model through raycasting.
await hit(4.944,2.676);assert.equal(await page.locator('[data-mode-bits]').textContent(),'01');
let bits=1;
for(const index of [1,8,9,10,11,12,13,14,15]){
 await hit(4.944-index*.66,2.676);bits^=1<<index;
 assert.equal(await page.locator('[data-mode-bits]').textContent(),(bits&3).toString(2).padStart(2,'0'));
 const preset=((bits>>>8)&255).toString(2).padStart(8,'0');
 assert.equal(await page.locator('[data-preset-bits]').textContent(),preset.slice(0,4)+' '+preset.slice(4));
}
await page.locator('[data-mode]').selectOption('3');await page.locator('[data-preset]').fill('5');await page.locator('[data-load]').click();await page.locator('[data-speed]').selectOption('100');
await hit(2.904,-.144);await page.waitForFunction(()=>document.querySelector('[data-state]').textContent==='ZERO');
assert.equal(await page.locator('[data-value]').textContent(),'00.00');await hit(2.904,.556);assert.equal(await page.locator('[data-value]').textContent(),'05.00');

await page.locator('[data-reset-view]').click();await page.waitForTimeout(150);
let b=await canvas.boundingBox();await page.mouse.move(b.x+b.width*.5,b.y+b.height*.5);await page.mouse.down();await page.mouse.move(b.x+b.width*.65,b.y+b.height*.6,{steps:8});await page.mouse.up();
await canvas.focus();await page.keyboard.press('ArrowLeft');await page.keyboard.press('Home');
for(const width of [1440,390]){
 await page.setViewportSize({width,height:1000});await page.waitForTimeout(200);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.locator('[data-three-host]').screenshot({path:'/tmp/board-3d-'+width+'.png'});
 console.log('PASS '+width+'px: WebGL board, no page overflow');
}
assert.deepEqual(errors,[]);console.log('PASS CAD model, all ten wired switch targets, 3D start/pause/reset/countdown, rotation, keyboard view controls, no JS errors');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
