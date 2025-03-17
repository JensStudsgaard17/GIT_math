//( function () {//We need a scope/selfexecuting function, so we dont pollute the global scope - i.e. the window objekt
//Når alle funktioner i ia.js er puttet ind i IA-objektet er vi kørende og kan sætte lokal-scope igen

var xlabels=0, ylabels=0,r11=false,r13=false,r14=true, a=2, b=3;

function fix(x){
	return x.toString().replace(".",",");
}

function hid(id) {return document.getElementById(id);};

function canvasTox(x){return (x-xOrigo)/xScale;}
function canvasToy(y){return (yOrigo-y)/yScale;}

function yToCanvas(y){return yOrigo-y*yScale;}
function xToCanvas(x){return xOrigo+x*xScale;}

function sletLabel(id){
	try
	{
		document.getElementById("canvas").parentNode.removeChild(document.getElementById(id));
	}
	catch(err)
	{
		//Handle errors here
	};
};

function lavLabel(tekst,l,t,fs,id){
	var Label= document.createElement("div");
	Label.setAttribute("id",id);
	Label.style.position="absolute";
	Label.style.top=t+"px";
	Label.style.left=l+"px";
	Label.style.color="black";
	Label.style.font=fs+"px 'Noto Sans', sans-serif";
	Label.style.cursor="default";
		//var text=document.createTextNode(tekst);
		//Label.appendChild(text);
		Label.innerHTML=tekst;
	document.getElementById("canvas").parentNode.appendChild(Label);
};

function setScaleOrigo(min,max,cmin,cmax){
	var Scale=(cmax-cmin)/(max-min), Origo;
	Origo=cmin-Scale*min;
	return {scale:Math.abs(Scale),origo: Origo};
};

function Axes(){
	var color="#000000";
	//Axes
	context.beginPath();
	context.strokeStyle=color; context.lineWidth="1";
	context.moveTo(0,yOrigo);context.lineTo(graph.width,yOrigo);

	context.moveTo(xOrigo,0);context.lineTo(xOrigo,graph.height);
	context.closePath();
	context.stroke();
	//Arrows
    	context.fillStyle=color;
	context.beginPath();
	context.moveTo(graph.width-8,yOrigo-4);context.lineTo(graph.width,yOrigo);context.lineTo(graph.width-8,yOrigo+4);
	context.fill();
	context.beginPath();
	context.moveTo(xOrigo-4,8);context.lineTo(xOrigo,0);context.lineTo(xOrigo+4,8);
	context.fill();
};

function Grid(){
	context.strokeStyle="#CBDCF0"; context.lineWidth="0.5";
	context.beginPath();
		for (var i=xToCanvas(gridxStart);i<=graph.width;i=i+gridxDiv*xScale){context.moveTo(i,0);context.lineTo(i,graph.height);};
		for (var i=yToCanvas(gridyStart);i>0;i=i-gridyDiv*yScale){context.moveTo(0,i);context.lineTo(graph.width,i);};
	context.closePath();
	context.stroke();
};

function Grid2(){
	context.strokeStyle="#EE8899"; context.lineWidth="0.5";
	context.beginPath();
		for (var i=xToCanvas(gridxStart);i<=graph.width;i=i+gridxDiv*xScale){context.moveTo(i,0);context.lineTo(i,graph.height);};
		//for (var i=yToCanvas(gridyStart);i>0;i=i-gridyDiv*yScale){context.moveTo(0,i);context.lineTo(graph.width,i);};
		for (var i=1;i<=10;i++) {context.moveTo(0,yToCanvas(Math.log(i)/Math.log(10)));context.lineTo(graph.width,yToCanvas(Math.log(i)/Math.log(10)));};
		for (var i=20;i<=100;i=i+10) {context.moveTo(0,yToCanvas(Math.log(i)/Math.log(10)));context.lineTo(graph.width,yToCanvas(Math.log(i)/Math.log(10)));};
	context.closePath();
	context.stroke();
};

