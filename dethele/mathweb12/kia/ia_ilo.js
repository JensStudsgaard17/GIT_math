//Copyright SYSTIME AS og Jens Studsgaard
var IA={
	poswidth:80, //max. length of position: Prevents scrolling when point is close to right border of the canvas

	GRID: function (start,step){//Draws a grid on the canvas
		context.strokeStyle="#aaa";
		context.beginPath();
		if (step==undefined) step=start;
		for (var i= start; i<graph.width; i+=step){
			context.moveTo(0,i);
			context.lineTo(graph.width,i);
			context.moveTo(i,0);
			context.lineTo(i,graph.height);
		};
		context.stroke();
		context.closePath();
		context.strokeStyle="#000";
	},

	/* CrossBrowser-registrering af eventlisteners - addEvent, removeEvevnt uses MetaProgramming */

	addEvent: function(element,type,func){
		if (document.addEventListener) {
			addEvent=function(element,type,func){
				element.addEventListener(type,func,false);
			};
		} else {
			addEvent=function(element,type,func){
				element.attachEvent("on"+type,func)
			};
		};
		addEvent(element,type,func);
	},

	removeEvent: function(element,type,func){
		if (document.removeEventListener) {
			removeEvent=function(element,type,func){
				element.removeEventListener(type,func,false);
			};
		} else {
			removeEvent=function(element,type,func){
			element.detachEvent("on"+type,func)
			};
		};
		removeEvent(element,type,func);
	},

	finito: function(){
		IA.removeEvent(graph,"mousemove",mouseMove);
		IA.removeEvent(graph,"mousedown",mouseDown);
		IA.removeEvent(graph,"mouseup",mouseUp);
		IA.removeEvent(window,"load",init);
		IA.removeEvent(window,"unload",IA.finito);
	},

	hentVaerdi: function(id,fejlVaerdi,min,max) {
		var a=document.getElementById(id).value || document.getElementById(id).innerHTML;
		var re=/\,/g; a=a.replace(re,".");//Decimalkomma til decimalpunktum
		a=parseFloat(a);

		if (isFinite(a)) {

			if (min!=undefined) {
				if (a<min) a=min;
			};
			if (max!=undefined) {
				if (a>max) a=max;
			};

			if (document.getElementById(id).value) {
				document.getElementById(id).value=a;
			} else {
				document.getElementById(id).innerHTML=a
			};

			return a;

		} else {

			if (fejlVaerdi!=undefined){
				alert("Fejl i tal, "+fejlVaerdi+" anvendes");

				if (document.getElementById(id).value) {
					document.getElementById(id).value=fejlVaerdi;
				} else {
					document.getElementById(id).innerHTML=fejlVaerdi;
				};

				document.getElementById(id).focus();
			} else {
				alert("Fejl i tal - om igen!");
				document.getElementById(id).focus();
			};
			return "fejl";

		}
	}
};//END IA-object

//THE JAVASCRIPT SKETCH PAD functions

/*
INITIAL STUFF
*/

function getCanvas()//returns the canvas-element (the first (and only!))
{
	return document.getElementsByTagName('canvas')[0]
};


function pointOnCanvas(x,y)//returns true if pOC and false otherwise
{
	var myCanvas=getCanvas();
	return (0<=x && x<=myCanvas.width && 0<=y && y<=myCanvas.height);
};

/*
GEOMTERI I PLANEN
*/

function pOK(A,B)//returns true if points are different else false
{
	return (A.x!=B.x || A.y!=B.y)
};

function midtPunkt(A,B)//returns the midtpoint of the segment AB
{
	return {x:(A.x+B.x)/2,y:(A.y+B.y)/2};
};


function beregnLinje(A,B){//returns coefficients a,b and c in the equation: ax + by = c (a lineEquation Object)

		var a1=A.y-B.y;
		var b1=B.x-A.x;
		return {a:a1,b:b1,c:a1*A.x+b1*A.y};

};

