/**
 * Demo Code
 * ==========================================
 * Can be used for commerical or non-commerical purposes.
 * DO NOT RESELL.
 * Attribution is appreciated but not due.
 * ==========================================
 * @module Generator
 * @author Cymaera
 */

// import dependencies
import * as reuleaux from "./reuleaux/maths.js";
import * as renderer from "./reuleaux/renderer.js";
import * as utilities from "./deps/utility.js";


// set up canvas
const viewWidth = 500, viewHeight = 500;
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = viewWidth * 2;
canvas.height = viewHeight * 2;


// initalise renderer
//  >> bind rendering context and make (0,0) the center of the canvas
renderer.setContext(ctx);
renderer.setViewbox( -viewWidth/2, -viewHeight/2, viewWidth, viewHeight );

// data
const polygon = {
	x:0,
	y:0,
	sides:3,
	circumradius:100,
	orientation: 0,
	extension:0
};
const displayOptions = {
	polygonColor:"#000000", 
	circleColor:"#FF0000",
	arcColor:"#0000FF",
	extensionRadiiColor:"#008000",
	extensionColor:"#800080",
	lineWidth:12,
	lineJoin:/** @type {CanvasLineJoin} */("round"),
	lineCap: /** @type {CanvasLineCap} */("round"),
};
const miscOptions = {
	manualDraw:false,
	autoDrawPolygon:true,
	autoDrawCircles:true,
	autoDrawArcs:true,
	rotate:false,
}


/**
 * Clear canvas
 */
function clearAll() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
}

/** 
 * Draw stuff
 * @param {boolean} drawPolygon
 * @param {boolean} drawCircles
 * @param {boolean} drawArcs
 */
function draw(drawPolygon, drawCircles, drawArcs) {
	// set context options
	ctx.lineWidth = displayOptions.lineWidth;
	ctx.lineJoin =  displayOptions.lineJoin;
	ctx.lineCap = displayOptions.lineCap;
	ctx.miterLimit = 1;
	
	// get the arcs representing the shape
	const arcs = reuleaux.getArcs(polygon);
	const extensions = reuleaux.getExtensions(polygon);

	if (drawPolygon) {
		// Draw polygon using a list of points
		//  >> arcs can be used as points, as they have x and y
		ctx.strokeStyle = displayOptions.polygonColor;
		renderer.outlinePolygon(arcs);

		// Draw extensions radii
		//  >> get the sector as a polygon, the straight lines are the radii
		if (polygon.extension !== 0) {	
			ctx.strokeStyle = displayOptions.extensionRadiiColor;
			for (const arc of extensions) {
				const sectorPolygon = reuleaux.getSector(arc);
				// "false" here indicates not to close the path
				renderer.outlinePolygon(sectorPolygon,false);
			}
		}
	}

	if (drawCircles) {
		// Draw circles
		//  >> arcs can be used as circles, as they have x, y and radius
		ctx.strokeStyle = displayOptions.circleColor;
		for (const arc of arcs) renderer.outlineCircle(arc);
	}

	if (drawArcs) {
		if (polygon.extension === 0) {
			// Draw arcs
			// 	>> use "traceArc" to build the path without drawing immediately.
			//	>> this way, we can draw all the lines at once so that they are connect.
			ctx.strokeStyle = displayOptions.arcColor;
			ctx.beginPath();
			for (const arc of arcs) renderer.traceArc(arc);
			ctx.closePath();
			ctx.stroke();
		} else {
			// Draw arcs
			ctx.strokeStyle = displayOptions.arcColor;
			for (const arc of arcs) renderer.outlineArc(arc);
			// Draw extensions
			ctx.strokeStyle = displayOptions.extensionColor;
			for (const arc of extensions) renderer.outlineArc(arc);
		}
	}
}

// Draw polygon
draw(true,true,true);

// Rotate polygon and redraw if "manualDraw" is false and "rotate" is true
// >> "delta" is the time passed since the last invokation.
utilities.loop(function(delta) {
	// abort if conditions are not met
	if (!(!miscOptions.manualDraw && miscOptions.rotate)) return;

	// rotate polygon
	polygon.orientation += delta/1000;
	polygon.orientation %= Math.PI*2;
	
	// update input value
	const degrees = utilities.radToDeg(polygon.orientation);
	orientationInput.value = degrees.toFixed(3);
	
	// redraw
	clearAll();
	draw(
		miscOptions.autoDrawPolygon,
		miscOptions.autoDrawCircles,
		miscOptions.autoDrawArcs
	);
});