function Units(){
	context.strokeStyle="#000000";
	context.beginPath();
		for (var i=xToCanvas(unitxStart);i<=graph.width;i=i+unitxDiv*xScale){context.moveTo(i,yOrigo+3);context.lineTo(i,yOrigo-3);};
		for (var i=yToCanvas(unityStart);i>0;i=i-unityDiv*yScale){context.moveTo(xOrigo-3,i);context.lineTo(xOrigo+3,i);};
	context.closePath();
	context.stroke();
};

function Units2(){
	context.strokeStyle="#000000";
	context.beginPath();
		for (var i=xToCanvas(unitxStart);i<=graph.width;i=i+unitxDiv*xScale){context.moveTo(i,yOrigo+3);context.lineTo(i,yOrigo-3);};
		//for (var i=yToCanvas(unityStart);i>0;i=i-unityDiv*yScale){context.moveTo(xOrigo-3,i);context.lineTo(xOrigo+3,i);};
		for (var i=1;i<=10;i++) {context.moveTo(xOrigo-3,yToCanvas(Math.log(i)/Math.log(10)));context.lineTo(xOrigo+3,yToCanvas(Math.log(i)/Math.log(10)));};
		for (var i=20;i<=100;i=i+10) {context.moveTo(xOrigo-3,yToCanvas(Math.log(i)/Math.log(10)));context.lineTo(xOrigo+3,yToCanvas(Math.log(i)/Math.log(10)));};
	context.closePath();
	context.stroke();
};

function Labels(){
	//SLET GAMLE y-LABELS - kræver at de får et id
	for (var k=0; k<xlabels; k++) sletLabel("x"+k);
	for (var k=0; k<ylabels; k++) sletLabel("y"+k);

	sletLabel("xl"); sletLabel("yl");
	//LAV NYE
	xlabels=0;
	for (var i=xToCanvas(unitxStart);i<graph.width;i=i+unitxDiv*xScale) if(i!=xOrigo) 	lavLabel(Math.round(canvasTox(i)).toString(),i-Math.round(canvasTox(i)).toString().length*6+5,yOrigo+25,12,"x"+xlabels++);
	ylabels=0;
	for (var i=yToCanvas(unityStart);i>0;i=i-unityDiv*yScale) if(i!=yOrigo) lavLabel(Math.round(canvasToy(i)).toString(),xOrigo-Math.round(canvasToy(i)).toString().length*8-5,i+8,12,"y"+ylabels++);

	lavLabel(xLabel,graph.width-10,yOrigo-5,14,"xl");
	lavLabel(yLabel,xOrigo+10,20,14,"yl");
};

function Labels2(){
	//SLET GAMLE y-LABELS - kræver at de får et id
	for (var k=0; k<xlabels; k++) sletLabel("x"+k);
	for (var k=0; k<ylabels; k++) sletLabel("y"+k);

	sletLabel("xl"); sletLabel("yl");
	//LAV NYE
	xlabels=0;
	for (var i=xToCanvas(unitxStart);i<graph.width;i=i+unitxDiv*xScale) if(i!=xOrigo) 	lavLabel(Math.round(canvasTox(i)).toString(),i-Math.round(canvasTox(i)).toString().length*6+5,yOrigo+25,12,"x"+xlabels++);
	ylabels=0;
	for (var i=1;i<=10;i++) lavLabel(Math.round(i).toString(),xOrigo-Math.round(i).toString().length*5-5,yToCanvas(Math.log(i)/Math.log(10))+8,10,"y"+ylabels++);
	for (var i=20;i<=100;i=i+10) lavLabel(Math.round(i).toString(),xOrigo-Math.round(i).toString().length*5-5,yToCanvas(Math.log(i)/Math.log(10))+8,10,"y"+ylabels++);

	lavLabel(xLabel,graph.width-10,yOrigo-5,14,"xl");
	lavLabel(yLabel,xOrigo+10,20,14,"yl");
};

function calcy(x){//a og b set by sliders
	y=b*Math.pow(a,x);
	if (r13 || r14) y=Math.log(y)/Math.log(10);
	return y;
};

