var gall_active=0;
var gall_c, gall_cWidth, gall_cHeight, gall_nElements, gall_cWidth, gall_cHeight, px1, px2, px3, move_active;
var gall_count=0;
var gall_firstTime=1;
var original_height=[];
function show_gallery(num)
{
 var g=id("gallery_full");
 for(var i=0;i<g.children.length;i++)
 {
	if(i==num){
	 g.children[i].style.display="block";
	 g.children[i].style.top=(innerHeight/2-g.children[i].naturalHeight/2)+"px";
	}
	else g.children[i].style.display="none";
 }
 g.style.display="block";
}
function linx_gall(container)
{
	gall_c = id(container);
	if(gall_firstTime==1)gall_firstTime=0;
	for(var i=0;i<gall_c.children.length;i++)
	{
		original_height[i]=gall_c.children[i].naturalHeight/gall_c.children[i].naturalWidth;
	}
	var clickElement=function(){

		}
	gall_cWidth = (gall_c.offsetWidth/7);
	gall_cHeight = (gall_c.offsetHeight/4);
	gall_nElements = gall_c.children.length;
	for(var i=0;i<gall_nElements;i++)
	{
		gall_c.children[i].style.height="auto";
		gall_c.children[i].gallN=i;
		gall_c.children[i].ondragstart=function(){return false};
		gall_c.children[i].onclick=function(){
			if(gall_active==this.gallN)show_gallery(this.gallN);
			else
			{
				gall_active=this.gallN;
				draw_gall();
			}
			}
	}
var translateObj=function(evt)
{
	evt.preventDefault();
	if(move_active==1){
	try{px2=evt.changedTouches[0].clientX}
	catch(err){px2=evt.clientX}
	px3 = px2-px1;
	if(px3>(gall_c.offsetWidth/10) && gall_active>0){
		px1=px2;
		gall_active--;
		draw_gall();
		}
	if(px3<-(gall_c.offsetWidth/10) && gall_nElements-1>gall_active){
		px1=px2;
		gall_active++;
		draw_gall();
		}
	px2=px3;
}
}
gall_c.addEventListener('touchmove',translateObj,false);
gall_c.addEventListener('touchstart', function(evt){px1=evt.changedTouches[0].clientX;move_active=1},false);
document.body.addEventListener('touchend', function(evt){
	move_active=0;
},false);
gall_c.addEventListener('mousemove',translateObj,false);
gall_c.addEventListener('mousedown', function(evt){px1=evt.clientX;move_active=1},false);
document.body.addEventListener('mouseup', function(evt){
	move_active=0;
},false);
draw_gall();
}
function draw_gall()
{
	gall_resize=0;
	for(var i=0;i<gall_nElements;i++)
	{
	 if(innerWidth>770){
	 gall_c.children[i].className="gallery-obj";
	 var tTop=(gall_c.offsetHeight/2)-(gall_c.children[i].offsetHeight/2);
	 var tLeft=(gall_c.offsetWidth/2)-(gall_c.children[i].offsetWidth/2);
		if(i==gall_active){
		 var tZoom=(gall_c.offsetHeight*0.9)/gall_c.children[i].offsetHeight;
		 gall_c.children[i].style.display="block";
		 gall_c.children[i].style.zIndex=4;
		 transform(gall_c.children[i],0,tLeft,tTop,tZoom);
		}
		else if(i==gall_active-1){
		 var tZoom=(gall_c.offsetHeight*0.6)/gall_c.children[i].offsetHeight;
		 gall_c.children[i].style.display="block";
		 gall_c.children[i].style.zIndex=3;
		 tLeft=tLeft-gall_c.offsetWidth/4;
		 transform(gall_c.children[i],0,tLeft,tTop,tZoom);
		}
		else if(i==gall_active-2){
		 var tZoom=(gall_c.offsetHeight*0.4)/gall_c.children[i].offsetHeight;
		 gall_c.children[i].style.display="block";
		 gall_c.children[i].style.zIndex=2;
		 tLeft=tLeft-gall_c.offsetWidth/3;
		 transform(gall_c.children[i],0,tLeft,tTop,tZoom);
		}
		else if(i==gall_active-3){
		 var tZoom=(gall_c.offsetHeight*0.2)/gall_c.children[i].offsetHeight;
		 gall_c.children[i].style.display="block";
		 gall_c.children[i].style.zIndex=1;
		 tLeft=tLeft-gall_c.offsetWidth/2.5;
		 transform(gall_c.children[i],0,tLeft,tTop,tZoom);
		}
		else if(i==gall_active-4){
		 var tZoom=(gall_c.offsetHeight*0.1)/gall_c.children[i].offsetHeight;
		 gall_c.children[i].style.display="none";
		 gall_c.children[i].style.zIndex=0;
		 tLeft=tLeft-gall_c.offsetWidth/2.5;
		 transform(gall_c.children[i],0,tLeft,tTop,tZoom);
		}
		else if(i==gall_active+1){
		 var tZoom=(gall_c.offsetHeight*0.6)/gall_c.children[i].offsetHeight;
		 gall_c.children[i].style.display="block";
		 gall_c.children[i].style.zIndex=3;
		 tLeft=tLeft+gall_c.offsetWidth/4;
		 transform(gall_c.children[i],0,tLeft,tTop,tZoom);
		}
		else if(i==gall_active+2){
		 var tZoom=(gall_c.offsetHeight*0.4)/gall_c.children[i].offsetHeight;
		 gall_c.children[i].style.display="block";
		 gall_c.children[i].style.zIndex=2;
		 tLeft=tLeft+gall_c.offsetWidth/3;
		 transform(gall_c.children[i],0,tLeft,tTop,tZoom);
		}
		else if(i==gall_active+3){
		 var tZoom=(gall_c.offsetHeight*0.2)/gall_c.children[i].offsetHeight;
		 gall_c.children[i].style.display="block";
		 gall_c.children[i].style.zIndex=1;
		 tLeft=tLeft+gall_c.offsetWidth/2.5;
		 transform(gall_c.children[i],0,tLeft,tTop,tZoom);
		}
		else if(i==gall_active+4){
		 var tZoom=(gall_c.offsetHeight*0.1)/gall_c.children[i].offsetHeight;
		 gall_c.children[i].style.display="none";
		 gall_c.children[i].style.zIndex=0;
		 tLeft=tLeft+gall_c.offsetWidth/2.5;
		 transform(gall_c.children[i],0,tLeft,tTop,tZoom); 
		}
		else{
		 gall_c.children[i].style.display="none";
		}
	}
	else
	{
	 gall_c.children[i].className="gallery-obj2";
	}
	}
	gall_resize=1;
	}
