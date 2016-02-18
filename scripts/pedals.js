//License: Same as pedalboard.js
var controls=new Object();
if(localStorage.bufferSize==null)localStorage.bufferSize="2048";
var BufferLength=parseInt(localStorage.bufferSize);
var effects=new Object();
var noteStrings=[ "B ", "C ", "C#", "D ", "D#", "E ", "F ", "F#", "G ", "G#", "A ", "A#", "B ", "C "];
function sign(x){if(x===0){return 1;}else{return Math.abs(x) / x;}}
function tanh(n){var a=Math.exp(n);var b=Math.exp(-n);return(a - b) / (a + b);}
/*---------------------Normal Effects---------------------*/
// Sterefy
effects.Sterefy = function() {
		this.in = context.createGain();
		this.splitter = context.createChannelSplitter(2);
		this.merger = context.createChannelMerger(2);
		this.delayR = context.createDelay();
		this.wetL = context.createGain();
		this.out = context.createGain();
		this.delayR.delayTime.value=0.05;
		this.in.connect(this.splitter);
		this.splitter.connect(this.wetL, 0);
		this.splitter.connect(this.delayR, 1);
		this.wetL.connect(this.merger, 0, 0);
		this.delayR.connect(this.merger, 0, 1);
		this.merger.connect(this.out);
};
// Flanger-Stereo
effects.FlangerStereo = function() {
		this.in = context.createGain();
		this.cut = context.createBiquadFilter();
		this.splitter = context.createChannelSplitter(2);
		this.merger = context.createChannelMerger(2);
		if(!webkit_audio) this.cut.type = "highpass";
		else this.cut.type = 1;
		this.cut.frequency.value=1000;
		this.delay = context.createDelay();
		this.wetL = context.createGain();
		this.wetR = context.createGain();
		this.out = context.createGain();
		this.oscR = context.createOscillator();
		this.oscL = context.createOscillator();
		this.oscL.connect(this.wetL.gain);
		this.oscR.connect(this.wetR.gain);
		this.oscL.frequency.value=this.oscR.frequency.value=5;
		this.oscL.start(0);this.oscR.start(0.5);
		this.delay.delayTime.value=0.06;
		this.in.gain.value=0.5;
		this.in.connect(this.delay);
		this.in.connect(this.out);
		this.delay.connect(this.cut);
		this.cut.connect(this.splitter);
		this.splitter.connect(this.wetL, 0);
		this.splitter.connect(this.wetR, 1);
		this.wetL.connect(this.merger, 0, 0);
		this.wetR.connect(this.merger, 0, 1);
		this.merger.connect(this.out);
};
// Flanger-Silver
effects.FlangerSilver = function() {
		this.in = context.createGain();
		this.cut = context.createBiquadFilter();
		if(!webkit_audio) this.cut.type = "highpass";
		else this.cut.type = 1;
		this.cut.frequency.value=1000;
		this.delay = context.createDelay();
		this.wet = context.createGain();
		this.out = context.createGain();
		this.osc = context.createOscillator();
		this.osc.connect(this.wet.gain);
		this.osc.frequency.value=5;
		this.osc.start(0);
		this.delay.delayTime.value=0.06;
		this.in.gain.value=0.5;
		this.in.connect(this.delay);
		this.in.connect(this.out);
		this.delay.connect(this.cut);
		this.cut.connect(this.wet);
		this.wet.connect(this.out);
};
//The-Bytter
effects.TheBytter = function() {
    this.in = context.createBiquadFilter();
    this.in.type = 0;
    this.in.frequency.value = 200;

    this.ws = context.createWaveShaper();
		
		this.out = context.createGain();
		
    this.drive = function(amount) {
    this.wsCurve = new Float32Array(512);
    var deg = Math.PI / 180;
    for (var i = 0; i < 512; i += 1) {
        this.wsCurve[i] = Math.sin(i/amount);
    }
		 this.ws.curve = this.wsCurve;
		};
		this.drive(10);
		this.in.gain.value=0.5;
		this.in.connect(this.ws);
		this.in.connect(this.out);
		this.ws.connect(this.out);
};
//The-Ripper
effects.TheRipper = function() {
    this.in = context.createBiquadFilter();
    this.in.type = 0;
    this.in.frequency.value = 200;

    this.ws = context.createWaveShaper();
		
		this.out = context.createGain();
		
    this.drive = function(amount) {
    this.wsCurve = new Float32Array(256);
    var deg = Math.PI / 180;
    for (var i = 0; i < 256; i += 1) {
        this.wsCurve[i] = Math.cos(i/amount);
    }
		 this.ws.curve = this.wsCurve;
		};
		this.drive(10);
		this.in.connect(this.ws);
		this.ws.connect(this.out);
};
//Compressor
effects.Compressor= function() {
		this.out = context.createGain();
		this.in = context.createDynamicsCompressor();
		this.in.connect(this.out);
};
//Limiter
effects.Limiter= function() {
		this.out = context.createGain();
		this.in = context.createGain();
		this.in.connect(this.out);
};
//Overdrive
effects.Overdrive = function() {
    this.in = context.createBiquadFilter();
    this.in.type = 0;
    this.in.frequency.value = 3000;

    this.ws = context.createWaveShaper();
		
		this.out = context.createGain();
		
    this.drive = function(amount) {
    var k = amount;
    this.wsCurve = new Float32Array(BufferLength);
    var deg = Math.PI / 180;
    for (var i = 0; i < BufferLength; i += 1) {
        var x = i * 2 / BufferLength - 1;
        this.wsCurve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
    }
		 this.ws.curve = this.wsCurve;
		};
		this.drive(500);
		this.in.connect(this.ws);
		this.ws.connect(this.out);
};
// Recorder
function writeString(view, offset, string){
  for (var i = 0; i < string.length; i++){
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
function mergeBuffers(recBuffers, recLength){
  var result = new Float32Array(recLength*BufferLength);
  var offset = 0;
  for (var i = 0; i < recBuffers.length; i++){
    result.set(recBuffers[i], offset);
    offset += recBuffers[i].length;
  }
  return result;
}
var sampleRate;
function encodeWAV(samples){
  var buffer = new ArrayBuffer(44 + samples.length * 2);
  var view = new DataView(buffer);
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 32 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 2, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 4, true);
  view.setUint16(32, 4, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);
  floatTo16BitPCM(view, 44, samples);
  return view;
}
function floatTo16BitPCM(output, offset, input){
  for (var i = 0; i < input.length; i++, offset+=2){
    var s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}
function interleave(inputL, inputR){
  var length = inputL.length + inputR.length;
  var result = new Float32Array(length);

  var index = 0,
    inputIndex = 0;

  while (index < length){
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }
  return result;
}
function exportWAV(){
	var r=controls.recorder;
  var bufferL = mergeBuffers(r.samplesL, r.samplesL.length);
  var bufferR = mergeBuffers(r.samplesR, r.samplesR.length);
  var interleaved = interleave(bufferL, bufferR);
	var dataview = encodeWAV(interleaved);
  audioBlob = new Blob([dataview], { type: 'audio/wav' });
	forceDownload();
	iniRecorder();
}
function iniRecorder(){var r=controls.recorder;r.samplesL=r.samplesR=new Array();r.s=0;}
var audioBlob;
var forceDownload = function(){
    var url = (window.URL || window.webkitURL).createObjectURL(audioBlob);
    var link = window.document.createElement('a');
		document.body.appendChild(link);
    link.style = "display: none";
    link.href = url;
		link.target= "_system";
    link.download = 'record-c'+parseInt(Math.random()*999999)+'.wav';
    link.click();
  }
controls.recorder={samplesL:new Array(),samplesR:new Array(),s:0}
effects.Recorder = function() {
		sampleRate=context.sampleRate;
		this.in=context.createGain();
		this.rec=context.createScriptProcessor(BufferLength, 2);
		this.out=context.createGain();
		this.ON=false;
		this.in.connect(this.rec);
		this.in.connect(this.out);
		this.rec.onaudioprocess=function(e){
		 var r=controls.recorder;
		 var inputL = e.inputBuffer.getChannelData(0);
		 var inputR = e.inputBuffer.getChannelData(1);
		 r.samplesL[r.s] = inputL;
		 r.samplesR[r.s] = inputR;
		 r.s++;
		};
};
// Digitalizer
effects.Digitalizer = function() {
		this.in = context.createScriptProcessor(BufferLength, 1, 1);
		this.out = context.createGain();

		this.in.connect(this.out);
		
		this.in.onaudioprocess=function(e){
		 var input = e.inputBuffer.getChannelData(0);
		 var output = e.outputBuffer.getChannelData(0);
		 for (var i = 0; i < BufferLength; i++) {output[i] = Math.round(input[i]*5)/5;}
		};
};
// Flanger-Darkmouth
controls.flangerdarkmouth={last:new Array(),cc:0,freq:6,speed:0.1};
effects.FlangerDarkmouth = function() {
		this.out=context.createGain();
		this.in = context.createScriptProcessor(BufferLength, 1, 1);
		
		for(var i=0;i<BufferLength;i++)controls.flangerdarkmouth.last[i]=0.0;
		this.in.onaudioprocess=function(e){
		 var input = e.inputBuffer.getChannelData(0);
		 var output = e.outputBuffer.getChannelData(0);
		 var xin,f=controls.flangerdarkmouth;
		 var pi=Math.PI/(256/f.freq);
		 f.cc+=f.speed;
		 for (var i = 0; i < BufferLength; i++) {
						xin=input[i]*Math.sin(f.cc);
						output[i]=xin+(f.last[i]*Math.sin(i*pi)*Math.sin(f.cc+1.5707));
						f.last[i]=input[i]*Math.sin(i*pi);
				}
		};
		this.in.connect(this.out);
};
// Flanger-Manhattan
controls.flangermanhattan={last:new Array(),cc:0,freq:6}
effects.FlangerManhattan = function() {
		this.out=context.createGain();
		this.in = context.createScriptProcessor(BufferLength, 1, 1);
		
		for(var i=0;i<BufferLength;i++)controls.flangermanhattan.last[i]=0.0;
		this.in.onaudioprocess=function(e){
		 var input = e.inputBuffer.getChannelData(0);
		 var output = e.outputBuffer.getChannelData(0);
		 var xin,f=controls.flangermanhattan;
		 var pi=Math.PI/(256/f.freq);
		 for (var i = 0; i < BufferLength; i++) {
						xin=input[i]*0.5;
						output[i]=xin+(f.last[i]*Math.sin(i*pi)*0.5);
						f.last[i]=input[i]*Math.sin(i*pi);
				}
		};
		this.in.connect(this.out);
};
// Flanger-Classic
controls.flangerclassic={last:new Array(),cc:0,speed:0.5,level:0.5}
effects.FlangerClassic = function() {
		this.out=context.createGain();
		this.in = context.createScriptProcessor(BufferLength, 1, 1);
		
		for(var i=0;i<BufferLength;i++)controls.flangerclassic.last[i]=0.0;
		this.in.onaudioprocess=function(e){
		 var input = e.inputBuffer.getChannelData(0);
		 var output = e.outputBuffer.getChannelData(0);
		 var xin,f=controls.flangerclassic;
		 var pi=Math.PI/(BufferLength/12);
		 f.cc+=f.speed;
		 for (var i = 0; i < BufferLength; i++) {
						xin=input[i];
						output[i]=xin*f.level+((1-f.level)*f.last[i]*Math.sin(i*pi)*Math.sin(f.cc+1.5707));
						f.last[i]=xin*Math.sin(i*pi);
				}
		};
		this.in.connect(this.out);
};
// Bitcrusher
controls.bitcrusher={bits:2,normfreq:0.1,step:Math.pow(1/2, 2),phaser:0,last:0}
effects.Bitcrusher = function() {
		
		this.out=context.createGain();

		this.in = context.createScriptProcessor(BufferLength, 1, 1);
		
		this.in.connect(this.out);
		
		this.in.onaudioprocess=function(e){
		 var input = e.inputBuffer.getChannelData(0);
		 var output = e.outputBuffer.getChannelData(0);
		 var b=controls.bitcrusher;
		 for (var i = 0; i < BufferLength; i++) {
						b.phaser += b.normfreq;
						if (b.phaser >= 1.0) {
								b.phaser -= 1.0;
								b.last = b.step * Math.floor(input[i] / b.step + 0.5);
						}
						output[i] = b.last;
				}
		};
		
};
// EQ-Peak
effects.EqPeak = function() {
		
		this.in = context.createBiquadFilter();
		this.out=context.createGain();
		if(!webkit_audio)//Firefox
		{
		 this.in.type = "peaking";
		}
		else//Chrome
		{
		 this.in.type = 5;
		}
		this.in.connect(this.out);
};
// EQ-Low
effects.EqLow = function() {
		
		this.in = context.createBiquadFilter();
		this.out=context.createGain();
		if(!webkit_audio)//Firefox
		{
		 this.in.type = "lowshelf";
		}
		else//Chrome
		{
		 this.in.type = 3;
		}
		this.in.connect(this.out);
};
// EQ-High
effects.EqHigh = function() {
		
		this.in = context.createBiquadFilter();
		this.out=context.createGain();
		if(!webkit_audio)//Firefox
		{
		 this.in.type = "highshelf";
		}
		else//Chrome
		{
		 this.in.type = 4;
		}
		this.in.connect(this.out);
};
// EQ-Mid
effects.EqMid = function() {
		
		this.in = context.createBiquadFilter();
		this.out=context.createGain();
		if(!webkit_audio)//Firefox
		{
		 this.in.type = "peaking";
		}
		else//Chrome
		{
		 this.in.type = 5;
		}
		this.in.connect(this.out);
};
// Fuxx-Boz
effects.FuxxBoz = function() {
		this.in=context.createGain();
		this.out=context.createGain();
		this.lowEq = context.createBiquadFilter();
		this.midEq = context.createBiquadFilter();
		this.highEq = context.createBiquadFilter();
		if(!webkit_audio)//Firefox
		{
		 this.lowEq.type = "lowshelf";
		 this.midEq.type = "peaking";
		 this.highEq.type = "highshelf";
		}
		else//Chrome
		{
		 this.lowEq.type = 3;
		 this.midEq.type = 5;
		 this.highEq.type = 4;
		}
		this.lowEq.gain.value = 5;
		this.midEq.gain.value = 1;
		this.highEq.gain.value = -5;

		this.ws = context.createWaveShaper();
		this.drive = function(amount) {
		var n_samples = 2048;
		this.wsCurve = new Float32Array(n_samples);
		var i, x, y, abx, a = 1 - amount > 0.99 ? 0.99 : 1 - amount;
								for(i = 0; i < n_samples; i++) {
										x = i * 2 / n_samples - 1;
										abx = Math.abs(x);
										if(abx < a) y = abx;
										else if(abx > a) y = a + (abx - a) / (1 + Math.pow((abx - a) / (1 - a), 2));
										else if(abx > 1) y = abx;
										this.wsCurve[i] = sign(x) * y * (1 / ((a + 1) / 2));
								}
		this.ws.curve = this.wsCurve;
		};
		this.drive(1);
		this.in.connect(this.lowEq);
		this.lowEq.connect(this.midEq);
		this.midEq.connect(this.highEq);
		this.highEq.connect(this.ws);
		this.ws.connect(this.out);
};
// Fuzz-Bit
effects.FuzzBit = function() {
		this.in=context.createGain();
		this.out=context.createGain();
		this.lowEq = context.createBiquadFilter();
		this.midEq = context.createBiquadFilter();
		this.highEq = context.createBiquadFilter();
		if(!webkit_audio)//Firefox
		{
		 this.lowEq.type = "lowshelf";
		 this.midEq.type = "peaking";
		 this.highEq.type = "highshelf";
		}
		else//Chrome
		{
		 this.lowEq.type = 3;
		 this.midEq.type = 5;
		 this.highEq.type = 4;
		}

		this.lowEq.gain.value = 5;
		this.midEq.gain.value = 1;
		this.highEq.gain.value = -5;

		this.ws = context.createWaveShaper();

		this.drive = function(amount) {
		var n_samples = 512;
		this.wsCurve = new Float32Array(n_samples);
		var a = 2 + Math.round(amount * 14),
										bits = Math.round(Math.pow(2, a - 1)),
										i, x;
								for(i = 0; i < n_samples; i++) {
										x = i * 2 / n_samples - 1;
										this.wsCurve[i] = Math.round(x * bits) / bits;
								}
		this.ws.curve = this.wsCurve;
		};
		this.drive(0.05);
		this.in.connect(this.lowEq);
		this.lowEq.connect(this.midEq);
		this.midEq.connect(this.highEq);
		this.highEq.connect(this.ws);
		this.ws.connect(this.out);
};
// Doppler
controls.doppler={panner:null,pannerPos:0,pannerM:null,pannerDistMax:2.5,pannerVel:0.9}
function setDoppler()
{
 var d=controls.doppler;
	if(d.pannerM==null||d.pannerPos>=d.pannerDistMax){d.pannerM=false;}
	else if(d.pannerPos<=-d.pannerDistMax){d.pannerM=true;}
	if(d.pannerM){d.pannerPos+=d.pannerVel}
	else{d.pannerPos-=d.pannerVel}
	d.panner.setPosition(d.pannerPos,0,0);
	d.panner.setVelocity(d.pannerPos*2,0,0);
	setTimeout(setDoppler,100);
}
effects.Doppler = function() {
		this.in = context.createGain();
		this.panner = context.createPanner();
		this.out = context.createGain();
		controls.doppler.panner=this.panner;
		this.in.connect(this.panner);
		this.panner.connect(this.out);
		setDoppler()
};
// Analyser
var freq,fLenght,currentPitch;
function getFreq()
{
		var analyserId=document.getElementById("analyser-note");
		var buf = new Uint8Array(2048);
		freq.getByteTimeDomainData(buf);
		autoCorrelate( buf, fLenght );
		var note = noteFromPitch( currentPitch );
		note=(note%12)+1;
		var detune = centsOffFromPitch( currentPitch, note );
		var imgD="<img id='detune-n' src='img/detune.png' style='transform:translateX("+(detune/400)+"px);-webkit-transform:translateX("+(detune/400)+"px)' />";
		if(note<100&&note>-100)analyserId.innerHTML="<table id='note-a' ><tr><td style='color:#c00'>"+noteStrings[note-1]+"</td><td>"+noteStrings[note]+"</td><td style='color:#c00'>"+noteStrings[note+1]+"</td></tr></table>"+imgD;
		setTimeout(getFreq,100);
}
function autoCorrelate( buf, sampleRate ) {
var MIN_SAMPLES = 4;// corresponds to an 11kHz signal
var MAX_SAMPLES = 1000;// corresponds to a 44Hz signal
var SIZE = 1000;
var best_offset = -1;
var best_correlation = 0;
var rms = 0;

confidence = 0;
currentPitch = 0;

if (buf.length < (SIZE + MAX_SAMPLES - MIN_SAMPLES))
return; // Not enough data

for (var i=0;i<SIZE;i++) {
var val = (buf[i] - 128)/128;
rms += val*val;
}
rms = Math.sqrt(rms/SIZE);

for (var offset = MIN_SAMPLES; offset <= MAX_SAMPLES; offset++) {
var correlation = 0;

for (var i=0; i<SIZE; i++) {
correlation += Math.abs(((buf[i] - 128)/128)-((buf[i+offset] - 128)/128));
}
correlation = 1 - (correlation/SIZE);
if (correlation > best_correlation) {
best_correlation = correlation;
best_offset = offset;
}
}
if ((rms>0.01)&&(best_correlation > 0.01)) {
confidence = best_correlation * rms * 10000;
currentPitch = sampleRate/best_offset;
}
}
function noteFromPitch( frequency ) {
var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
return Math.round( noteNum ) + 69;
}
function frequencyFromNoteNumber( note ) {
return 440 * Math.pow(2,(note-69)/12);
}
function centsOffFromPitch( frequency, note ) {
return ( 1200 * Math.log( frequency / frequencyFromNoteNumber( note ))/Math.log(2) );
}
effects.Analyser = function() {
		this.in = context.createGain();
		this.out = context.createGain();
		this.analyser = context.createAnalyser();
		freq=this.analyser;
		fLenght=context.sampleRate;
		this.analyser.fftSize = 2048;
		this.in.connect(this.analyser);
		this.analyser.connect(this.out);
		getFreq();
};
// Tremolo
effects.Tremolo = function() {
		this.in = context.createGain();
		this.out = context.createGain();
		this.osc = context.createOscillator();
		this.osc.connect(this.out.gain);
		this.osc.frequency.value=10;
		this.osc.start(0);
		this.in.connect(this.out);
};
// Chorus-Classic
effects.ChorusClassic = function() {
		this.in = context.createGain();
		this.delay1 = context.createDelay();
		this.delay2 = context.createDelay();
		this.delay3 = context.createDelay();
		this.delay4 = context.createDelay();
		this.delay5 = context.createDelay();
		this.delay6 = context.createDelay();
		this.delay7 = context.createDelay();
		this.out = context.createGain();
		
		this.delay1.delayTime.value=0;
		this.delay2.delayTime.value=0.01;
		this.delay3.delayTime.value=0.02;
		this.delay4.delayTime.value=0.04;
		this.delay5.delayTime.value=0.06;
		this.delay6.delayTime.value=0.08;
		this.delay7.delayTime.value=0.1;
		
		this.in.connect(this.delay1);
		this.in.connect(this.delay2);
		this.in.connect(this.delay3);
		this.in.connect(this.delay4);
		this.in.connect(this.delay5);
		this.in.connect(this.delay6);
		this.in.connect(this.delay7);
		this.delay1.connect(this.out);
		this.delay2.connect(this.out);
		this.delay3.connect(this.out);
		this.delay4.connect(this.out);
		this.delay5.connect(this.out);
		this.delay6.connect(this.out);
		this.delay7.connect(this.out);
		this.in.connect(this.out);
		this.in.gain.value=0.5;
};
// Chorus-Supercharger
effects.ChorusSupercharger = function() {
		
		this.in = context.createGain();
		this.out = context.createGain();
		this.attenuator = context.createGain();
		this.splitter = context.createChannelSplitter(2);
		this.delayL = context.createDelay();
		this.delayR = context.createDelay();
		this.feedbackR = context.createGain();
		this.feedbackL = context.createGain();
		this.merger = context.createChannelMerger(2);
		this.waveShaperL = context.createWaveShaper();
		this.waveShaperR = context.createWaveShaper();
		this.lowPass = context.createBiquadFilter();
		if(!webkit_audio)//Firefox
		{this.lowPass.type = "lowpass"}
		else//Chrome
		{this.lowPass.type = 0}
		this.lowPass.frequency.value = 700;
		
		this.feedbackL.gain.value=this.feedbackR.gain.value=0.45;
		this.delayR.delayTime.value=this.delayL.delayTime.value = 0.05;
		this.attenuator.gain.value=0.5;
		
		this.in.connect(this.attenuator);
		this.in.connect(this.out);
		this.attenuator.connect(this.out);
		this.attenuator.connect(this.splitter);
		this.splitter.connect(this.delayL, 0);
		this.splitter.connect(this.delayR, 1);
		this.delayL.connect(this.feedbackR);
		this.delayR.connect(this.feedbackL);
		this.feedbackR.connect(this.delayR);
		this.feedbackL.connect(this.delayL);
		this.delayL.connect(this.merger, 0, 0);
		this.delayR.connect(this.merger, 0, 1);
		this.merger.connect(this.out);
		
		this.drive = function() {
		var samples=2048;
		this.wsCurve = new Float32Array(samples);
				for (var i = 0; i < samples; ++i) {
						this.wsCurve[i] = Math.sin(2 * Math.PI * (i/samples));
				}
		this.waveShaperL.curve = this.wsCurve;
				for (var x, i = 0; i < samples; ++i) {
						x = (i / samples) - 0.25;
						this.wsCurve[i] = 1.0 - 4.0 * Math.abs(Math.round(x) - x);
				}
		this.waveShaperR.curve = this.wsCurve;
		};
		this.drive();
};
// 3-Band-EQ
effects.Eq3 = function() {
		
		this.in = context.createBiquadFilter();
		this.midEq = context.createBiquadFilter();
		this.highEq = context.createBiquadFilter();
		this.out=context.createGain();
		if(!webkit_audio)//Firefox
		{
		 this.in.type = "lowshelf";
		 this.midEq.type = "peaking";
		 this.highEq.type = "highshelf";
		}
		else//Chrome
		{
		 this.in.type = 3;
		 this.midEq.type = 5;
		 this.highEq.type = 4;
		}
		this.in.connect(this.midEq);
		this.midEq.connect(this.highEq);
		this.highEq.connect(this.out);
};
// Delay-Stereo
effects.DelayStereo = function() {
		this.delayL = context.createDelay();
		this.delayR = context.createDelay();
		this.splitter = context.createChannelSplitter(2);
		this.feedbackL = context.createGain();
		this.feedbackR = context.createGain();
		this.wetLevel = context.createGain();
		this.filterL = context.createBiquadFilter();
		this.filterR = context.createBiquadFilter();
		this.out = context.createGain();
		this.in = context.createGain();
		this.merger = context.createChannelMerger(2);
		this.filterR.type = 6;
		this.filterR.frequency.value=4000;
		this.filterL.type = 1;
		this.filterL.frequency.value=8000;
		if(!webkit_audio)//Firefox
		{
		 this.filterL.type = "highpass";
		 this.filterR.type = "notch";
		}
		else//Chrome
		{
		 this.filterL.type = 1;
		 this.filterR.type = 6;
		}
		
		this.in.connect(this.out);
		this.in.connect(this.splitter);
		this.splitter.connect(this.delayL, 0);
		this.splitter.connect(this.delayR, 1);
		this.delayL.connect(this.filterL);
		this.delayR.connect(this.filterR);
		this.filterL.connect(this.feedbackL);
		this.filterR.connect(this.feedbackR);
		this.feedbackL.connect(this.delayL);
		this.feedbackR.connect(this.delayR);
		this.delayL.connect(this.merger, 0, 0);
		this.delayR.connect(this.merger, 0, 1);
		this.merger.connect(this.wetLevel);
		this.wetLevel.connect(this.out);
		
		this.delayR.delayTime.value = 0.25;
		this.delayL.delayTime.value = 0.25*0.94;
		this.feedbackL.gain.value = this.feedbackR.gain.value = 0.4;
};
// Delay-Mono
effects.Delay = function() {
		this.delay = context.createDelay(),
		this.feedback = context.createGain(),
		this.wetLevel = context.createGain(),
		this.out = context.createGain();
		this.in = context.createGain();

		this.in.connect(this.delay);
		this.in.connect(this.out);
		this.delay.connect(this.feedback);
		this.delay.connect(this.wetLevel);
		this.feedback.connect(this.delay);
		this.wetLevel.connect(this.out);
		
		this.feedback.gain.value = 0.4;
		this.wetLevel.gain.value = 0.5;
		this.delay.delayTime.value = 0.25;
};
// Overscream
effects.Overscream = function() {
		this.in = context.createBiquadFilter();
		this.in.type = 0;
		this.in.frequency.value = 3000;
		this.out=context.createGain();
		this.ws = context.createWaveShaper();

		this.drive = function(amount) {
		var k = amount;
		var n_samples = 10;
		this.wsCurve = new Float32Array(n_samples);
		var deg = Math.PI / 180;
		for (var i = 0; i < n_samples; i += 1) {
				var x = i * 2 / n_samples - 1;
				this.wsCurve[i] = 500 * x * 20 * deg / (Math.PI - k * Math.abs(x));
		}
		this.ws.curve = this.wsCurve;
		};
		this.drive(200);
		this.in.connect(this.ws);
		this.ws.connect(this.out);
};
// Fuzz
effects.Fuzz = function() {
		
		this.in = context.createBiquadFilter();
		this.in.type = 0;
		this.in.frequency.value = 3000;
		this.out=context.createGain();

		this.ws = context.createWaveShaper();
		this.drive = function(amount) {
		var k = amount;
		var n_samples = 512;
		this.wsCurve = new Float32Array(n_samples);
		var deg = Math.PI / 180;
		for (var i = 0; i < n_samples; i += 1) {
				var x = i * 2 / n_samples - 1;
				this.wsCurve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
		}
		this.ws.curve = this.wsCurve;
		};
		this.drive(1000);
		this.in.connect(this.ws);
		this.ws.connect(this.out);
};
/*---------------------IR Effects---------------------*/
// AutoReverb
effects.AutoReverb = function() {
		this.in = context.createGain();
		this.convolver = context.createConvolver();
		this.out = context.createGain();
		this.decay=3;
		this.reverse=0;
		this.length = context.sampleRate;
		this.impulse = context.createBuffer(2, this.length, context.sampleRate);
		this.impulseL = this.impulse.getChannelData(0);
		this.impulseR = this.impulse.getChannelData(1);
		this.counter=0;
		this.updateimpulse=function(){
		 if(this.counter%20==0){
		 for (i = 0; i < this.length; i++) {
				n = this.reverse ? this.length - i : i;
				this.impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / this.length, this.decay);
				this.impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / this.length, this.decay);
			}
			this.convolver.buffer = this.impulse;}
			this.counter++;
		}
		this.updateimpulse();
		
		this.in.connect(this.convolver);
		this.convolver.connect(this.out);
};
// RingRing
effects.RingRing = function() {
		this.irPath='audio/ir/reverb/ringring.ogg';
		this.cabinet=false;
		loadIR(this);
};
// Convolver
effects.Convolver = function() {
		this.irPath='audio/ir/reverb/convolver.ogg';
		this.cabinet=false;
		loadIR(this);
};
// Reverb-Classic
effects.ReverbClassic = function() {
		this.irPath='audio/ir/reverb/classic.ogg';
		this.cabinet=false;
		loadIR(this);
};
// Reverb-Catedral
effects.ReverbCatedral = function() {
		this.irPath='audio/ir/reverb/catedral.ogg';
		this.cabinet=false;
		loadIR(this);
};
// Reverb-Small Room
effects.ReverbSmallRoom = function() {
		this.irPath='audio/ir/reverb/smallroom.ogg';
		this.cabinet=false;
		loadIR(this);
};