function definePoints(){
	for (var i=-1; i<=8; i++) P[i]={x:xToCanvas(i),y:yToCanvas(calcy(i))};
};

function h(id) {return document.getElementById(id);};

function init(){
	h("facit").innerHTML="<i>y</i> = <i>b</i>&#183;<i>a</i><sup><i>x</i></sup> = "+b+"&#183;"+a.toString().replace(".",",")+"<sup><i>x</i></sup>";

	//COORDINATSYSTEM
	xmin=-1.2, xmax=8.8;
	ymin=-100, ymax=900;
	gridxStart=-1; gridxDiv=1;
	gridyStart=0; gridyDiv=100;
	unitxStart=-1; unitxDiv=1;
	unityStart=0; unityDiv=100;
	xLabel="<i>x</i>"; yLabel="<i>y</i>";

	start();
	var cxmin=0, cxmax=graph.width;
	var cymin=0, cymax=graph.height;

	var setX=setScaleOrigo(xmin,xmax,cxmin,cxmax); xScale=setX.scale; xOrigo=setX.origo;
	var setY=setScaleOrigo(ymin,ymax,cymax,cymin); yScale=setY.scale; yOrigo=setY.origo;

	Labels();

	var sh1=new SliderH(0,25,0.3,2.3,"a","sh1","ss1","#1CAE27",2,2);
	var sh2=new SliderH(0,75,1,101,"b","sh2","ss2","#DDB30A",1,3);

	//POINTS
	P=[]; definePoints();
	//END POINTS

	//EVENTHANDLERS
	testa=function(){if (sh1.sel()){a=parseFloat(sh1.val());tegn();};};
	testb=function(){if (sh2.sel()){b=parseFloat(sh2.val());tegn();};};

	r1f=function(){
		xmin=-1.2, xmax=8.8;
		ymin=-100, ymax=900;
		gridxStart=-1; gridxDiv=1;
		gridyStart=0; gridyDiv=100;
		unitxStart=-1; unitxDiv=1;
		unityStart=0; unityDiv=100;
		xLabel="<i>x</i>"; yLabel="<i>y</i>";

		start();
		var cxmin=0, cxmax=graph.width;
		var cymin=0, cymax=graph.height;

		var setX=setScaleOrigo(xmin,xmax,cxmin,cxmax); xScale=setX.scale; xOrigo=setX.origo;
		var setY=setScaleOrigo(ymin,ymax,cymax,cymin); yScale=setY.scale; yOrigo=setY.origo;

		Labels();

		r13=false; r14=false;

		definePoints();
		r11=true;
		tegn();
	};

	r2f=function(){
		xmin=-1.2, xmax=8.8;
		ymin=-0.2, ymax=2.1;//ymin=-0.4, ymax=3.6
		gridxStart=-1; gridxDiv=1;
		gridyStart=0; gridyDiv=0.5;
		unitxStart=-1; unitxDiv=1;
		unityStart=0; unityDiv=1;
		xLabel="<i>x</i>"; yLabel="log(<i>y</i>)";

		cxmin=0, cxmax=graph.width;
		cymin=0, cymax=graph.height;

		setX=setScaleOrigo(xmin,xmax,cxmin,cxmax); xScale=setX.scale; xOrigo=setX.origo;
		setY=setScaleOrigo(ymin,ymax,cymax,cymin); yScale=setY.scale; yOrigo=setY.origo;

		r13=true;
		Labels();

		definePoints();
		r11=false; r14=false;
		tegn();
	};

	r3f=function(){
		xmin=-1.2, xmax=8.8;
		ymin=-0.2, ymax=2.1;
		gridxStart=-1; gridxDiv=1;
		gridyStart=0; gridyDiv=0.5;//CHANGES HERE: Individual grid-lines
		unitxStart=-1; unitxDiv=1;
		unityStart=0; unityDiv=1;//CHANGES HERE: Individual units
		xLabel="<i>x</i>"; yLabel="<i>y</i> (Logaritmisk <i>y</i>-akse)";

		cxmin=0, cxmax=graph.width;
		cymin=0, cymax=graph.height;

		setX=setScaleOrigo(xmin,xmax,cxmin,cxmax); xScale=setX.scale; xOrigo=setX.origo;
		setY=setScaleOrigo(ymin,ymax,cymax,cymin); yScale=setY.scale; yOrigo=setY.origo;

		r14=true;
		Labels2();//CHANGES HERE: Individual labels on the y-aksis means calling of a new function!

		definePoints();
		r11=false; r13=false;
		tegn();
	};

	IA.addEvent(window,"unload",slut);
	IA.addEvent(document.getElementById("ss1"),"mousemove",testa);
	if (typeof document.addEventListener!="undefined"){//could be a TD
		IA.addEvent(document.getElementById("ss1"),"touchmove",testa);
	};
	IA.addEvent(document.getElementById("ss2"),"mousemove",testb);
	if (typeof document.addEventListener!="undefined"){//could be a TD
		IA.addEvent(document.getElementById("ss2"),"touchmove",testb);
	};
	//IA.addEvent(hid("r1"),"click",r1f);
	IA.addEvent(hid("r2"),"click",r2f);
	IA.addEvent(hid("r3"),"click",r3f);
	r3f();
	tegn();
};

