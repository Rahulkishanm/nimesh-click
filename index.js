// let aTags = document.getElementsByTagName("a");
// let searchText = "SearchingText";
// let found;

// for (let i = 0; i < aTags.length; i++) {
//   if (aTags[i].textContent.toLowerCase().includes(searchText)) {
//     found = aTags[i];
//     found.click()
//     break;
//   }
// }

// setTimeout(()=>{
//   found.click()
// },0)

// let prev = {}
// setInterval(()=>{
//   location.reload()
//   let aTags = document.getElementsByTagName("a");
//   if(JSON.stringify(prev) !==JSON.stringify(aTags)  ){
//     console.log(aTags)
//   }
  
// },1000)
// This injects a box into the page that moves with the mouse;
// Useful for debugging
async function installMouseHelper(page) {
  await page.evaluateOnNewDocument(() => {
    // Install mouse helper only for top-level frame.
    if (window !== window.parent)
      return;
    window.addEventListener('DOMContentLoaded', () => {
      const box = document.createElement('puppeteer-mouse-pointer');
      const styleElement = document.createElement('style');
      styleElement.innerHTML = `
        puppeteer-mouse-pointer {
          pointer-events: none;
          position: absolute;
          top: 0;
          z-index: 10000;
          left: 0;
          width: 20px;
          height: 20px;
          background: rgba(0,0,0,.4);
          border: 1px solid white;
          border-radius: 10px;
          margin: -10px 0 0 -10px;
          padding: 0;
          transition: background .2s, border-radius .2s, border-color .2s;
        }
        puppeteer-mouse-pointer.button-1 {
          transition: none;
          background: rgba(0,0,0,0.9);
        }
        puppeteer-mouse-pointer.button-2 {
          transition: none;
          border-color: rgba(0,0,255,0.9);
        }
        puppeteer-mouse-pointer.button-3 {
          transition: none;
          border-radius: 4px;
        }
        puppeteer-mouse-pointer.button-4 {
          transition: none;
          border-color: rgba(255,0,0,0.9);
        }
        puppeteer-mouse-pointer.button-5 {
          transition: none;
          border-color: rgba(0,255,0,0.9);
        }
      `;
      document.head.appendChild(styleElement);
      document.body.appendChild(box);
      document.addEventListener('mousemove', event => {
        box.style.left = event.pageX + 'px';
        box.style.top = event.pageY + 'px';
        updateButtons(event.buttons);
      }, true);
      document.addEventListener('mousedown', event => {
        updateButtons(event.buttons);
        box.classList.add('button-' + event.which);
      }, true);
      document.addEventListener('mouseup', event => {
        updateButtons(event.buttons);
        box.classList.remove('button-' + event.which);
      }, true);
      function updateButtons(buttons) {
        for (let i = 0; i < 5; i++)
          box.classList.toggle('button-' + i, buttons & (1 << i));
      }
    }, false);
  });
};



const puppeteer = require('puppeteer');

const clickit = async() => {
  const browser = await puppeteer.launch({headless: false});//{executablePath: '/path/to/Chrome'} to open in chrome 
  const page = await browser.newPage();
  // await installMouseHelper(page)
  await page.setViewport({ width: 1440, height: 789 })
 
  await installMouseHelper(page);
  // Here's the navigation. From now on we'll have a mouse cursor on the page.
  await page.goto('https://playwright.dev/docs/intro');
  await page.mouse.move(135, 173);
  await page.mouse.down();
  await page.mouse.move(400, 225);
  await page.screenshot({path: 'screenshot.png'});
  await page.mouse.click(350, 40,{clickCount:200});
  await page.screenshot({path: 'sd2.png'});
  // await page.waitFor(6000);
  // await browser.close();
}

var cron = require('node-cron');

cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
  clickit()
});