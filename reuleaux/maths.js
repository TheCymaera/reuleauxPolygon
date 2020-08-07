/**
 * Reuleaux Polygon Maths
 * ==========================================
 * Can be used for commerical or non-commerical purposes.
 * DO NOT RESELL.
 * Attribution is appreciated but not due.
 * ==========================================
 * @module ReuleauxPolygon
 * @author Cymaera
 */

// useful constants
const PI = Math.PI;
const CIRCLE_RAD = PI*2;

/**
 * Represents a point
 * @typedef {Object} Point
 * @property {number} x 
 * @property {number} y
*/
/**
 * Represents an arc (Inherits from Point)
 * @typedef {Object} Arc
 * @property {number} x 
 * @property {number} y
 * @property {number} radius
 * @property {number} orientation
 * @property {number} angle 
*/
/**
 * Represents a reuleaux polygon (Inherits from Point)
 * @typedef {Object} ReuleauxPolygon
 * @property {number} x 
 * @property {number} y
 * @property {number} sides
 * @property {number} circumradius
 * @property {number} orientation
 * @property {number} extension 
*/






/**
 * Returns the width of a polygon
 * @param {ReuleauxPolygon} polygon 
 */
export function getWidth(polygon) {
	// To find the width,
	// Consider a triangle formed from these points:
	//		A: (origin)
	//		B: (vertex)
	//		C: (opposite vertex)
	// AB and AC is the circumradius (polygon.circumradius)
	// BC (+ the extension) is the width.
	// =====================================================
	// We can find BC using the cosine rule:
	//    a^2 = b^2 + c^2 - 2bc - cos(A)
	// b = c, therefore:
	//    a = sqrt(2b^2 * (1 - cos(A)))
	const A = (CIRCLE_RAD / polygon.sides) * ((polygon.sides/2)|0);
	const b = polygon.circumradius;
	const BC = Math.sqrt(2*b*b * (1-Math.cos(A))) 
	return BC + polygon.extension;
}




/**
 * Returns the vertices of a regular polygon
 * @param {ReuleauxPolygon} polygon 
 * @returns {Point[]}
 */
export function getVertices(polygon) {
	const output = [];
	const angleDelta = CIRCLE_RAD / polygon.sides;
	let angle = polygon.orientation;
	for (let i = 0; i < polygon.sides; i++) {
		output.push({
			x: polygon.x + Math.cos(angle) * polygon.circumradius,
			y: polygon.y + Math.sin(angle) * polygon.circumradius,
		});
		angle += angleDelta;
	}
	return output;
}


/**
 * Returns the arcs that intersect to form a reuleaux polygon
 * @param {ReuleauxPolygon} polygon 
 * @returns {Arc[]}
 */
export function getArcs(polygon) {
	const output = [];
	const angleDelta = CIRCLE_RAD / polygon.sides;
	
	const triangleAngle = angleDelta * ((polygon.sides/2)|0);
	const arcAngle = (PI - triangleAngle);
	const arcOrientation = PI - arcAngle/2;

	const arcRadius = getWidth(polygon);

	let angle = polygon.orientation;
	for (let i = 0, l = polygon.sides; i < l; i++) {
		output.push({
			x: polygon.x + Math.cos(angle) * polygon.circumradius,
			y: polygon.y + Math.sin(angle) * polygon.circumradius,
			radius: arcRadius,
			orientation: angle+arcOrientation,
			angle: arcAngle
		});
		angle += angleDelta;
	}
	return output;
}

/**
 * Returns the extensions of a reuleaux polygon
 * @param {ReuleauxPolygon} polygon 
 * @returns {Arc[]}
 */
export function getExtensions(polygon) {
	const output = [];
	const angleDelta = CIRCLE_RAD / polygon.sides;

	const triangleAngle = angleDelta * ((polygon.sides/2)|0);
	const arcAngle = (PI - triangleAngle);
	const arcOrientation = PI - arcAngle/2 - PI;

	let angle = polygon.orientation;
	for (let i = 0, l = polygon.sides; i < l; i++) {
		output.push({
			x: polygon.x + Math.cos(angle) * polygon.circumradius,
			y: polygon.y + Math.sin(angle) * polygon.circumradius,
			radius: polygon.extension,
			orientation: angle+arcOrientation,
			angle: arcAngle
		});
		angle += angleDelta;
	}
	return output;
}

/**
 * Returns a polygon, representing a circular sector
 * @param {Arc} arc 
 * @returns {Point[]}
 */
export function getSector(arc) {
	const points = [];
	points.push({
		x: arc.x + Math.cos(arc.orientation) * arc.radius,
		y: arc.y + Math.sin(arc.orientation) * arc.radius,
	});
	points.push(arc);
	points.push({
		x: arc.x + Math.cos(arc.orientation + arc.angle) * arc.radius,
		y: arc.y + Math.sin(arc.orientation + arc.angle) * arc.radius,
	});
	return points
}