	SliderH=function(x,y,min,max,navn,kid,sid,color,antdec,startval){

	function museKoord(ev){
		ev = ev || window.event;
		if(ev.pageX || ev.pageY) return ev.pageX - document.getElementById("denne").offsetLeft-slider.offsetLeft-7;//FireFox
		return ev.clientX + document.body.scrollLeft - document.getElementById("denne").offsetLeft - document.body.clientLeft - slider.offsetLeft-7;//IE
	};

		this.x=x; this.y=y; this.knapId=kid; this.sliderId=sid; this.min=min; this.max=max; this.color=color;
		this.antdec=antdec; this.navn=navn; this.valId=this.sliderId+"v";
		var sel=false;

		var knapNed=function(){
			sel=true;
			knap.style.zIndex=1;
			valc.style.background="#fff";
		};

		var knapOp=function(){
			sel=false;
			knap.style.zIndex=0;
			valc.style.background="#ccc";
			valc.focus();//A trick to get FireFox working
		};

		var knapFlyt=function(e){
			if (sel) {//her afl�ses de aktuelle musekoordinater, knappen flyttes og v�rdien vises
				var musPos=museKoord(e);
				if (musPos<5) musPos=5; if (musPos>205) musPos=205;
				knap.style.left=musPos+"px";

				var midtPos=musPos-5;
				var scaledPos=(midtPos/200*(max-min)+min).toFixed(antdec);
				if (!window.event) valc.innerHTML=navn+"="+scaledPos;
			};
		};

		var slider = document.createElement("div");
		slider.setAttribute("id",this.sliderId);
		slider.style.position="absolute";
		slider.style.margin=0+"px";
		slider.style.padding=0+"px";
		slider.style.top=this.y+"px";
		slider.style.left=this.x+"px";
		slider.style.width=224+"px";
		slider.style.height=45+"px";
		slider.style.background="#ffffff url(../slider/rail.jpg) 12px 0 no-repeat";
		slider.style.border="1px dotted "+this.color;

		var knap=document.createElement("div");
		knap.setAttribute("id",this.knapId);
		knap.style.zIndex=0;
		knap.style.cursor="pointer";
		knap.style.margin=0+"px";
		knap.style.padding=0+"px";
		knap.style.position="absolute";
		knap.style.top=5+"px";
		var knapinit=parseInt(200*(startval-min)/(max-min));
		knap.style.left=5+knapinit+"px";
		knap.style.width=15+"px";
		knap.style.height=20+"px";
		knap.style.background="url(../slider/pilDOWN.jpg) 0 0 no-repeat";

		//knap.onmousedown=knapNed;
		//knap.onmouseup=knapOp;

		slider.appendChild(knap);

		var minc = document.createElement("div");
		minc.style.position="absolute";
		minc.style.top=24+"px";
		minc.style.left=6+"px";
		minc.style.font="11px verdana";
		minc.style.color=this.color;
		minc.innerHTML=this.min;
		slider.appendChild(minc);

		var maxc = document.createElement("div");
		maxc.style.position="absolute";
		maxc.style.top=24+"px";
		maxc.style.right=6+"px";
		maxc.style.font="11px verdana";
		maxc.style.color=this.color;
		maxc.innerHTML=this.max;
		slider.appendChild(maxc);

		var valc = document.createElement("div");
		valc.setAttribute("id",this.valId);
		valc.style.position="absolute";
		valc.style.top=24+"px";
		valc.style.left=100-this.navn.length*4+"px";
		valc.style.padding=1+"px";
		valc.style.font="bold 11px verdana";
		valc.style.color=this.color;
		valc.style.background="#ddd";
		valc.style.border="1px inset #ccc";
		valc.innerHTML=this.navn+"="+startval;//this.val();
		slider.appendChild(valc);

		document.getElementById("controls").appendChild(slider);

		IA.addEvent(document.getElementById(this.knapId),"mousedown",knapNed);
		IA.addEvent(document.getElementById(this.knapId),"mouseup",knapOp);

		IA.addEvent(document.getElementById(this.sliderId),"mousemove",knapFlyt);
	};

	SliderH.prototype.sel=function(){//Prototyping a method that returns z-index for the 'knap'
		if (document.getElementById(this.knapId).style.zIndex==1) return true;
		return false;
	};

	SliderH.prototype.val=function(){
		var sliderPos=parseInt(document.getElementById(this.knapId).style.left);
		var midtPos=sliderPos-5;
		var scaledPos=(midtPos/200*(this.max-this.min)+this.min).toFixed(this.antdec)
		document.getElementById(this.valId).innerHTML=this.navn+"="+scaledPos;
		return scaledPos;
	};

