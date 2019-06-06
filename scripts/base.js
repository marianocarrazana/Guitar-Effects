//Copyright 2014 Claudio Mariano Carrazana marianocarrazana@gmail.com
/*if(!debugF && appType=="web"){
setInterval(function () {
if ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || window.outerWidth - window.innerWidth > 160 ||
window.outerHeight - window.innerHeight > 220) {
document.body.innerHTML="";
document.getElementsByTagName("head")[0].innerHTML = "";
}
}, 2000);}*/
function showAmp()
{
 if(id("ampcab").innerHTML=="-")
 {
	id("ampcab").innerHTML="+";
	translate(id("amp-options"),-322,0);
 }
 else
 {
	id("ampcab").innerHTML="-";
	translate(id("amp-options"),0,0);
 }
}
var sliderEl;
function loadSliders()
{
 sliderEl=document.getElementsByTagName("slider");
 for(var i=0;i<sliderEl.length;i++)slider(sliderEl[i]);
}
function slider(a)
{
 a.innerHTML="<slider2></slider2><tagSlider></tagSlider>";
 a.t=a.getAttribute("type");
 a.min=parseFloat(a.getAttribute("min"));
 a.max=parseFloat(a.getAttribute("max"));
 a.length=parseInt(a.getAttribute("length"));
 a.value=parseFloat(a.getAttribute("value"));
 a.eval=a.getAttribute("eval");
 if(a.t=="vertical")
 {a.style.height=a.length+"px";a.children[1].className="tagV";}
 else
 {a.style.width=a.length+"px";a.children[1].className="tagH";}
 window.onmouseup=window.ontouchend=function(){for(var i=0;i<sliderEl.length;i++)sliderEl[i].enabled=false;};
 a.ondragstart=function(){return false};
 var enabled=true;
 try{eval("a.connect="+a.getAttribute('connect'));}catch(err){enabled=false;}
 if(a.connect===undefined)enabled=false;
 if(enabled){
 a.onmousedown=function(event){this.enabled=true;this.onmousemove(event);};
 a.ontouchstart=a.ontouchmove=a.onmousemove=function(e)
 {
 var event={layerX:e.layerX,layerY:e.layerY,target:e.target,type:e.type};
 if(event.type=="touchstart"||event.type=="touchmove")
	{
	 event.layerY=e.changedTouches[0].clientY-e.changedTouches[0].target.clientTop;
	 event.layerX=e.changedTouches[0].clientX-e.changedTouches[0].target.clientLeft;
	 event.target=e.changedTouches[0].target;
	 this.enabled=true;
	}
 if(this.enabled&&event.target.tagName=="SLIDER"){
	var posX=event.layerX*((this.length-16)/this.length);
	var posY=event.layerY*((this.length-16)/this.length);
	var v;
	if(this.t=="vertical")
	{
	if(event.layerY>=0&&event.layerY<=this.length){
	this.children[1].style.top=posY+"px";
	translate(this.children[0],0,posY);}
	v=this.min+event.layerY*((this.max-this.min)/this.length);
	}
	else
	{
	if(event.layerX>=0&&event.layerX<=this.length){
	translate(this.children[0],posX,0);}
	v=this.min+event.layerX*((this.max-this.min)/this.length);
	}
	this.slide(v);
	}
 };
 a.slide=function(val)
 {
	if(val>this.max)val=this.max;
	if(val<this.min)val=this.min;
	this.value=val;
	if(this.eval=="linear")eval(this.getAttribute('connect')+"="+val);
	else eval(this.getAttribute('connect')+"("+val+")");
	this.children[1].innerHTML=val.toFixed(2);
 };
 var ev={type:"",layerX:a.length/((a.max-a.min)/(a.value-a.min)),layerY:a.length/((a.max-a.min)/(a.value-a.min)),target:{tagName:"SLIDER"}};
 a.onmousedown(ev);
 a.enabled=false;
 a.style.background="";
	a.children[1].style.display="";
 }
 else
 {
	a.style.background="gray";
	a.children[1].style.display="none";
 }
}
window.addEventListener("message",function(event)
{
 var d=event.data;
 if(d.substring&&d.search("name")==-1)
 {
	if(d=="recorder"){recorderP="recorder";}
	else{pedals=d+",";}
	loadPedals(true);
	if(lang=="es"){alert("Tiene 30 segundos para probarlo");}
	else{alert("You have 30 seconds to try it");}
	setTimeout(endTry,30000);
	tryModeOn=true;
 }
 else
 {
	localStorage.purch=JSON.stringify(d);
	listPedals();
 }
});
var tryModeOn=false;
var endTry=function()
{
 pedals=localStorage.lastPedals;
 recorderP=localStorage.recorder;
 tryModeOn=false;
 loadPedals();
 if(lang=="es"){alert("Tiempo Terminado");}
 else{alert("Time finished");}
}
var firstTime=false;
if(localStorage.lastPedals==null)
{localStorage.lastPedals="overdrive,";firstTime=true}
if(localStorage.limiter==null)localStorage.limiter="limiter,";
if(localStorage.compressor==null)localStorage.compressor="";
if(localStorage.recorder==null)localStorage.recorder="";
if(localStorage.amplifier==null)localStorage.amplifier="rpr";
if(localStorage.amplifierN==null)localStorage.amplifierN="RPR";
if(localStorage.cabinet==null)localStorage.cabinet="vinuk";
if(localStorage.cabinetN==null)localStorage.cabinetN="Vintage UK";
//if(localStorage.purch==null)localStorage.purch="";
if(localStorage.nruns==null)localStorage.nruns=0;
else localStorage.nruns=parseInt(localStorage.nruns)+1;
function generatePedal(name,subname,pot1,level1,pot2,level2,pot3,level3,pot4,level4)
{
	var td='<td><div class="pedal" id="'+name.toLowerCase()+subname.toLowerCase()+'">';
	if(pot1=="analyser"){dial="<div id='analyser-note'></div>";}
  else if(pot1=="rec"){dial="<div id='recorder-icon'><img src='img/rec.png' /></div>";}
  else{
  if(pot4!=null){var n=4}
	else if(pot3!=null){var n=3}
	else if(pot2!=null){var n=2}
	else{var n=1}
	var dial="";
	for(var i=0;i<n;i++){
	 var control,lv,pot;
	 if(n==1){control="middle";lv=level1;pot=pot1}
	 else if(n==2&&i==0){control="left";lv=level1;pot=pot1}
	 else if(n==2&&i==1){control="right";lv=level2;pot=pot2}
	 else if(n==3&&i==0){control="top-middle";lv=level1;pot=pot1}
	 else if(n==3&&i==1){control="left-middle";lv=level2;pot=pot2}
	 else if(n==3&&i==2){control="right-middle";lv=level3;pot=pot3}
	 else if(n==4&&i==0){control="right-top";lv=level1;pot=pot1}
	 else if(n==4&&i==1){control="right-bottom";lv=level2;pot=pot2}
	 else if(n==4&&i==2){control="left-top";lv=level3;pot=pot3}
	 else if(n==4&&i==3){control="left-bottom";lv=level4;pot=pot4}
	 dial+='<dial class="control-'+control+' controls" id="'+name.toLowerCase()+subname.toLowerCase()+'-'+pot+'" start="'+lv+'" min="0" max="1"></dial>';
	 dial+='<label class="label-'+control+' controls">'+pot.toUpperCase()+'</label>';
	}
    }
	var nametag="<name>"+name+"</name><subname>"+subname+"</subname>";
	var end="<switch></switch></div></td>";
	return td+dial+nametag+end;
}
var optionsVisible=false;
function showOptions()
{
 if(!optionsVisible)
 {
	translate(id("options-button"),-240,0);
	translate(id("options"),-240,0);
 }
 else
 {
	translate(id("options-button"),0,0);
	translate(id("options"),0,0);
 }
 optionsVisible=!optionsVisible;
}
function changeBufferSize(size)
{
 localStorage.bufferSize=size;
 BufferLength=parseInt(size);
 loadPedals();
}
var pedals=localStorage.lastPedals;
var limiterP=localStorage.limiter;
var recorderP=localStorage.recorder;
var compressorP=localStorage.compressor;
var cabinetON=false;
var amplifierON=true;
var amp=localStorage.amplifier;
var cab=localStorage.cabinet;
var pedalsN=0;
var effectsArray=new Array();
var ctx,board,sterefy,flangerstereo,flangersilver,thebytter,theripper,compressor,recorder,digitalizer,overdrive,flangerdarkmouth,flangermanhattan,eqpeak,flangerclassic,eqmid,eqhigh,eqlow,fuxxboz,autoreverb,doppler,tremolo,chorusclassic,delaystereo,delaymono,chorussupercharger,eq3band,r_classic,r_catedral,r_smallroom,limiter,cabinet,amplifier,convolver,fuzz1,ringring,overscream;
function loadPedals(tryMode)
{
 if(!tryModeOn){
 	if(localStorage.nruns=="0"){
 		localStorage.nruns="1";
 		if(lang=="es")
 			message("Conecte su guitarra y presione el ícono del micrófono <img style='width:auto;height:32px' src='img/mic.png' alt='mic'/> para empezar a reproducir.<br>\
 			Algunas placas USB son compatibles ahora, consulte la página de <a href='https://www.patreon.com/marianofromlaruta' target='_blank'>patreon</a> para más información.");
 			else message("Connect your guitar and press the microphone icon <img style='width:auto;height:32px' src='img/mic.png' alt='mic'/> to start playing.<br>\
 			Some external USB cards are supported now, check the <a href='https://www.patreon.com/marianofromlaruta' target='_blank'>patreon</a> page for more information.");
 	}
	try{recorder.rec.onaudioprocess=function(e){};}catch(err){}
	for(var i=0;i<effectsArray.length;i++)effectsArray[i].out.disconnect();
	try{microphone.disconnect();}catch(err){}
	try{localAudio.disconnect();}catch(err){}
	id("buffer-length").value=localStorage.bufferSize;
	id("add-pedals").innerHTML="";
	id("del-pedals").innerHTML="";
	if(amplifier!=null){amplifier.out.disconnect();if(amplifier.ON)amplifierON=true;else amplifierON=false}
	if(cabinet!=null){cabinet.out.disconnect();if(cabinet.ON)cabinetON=true;else cabinetON=false}
	overdrive=sterefy=flangerstereo=flangersilver=thebytter=theripper=compressor=recorder=digitalizer=flangerclassic=flangerdarkmouth=flangermanhattan=eqpeak=eqmid=eqhigh=eqlow=autoreverb=fuxxboz=doppler=delaystereo=tremolo=chorusclassic=delaymono=r_classic=r_catedral=chorussupercharger=eq3band=r_smallroom=limiter=cabinet=convolver=fuzz1=ringring=overscream=null;
	if(cab=="vinus"){cabinet = new effects.VinUs()}
	if(cab=="vinuk"){cabinet = new effects.VinUk()}
	if(cab=="clean"){cabinet = new effects.Clean()}
	if(cab=="bass"){cabinet = new effects.Bass()}
	if(cab=="deep"){cabinet = new effects.Deep()}
	if(cab=="stereo")cabinet = new effects.Stereo();
	if(cab=="alien")cabinet = new effects.Alien();
	if(cab=="metal")cabinet = new effects.Metal();
	if(cab=="noisy")cabinet = new effects.Noisy();
	if(cab=="feedy")cabinet = new effects.Feedy();
	if(cab=="peaker")cabinet = new effects.Peaker();
	if(cab=="power")cabinet = new effects.Power();
	if(amp=="modger")amplifier = new effects.ModernGer();
	if(amp=="eqg")amplifier = new effects.EQG();
	if(amp=="bassman")amplifier = new effects.Bassman();
	if(amp=="rpr")amplifier = new effects.RPR();
	if(amp=="crusher")amplifier = new effects.Crusher();
	var nP=0;
	if(pedals.search("sterefy")!=-1){
	 var sterefyPedal=generatePedal("Sterefy","","level","1","separation","0.5");
	 sterefy = new effects.Sterefy();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', sterefyPedal );addDel("sterefy")}
	if(pedals.search("flangerstereo")!=-1){
	 var flangerstereoPedal=generatePedal("Flanger","Stereo","level","1","frequency","0.5","cutoff","0.5");
	 flangerstereo = new effects.FlangerStereo();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', flangerstereoPedal );addDel("flangerstereo")}
	if(pedals.search("flangersilver")!=-1){
	 var flangersilverPedal=generatePedal("Flanger","Silver","level","1","frequency","0.5","cutoff","0.5");
	 flangersilver = new effects.FlangerSilver();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', flangersilverPedal );addDel("flangersilver")}
	if(pedals.search("thebytter")!=-1){
	 var thebytterPedal=generatePedal("The-Bytter","","level","1","drive","0.5","cutoff","0.5");
	 thebytter = new effects.TheBytter();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', thebytterPedal );addDel("thebytter")}
	if(pedals.search("theripper")!=-1){
	 var theripperPedal=generatePedal("The-Ripper","","level","1","drive","0.5","cutoff","0.5");
	 theripper = new effects.TheRipper();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', theripperPedal );addDel("theripper")}
	if(compressorP.search("compressor")!=-1){
	 var compressorPedal=generatePedal("Compressor","","level","1");
	 compressor = new effects.Compressor();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', compressorPedal );addDel("compressor")}
	if(recorderP.search("recorder")!=-1){
	 var recorderPedal=generatePedal("Recorder","","rec");
	 recorder = new effects.Recorder();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', recorderPedal );addDel("recorder")}
	if(pedals.search("digitalizer")!=-1){
	 var digitalizerPedal=generatePedal("Digitalizer","","level","1");
	 digitalizer = new effects.Digitalizer();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', digitalizerPedal );addDel("digitalizer")}
	if(pedals.search("bitcrusher")!=-1){
	 var bitcrusherPedal=generatePedal("Bitcrusher","","level","1","frequency","1","bits","0.2");
	 bitcrusher = new effects.Bitcrusher();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', bitcrusherPedal );addDel("bitcrusher")}
	if(pedals.search("flangerdarkmouth")!=-1){
	 var flangerdarkmouthPedal=generatePedal("Flanger","Darkmouth","level","1","frequency","0.5","speed","0.25");
	 flangerdarkmouth = new effects.FlangerDarkmouth();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', flangerdarkmouthPedal );addDel("flangerdarkmouth")}
	if(pedals.search("flangermanhattan")!=-1){
	 var flangermanhattanPedal=generatePedal("Flanger","Manhattan","level","1","frequency","0.5");
	 flangermanhattan = new effects.FlangerManhattan();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', flangermanhattanPedal );addDel("flangermanhattan")}
	if(pedals.search("flangerclassic")!=-1){
	 var flangerclassicPedal=generatePedal("Flanger","Classic","level","1","speed","0.5","dry/wet","0.5");
	 flangerclassic = new effects.FlangerClassic();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', flangerclassicPedal );addDel("flangerclassic")}
	if(pedals.search("eqlow")!=-1){
	 var eqlowPedal=generatePedal("EQ","Low","level","1","gain","0.5","frequency","0.5");
	 eqlow = new effects.EqLow();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', eqlowPedal );addDel("eqlow")}
	if(pedals.search("eqhigh")!=-1){
	 var eqhighPedal=generatePedal("EQ","High","level","1","gain","0.5","frequency","0.5");
	 eqhigh = new effects.EqHigh();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', eqhighPedal );addDel("eqhigh")}
	if(pedals.search("eqpeak")!=-1){
	 var eqpeakPedal=generatePedal("EQ","Peak","level","1","gain","0.5","quality","0.5","frequency","0.5");
	 eqpeak = new effects.EqPeak();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', eqpeakPedal );addDel("eqpeak")}
	if(pedals.search("eqmid")!=-1){
	 var eqmidPedal=generatePedal("EQ","Mid","level","1","gain","0.5","quality","0.5");
	 eqmid = new effects.EqMid();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', eqmidPedal );addDel("eqmid")}
	if(pedals.search("fuzzbit")!=-1){
	 var fuxxbozPedal=generatePedal("Fuzz","Bit","level","1","tone","0.5","drive","0.5");
	 fuzzbit = new effects.FuzzBit();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', fuxxbozPedal );addDel("fuzzbit")}
	if(pedals.search("fuxxboz")!=-1){
	 var fuxxbozPedal=generatePedal("Fuxx","Boz","level","1","tone","0.5","drive","0.5");
	 fuxxboz = new effects.FuxxBoz();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', fuxxbozPedal );addDel("fuxxboz")}
	if(pedals.search("autoreverb")!=-1){
   var autoreverbPedal=generatePedal("AutoReverb","","decay","0.5","length","0.5","offset","0");
	 autoreverb = new effects.AutoReverb();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', autoreverbPedal );addDel("autoreverb")}
	if(pedals.search("doppler")!=-1){
     var analyserPedal=generatePedal("Doppler","","level","1","velocity","0.5","distance","0.5");
	 doppler = new effects.Doppler();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', analyserPedal );addDel("doppler")}
	if(pedals.search("analyser")!=-1){
     var analyserPedal=generatePedal("Analyser","","analyser");
	 analyser = new effects.Analyser();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', analyserPedal );addDel("analyser")}
	if(pedals.search("tremolo")!=-1){
	 var tremoloPedal=generatePedal("Tremolo","","level","1","frequency","0.5");
	 tremolo = new effects.Tremolo();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', tremoloPedal );addDel("tremolo")}
	if(pedals.search("chorusclassic")!=-1){
	 var chorusclassicPedal=generatePedal("Chorus","Classic","level","1");
	 chorusclassic = new effects.ChorusClassic();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', chorusclassicPedal );addDel("chorusclassic")}
	if(pedals.search("chorussupercharger")!=-1){
	 var chorusPedal=generatePedal("Chorus","Supercharger","level","1.0","gain","0.5");
	 chorussupercharger = new effects.ChorusSupercharger();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', chorusPedal );addDel("chorussupercharger")}
	if(pedals.search("eq3band")!=-1){
	 var eq3Pedal=generatePedal("Equalizer","3Band","level","1.0","mid","0.5","high","0.5","low","0.5");
	 eq3band = new effects.Eq3();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', eq3Pedal );addDel("eq3band")}
	if(pedals.search("delaystereo")!=-1){
	 var delaystereoPedal=generatePedal("Delay","Stereo","level","1.0","dry/wet","0.5","feedback","0.5","time","0.5");
	 delaystereo = new effects.DelayStereo();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', delaystereoPedal );addDel("delaystereo")}
	if(pedals.search("delaymono")!=-1){
	 var delaymonoPedal=generatePedal("Delay","Mono","level","1.0","dry/wet","0.5","feedback","0.5","time","0.5");
	 delaymono = new effects.Delay();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', delaymonoPedal );addDel("delaymono")}
	if(pedals.search("overdrive")!=-1){
	 var overdrivePedal=generatePedal("Overdrive","","level","1","tone","0.5","drive","0.5");
	 overdrive = new effects.Overdrive();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', overdrivePedal );addDel("overdrive")}
	if(pedals.search("r_classic")!=-1){
	 var r_classicPedal=generatePedal("Reverb","Classic","level","1");
	 r_classic = new effects.ReverbClassic();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', r_classicPedal );addDel("r_classic")}
	if(pedals.search("overscream")!=-1){
	 var overscreamPedal=generatePedal("Overscream","","level","1","drive","0.5");
	 overscream = new effects.Overscream();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', overscreamPedal );addDel("overscream")}
	if(pedals.search("fuzz1")!=-1){
	 var fuzzPedal=generatePedal("Fuzz","","level","1","tone","0.5","drive","0.5");
	 fuzz1 = new effects.Fuzz();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', fuzzPedal );addDel("fuzz1")}
	if(limiterP.search("limiter")!=-1){
	 var limiterPedal=generatePedal("Limiter","","level","1");
	 limiter = new effects.Limiter();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', limiterPedal );addDel("limiter")}
	if(pedals.search("convolver")!=-1){
	 var convolverPedal=generatePedal("Convolver","","level","1");
	 convolver = new effects.Convolver();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', convolverPedal );addDel("convolver")}
	if(pedals.search("ringring")!=-1){
	 var ringringPedal=generatePedal("RingRing","","level","1");
	 ringring = new effects.RingRing();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', ringringPedal );addDel("ringring")}
	if(pedals.search("r_catedral")!=-1){
	 var r_catedralPedal=generatePedal("Reverb","Catedral","level","1");
	 r_catedral = new effects.ReverbCatedral();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', r_catedralPedal );addDel("r_catedral")}
	if(pedals.search("r_smallroom")!=-1){
	 var r_smallroomPedal=generatePedal("Reverb","SmallRoom","level","1");
	 r_smallroom = new effects.ReverbSmallRoom();
	 nP++;id("add-pedals").insertAdjacentHTML( 'afterbegin', r_smallroomPedal );addDel("r_smallroom")}
	id("pedals").style.width=(309*nP)+"px";
	for(var i=0;i<id("add-pedals").children.length;i++)id("add-pedals").children[i].style.width=(100/nP)+"%";
	try{
	 eval('effectsArray=['+pedals+'amplifier,cabinet,'+compressorP+limiterP+recorderP+']');
	 loadEffects(effectsArray);}
	catch(err){
	 localStorage.lastPedals=pedals="";
	 localStorage.limiter=limiterP="";
	 localStorage.recorder=recorderP="";
	 localStorage.compressor=compressorP="";
	 localStorage.amplifier=amp="rpr";
	 localStorage.cabinet=cab="vinuk";
	 localStorage.amplifierN="RPR";
	 localStorage.cabinetN="Vintage UK";
	 console.log(err);
	}
	load();
	if(tryMode==null){localStorage.lastPedals=pedals;
	localStorage.recorder=recorderP;
	localStorage.limiter=limiterP;
	localStorage.compressor=compressorP;
	localStorage.amplifier=amp;
	localStorage.cabinet=cab;
	}
 }
}
function swCab(el)
{
	if(!cabinet.ON){el.innerHTML="ON";el.style.background="#0f0";}
	else{el.innerHTML="OFF";el.style.background="#f00";}
	cabinetON=!cabinetON;
	try{cabinet.ON=!cabinet.ON;loadEffects(effectsArray);}catch(err){console.log(err);}
}
function swAmp(el)
{
	if(!amplifier.ON){el.innerHTML="ON";el.style.background="#0f0";}
	else{el.innerHTML="OFF";el.style.background="#f00";}
	amplifierON=!amplifierON;
	try{amplifier.ON=!amplifier.ON;loadEffects(effectsArray);}catch(err){console.log(err);}
}
function selectCabinet(val,name){
 if(val!="0"){cab=val;localStorage.cabinetN=name;loadPedals();}
 translate(id("cabinets-list"),-241,0);
}
function selectAmplifier(val,name){
 if(val!="0"){amp=val;localStorage.amplifierN=name;loadPedals();}
 translate(id("amplifiers-list"),-241,0);
}
function addDel(p){id("del-pedals").insertAdjacentHTML( 'afterbegin', "<td onclick=\"delPedal('"+p+"',this)\"><div>Delete</div></td>" )}
function delPedal(p)
{
 if(p=="limiter"){limiterP="";}
 else if(p=="recorder"){recorderP="";}
 else if(p=="compressor"){compressorP="";}
 else{pedals=pedals.replace(p+",","");}
 window[p].out.disconnect();
 loadPedals();
}
function addPedal(tp)
{
	if(tp!="0"&&pedals.search(tp)==-1&&tp!="limiter"&&tp!="recorder"&&tp!="compressor")
	{pedals+=tp+",";loadPedals();}
	else if(tp=="limiter"){limiterP="limiter,";loadPedals();}
	else if(tp=="recorder"){recorderP="recorder";loadPedals();}
	else if(tp=="compressor"){compressorP="compressor,";loadPedals();}
	translate(id("pedals-list"),-241,0);
}
function listPedals(onlyshow)//onlyshow=true: open pedals list
{
 if(onlyshow){translate(id("pedals-list"),0,0)}
 else
 {
	translate(id("pedals-list"),-241,0);
	//to fix: micro stuttering with doppler
	//to fix: recorder working only on firefox
	var pedals_vars=["0","overdrive","overscream","fuzz1","limiter","delaymono","delaystereo","eq3band","chorusclassic","chorussupercharger","tremolo","analyser","doppler","fuxxboz","fuzzbit","eqmid","eqhigh","eqpeak","eqlow","flangerclassic","flangermanhattan","flangerdarkmouth","bitcrusher","digitalizer",/*"recorder",*/"r_classic","r_catedral","r_smallroom","ringring","autoreverb","convolver","compressor","theripper","thebytter","flangersilver","flangerstereo","sterefy"];
	var pedals_names=["close","Overdrive","Overscream","Fuzz","Limiter","Delay-Mono","Delay-Stereo","3Band-EQ","Chorus-Classic","Chorus-Supercharger","Tremolo","Analyser-Tuner","Doppler","Fuxx-Boz","Fuzz-Bit","EQ-Mid","EQ-High","EQ-Peak","EQ-Low","Flanger-Classic","Flanger-Manhattan","Flanger-Darkmouth","Bitcrusher","Digitalizer",/*"Recorder",*/"Reverb-Classic","Reverb-Catedral","Reverb-Small Room","RingRing","AutoReverb","Convolver","Compressor","The-Ripper","The-Bytter","Flanger-Silver","Flanger-Stereo","Sterefy"];
	var cont="";
	var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
	if(isFirefox){
		pedals_vars.push("recorder");
		pedals_names.push("Recorder");
	}
	pedals_vars.push("0");
	pedals_names.push("close");
	for(var i=0;i<pedals_vars.length;i++)
	{
	 var purchased=true;
	 var classes="";
	 if(pedals_vars[i]=="0")classes="pedal-sel-close";

	 if(purchased)cont+="<div onclick='addPedal(\""+pedals_vars[i]+"\")' class='pedal-select "+classes+"'>"+pedals_names[i]+"</div>";
	}
	id("pedals-list").innerHTML=cont;
 }
}
function checkP(itemID,list)
{
 var p=false;
 for(var i=0;i<list.length;i++)
 {
	if(itemID==list[i].id)p=true;
 }
 return p;
}
var mic_on=false;
function playLineIn() 
{
	if(!mic_on)
	{
	 connectIn("mic");
	 id("mic").style.background='#0f0';
	 mic_on=true;
	}
	else
	{
		id("mic").style.background='red';
		disconnectIn("mic");
		mic_on=false;
	}
}
function playDemo() 
{
	if(id("demo").innerHTML=="Play Demo")
	{
	connectIn('demo/Demo.ogg');
	id("demo").innerHTML="Stop Demo";
	id("demo").style.background="#0f0";
	}
	else
	{
	 disconnectIn("d");
	 id("demo").innerHTML="Play Demo";
	 id("demo").style.background="red";
	}
}
function posPedals()
{
	var winH=window.innerHeight;
	id("div-pedals").style.height=(winH-58)+"px";
	scale(id("pedals"),((winH-58)/550));
}
function loadDials()
{
	for(var i=0;i<tag("dial").length;i++){
	 start=parseFloat(tag("dial")[i].getAttribute("start"));
	 min=parseInt(tag("dial")[i].getAttribute("min"));
	 max=parseInt(tag("dial")[i].getAttribute("max"));
	 createDial(tag("dial")[i],start,min,max,10000,document.body);
	}
}
function load()
{
	if(localAudio==null)
	{
	 readData("demo/Demo.ogg");
	 tag('loading')[0].style.display="none";
	}
	posPedals();
	loadDials();
	loadSliders();
	id("cabinet-s2").innerHTML=localStorage.cabinetN;
	id("amplifier-s2").innerHTML=localStorage.amplifierN;
	for(var i=0;i<tag("switch").length;i++){
		var t=tag("switch")[i].parentNode.id;
		switch(t)
		{
		 case "recorder":var state=false;break; 
		 default:var state=true;
		}
		if(state){
			 tag("switch")[i].parentNode.style.backgroundImage="url(img/pedal-on.png)";
			}
		else{
			 tag("switch")[i].parentNode.style.backgroundImage="url(img/pedal-off.png)";
			}
		tag("switch")[i].onclick=function()
		{
			var k=this.parentNode.id;
			for(var i=0;i<effectsArray.length;i++)effectsArray[i].out.disconnect();
			try{microphone.disconnect();}catch(err){}
			try{localAudio.disconnect();}catch(err){}
			switch(k)
			{
			case "fuzz":var state=fuzz1.ON=!fuzz1.ON;break;
			case "reverbsmallroom":var state=true;break;
			case "reverbclassic":var state=true;break;
			case "reverbcatedral":var state=true;break;
			case "the-ripper":var state=theripper.ON=!theripper.ON;break;
			case "the-bytter":var state=thebytter.ON=!thebytter.ON;break;
			case "recorder":var state=recorder.ON=!recorder.ON;if(recorder.ON){iniRecorder();id("recorder-icon").style.WebkitAnimation=id("recorder-icon").style.animation="2s recAnim infinite";}else{id("recorder-icon").style.WebkitAnimation=id("recorder-icon").style.animation="";exportWAV();};break;
			default:var state=window[k].ON=!window[k].ON;
			}
			loadEffects(effectsArray);
			if(state){
			 this.parentNode.style.backgroundImage="url(img/pedal-on.png)";}
			else{
			 this.parentNode.style.backgroundImage="url(img/pedal-off.png)";}
			}
	}
}
function id(element){return document.getElementById(element)}
function tag(element){return document.getElementsByTagName(element)}
function className(element){return document.getElementsByClassName(element)}
Element.prototype.remove = function(){this.parentElement.removeChild(this)}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++){
        if(this[i] && this[i].parentElement){this[i].parentElement.removeChild(this[i])}
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
				if(num!=null&&s2!=null){
				 var v=parseFloat(dV[num].toFixed(2));
				 var ef=s2.id;
				 var con=controls;
				 switch(ef)
					{
					 case "convolver-level":convolver.process.gain.value=v;break;
					 case "limiter-level":limiter.out.gain.value=v;break;
					 case "reverbclassic-level":r_classic.process.gain.value=v;break;
					 case "ringring-level":ringring.process.gain.value=v;break;
					 case "reverbcatedral-level":r_catedral.process.gain.value=v;break;
					 case "reverbsmallroom-level":r_smallroom.process.gain.value=v;break;
					 case "overdrive-level":overdrive.out.gain.value=v;break;
					 case "overdrive-drive":overdrive.drive(v*1000);break;
					 case "overdrive-tone":overdrive.in.frequency.value=v*6000;break;
					 case "overscream-level":overscream.out.gain.value=v;break;
					 case "overscream-drive":overscream.drive(400-v*400);break;
					 case "fuzz-level":fuzz1.out.gain.value=v;break;
					 case "fuzz-drive":fuzz1.drive(v*2000);break;
					 case "fuzz-tone":fuzz1.in.frequency.value=v*6000;break;
					 case "delaymono-level":delaymono.out.gain.value=v;break;
					 case "delaymono-dry/wet":delaymono.wetLevel.gain.value=v;break;
					 case "delaymono-feedback":delaymono.feedback.gain.value=v*0.8;break;
					 case "delaymono-time":delaymono.delay.delayTime.value=v*0.5+0.05;break;
					 case "delaystereo-level":delaystereo.out.gain.value=v;break;
					 case "delaystereo-dry/wet":delaystereo.wetLevel.gain.value=v;break;
					 case "delaystereo-feedback":delaystereo.feedbackL.gain.value=delaystereo.feedbackR.gain.value=v*0.8;break;
					 case "delaystereo-time":delaystereo.delayR.delayTime.value=v*0.5+0.05;delaystereo.delayL.delayTime.value=(v*0.5+0.05)*0.94;break;
					 case "equalizer3band-low":eq3band.in.gain.value=v*20-10;break;
					 case "equalizer3band-mid":eq3band.midEq.gain.value=v*20-10;break;
					 case "equalizer3band-high":eq3band.highEq.gain.value=v*20-10;break;
					 case "equalizer3band-level":eq3band.out.gain.value=v;break;
					 case "chorussupercharger-level":chorussupercharger.out.gain.value=v;break;
					 case "chorussupercharger-gain":chorussupercharger.attenuator.gain.value=v;break;
					 case "chorusclassic-level":chorusclassic.out.gain.value=v;break;
					 case "tremolo-frequency":tremolo.osc.frequency.value=v*20;break;
					 case "tremolo-level":tremolo.out.gain.value=v;break;
					 case "doppler-velocity":con.doppler.pannerVel=v*1.8;break;
					 case "doppler-distance":con.doppler.pannerDistMax=1+v*3;break;
					 case "doppler-level":doppler.out.gain.value=v;break;
					 case "autoreverb-length":autoreverb.length=v*context.sampleRate*2;autoreverb.updateimpulse();break;
					 case "autoreverb-decay":autoreverb.decay=v*6;autoreverb.updateimpulse();break;
					 case "autoreverb-offset":autoreverb.reverse=v;autoreverb.updateimpulse();break;
					 case "fuxxboz-level":fuxxboz.out.gain.value=v;break;
					 case "fuxxboz-drive":fuxxboz.drive(v*2);break;
					 case "fuxxboz-tone":fuxxboz.lowEq.gain.value=10-v*20;fuxxboz.midEq.gain.value=v*20-10;fuxxboz.highEq.gain.value=v*20-10;break;
					 case "fuzzbit-level":fuzzbit.out.gain.value=v;break;
					 case "fuzzbit-drive":fuzzbit.drive(v*0.1);break;
					 case "fuzzbit-tone":fuzzbit.lowEq.gain.value=10-v*20;fuzzbit.midEq.gain.value=v*20-10;fuzzbit.highEq.gain.value=v*20-10;break;
					 case "eqmid-level":eqmid.out.value.gain=v;break;
					 case "eqmid-quality":eqmid.in.Q.value=v*2;break;
					 case "eqmid-gain":eqmid.in.gain.value=v*80-40;break;
					 case "eqhigh-level":eqhigh.out.value.gain=v;break;
					 case "eqhigh-frequency":eqhigh.in.frequency.value=v*700;break;
					 case "eqhigh-gain":eqhigh.in.gain.value=v*80-40;break;
					 case "eqlow-level":eqlow.out.value.gain=v;break;
					 case "eqlow-frequency":eqlow.in.frequency.value=v*700;break;
					 case "eqlow-gain":eqlow.in.gain.value=v*80-40;break;
					 case "eqpeak-level":eqpeak.out.gain.value=v;break;
					 case "eqpeak-frequency":eqpeak.in.frequency.value=v*700;break;
					 case "eqpeak-quality":eqpeak.in.Q.value=v*2;break;
					 case "eqpeak-gain":eqpeak.in.gain.value=v*80-40;break;
					 case "flangerclassic-dry/wet":con.flangerclassic.level=1-v;break;
					 case "flangerclassic-speed":con.flangerclassic.speed=v*0.4;break;
					 case "flangerclassic-level":flangerclassic.out.gain.value=v;break;
					 case "flangermanhattan-frequency":con.flangermanhattan.freq=1+(v*10);break;
					 case "flangermanhattan-level":flangermanhattan.out.gain.value=v;break;
					 case "flangerdarkmouth-speed":con.flangerdarkmouth.speed=v;break;
					 case "flangerdarkmouth-frequency":con.flangerdarkmouth.freq=1+(v*10);break;
					 case "flangerdarkmouth-level":flangerdarkmouth.out.gain.value=v;break;
					 case "bitcrusher-level":bitcrusher.out.gain.value=v;break;
					 case "bitcrusher-bits":con.bitcrusher.speed=parseInt(v*10);con.bitcrusher.step=Math.pow(1/2,con.bitcrusher.speed);break;
					 case "bitcrusher-frequency":con.bitcrusher.normfreq=v/10;break;
					 case "digitalizer-level":digitalizer.out.gain.value=v;break;
					 case "compressor-level":compressor.out.gain.value=v;break;
					 case "the-ripper-level":theripper.out.gain.value=v;break;
					 case "the-ripper-drive":theripper.drive(18-(16*v));break;
					 case "the-ripper-cutoff":theripper.in.frequency.value=100+(v*200);break;
					 case "the-bytter-level":thebytter.out.gain.value=v;break;
					 case "the-bytter-drive":thebytter.drive(18-(16*v));break;
					 case "the-bytter-cutoff":thebytter.in.frequency.value=100+(v*200);break;
					 case "flangersilver-level":flangersilver.out.gain.value=v;break;
					 case "flangersilver-cutoff":flangersilver.cut.frequency.value=v*2000;break;
					 case "flangersilver-frequency":flangersilver.osc.frequency.value=v*10;break;
					 case "flangerstereo-level":flangerstereo.out.gain.value=v;break;
					 case "flangerstereo-cutoff":flangerstereo.cut.frequency.value=v*2000;break;
					 case "flangerstereo-frequency":flangerstereo.oscR.frequency.value=flangerstereo.oscL.frequency.value=v*10;break;
					 case "sterefy-level":sterefy.out.gain.value=v;break;
					 case "sterefy-separation":sterefy.delayR.delayTime.value=v/10;break;
					}
				 }
				}
			container.onmousemove = move;
			container.addEventListener('touchmove',move ,false);
			numDial++;
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
var demoLoaded=false;
function readData(fileURL)
{
	var request = new XMLHttpRequest();
	request.open("GET", fileURL, true);
	request.responseType = 'arraybuffer';
	request.onload = function() {
        id("demo").innerHTML="Play Demo";
				id("demo").disabled=false;
				demoLoaded=true;
    };
	request.send(null);
}
function share(web)
{
	var url="";var webD="";
	if(appType=="web")webD="https://larutaproducciones.xyz/guitareffects";
	if(appType=="android")webD="play.google.com/store/apps/details?id=com.xtraid.guitareffects";
	switch(web)
	{
	 case "facebook":url="https://www.facebook.com/sharer/sharer.php?u="+webD;break;
	 case "twitter":url="https://twitter.com/home?status="+webD;break;
	 case "googleplus":url="https://plus.google.com/share?url="+webD;break;
	}
  var win=window.open(url, '_blank');
  win.focus();
}
function message(text,func)
{
	if(id("msg-outter")==null)
	{
		var m="<div id=\"msg-outter\"><div id=\"msg-inner\"></div></div>"
		document.body.insertAdjacentHTML( 'afterbegin', m );
	}
	scale(id("msg-inner"),0);
	id("msg-outter").style.display="block";
	id("msg-inner").innerHTML=text+"<button onclick=\""+func+";this.parentNode.parentNode.style.display='none'\" class=\"button-msg\">OK</button>";
	id("msg-inner").style.left=(window.innerWidth/2)-(id("msg-inner").offsetWidth/2)+"px";
	id("msg-inner").style.top=(window.innerHeight/2)-(id("msg-inner").offsetHeight/2)+"px";
	scale(id("msg-inner"),1);
}