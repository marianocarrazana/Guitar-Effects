function listCabinets(onlyshow)
{
 if(onlyshow){translate(id("cabinets-list"),0,0)}
 else
 {
	translate(id("cabinets-list"),-241,0);
	var pedals_vars=["0","vinus","vinuk","clean","bass","deep","stereo","alien","peaker","noisy","power","feedy","metal","0"];
	var pedals_names=["close","Vintage US","Vintage UK","Clean","Bass","Deep","Stereo","Alien","Peaker","Noisy","Power","Feedy","Metal","close"];
	var cont="";
	for(var i=0;i<pedals_vars.length;i++)
	{
	 var classes="";
	 if(pedals_vars[i]=="0")classes="cabinet-sel-close";
	 cont+="<div onclick='selectCabinet(\""+pedals_vars[i]+"\",\""+pedals_names[i]+"\")' class='cabinet-select "+classes+"'>"+pedals_names[i]+"</div>";
	}
	id("cabinets-list").innerHTML=cont;
 }
}
// Peaker
effects.Peaker = function() {
		this.irPath='audio/ir/speaker/peaker.ogg';
		this.cabinet=true;
		loadIR(this);
};
// Power
effects.Power = function() {
		this.irPath='audio/ir/speaker/power.ogg';
		this.cabinet=true;
		loadIR(this);
};
// Noisy
effects.Noisy = function() {
		this.irPath='audio/ir/speaker/noisy.ogg';
		this.cabinet=true;
		loadIR(this);
};
// Feedy
effects.Feedy = function() {
		this.irPath='audio/ir/speaker/feedy.ogg';
		this.cabinet=true;
		loadIR(this);
};
// Metal
effects.Metal = function() {
		this.irPath='audio/ir/speaker/metal.ogg';
		this.cabinet=true;
		loadIR(this);
};
// Vintage US
effects.VinUs = function() {
		this.irPath='audio/ir/speaker/vintageus.ogg';
		this.cabinet=true;
		loadIR(this);
};
// Vintage UK
effects.VinUk = function() {
		this.irPath='audio/ir/speaker/vintageuk.ogg';
		this.cabinet=true;
		loadIR(this);
};
// Clean
effects.Clean = function() {
		this.irPath='audio/ir/speaker/clean.wav';
		this.cabinet=true;
		loadIR(this);
};
// Bass
effects.Bass = function() {
		this.irPath='audio/ir/speaker/bass.wav';
		this.cabinet=true;
		loadIR(this);
};
// Deep
effects.Deep = function() {
		this.irPath='audio/ir/speaker/deep.wav';
		this.cabinet=true;
		loadIR(this);
};
// Stereo
effects.Stereo = function() {
		this.irPath='audio/ir/speaker/stereo.wav';
		this.cabinet=true;
		loadIR(this);
};
// Alien
effects.Alien = function() {
		this.irPath='audio/ir/speaker/alien.wav';
		this.cabinet=true;
		loadIR(this);
};