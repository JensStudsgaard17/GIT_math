//Copyright SYSTIME AS og Jens Studsgaard
	SliderH=function(x,y,min,max,navn,kid,sid,color,antdec,startval){

	function museKoord(ev){
		ev = ev || window.event;
		if(ev.pageX || ev.pageY) return ev.pageX - document.getElementById("denne").offsetLeft-slider.offsetLeft-document.getElementById("controlsContainer").offsetLeft-7;//FireFox
		return ev.clientX + document.body.scrollLeft - document.getElementById("denne").offsetLeft - document.body.clientLeft - slider.offsetLeft-document.getElementById("controlsContainer").offsetLeft-9;//IE
	};

		this.x=x; this.y=y; this.knapId=kid; this.sliderId=sid; this.min=min; this.max=max; this.color=color;
		this.antdec=antdec; this.navn=navn; this.valId=this.sliderId+"v";
		var sel=false;

		var knapNed=function(){
			sel=true;
			knap.style.zIndex=1;
			//valc.style.background="#fff";
		};

		var knapOp=function(){
			sel=false;
			knap.style.zIndex=0;
			//valc.style.background="#ccc";
			valc.focus();//A trick to get FireFox working
		};

		var knapFlyt=function(e){
			if (sel) {//her afl ses de aktuelle musekoordinater, knappen flyttes og v rdien vises (men ikke i IE)
				var musPos=museKoord(e);
				if (musPos<5) musPos=5; if (musPos>205) musPos=205;
				knap.style.left=musPos+"px";

				if (!window.event){//shows the wrong value in valc inIE
					var midtPos=musPos-5;
					var scaledPos=(midtPos/200*(max-min)+min).toFixed(antdec);
					valc.innerHTML="<i>"+navn+"</i> = "+scaledPos;
				};
			};
		};

		var knapFlytTD=function(e){
			if (sel) {
				e.preventDefault();
				var musPos=e.changedTouches[0].pageX - document.getElementById("denne").offsetLeft-slider.offsetLeft-document.getElementById("controlsContainer").offsetLeft-7;
				if (musPos<5) musPos=5; if (musPos>205) musPos=205;
				knap.style.left=musPos+"px";

				if (!window.event){//shows the wrong value in valc inIE
					var midtPos=musPos-5;
					var scaledPos=(midtPos/200*(max-min)+min).toFixed(antdec);
					valc.innerHTML="<i>"+navn+"</i> = "+scaledPos;
				};
			};
		};

		var slider = document.createElement("div");
		slider.setAttribute("id",this.sliderId);
		slider.style.position="absolute";
		slider.style.margin=0+"px";
		slider.style.padding=0+"px";
		slider.style.top=this.y+"px";
		slider.style.left=this.x+"px";
		slider.style.width=226+"px";
		slider.style.height=48+"px";
		slider.style.background="#ffffff url(../../../../mathweb12/kia/slider_ilo/slider_bg.png) 0 0 no-repeat";//url(../slider/rail.jpg) 12px 26px no-repeat";
		//slider.style.border="1px dotted "+this.color;

		var knap=document.createElement("div");
		knap.setAttribute("id",this.knapId);
		knap.style.zIndex=0;
		knap.style.cursor="pointer";
		knap.style.margin=0+"px";
		knap.style.padding=0+"px";
		knap.style.position="absolute";
		knap.style.top=21+"px";
		var knapinit=parseInt(200*(startval-min)/(max-min));
		knap.style.left=5+knapinit+"px";
		knap.style.width=15+"px";
		knap.style.height=20+"px";
		knap.style.background="url(../../../../mathweb12/kia/slider_ilo/pil.png) 0 0 no-repeat";

		//knap.onmousedown=knapNed;
		//knap.onmouseup=knapOp;

		slider.appendChild(knap);

		var minc = document.createElement("div");
		minc.style.position="absolute";
		minc.style.top=4+"px";
		minc.style.left=6+"px";
		minc.style.font="12px 'Noto Sans',sans-serif";
		minc.style.color=this.color;
		minc.innerHTML=this.min.toString().replace(".",",");
		slider.appendChild(minc);

		var maxc = document.createElement("div");
		maxc.style.position="absolute";
		maxc.style.top=4+"px";
		maxc.style.right=6+"px";
		maxc.style.font="12px 'Noto Sans',sans-serif";
		maxc.style.color=this.color;
		maxc.innerHTML=this.max.toString().replace(".",",");
		slider.appendChild(maxc);

		var valc = document.createElement("div");
		valc.setAttribute("id",this.valId);
		valc.style.position="absolute";
		valc.style.top=4+"px";
		valc.style.left=100-this.navn.length*4+"px";
		valc.style.padding=1+"px";
		valc.style.font="12px 'Noto Sans',sans-serif";
		valc.style.color=this.color;
		//valc.style.background="#ddd";
		//valc.style.border="1px inset #ccc";
		if (this.navn=="a"){
			valc.innerHTML="<i style='font: italic 12px arial'>"+this.navn+"</i> = "+startval.toString().replace(".",",");
		} else {
			valc.innerHTML="<i>"+this.navn+"</i> = "+startval.toString().replace(".",",");
		}
		slider.appendChild(valc);

		document.getElementById("controls").appendChild(slider);

		IA.addEvent(document.getElementById(this.knapId),"mousedown",knapNed);
		IA.addEvent(document.getElementById(this.knapId),"mouseup",knapOp);
		IA.addEvent(document.getElementById(this.sliderId),"mousemove",knapFlyt);

		if (typeof document.addEventListener!="undefined"){//The device we are running in could be a touchscreen thing...
			IA.addEvent(document.getElementById(this.knapId),"touchstart",knapNed);
			IA.addEvent(document.getElementById(this.knapId),"touchend",knapOp);
			IA.addEvent(document.getElementById(this.sliderId),"touchmove",knapFlytTD);
		};

	};

	SliderH.prototype.sel=function(){//Prototyping a method that returns z-index for the 'knap'
		if (document.getElementById(this.knapId).style.zIndex==1) return true;
		return false;
	};

	SliderH.prototype.val=function(){
		var sliderPos=parseInt(document.getElementById(this.knapId).style.left);
		var midtPos=sliderPos-5;
		var scaledPos=(midtPos/200*(this.max-this.min)+this.min).toFixed(this.antdec);
		if (this.navn=="a"){
			document.getElementById(this.valId).innerHTML="<i style='font: italic 12px arial'>"+this.navn+"</i> = "+scaledPos.toString().replace(".",",");
		} else {
			document.getElementById(this.valId).innerHTML="<i>"+this.navn+"</i> = "+scaledPos.toString().replace(".",",");
		};
		return scaledPos;
	};