function id(element){return document.getElementById(element)}
function tag(element){return document.getElementsByTagName(element)}
function showMenu(){
	if(id('nav').style.display=="none")
	{
		id('nav').style.display="block"
		}
	else
	{
		id('nav').style.display="none"
		}
	}
function load(){
	linx_gall('gall');
	loadDials();
	}
var img=1;
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
    if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
function rotate(element,deg){transform(element,deg,0,0,1)}
function translate(element,x,y){transform(element,0,x,y,1)}
function scale(element,scale){transform(element,0,0,0,scale)}
function transform(element,deg,x,y,scale)
{
	if(deg==null){deg=0}
	if(x==null){x=0}
	if(y==null){y=0}
	if(scale==null){scale=1}
	var v='rotate(' + deg + 'deg) translate(' + x + 'px,' + y + 'px) scale(' + scale + ')';
	element.style['-ms-transform'] = v;
	element.style['-o-transform'] = v;
	element.style['-webkit-transform'] = v;
	element.style['-moz-transform'] = v;
	element.style['transform'] = v;
}
function loadDials()
{
	for(var i=0;i<tag("dial").length;i++){
	 start=parseFloat(tag("dial")[i].getAttribute("start"));
	 min=parseInt(tag("dial")[i].getAttribute("min"));
	 max=parseInt(tag("dial")[i].getAttribute("max"));
	 createDial(tag("dial")[i],start,min,max,100,document.body);
	}
}
var numDial=0;
var dialEnabled,s2,x1,x2,num;
var mouseM=new Array();
var s = new Array();
var c = new Array();
var ma = new Array();
var mi = new Array();
var dV = new Array();
var se = new Array();
var element,cX,cY,x2,y2,x3,y3,x4,y4;
function createDial(dial,defaultValue,minValue,maxValue,sensitivity,container)
{
		s[numDial]=dial;
		s[numDial].innerHTML="<div style=\"width:100%;height:100%\"></div>";
		ma[numDial]=maxValue;
		mi[numDial]=minValue;
		dV[numDial]=defaultValue;
		se[numDial]=sensitivity;
		c[numDial]=270/(ma[numDial]-mi[numDial]);
		s[numDial].children[0].style['-webkit-transform'] = 'rotate(' + ((dV[numDial]-mi[numDial])*c[numDial]) + 'deg)';
		s[numDial].children[0].style['-moz-transform'] = 'rotate(' + ((dV[numDial]-mi[numDial])*c[numDial]) + 'deg)';
		s[numDial].children[0].style['transform'] = 'rotate(' + ((dV[numDial]-mi[numDial])*c[numDial]) + 'deg)';
		s[numDial].onmousedown = function(evt){x1=evt.clientX;dialEnabled=1;s2=this}
		s[numDial].addEventListener('touchstart', function(evt){x1=evt.changedTouches[0].clientX;dialEnabled=1;s2=this} ,false);
		container.ondragstart=function(){return false};
		container.onmouseup = function(){dialEnabled=0;s2=null}
		container.addEventListener('touchend', function(){dialEnabled=0;s2=null},false);
		var move = function(evt){
			if(dialEnabled==1){evt.preventDefault()}
			for(var i=0;i<numDial;i++){
				if(s[i]==s2){num=i}
				}
			if(dV[num]<mi[num]){dV[num]=mi[num];dialEnabled=0;
				x3=(dV[num]-mi[num])*c[num];
				s2.children[0].style['-webkit-transform'] = 'rotate(' + x3 + 'deg)';
				s2.children[0].style['-moz-transform'] = 'rotate(' + x3 + 'deg)';
				s2.children[0].style['transform'] = 'rotate(' + x3 + 'deg)';
				s2.value=dV[num];}
			if(dV[num]>ma[num]){dV[num]=ma[num];dialEnabled=0;
				x3=(dV[num]-mi[num])*c[num];
				s2.children[0].style['-webkit-transform'] = 'rotate(' + x3 + 'deg)';
				s2.children[0].style['-moz-transform'] = 'rotate(' + x3 + 'deg)';
				s2.children[0].style['transform'] = 'rotate(' + x3 + 'deg)';
				s2.value=dV[num];}
			if(dialEnabled==1 && dV[num]>=mi[num] && dV[num]<=ma[num]){
				try{x2=(evt.changedTouches[0].clientX-x1)/se[num]}
				catch(err){x2=(evt.clientX-x1)/se[num]}
				x3=(dV[num]-mi[num])*c[num];
				s2.children[0].style['-webkit-transform'] = 'rotate(' + (x3+x2) + 'deg)';
				s2.children[0].style['-moz-transform'] = 'rotate(' + (x3+x2) + 'deg)';
				s2.children[0].style['transform'] = 'rotate(' + (x3+x2) + 'deg)';
				dV[num]+=x2;
				s2.value=dV[num];
			}
				if(num!=null&&s2!=null)id("pedal").style.backgroundColor="rgb("+parseInt(dV[0])+","+parseInt(dV[1])+","+parseInt(dV[2])+")";
				}
			container.onmousemove = move;
			container.addEventListener('touchmove',move ,false);
			numDial++;
}