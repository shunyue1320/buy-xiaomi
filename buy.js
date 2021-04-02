const puppeteer = require('puppeteer');

const config = {
  user: '****', // mi user name
  password: '****', // mi password
  // buyPage: 'https://www.mi.com/buy/detail?product_id=13544', // k40 buy page url
  buyPage: 'https://www.mi.com/buy/detail?product_id=13272', // mi11 buy page url
  buyStartTime: new Date("2021-04-02 23:53").getTime()  // buy start Time
};

// buy rule：越前面的越优先购买，前面的没货才购买后面
const buyRule = [
  {
    // 8GB+128GB + 幻境
    GB: { type: 1, index: 1 },  // 选择版本为第一栏 type = 1, index = 1 选择版本中的第 1 个型号 
    color: { type: 2, index: 3 } // 选择颜色为第二栏 type = 2, index = 3 选择版本中的第 3 个颜色
  },
  {
    // 8GB+128GB + 晴雪
    GB: { type: 1, index: 1 },
    color: { type: 2, index: 2 }
  },
  {
    // 8GB+256GB + 幻境
    GB: { type: 1, index: 3 },
    color: { type: 2, index: 3 }
  },
  {
    // 8GB+256GB + 晴雪
    GB: { type: 1, index: 3 },
    color: { type: 2, index: 2 }
  }
];

function createSelector(type, index) {
  return `#app > div.mi-detail > div > div > div > div.product-box.container > div.product-con > div.buy-option > div:nth-child(${type}) > div > ul > li:nth-child(${index}) > a'`
}

// 加入购物车选择器
const btnPrimary = '#app > div.mi-detail > div > div > div > div.product-box.container > div.product-con > div.btn-box > div.sale-btn > a';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 2000,
      height: 1000
    }
  })

  const page = await browser.newPage()
  // Login
  await page.goto('https://account.xiaomi.com')
  await sleep(2000)

  await page.type('input[name="password"]', config.password)
  await page.type('input[name="account"]', config.user.toString())
  let button = await page.$('button[type="submit"]')
  await button.click()
  await page.waitForNavigation()

  // redirect buy page confirm login successfully
  await page.goto(config.buyPage)
  try {
    await page.waitForSelector('a.login', { timeout: 1000 })
    await page.click('a.login')
    // await page.waitForNavigation()
  } catch (e) {
    console.log("已登录")
  }

  // panic buying core code
  await refreshBuy(page) // 1. 真实开抢逻辑
  // await page.waitForSelector(btnPrimary, { timeout: 2000 }) // 2. 模拟请打开这里

  await page.click(btnPrimary)
  await page.waitForNavigation()
  await page.goto('https://static.mi.com/cart/') // go to cart
  await page.click("#J_goCheckout")
})();

function sleep(ms, type) {
  if (ms < 0) return true
  if (type) {
    const timer = setInterval(() => {
      const resMs = config.buyStartTime - Date.now()
      if (resMs < 0) {
        clearInterval(timer)
      } else {
        console.log(`${resMs}ms 后开启抢单`)
      }
    }, 1000)
  }
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function refreshBuy(page) {
  // try {
    await sleep(config.buyStartTime - Date.now(), true)
    console.log("开启抢单")
    await page.goto(config.buyPage)
    // await page.waitForNavigation()
    // await page.waitForSelector('div.buy-option', { timeout: 2000 })
    for (let i = 0; i < buyRule.length; i++) {
      const { GB, color } = buyRule[i]
      console.log("1111111:::", createSelector(GB.type, GB.index))
      console.log("1111111:::", createSelector(color.type, color.index))
      // const aaa = createSelector(GB.type, GB.index)
      // const bbb = createSelector(color.type, color.index)
      await page.evaluate(({ createSelector, buyRuleItem })=>{
        const { GB, color } = buyRuleItem
        document.querySelector(createSelector(GB.type, GB.index)).click()
        document.querySelector(createSelector(color.type, color.index)).click()
      }, {createSelector, buyRuleItem: buyRule[i]})
      // const GBNode = await page.waitForSelector(createSelector(GB.type, GB.index))
      // const colorNode = await page.waitForSelector(createSelector(color.type, color.index))
      // GBNode.click()
      // colorNode.click()
      try {
        await page.waitForSelector(btnPrimary, { timeout: 2000 })
        console.log("抢单成功")
        return
      } catch (e) {
        continue;
      }
    }
    await page.waitForSelector(btnPrimary, { timeout: 2000 })
  // } catch (e) {
  //   await refreshBuy()
  // }
}
