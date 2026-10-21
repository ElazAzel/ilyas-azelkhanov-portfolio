import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {join,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../out/',import.meta.url));
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.txt':'text/plain'};
const server=createServer(async(req,res)=>{try{let p=join(root,decodeURIComponent(new URL(req.url,'http://x').pathname));if((await stat(p)).isDirectory())p=join(p,'index.html');res.writeHead(200,{'content-type':mime[extname(p)]||'application/octet-stream'});res.end(await readFile(p));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(4174,'127.0.0.1',r));
const browser=await chromium.launch(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : process.platform==='win32' ? {channel:'msedge'} : {});
const errors=[];const missing=new Set();
try{
 for(const width of [375,768,1440]){
  const page=await browser.newPage({viewport:{width,height:900}});
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)missing.add(new URL(r.url()).pathname)});
  await page.goto('http://127.0.0.1:4174/',{waitUntil:'networkidle'});
  await page.locator('.partners').scrollIntoViewIfNeeded();
  await page.getByRole('button',{name:'Остановить движение'}).click();
  assert.equal(await page.locator('.partners-track').first().evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
  await page.getByRole('button',{name:'Продолжить движение'}).click();
  await page.mouse.move(0,0);
  assert.equal(await page.locator('.partners-track').first().evaluate(e=>getComputedStyle(e).animationPlayState),'running');
  await page.locator('.partners-directory summary').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.partners-directory').getAttribute('open'),'');
  assert.equal(await page.locator('.partners-grid > li').count(),29);
  for(const image of await page.locator('.partners-grid img').all()){
   await image.scrollIntoViewIfNeeded();
   await image.evaluate(async el=>{if(!el.complete)await new Promise(r=>{el.addEventListener('load',r,{once:true});el.addEventListener('error',r,{once:true})});});
   assert(await image.evaluate(e=>e.naturalWidth>0),'Broken logo');
  }
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow at ${width}`);
  await page.locator('.partners-directory summary').click();
  await page.locator('.partners').screenshot({path:`shots/partners-${width}-verified.png`});
  await page.goto('http://127.0.0.1:4174/about/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('.partners-grid > li').count(),29);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`about overflow ${width}`);
  await page.getByRole('link',{name:'Посмотреть работы',exact:true}).click();
  await page.waitForURL('**/work/');
  await page.getByRole('heading',{level:1,name:'Работы',exact:true}).waitFor();
  console.log(`PASS ${width}: pause/resume, keyboard directory, all logos loaded, no overflow, About directory`);
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:375,height:900},reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:4174/',{waitUntil:'networkidle'});
 assert.equal(await page.locator('.partners-track').first().evaluate(e=>getComputedStyle(e).animationName),'none');
 assert.equal(await page.locator('.cine-stage').evaluate(e=>getComputedStyle(e).position),'relative');
 assert.equal(await page.locator('.partners-pause').isVisible(),false);
 for(const ch of await page.locator('[data-ch]').all())assert.equal(await ch.evaluate(e=>e.inert),false);
 await page.close();
 console.log('PASS reduced motion: no automatic brand motion, no sticky story, all chapters available');
 for(const width of [320,390,768]){
  const mobile=await browser.newPage({viewport:{width,height:740},reducedMotion:'reduce'});
  mobile.on('pageerror',e=>errors.push(e.message));
  await mobile.goto('http://127.0.0.1:4174/',{waitUntil:'networkidle'});
  const toggle=mobile.getByRole('button',{name:'Открыть меню',exact:true});
  const menu=mobile.locator('#site-menu');
  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-expanded'),'true');
  const box=await menu.boundingBox();
  assert.equal(box.y,0);
  assert.equal(box.width,width);
  assert.equal(box.height,740,'Menu must escape the glass header');
  assert.equal(await menu.evaluate(e=>e.scrollWidth>e.clientWidth),false);
  for(let i=0;i<20;i++){
   await mobile.keyboard.press('Tab');
   const focus=await menu.evaluate(e=>({inside:e.contains(document.activeElement),tag:document.activeElement.tagName,text:document.activeElement.textContent.slice(0,60),docFocus:document.hasFocus(),modal:e.matches(':modal')}));
   // Edge can move Tab focus into its browser toolbar; no background control may receive it.
   assert(focus.inside||(focus.tag==='BODY'&&!focus.docFocus),`Background received focus at Tab ${i}: ${JSON.stringify(focus)}`);
  }
  await menu.evaluate(e=>e.scrollTop=0);
  await mobile.screenshot({path:`shots/menu-${width}-verified.png`});
  await menu.getByRole('link',{name:'Telegram @elazart',exact:true}).scrollIntoViewIfNeeded();
  assert(await menu.getByRole('link',{name:'Telegram @elazart',exact:true}).isVisible());
  await mobile.keyboard.press('Escape');
  assert.equal(await menu.getAttribute('open'),null);
  assert(await toggle.evaluate(e=>document.activeElement===e),'Focus must return to the burger');
  assert.equal(await mobile.evaluate(()=>document.documentElement.style.overflow),'');
  await toggle.click();
  await menu.getByRole('link',{name:'Обо мне',exact:true}).click();
  await mobile.waitForURL('**/about/');
  assert.equal(await menu.getAttribute('open'),null);
  await toggle.click();
  await menu.getByRole('link',{name:'Обо мне',exact:true}).click();
  assert.equal(await menu.getAttribute('open'),null,'Current-page link must also close the menu');
  await toggle.click();
  await mobile.setViewportSize({width:1100,height:740});
  await mobile.waitForFunction(()=>!document.querySelector('#site-menu').open);
  console.log(`PASS menu ${width}: full height, focus trap/return, scroll, Escape, links, desktop resize`);
  await mobile.close();
 }
 const story=await browser.newPage({viewport:{width:1440,height:900}});
 story.on('pageerror',e=>errors.push(e.message));
 await story.addInitScript(()=>{
  window.__heroPaints=[];
  const paint=CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage=function(...args){
   const frame=String(args[0]?.src||'').match(/cinematic\/([lp])\/(\d+)\.webp/);
   if(frame){
    window.__heroPaints.push({orientation:frame[1],frame:Number(frame[2]),alpha:this.globalAlpha});
    if(window.__heroPaints.length>3000)window.__heroPaints.shift();
   }
   return Reflect.apply(paint,this,args);
  };
 });
 await story.goto('http://127.0.0.1:4174/',{waitUntil:'networkidle'});
 await story.waitForFunction(()=>window.__heroPaints.some(p=>p.alpha>0&&p.alpha<1));
 await story.waitForFunction(()=>window.__heroPaints.some(p=>p.frame>=29));
 await story.evaluate(()=>{
  const scene=document.querySelector('.cine');
  const stage=document.querySelector('.cine-canvas');
  window.scrollTo({top:scene.getBoundingClientRect().top+scrollY+(scene.offsetHeight-stage.getBoundingClientRect().height)*.54,behavior:'instant'});
 });
 await story.waitForFunction(()=>document.querySelector('.cine').dataset.chapter==='2');
 await story.waitForFunction(()=>window.__heroPaints.at(-1).frame>=64);
 await story.mouse.move(1100,200);
 await story.screenshot({path:'shots/hero-blended-verified.png'});
 await story.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 await story.waitForFunction(()=>document.querySelector('.cine').dataset.chapter==='0'&&window.__heroPaints.at(-1).frame<=30);
 assert(await story.locator('.cine-canvas').evaluate(e=>e.getContext('2d').getImageData(e.width/2,e.height/2,1,1).data[3]>0),'Canvas should remain painted');
 await story.setViewportSize({width:390,height:844});
 await story.waitForFunction(()=>window.__heroPaints.some(p=>p.orientation==='p'&&p.frame>=29));
 await story.close();
 console.log('PASS logo: blended intro, forward/reverse scroll, matching chapters, pointer, portrait resize');
 const fallback=await browser.newPage();
 await fallback.route('**/logos/bcc-hub.svg',r=>r.abort());
 await fallback.goto('http://127.0.0.1:4174/about/',{waitUntil:'networkidle'});
 await fallback.locator('.partners-grid li').first().scrollIntoViewIfNeeded();
 await fallback.locator('.partners-grid li').first().getByText('BCC HUB',{exact:true}).waitFor();
 assert.equal(await fallback.locator('.partners-grid li').first().locator('img').count(),0);
 console.log('PASS failed logo: BCC HUB remains readable as text');
 assert.equal(errors.length,0,errors.join('\n'));
 assert.equal(missing.size,0,`Missing resources: ${[...missing].join(', ')}`);
 console.log('PASS no page errors or missing assets / navigation payloads');
}finally{await browser.close();server.close();}
