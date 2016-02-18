var webkit_audio=false;
if(window.webkitAudioContext)webkit_audio=true;
var context,microphone,localAudio,lineIn;
window.addEventListener('load', loadContext, false);
function loadContext(){
 window.AudioContext = window.AudioContext||window.webkitAudioContext;
 navigator.getUserMedia = navigator.getUserMedia||navigator.mozGetUserMedia||navigator.webkitGetUserMedia;
 context = new AudioContext();
 microphone="";
 listPedals();listAmplifiers();listCabinets();loadPedals();
}
function connectIn(type){
	if(type=="mic")
	{
	 if(microphone!="")microphone.connect(lineIn);
	 else
	 {
	 navigator.getUserMedia({video: false,audio: true}, function(stream) {
    microphone = context.createMediaStreamSource(stream);
		microphone.connect(lineIn);},function(err) {alert("An error occured! " + err);});
	 }
	}
	else
	{
	 var request = new XMLHttpRequest();
	 request.open('GET', type, true);
	 request.responseType = 'arraybuffer';
	 request.onload = function() {
   context.decodeAudioData(request.response, function(buffer) {
			localAudio=context.createBufferSource();
      localAudio.buffer = buffer;
			localAudio.loop = true;
			localAudio.connect(lineIn);
			localAudio.start(0);
    } );
  }
  request.send();
	}
}
function disconnectIn(type){if(type=="mic"){if(microphone!=null)microphone.disconnect();}else localAudio.stop(0);}
function loadEffects(arr)
{
 try{var n=arr.length;}catch(err){var n=0;}
 var cloneArray=new Array();
 var nA=0;
 for(var i=0;i<n;i++)
	{
	 if(arr[i].ON==null)arr[i].ON=true;
	 if(arr[i].cabinet)arr[i].ON=cabinetON;
	 if(arr[i].ON){cloneArray[nA]=arr[i];nA++;}
	 arr[i].out.disconnect();
	}
 if(nA==0)lineIn=context.destination;
 else
 {
	lineIn=cloneArray[0].in;
	for(var i=0;i<nA-1;i++)cloneArray[i].out.connect(cloneArray[i+1].in);
	cloneArray[nA-1].out.connect(context.destination);
 }
 if(localAudio!=null)localAudio.connect(lineIn);
 if(microphone!="")microphone.connect(lineIn);
}
function loadIR(el) {
    var that = el;
		that.conv = context.createConvolver();
    that.in = context.createGain();
		that.process=context.createGain();
    that.out = context.createGain();
		if(that.cabinet)that.process.gain.value=10;
		that.in.connect(that.out);
		that.in.connect(that.process);
		that.process.connect(that.conv);
		that.conv.connect(that.out);
		
    var request = new XMLHttpRequest();
    request.open('GET', that.irPath, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        context.decodeAudioData(/** @type {ArrayBuffer} */(request.response), function(buffer) {
            that.conv.buffer = buffer;
        });
    };
    request.send();
};

function showNevadaGuitar()
{
	tag("nevada")[0].style.display="block";
}