function Graphics(config){
  this.dom = config.domCanvas;
  this.ctx = config.domCanvas.getContext("2d");
  this.width = this.dom.width;
  this.height = this.dom.height;

}
Graphics.prototype.clear=function(){
  this.ctx.clearRect(0,0,this.width,this.height);
}
Graphics.prototype.drawImage=function(img,dx,dy,w,h){
  if(typeof w!=='undefined' && typeof h !=='undefined' ){
    this.ctx.drawImage(img,0,0,w,h,dx,dy,w,h);
  }else{
    try{
      this.ctx.drawImage(img,0,0,img.width,img.height,dx,dy,this.width,this.height);
    }catch(ex){
      debugger;
    }
  }
}

Graphics.prototype.drawText=function(text,x,y,anchorX='center',anchorY='bottom'){
  // 设置字体样式
  this.ctx.font = '30px Arial';
  // 设置文本颜色
  this.ctx.fillStyle = 'black';
  // var textMetrics = this.ctx.measureText(text);
  // var textWidth = textMetrics.width;
  var textHeight = parseInt(this.ctx.font); 
  if(anchorX == 'center'){
    this.ctx.textAlign='center';
  }
  else if(anchorX == 'right'){
    this.ctx.textAlign='right';
  }
  else if(anchorX == 'left'){
    this.ctx.textAlign='left';
  }
  if(anchorY == 'center'){
    y -= textHeight/2;
  }
  else if(anchorX == 'bottom'){
    y -= textHeight;
  }
  else if(anchorX == 'top'){
  }

  // 在 Canvas 上绘制字符串
  this.ctx.fillText(''+text, x, y);
}



function SlotMachine(config){
  this.imgList=config.imgList||[];
  this.drawList=[];
  this.imgPos=0;
  this.posMax = this.imgList.length;
  this.y=0;
  this.status='pending';
  this.domCanvas = config.domCanvas;
  this.canvas = new Graphics({
    domCanvas:config.domCanvas
  });
  this.defaultImg = config.defaultImg||null;

  this.lastTime = 0;
  this.frameCount = 0;
  this.fps=0;


  this.y=0;
  this.vY=0;
  this.targetSpeed=0;//目标移动速度
  this.liHeight=0;

  this.liHeight = this.domCanvas.height;

  for(let i=0;i<3;i++){
    if(i===0&&this.defaultImg){
      this.drawList.push( {img:this.defaultImg} );
    }else{
      this.drawList.push( {img:this.imgList[this.imgPos]} );
      this.imgPos = (this.imgPos+1)%this.posMax;
    }
  }
  this.tick();
}


SlotMachine.prototype.render= function(){
  var liH = this.liHeight;
  this.canvas.clear();
  this.canvas.drawImage(this.drawList[0].img,0,-this.y);
  this.canvas.drawImage(this.drawList[1].img,0,-this.y+liH);
  this.canvas.drawText(`${this.fps}/${this.vY}`,this.canvas.width,this.canvas.height,'right','bottom')
}

SlotMachine.prototype.tick= function(currentTime){
  this.frameCount++;
  if (currentTime - this.lastTime >= 1000) {
    this.fps = this.frameCount;
    this.frameCount = 0;
    this.lastTime = currentTime;
  }
  if(this.status=='running'){
    this.updateSpeed(currentTime);
    this.y += this.vY;
    var liH = this.liHeight;
    if( this.y >= liH ){
      this.y -= liH;
      this.drawList.shift();
      if(this.drawList[0].stop){
        this.y=0;
        this.drawList[0].stop=false;
        this.resetSpeed();
        this.status='pending';
      }else{
        this.drawList.push({img:this.imgList[this.imgPos++%this.posMax]});
        this.imgPos %= this.posMax;
      }
    }
  }
  this.render();
  requestAnimationFrame(this.tick.bind(this));
}

SlotMachine.prototype.updateSpeed= function(now){
  if(!this.speedType)return this.vY;
  if(!now)return this.vY;

  if(this.targetStartTime==0){
    this.targetStartTime = now;
  }
  if(now-this.targetStartTime<100){
    return this.vY;
  }
  this.targetStartTime = now;

  if(this.speedType==='start'){
    this.vY += 2;
    this.vY= Math.min(this.vY,20);
  }else if(this.speedType==='end'){
    this.vY -= 2;
    this.vY = Math.max(this.vY,5);
    if(this.vY == 5 ){
      this.drawList[2] = {img:this.resultImage,stop:true};
      this.speedType='';
    }
  }
}

SlotMachine.prototype.resetSpeed= function(now){
  this.targetStartTime=0;
  this.speedType='';
  this.resultImage=null;
}

SlotMachine.prototype.start= function(){
  this.targetStartTime=0;
  this.speedType='start';
  this.status='running';
  this.drawList.forEach(item=>item.stop=false)
}

SlotMachine.prototype.end= function(img){
  this.targetStartTime=0;
  this.speedType='end'
  this.resultImage=img;
  // this.drawList[2] = {img:img,stop:true};
}

export default SlotMachine;