/**
 * Short hand for getting input elements.
 *	>> I'm doing this so type-check doesn't shout at me.
 * @param {string} selector
 * @returns {HTMLInputElement} 
 */
function getElement(selector) {
	return document.querySelector(selector);
}

// Buttons
getElement("#drawPolygonButton").onclick = function() {
	// draw polygon only
	draw(true,false,false);
}
getElement("#drawCirclesButton").onclick = function() {
	// draw circles only
	draw(false,true,false);
}
getElement("#drawArcsButton").onclick = function() {
	// draw arcs only
	draw(false,false,true);
}
getElement("#clearButton").onclick = function() {
	// clear canvas
	clearAll();
}
getElement("#downloadButton").onclick = function() {
	// download canvas
	utilities.downloadCanvas(canvas,"Reuleaux Polygon");
}


// Misc options
// >> bind inputs to "miscOptions"
utilities.bindInput("#manualDraw",miscOptions,"manualDraw","boolean");
utilities.bindInput("#autoDrawPolygon",miscOptions,"autoDrawPolygon","boolean");
utilities.bindInput("#autoDrawCircles",miscOptions,"autoDrawCircles","boolean");
utilities.bindInput("#autoDrawArcs",miscOptions,"autoDrawArcs","boolean");
utilities.bindInput("#rotate",miscOptions,"rotate","boolean");

// Geometry
// >> bind inputs to "polygon"
utilities.bindInput("#sides",polygon,"sides","int");
utilities.bindInput("#size",polygon,"circumradius","float");
utilities.bindInput("#extension",polygon,"extension","float");

// Display Options
// >> bind inputs to "displayOptions"
utilities.bindInput("#lineWidth",displayOptions,"lineWidth","float");
utilities.bindInput("#polygonColor",displayOptions,"polygonColor","color");
utilities.bindInput("#circleColor",displayOptions,"circleColor","color");
utilities.bindInput("#arcColor",displayOptions,"arcColor","color");
utilities.bindInput("#extensionColor",displayOptions,"extensionColor","color");
utilities.bindInput("#extensionRadiiColor",displayOptions,"extensionRadiiColor","color");
utilities.bindSelect("#lineCap",displayOptions,"lineCap",[
	{value:"butt",text:"Butt"},
	{value:"round",text:"Round"},
	{value:"square",text:"Square"},
]);
utilities.bindSelect("#lineJoin",displayOptions,"lineJoin",[
	{value:"round",text:"Round"},
	{value:"bevel",text:"Bevel"},
	{value:"miter",text:"Miter"},
]);


// Orientation
// >> this can't be binded directly, as the 
//    input uses degrees, but the code uses radians.
const orientationInput = getElement("#orientation");
orientationInput.oninput = function() {
	const degrees = parseFloat(this.value);
	polygon.orientation = utilities.degToRad(degrees);
};
orientationInput.value = utilities.radToDeg(polygon.orientation).toString();


// Resolution
// >> this can't be binded directly, as the renderer needs
//    to be informed of the change.
const resolutionInput = getElement("#resolution");
resolutionInput.oninput = function() {
	canvas.height = canvas.width = parseInt(this.value);
	renderer.resize();
};
resolutionInput.value = canvas.width.toString();


// Auto draw
// >> if ANY input event has occured and "manualDraw"
//    is false, then redraw.
document.body.addEventListener("input",function() {
	if (miscOptions.manualDraw) return;
	clearAll();
	draw(
		miscOptions.autoDrawPolygon,
		miscOptions.autoDrawCircles,
		miscOptions.autoDrawArcs
	);
})


// Set "manualDraw" in html so it can be used by CSS.
getElement("#manualDraw").addEventListener("input",function() {
	document.documentElement.dataset.manualDraw = this.checked ? "true" : "false"; 
});
document.documentElement.dataset.manualDraw = miscOptions.manualDraw  ? "true" : "false";


// Toggle info dialog when the info button is clicked
let dialogIsOpen = false;
const infoDialog = getElement("#info");
const infoButton = getElement("#infoButton");
infoButton.addEventListener("click",function() {
	dialogIsOpen = !dialogIsOpen;
	infoButton.dataset.open = infoDialog.dataset.open = dialogIsOpen ? "true" : "false"; 
});
infoButton.dataset.open = infoDialog.dataset.open = dialogIsOpen ? "true" : "false"; 