function midtNormal(A,B){//returns an array with to points(objects) on the Normal to the linesegment AB

		var P=midtPunkt(A,B);
		var L=beregnLinje(A,B);
		var Q= {x:P.x+L.a,y:P.y+L.b};
		return  [P,Q];

};

function skaering(L1,L2){//returns a point and true if point exists and false and (0,0) if point doesnt exist. L1 and L2 are lineEquation Objects
	var d=L1.a*L2.b-L2.a*L1.b;
	var dx=L2.b*L1.c-L1.b*L2.c;
	var dy=L1.a*L2.c-L2.a*L1.c;
	if (d==0) {
		return {ok:false,x:-5,y:-5};
	}
	else {
		return {ok:true,x:dx/d,y:dy/d};
	};
};

function vhl(A,B,C){//returns an array with to points on the 'vinkelhalveringslinje'
	var lbc=100/laengde(B,C);
	var lba=100/laengde(B,A);
	var P={x:B.x+(C.x-B.x)*lbc,y:B.y+(C.y-B.y)*lbc};
	var Q={x:B.x+(A.x-B.x)*lba,y:B.y+(A.y-B.y)*lba};
	return [B,midtPunkt(P,Q)];
};

function normal(A,B,C){//returns an array of to points defining the normal to the line from A to B going through C
	var a1=B.x-A.x;
	var b1=B.y-A.y;
	var n={a:a1,b:b1,c:a1*C.x+b1*C.y};
	return [C,skaering(n,beregnLinje(A,B)),true];
};

/*
METRIK I PLANEN
*/

function laengde(A,B){
	return Math.sqrt((B.x-A.x)*(B.x-A.x)+(B.y-A.y)*(B.y-A.y));
};

function vinkel(A,B,C){//Returns the angle at B (between vector BA and vector BC). An optional fourth parameter means degrees. Default is radians
	var t=(A.x-B.x)*(C.x-B.x)+(A.y-B.y)*(C.y-B.y);
	var n=laengde(B,A)*laengde(B,C);
	if (n==0) return false;
	if (arguments.length>3) {//Degrees
		return Math.round(180/Math.PI*Math.acos(t/n)*100)/100+"<sup>o</sup>";
	}
	else {//Radians
		return Math.round(Math.acos(t/n)*10000)/10000;
	};
};

/*
ACTUAL DRAWING FUNCTIONS
*/

function koSys(x0,y0,x1,y1,color,grid,gridColor){//definerer et koordinatsystem med Origo i (x0,y0) og med skalaer x1 og y1

	var yTal="1";
	if (y1<=2) {y1=10*y1;yTal="10"};

	var myCanvas=getCanvas();
	with (myCanvas.getContext("2d")) {
		//GRID
		if (grid==1 && gridON){
			strokeStyle="#cbdcf0"/*gridColor*/; lineWidth="0.5";
			beginPath();
			for (var i=0;i<=graph.width;i=i+x1){moveTo(i,0);lineTo(i,graph.height);};
			for (var i=0;i<=graph.height;i=i+y1){moveTo(0,i);lineTo(graph.width,i);};
			closePath();
			stroke();
		};
		//Axes
		beginPath();
		strokeStyle=color; lineWidth="1";
		moveTo(0,y0);lineTo(myCanvas.width,y0);
		moveTo(x0,0);lineTo(x0,myCanvas.height);
		closePath();
		stroke();
		//Arrows
	    	fillStyle=color;
		beginPath();
		moveTo(myCanvas.width-8,y0-4);lineTo(myCanvas.width,y0);lineTo(myCanvas.width-8,y0+4);
		fill();
		beginPath();
		moveTo(x0-4,8);lineTo(x0,0);lineTo(x0+4,8);
		fill();
		//Units
		beginPath();
		moveTo(x0+x1,y0+3);lineTo(x0+x1,y0-3);
		moveTo(x0-3,y0-y1);lineTo(x0+3,y0-y1);
		closePath();
		stroke();
		//Labels
		var thisFunction = arguments.callee;

		if (!thisFunction.labelX) {
			thisFunction.labelX=1;
			var Label= document.createElement("div");
			Label.setAttribute("id","labelXscale");
			Label.onmousemove=mouseMove;//points can be dragged across other points
			Label.style.position="absolute";
			Label.style.color=color;
			Label.style.font="1.20em 'Noto Sans',sans-serif";
			Label.style.cursor="arrow";
				var text=document.createTextNode("1");
				Label.appendChild(text);
			graph.parentNode.appendChild(Label);
		}
		else {
			var Label= document.getElementById("labelXscale");
		};
		Label.style.top=y0-17+graph.offsetTop+"px";
		Label.style.left=x0+x1+2+graph.offsetLeft+"px";

		if (!thisFunction.labelY) {
			thisFunction.labelY=1;
			var Label= document.createElement("div");
			Label.setAttribute("id","labelYscale");
			Label.onmousemove=mouseMove;//points can be dragged across other points
			Label.style.position="absolute";
			Label.style.color=color;
			Label.style.font="1.20em 'Noto Sans',sans-serif";
			Label.style.cursor="default";
				var text=document.createTextNode(yTal);
				Label.appendChild(text);
			graph.parentNode.appendChild(Label);
		}
		else {
			var Label= document.getElementById("labelYscale");
		};
		Label.style.top=y0-y1-17+graph.offsetTop+"px";
		Label.style.left=x0+3+graph.offsetLeft+"px";

		strokeStyle="#000"; lineWidth="1"; fillStyle="#000";
	};
};

