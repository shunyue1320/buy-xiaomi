const puppeteer = require('puppeteer');

const config = {
	user: '****',
	password: '*****',
	buyPage: 'https://www.mi.com/buy/detail?product_id=13544', // k40 buy page url
	// buyPage: 'https://www.mi.com/buy/detail?product_id=13272', // mi11 buy page url
	buyStartTime: new Date("2021-04-02 10:00").getTime()  // buy start Time
};

// buy rule：越前面的越优先购买，前面的没货才购买后面
const buyRule = [
	{
		// 8GB+128GB + 幻境
		GB: '#app > div.mi-detail > div > div > div > div.product-box.container > div.product-con > div.buy-option > div:nth-child(1) > div > ul > li:nth-child(1) > a',
		color: '#app > div.mi-detail > div > div > div > div.product-box.container > div.product-con > div.buy-option > div:nth-child(2) > div > ul > li:nth-child(3) > a'
	},
	{
		// 8GB+128GB + 晴雪
		GB: '#app > div.mi-detail > div > div > div > div.product-box.container > div.product-con > div.buy-option > div:nth-child(1) > div > ul > li:nth-child(1) > a',
		color: '#app > div.mi-detail > div > div > div > div.product-box.container > div.product-con > div.buy-option > div:nth-child(2) > div > ul > li:nth-child(2) > a'
	},
	{
		// 8GB+256GB + 幻境
		GB: '#app > div.mi-detail > div > div > div > div.product-box.container > div.product-con > div.buy-option > div:nth-child(1) > div > ul > li:nth-child(3) > a',
		color: '#app > div.mi-detail > div > div > div > div.product-box.container > div.product-con > div.buy-option > div:nth-child(2) > div > ul > li:nth-child(3) > a'
	},
	{
		// 8GB+256GB + 晴雪
		GB: '#app > div.mi-detail > div > div > div > div.product-box.container > div.product-con > div.buy-option > div:nth-child(1) > div > ul > li:nth-child(3) > a',
		color: '#app > div.mi-detail > div > div > div > div.product-box.container > div.product-con > div.buy-option > div:nth-child(2) > div > ul > li:nth-child(2) > a'
	}
];

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
	} catch(e) {
		console.log("已登录")
	}

	// panic buying core code
	await refreshBuy() // 1. 真实开抢逻辑
	// await page.waitForSelector(btnPrimary, { timeout: 2000 }) // 2. 模拟请打开这里

	await page.click(btnPrimary)
	await page.waitForNavigation()
	await page.goto('https://static.mi.com/cart/') // go to cart
	await page.click("#J_goCheckout")
})();

function sleep(ms) {
	if (ms < 0) { ms = 0 }
	return new Promise(resolve => setTimeout(resolve, ms))
}

async function refreshBuy() {
	try {
		await sleep(config.thetime * 1000 - Date.now())
		await page.goto(config.buyPage)
		await page.waitForSelector('div.buy-option', { timeout: 2000 })
		for (let i = 0; i < buyRule.length; i++) {
			const GB = await page.waitForSelector(buyRule[i].GB)
			const color = await page.waitForSelector(buyRule[i].color)
			GB.click()
			color.click()
			try {
				await page.waitForSelector(btnPrimary, { timeout: 2000 })
				return
			} catch(e) {
				continue;
			}
		}
		await page.waitForSelector(btnPrimary, { timeout: 2000 })
	} catch(e) {
		await refreshBuy()
	}
}
