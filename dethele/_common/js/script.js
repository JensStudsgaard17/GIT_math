// JavaScript Document
// Developer: Mikkel Olrik, Systime A/S

window.addEventListener('load', eventWindowLoaded, false);
function eventWindowLoaded () {
	initia();
}
function initia() {

    jQuery('.jui-sliders').slider({
        orientation: "horizontal",
        range: "min",
        max: 255,
        value: 127,
    });
    jQuery('#jui-slider3').slider({
        orientation: "vertical",
        range: "min",
        max: 255,
        value: 127,
    });
	/* reset behaviour */
	jQuery('#reset').click(function(){
		document.location.reload(true);
	});
}