function cirkel(A,r,color) {	//Draws a cirkel centered at point A with radius r in a given color - if present!
  with (getCanvas().getContext("2d")) {
    if (color != undefined){save();strokeStyle=color;};
    beginPath();
    arc(A.x,A.y,r,0,2*Math.PI,true);
    closePath();
    stroke();
    if (color != undefined){restore();};
  };
};

function dP(A,color) {	//Draws a colored point at A
  with (getCanvas().getContext("2d")) {
    beginPath();
    arc(A.x,A.y,3,0,2*Math.PI,true)
    fillStyle=color;
    fill();
    fillStyle="#000";
  }
};

function linjeStykke(A,B)//draws a segment if A and B are distinct points
{
	if (pOK(A,B))
	{
		var ctx=getCanvas().getContext("2d");
		ctx.beginPath();
		ctx.moveTo(A.x,A.y);
		ctx.lineTo(B.x,B.y);
		ctx.stroke();
		ctx.closePath();
	}
};

function linje(A,B,h)//draws a line if A and B are distinct points - if h=2 a halfline from A through B is drawn
{
	if (pOK(A,B))
	{
		var myCanvas=getCanvas();
		var ctx=myCanvas.getContext("2d");
		ctx.beginPath();

		if (A.x==B.x)//lodret linje
		{
			if (h==2){
				ctx.moveTo(A.x,A.y);
				if (A.y>B.y) {ctx.lineTo(A.x,0);} else {ctx.lineTo(A.x,myCanvas.height);};
			}
			else {
				ctx.moveTo(A.x,0);
				ctx.lineTo(A.x,myCanvas.height);
			};
		}

		else if (A.y==B.y)//vandret linje
		{
			if (h==2){
				ctx.moveTo(A.x,A.y);
				if (A.x<B.x) {ctx.lineTo(myCanvas.width,A.y);} else {ctx.lineTo(0,A.y);};
			}
			else {
				ctx.moveTo(0,A.y);
				ctx.lineTo(myCanvas.width,A.y);
			};
		}
		else//skr� linje
		{
			var a = (B.y-A.y)/(B.x-A.x);
			var b = A.y - a*A.x;
			var C=[]; C[0]={}; C[1]={}; C[2]={}; C[3]={};
                                      C[0].x=C[0].y=C[1].x=C[1].y=0;//draws nothing=a point, if line is outside the canvas
			var i=0;

			if (0<=b && b<= myCanvas.height)//sk�ring ved venstre kant
			{
				C[i].x=0;
				C[i].y=b;
				i++;
			}
			if (0<=a*myCanvas.width+b && a*myCanvas.width+b<= myCanvas.height)//sk�ring ved h�jre kant
			{
				C[i].x=myCanvas.width;
				C[i].y=a*myCanvas.width+b;
				i++;
			}
			if (0<=-b/a && -b/a<=myCanvas.width)//sk�ring ved �verste kant
			{
				C[i].x=-b/a;
				C[i].y=0;
				i++;
			}
			if (0<=(myCanvas.height-b)/a && (myCanvas.height-b)/a<=myCanvas.width)//sk�ring ved nederste kant
			{
				C[i].x=(myCanvas.height-b)/a;
				C[i].y=myCanvas.height;
			}

			if (h==2) {
				if (B.y>A.y) {//skr�t nedad - �verste punkt er A
					if (C[1].y>C[0].y) {C[0]=A;} else {C[1]=A;};
				}
				else {//skr�t opad - �verste punkt er B
					if (C[1].y>C[0].y) {C[1]=A;} else {C[0]=A;};
				};
			};
				ctx.moveTo(C[0].x,C[0].y);
				ctx.lineTo(C[1].x,C[1].y);

		};

		ctx.stroke();
		ctx.closePath();
	}
};


