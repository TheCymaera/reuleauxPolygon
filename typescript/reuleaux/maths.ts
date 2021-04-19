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

export interface Point {
	x: number;
	y: number;
}

export interface Circle extends Point {
	radius: number;
}

export interface Arc extends Circle {
	orientation: number;
	angle: number;
}

export interface ReuleauxPolygon extends Point {
	sides: number;
	circumradius: number;
	orientation: number;
	extension : number;
}

export function getWidth(polygon: ReuleauxPolygon): number {
	// To find the width,
	// Consider a triangle formed from these points:
	//		A: (origin)
	//		B: (vertex)
	//		C: (opposite vertex)
	// AB and AC are the circumradii (polygon.circumradius)
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


export function getVertices(polygon: ReuleauxPolygon): Point[] {
	const out: Point[] = [];
	const angleDelta = CIRCLE_RAD / polygon.sides;
	let angle = polygon.orientation;
	for (let i = 0; i < polygon.sides; i++) {
		out.push({
			x: polygon.x + Math.cos(angle) * polygon.circumradius,
			y: polygon.y + Math.sin(angle) * polygon.circumradius,
		});
		angle += angleDelta;
	}
	return out;
}

export function getArcs(polygon: ReuleauxPolygon): Arc[] {
	const out: Arc[] = [];
	const angleDelta = CIRCLE_RAD / polygon.sides;
	
	const triangleAngle = angleDelta * ((polygon.sides/2)|0);
	const arcAngle = (PI - triangleAngle);
	const arcOrientation = PI - arcAngle/2;

	const arcRadius = getWidth(polygon);

	let angle = polygon.orientation;
	for (let i = 0, l = polygon.sides; i < l; i++) {
		out.push({
			x: polygon.x + Math.cos(angle) * polygon.circumradius,
			y: polygon.y + Math.sin(angle) * polygon.circumradius,
			radius: arcRadius,
			orientation: angle+arcOrientation,
			angle: arcAngle
		});
		angle += angleDelta;
	}
	return out;
}

export function getExtensions(polygon: ReuleauxPolygon): Arc[] {
	const out: Arc[] = [];
	const angleDelta = CIRCLE_RAD / polygon.sides;

	const triangleAngle = angleDelta * ((polygon.sides/2)|0);
	const arcAngle = (PI - triangleAngle);
	const arcOrientation = PI - arcAngle/2 - PI;

	let angle = polygon.orientation;
	for (let i = 0, l = polygon.sides; i < l; i++) {
		out.push({
			x: polygon.x + Math.cos(angle) * polygon.circumradius,
			y: polygon.y + Math.sin(angle) * polygon.circumradius,
			radius: polygon.extension,
			orientation: angle+arcOrientation,
			angle: arcAngle
		});
		angle += angleDelta;
	}
	return out;
}

export function getSector(arc: Arc): Point[] {
	const out: Point[] = [];
	out.push({
		x: arc.x + Math.cos(arc.orientation) * arc.radius,
		y: arc.y + Math.sin(arc.orientation) * arc.radius,
	});
	out.push(arc);
	out.push({
		x: arc.x + Math.cos(arc.orientation + arc.angle) * arc.radius,
		y: arc.y + Math.sin(arc.orientation + arc.angle) * arc.radius,
	});
	return out
}