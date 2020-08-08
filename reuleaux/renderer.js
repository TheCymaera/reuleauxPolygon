/**
 * Reuleaux Polygon Renderer
 * ==========================================
 * Can be used for commerical or non-commerical purposes.
 * DO NOT RESELL.
 * Attribution is appreciated but not due.
 * ==========================================
 * @module ReuleauxPolygonRenderer
 * @author Cymaera
 */

/** @type {CanvasRenderingContext2D} */
let ctx;
let viewX = -10, viewY = -10, viewWidth = 10, viewHeight = 10;
let canvasHeight = 0, canvasWidth = 0;
let resX = 1, resY = 1;

// Import data types from maths module
/**
 * @typedef {import("./maths.js").Arc} Arc 
 * @typedef {import("./maths.js").Point} Point
*/


/**
 * Set rendering context
 * @param {CanvasRenderingContext2D} context
 */
export function setContext(context) {
	ctx = context;
	resize();
}

/**
 * Set view box
 * @param {number} x 
 * @param {number} y 
 * @param {number} width 
 * @param {number} height 
 */
export function setViewbox(x,y,width,height) {
	viewX = x;
	viewY = y;
	viewWidth = width;
	viewHeight = height;

	resX = canvasWidth / viewWidth;
	resY = canvasHeight / viewHeight;
}

/**
 * Call after the canvas has been resized
 */
export function resize() {
	if (!ctx) return;

	const canvas = ctx.canvas;
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;

	resX = canvasWidth / viewWidth;
	resY = canvasHeight / viewHeight;
}



/**
 * Outlines a polygon from a list of points
 * @param {Point[]} points
 */
export function tracePolygon(points) {
	let p1 = points[0];
	let startX = (p1.x - viewX) * resX;
	let startY = canvasHeight - ((p1.y - viewY) * resY);
	ctx.moveTo(startX,startY);
	for (let i = 1; i < points.length; i++) {
		const point = points[i];
		let x = (point.x - viewX) * resX;
		let y = canvasHeight - ((point.y - viewY) * resY);
		ctx.lineTo(x,y);
	}
}
/**
 * Draws the outline of a polygon from a list of points
 * @param {Point[]} points
 * @param {boolean} [closePath=true]
 */
export function outlinePolygon(points,closePath) {
	ctx.beginPath();
	tracePolygon(points);
	if (closePath !== false) ctx.closePath();
	ctx.stroke();
}


/**
 * Traces a circle
 * @param {Arc} arc 
 */
export function traceCircle(arc) {
	const x = (arc.x - viewX) * resX;
	const y = canvasHeight - ((arc.y - viewY) * resY);
	const rx = Math.abs(resX * arc.radius);
	const ry = Math.abs(resY * arc.radius);
	ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);
}

/**
 * Draws the outline of a circle
 * @param {Arc} arc 
 */
export function outlineCircle(arc) {
	ctx.beginPath();
	traceCircle(arc);
	ctx.stroke();
}


/**
 * Traces an arc
 * @param {Arc} arc 
 */
export function traceArc(arc) {
	const x = (arc.x - viewX) * resX;
	const y = canvasHeight - ((arc.y - viewY) * resY);
	const rx = Math.abs(resX * arc.radius);
	const ry = Math.abs(resY * arc.radius);
	const a1 = arc.orientation;
	const a2 = a1 + arc.angle;
	ctx.ellipse(x,y,rx,ry,0,-a1,-a2,true);
}


/**
 * Draws the outline of an arc
 * @param {Arc} arc 
 */
export function outlineArc(arc) {
	ctx.beginPath();
	traceArc(arc);
	ctx.stroke();
}