function tegnLinjer(){//Tegner linjestykker fra startpunkt til slutpunkt
	with (getCanvas().getContext("2d")) {
		beginPath();
		moveTo(arguments[0].x,arguments[0].y);
		for (var i=1;i<arguments.length;i++){
			lineTo(arguments[i].x,arguments[i].y);
		};
		fillStyle="#a5bcd3";
		fill();

		beginPath();
		moveTo(arguments[0].x,arguments[0].y);
		for (var i=1;i<arguments.length;i++){
			lineTo(arguments[i].x,arguments[i].y);
		};
		lineTo(arguments[0].x,arguments[0].y);
		stroke();
	};
};

function tegnLinjerMFarve(){//Tegner linjestykker fra startpunkt til slutpunkt med en angiven farve
	with (getCanvas().getContext("2d")) {
		beginPath();
		moveTo(arguments[0].x,arguments[0].y);
		for (var i=1;i<arguments.length-1;i++){
			lineTo(arguments[i].x,arguments[i].y);
		};
		fillStyle=arguments[i];
		fill();

		beginPath();
		moveTo(arguments[0].x,arguments[0].y);
		for (var i=1;i<arguments.length-1;i++){
			lineTo(arguments[i].x,arguments[i].y);
		};
		lineTo(arguments[0].x,arguments[0].y);
		stroke();
	};
};


/*
DRAGABLE POINTS ON THE CANVAS - CROSSBROWSER (IE/FIREFOX)
*/

function mouseCoords(ev){
	var myCanvas=getCanvas();
	ev = ev || window.event;
	if(ev.pageX || ev.pageY){//FireFox
		return {
			x:ev.pageX-tc,
			y:ev.pageY-myCanvas.offsetTop-2
		};
	}
	return {//IE
		x:ev.clientX + document.body.scrollLeft - document.body.clientLeft-tc-2,//+8
		y:ev.clientY + document.body.scrollTop - myCanvas.offsetTop - document.body.clientTop-3
	};
};

window.onresize=function(){
	tc=document.getElementById("denne").offsetLeft;
}

//NEW STUFF:

function drawDragPoints(){
	for (var i=0; i<moveP.length;i++){moveP[i].drawIt()}
};

function drawFixPoints(){
	for (var i=0; i<fixP.length;i++){dP(fixP[i],fixP[i].color)}
};

function getCoordinatesFrom(id){
	//test for valid input: hvis der er et komma s� test for valide tal
	var t=document.getElementById(id).value.split(",");
	if (koSysON){var NYx=parseFloat(t[0])*xScale+xOrigo;var NYy=yOrigo-parseFloat(t[1])*yScale;}
	else {var NYx=parseInt(t[0]); var NYy=graph.height-parseInt(t[1]);};
	return {x:NYx,y:NYy,ok:true};
};

