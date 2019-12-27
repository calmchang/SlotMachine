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
    this.ctx.drawImage(img,0,0,img.width,img.height,dx,dy,this.width,this.height);
  }
}

function SlotMachine(config){
  this.imgList=config.imgList||[];
  this.drawList=[];
  this.imgPos=0;
  this.posMax = this.imgList.length;
  this.y=0;
  this.domCanvas = config.domCanvas;
  this.canvas = new Graphics({
    domCanvas:config.domCanvas
  });
  this.defaultImg = config.defaultImg||null;

  this.y=0;
  this.vY=1;
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

  this.render();
}

SlotMachine.prototype.start= function(){
  this.tick();
}
SlotMachine.prototype.render= function(){
  var liH = this.liHeight;
  this.canvas.clear();
  this.canvas.drawImage(this.drawList[0].img,0,-this.y);
  this.canvas.drawImage(this.drawList[1].img,0,-this.y+liH);
}
SlotMachine.prototype.tick= function(){

  this.vY =20;
  this.y+=this.vY;
  var liH = this.liHeight;
  this.render();

  if( this.y >= liH ){
    this.y -= liH;
    this.drawList.shift();
    if(this.drawList[0].stop){
      this.y=0;
      return;
    }
    this.drawList.push({img:this.imgList[this.imgPos++%this.posMax]});
    this.imgPos %= this.posMax;
  }
  
  requestAnimationFrame(this.tick.bind(this));
}
SlotMachine.prototype.end= function(img){
  this.drawList[2] = {img:img,stop:true};
}

export default SlotMachine;


