# buy-xiaomi
## 抢小米手机脚本，基于 puppeteer.js 仅辅助更快操作浏览器


## Use
```c
// 安装依赖
yarn install

// 启动脚本
node buy.js
```
## 更好的抢购规则
```js
// 越前面的越优先购买，前面的没货才购买后面
// 选择器通过浏览器 elements -> 右键 -> Copy -> Copy selector 复制
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
```


## 声明
本脚本仅供米粉购买小米系列产品，请勿当黄牛！