function start(){
	draw=false;
       	graph=getCanvas();
	graph.style.cursor="arrow"
	context = graph.getContext("2d");

	IA.addEvent(graph,"mousemove",mouseMove);
	IA.addEvent(graph,"mousedown",mouseDown);
	IA.addEvent(graph,"mouseup",mouseUp);

	moveP = [];	//All dragable points are listed in this array - dragable points added by constructor!!!
	fixP = [];		//All fixed points are listed in this array - fixed points added by constructor!!!

	tc=document.getElementById("denne").offsetLeft;

	//IMPLEMENTATION FOR TOUCHSCREEN-DEVICE (IPAD, SMARTPHONES...)

	if (typeof document.addEventListener!="undefined"){//The device we are running on could be a touchscreen-thing...
		var myCanvas=getCanvas();

		document.getElementById("canvas").addEventListener("touchstart", function(e) {//Mimics mouseDown
		  if (e.changedTouches.length==1){
			e.preventDefault();
			var mPx=e.changedTouches[0].pageX-tc;
			var mPy=e.changedTouches[0].pageY-myCanvas.offsetTop-2;
			for (var i=0;i<moveP.length;i++){
				if (mPx >= moveP[i].x-15 && mPx <= moveP[i].x+15 && mPy >= moveP[i].y-15 && mPy <= moveP[i].y+15) {
					draw=true;
					pointTaken=moveP[i];
				}
			};
		  };
		},false);

		document.getElementById("canvas").addEventListener("touchend", function(e) {//Mimics mouseUp
		  if (e.changedTouches.length==1){
			e.preventDefault();
			draw=false;
		  };
		},false);


		document.getElementById("canvas").addEventListener("touchmove", function(e) {//Mimics mouseMove
		  if (e.changedTouches.length==1){
			e.preventDefault();
			if (draw) {
				var mPx=e.changedTouches[0].pageX-tc;
				var mPy=e.changedTouches[0].pageY-myCanvas.offsetTop-2;
				pointTaken.x=mPx;
				pointTaken.y=mPy;
				tegn();
				return false;
			};
		  };
		},false);
	};

	//IE10 pointer events -not W3C...for heavens sake...!
	document.getElementById("canvas").style.msTouchAction="none";

	//END IMPLEMENTATION FOR TOUCHSCREEN-DEVICE (IPAD, SMARTPHONES...)


};

function mouseDown(ev){
	var mP = mouseCoords(ev);
	for (var i=0;i<moveP.length;i++){
		if (mP.x >= moveP[i].x-5 && mP.x <= moveP[i].x+5 && mP.y >= moveP[i].y-5 && mP.y <= moveP[i].y+5) {
			draw=true;
			pointTaken=moveP[i];
			graph.style.cursor="pointer";
			return false;
		}
	}
}

function mouseUp(){draw=false;graph.style.cursor="default";};

function mouseMove(ev){
	if (draw) {
		pointTaken.updateIt(ev);
		tegn();
		return false;
	};
	var mP = mouseCoords(ev); tc=document.getElementById("denne").offsetLeft;
	for (var i=0;i<moveP.length;i++){
		if (mP.x >= moveP[i].x-5 && mP.x <= moveP[i].x+5 && mP.y >= moveP[i].y-5 && mP.y <= moveP[i].y+5) {
			graph.style.cursor="pointer";
			return false;
		}
	};
	graph.style.cursor="default";
};

function mouseOver(){
	draw=false;
	graph.style.cursor="default";
};

/*
Here we define a class dragPoint with some properties and 2 methods: drawIt and updateIt
*/

