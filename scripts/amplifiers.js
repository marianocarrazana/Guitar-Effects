function listAmplifiers(onlyshow)
{
 if(onlyshow){translate(id("amplifiers-list"),0,0)}
 else
 {
	translate(id("amplifiers-list"),-241,0);
	var pedals_vars=["0","eqg","modger","bassman","rpr","crusher","0"];
	var pedals_names=["close","EQG","German","Bassman","RPR","Crusher","close"];
	var cont="";
	for(var i=0;i<pedals_vars.length;i++)
	{
	 var classes="";
	 if(pedals_vars[i]=="0")classes="cabinet-sel-close";
	 cont+="<div onclick='selectAmplifier(\""+pedals_vars[i]+"\",\""+pedals_names[i]+"\")' class='cabinet-select "+classes+"'>"+pedals_names[i]+"</div>";
	}
	id("amplifiers-list").innerHTML=cont;
 }
}
// Crusher
effects.Crusher = function() {
		this.ON=amplifierON;
		this.out=context.createGain();
		this.in = context.createWaveShaper();
		this.phaser = context.createBiquadFilter();
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
		this.phaser.frequency.value=600;
		this.drive = function(amount) {
		  amount=amount/10;
		  k=5000;
		this.wsCurve = new Float32Array(k);
		for (var i = 0; i < k; i++) {
        if(i<k/2)this.wsCurve[i] = (i/k)*amount;
		else this.wsCurve[i] = (k-i/k)*amount;
		}
		this.in.curve = this.wsCurve;
		};
		this.in.connect(this.phaser);
		this.phaser.connect(this.lowEq);
		this.lowEq.connect(this.midEq);
		this.midEq.connect(this.highEq);
		this.highEq.connect(this.out);
};
// RPR
effects.RPR = function() {
		this.ON=amplifierON;
		this.out=context.createGain();
		this.in = context.createWaveShaper();
		this.phaser = context.createBiquadFilter();
		this.lowEq = context.createBiquadFilter();
		this.midEq = context.createBiquadFilter();
		this.highEq = context.createBiquadFilter();
		if(!webkit_audio)//Firefox
		{
		 this.phaser.type = "highpass";
		 this.lowEq.type = "lowshelf";
		 this.midEq.type = "peaking";
		 this.highEq.type = "highshelf";
		}
		else//Chrome
		{
		 this.phaser.type = 1;
		 this.lowEq.type = 3;
		 this.midEq.type = 5;
		 this.highEq.type = 4;
		}
		this.phaser.frequency.value=220;
		this.drive = function(amount) {
		  amount-=17;
		this.wsCurve = new Float32Array(256);
		var deg = Math.PI / 180;
		for (var i = 0; i < 256; i += 1) {
        this.wsCurve[i] = Math.cos(i/amount);
		}
		this.in.curve = this.wsCurve;
		};
		this.in.connect(this.phaser);
		this.phaser.connect(this.lowEq);
		this.lowEq.connect(this.midEq);
		this.midEq.connect(this.highEq);
		this.highEq.connect(this.out);
};
// Bassman
effects.Bassman = function() {
		this.ON=amplifierON;
		this.out=context.createGain();
		this.in = context.createWaveShaper();
		this.low = context.createBiquadFilter();
		this.lowEq = context.createBiquadFilter();
		this.highEq = context.createBiquadFilter();
		if(!webkit_audio)//Firefox
		{
		 this.lowEq.type = "lowshelf";
		 this.highEq.type = "highshelf";
		}
		else//Chrome
		{
		 this.lowEq.type = 3;
		 this.highEq.type = 4;
		}
		this.low.frequency.value=880;
		this.drive = function(v) {
		var n_samples = 1024;
		this.wsCurve = new Float32Array(n_samples);
		var deg = Math.PI / 180;
		for (var i = 0; i < n_samples; i += 1) {
				var x = i * 2 / n_samples - 1;
				this.wsCurve[i] = (1 + v) * x / (1 + v * Math.abs(x));
		}
		this.in.curve = this.wsCurve;
		};
		this.in.connect(this.low);
		this.low.connect(this.lowEq);
		this.lowEq.connect(this.highEq);
		this.highEq.connect(this.out);
};
// EQG
effects.EQG = function() {
		this.ON=amplifierON;
		this.in = context.createGain();
		this.lowEq = context.createBiquadFilter();
		this.midEq = context.createBiquadFilter();
		this.highEq = context.createBiquadFilter();
		this.out = context.createGain();
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

		this.in.connect(this.lowEq);
		this.lowEq.connect(this.midEq);
		this.midEq.connect(this.highEq);
		this.highEq.connect(this.out);
};
// German
effects.ModernGer = function() {
		this.ON=amplifierON;
		this.out=context.createGain();
		this.in = context.createWaveShaper();
		this.drive = function(v) {
		var n_samples = 512;
		this.wsCurve = new Float32Array(n_samples);
		var deg = Math.PI / 180;
		for (var i = 0; i < n_samples; i += 1) {
				var x = i * 2 / n_samples - 1;
				this.wsCurve[i] = (1 + v) * x / (1 + v * Math.abs(x));
		}
		this.in.curve = this.wsCurve;
		};
		this.in.connect(this.out);
};