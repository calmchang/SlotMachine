![Page Views Count](https://badges.toozhao.com/badges/01GM1ZKCPFTDZDZXAMATBZHM10/green.svg)

#### 高帧率老虎机滚轴插件,可以用来年会抽奖、777拉霸等

![](http://img.vuedata.cn/slotmachine-review.gif)


##### 使用案例

```
import SlotMachine from './SlotMachine.js';

let imgs=[];//存放所有展示的图片
for(let i=0;i<10;i++){
  imgs[i]=new Image();
  imgs[i].src=`${i}.jpg`;
}

let domCanvas = document.createElement('canvas');//用于渲染滚轴的canvas
let scroll = new SlotMachine({
  imgList:imgs,
  domCanvas:domCanvas
});
scroll.start();
let result = Date.now()%10;//随机一个结果
scroll.end(imgs[result]);//传入图片展示结果
```