function Point(x,y,label,t){//Constructor for dragable red point
	moveP[moveP.length]=this;
	this.x=x;
	this.y=y;
	//Tracked point
	if (t==1){
		this.tracked=true;
		this.tID="txt"+label;
		showCoordinates(this.x,this.y,this.tID)
	}
	else {
		this.tracked=false;
	};
	//Label
	var thisFunction = arguments.callee;
	if (!thisFunction.uid) thisFunction.uid=0;
	this.labelID=++thisFunction.uid;
	var Label= document.createElement("div");
	Label.setAttribute("id",this.labelID);
	Label.style.position="absolute";
	Label.style.color="red";
	Label.style.font="italic 1.25em 'Noto Sans',sans-serif";
	Label.style.cursor="default";
	Label.style.top=this.y-15+graph.offsetTop+"px";
	Label.style.left=this.x+8+graph.offsetLeft+"px";
	Label.onmousemove=mouseMove;//points can be dragged across other points
	Label.onmouseover=showPos;
	Label.onmouseout=hidePos;
		var text=document.createTextNode(label);
		Label.appendChild(text);
	graph.parentNode.appendChild(Label);
}

function hidePos(){
	this.innerHTML=husklabel;
	this.style.backgroundColor='';
	this.style.zIndex="1";
	return false;
};

function showCoordinates(x,y,id){
	if (koSysON){
		xc=(x-xOrigo)/xScale;
		yc=(yOrigo-y)/yScale;
	} else{
		xc=x;
		yc=Number(graph.height-y);
	};
	document.getElementById(id).value=xc+" , "+yc;
};

Point.prototype.drawIt = function(){//Method of dragpoint
	//the point is redrawn (clearRect)
	context.beginPath();
	context.arc(this.x,this.y,3,0,2*Math.PI,true)
	context.fillStyle="#FF0000";
	context.fill();
	//the label (which is just a div-element residing on top of the canvas) is moved
	var Label=document.getElementById(this.labelID);
             //ADD ON: not showing label if point out of canvas
             if (this.y>=0 && this.y<=graph.height && this.x>=0 && this.x<=graph.width) Label.style.visibility="visible"
             else Label.style.visibility="hidden";
	Label.style.top=this.y-15+graph.offsetTop+"px";
	Label.style.left=this.x+8+graph.offsetLeft+"px";
};

Point.prototype.updateIt = function(ev){//Method of dragPoint
	var mousePos = mouseCoords(ev);
	this.x=mousePos.x;
	this.y=mousePos.y;
	if (this.tracked) {
		showCoordinates(this.x,this.y,this.tID);
	};
};

/*
Here we define a class fixedPoint with 4 properties
*/

function FixedPoint(x,y,label,color){//Constructor for fixed invisible point
	this.x=x;
	this.y=y;
	this.color=color;
	//Label
	this.label=label;
	var Label= document.createElement("div");
	Label.setAttribute("id",this.label);
	Label.onmousemove=mouseMove;//points can be dragged across other points
	Label.onmouseover=showPos;
	Label.onmouseout=hidePos;
	Label.style.position="absolute";
	Label.style.color=this.color;
	Label.style.font="bold 0.8em verdana";
	Label.style.cursor="default";
	Label.style.top=this.y-15+graph.offsetTop;
	Label.style.left=this.x+8+graph.offsetLeft;
		var text=document.createTextNode(this.label);
		Label.appendChild(text);
	graph.parentNode.appendChild(Label);
};

function FixPoint(x,y,label,color){//Constructor for fixed colored point
	fixP[fixP.length]=this;
	this.x=x;
	this.y=y;
	this.color=color;
	//Label
	var Label= document.createElement("div");
	Label.setAttribute("id",label);
	Label.style.position="absolute";
	Label.style.color=color;
	Label.style.font="bold 0.8em verdana";
	Label.style.cursor="default";
	Label.style.top=this.y-15+graph.offsetTop+"px";
	Label.style.left=this.x+8+graph.offsetLeft+"px";
	Label.onmousemove=mouseMove;//points can be dragged across other points
	Label.onmouseover=showPos;
	Label.onmouseout=hidePos;
		var text=document.createTextNode(label);
		Label.appendChild(text);
	graph.parentNode.appendChild(Label);
}
