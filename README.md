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
```
## 浏览器获取选择器
```js
// 选择器通过浏览器 elements -> 右键 -> Copy -> Copy selector 复制
例如：'#app > div.mi-detail > div > div > div > div.product-box.container > div.product-con > div.btn-box > div.sale-btn > a'

```
## 效果预览：
![效果预览](https://img-blog.csdnimg.cn/20210326231919545.gif)

## 声明
本脚本仅供米粉购买小米系列产品，请勿当黄牛！