function slut(){
	IA.removeEvent(document.getElementById("ss1"),"mousemove",testa);
	if (typeof document.addEventListener!="undefined"){//could be a TD
		IA.removeEvent(document.getElementById("ss1"),"touchmove",testa);
	};
	if (typeof document.addEventListener!="undefined"){//could be a TD
		IA.removeEvent(document.getElementById("ss2"),"touchmove",testb);
	};
	IA.removeEvent(document.getElementById("ss2"),"mousemove",testb);
	//IA.removeEvent(hid("r1"),"click",r1f);
	IA.removeEvent(hid("r2"),"click",r2f);
	IA.removeEvent(hid("r3"),"click",r3f);
	IA.removeEvent(window,"unload",slut);
};

function graf(){
	definePoints();
	for (var i=-1; i<=8; i++) dP(P[i],"#3C99D6");
};

function tegn(){
	context.clearRect(0,0,graph.width,graph.height);
	if (r14) Grid2()
	else Grid();
	if (r14) Units2()
	else Units();
	Axes();

	//DRAWINGS
	graf();

	/* COMUNICATING WITH THE CANVAS' SURROUNDING */
	if (r11 || r14) h("facit").innerHTML="<i>y</i> = <i>b</i>&#183;<i>a</i><sup><i>x</i></sup> = "+"<span style='color: #DDB30A'>"+fix(b)+"</span>"+"&#183;"+"<span style='color: #1CAE27'>"+fix(a)+"</span>"+"<sup><i>x</i></sup>";
	if (r13) h("facit").innerHTML="log(<i>y</i>) = log(<i>a</i>)&#183;<i>x</i> + log(<i>b</i>) = "+fix((Math.log(a)/Math.log(10)).toFixed(3))+"&#183;<i>x</i> + "+fix((Math.log(b)/Math.log(10)).toFixed(2));

	//END OF DRAWINGS
	drawFixPoints();//FJERNES DENNE SES KUN LABEL
	drawDragPoints();
};



	IA.addEvent(window,"load",init);
	IA.addEvent(window,"unload",IA.finito);

//})(); //end of scope

function showPos(){
	husklabel=this.innerHTML;
	this.style.backgroundColor='rgb(255,255,200)';
	this.style.zIndex="10";
	var xc=Number(parseInt(this.style.left)-8-graph.offsetLeft);
	var xHusk=xc;
	var yc=Number(graph.height-(parseInt(this.style.top)+15-graph.offsetTop));
	if (true) {
		xc=(xc-xOrigo)/xScale;
		yc=Number(parseInt(this.style.top)+15-graph.offsetTop);
		yc=(yOrigo-yc)/yScale;
	};
	if (xHusk<graph.width-IA.poswidth){this.innerHTML=husklabel+" ("+xc+","+yc+")";};
	return false;
};
