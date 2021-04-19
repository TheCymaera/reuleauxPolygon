const PI = Math.PI;
const CIRCLE_RAD = PI * 2;
export function getWidth(polygon) {
    const A = (CIRCLE_RAD / polygon.sides) * ((polygon.sides / 2) | 0);
    const b = polygon.circumradius;
    const BC = Math.sqrt(2 * b * b * (1 - Math.cos(A)));
    return BC + polygon.extension;
}
export function getVertices(polygon) {
    const out = [];
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
export function getArcs(polygon) {
    const out = [];
    const angleDelta = CIRCLE_RAD / polygon.sides;
    const triangleAngle = angleDelta * ((polygon.sides / 2) | 0);
    const arcAngle = (PI - triangleAngle);
    const arcOrientation = PI - arcAngle / 2;
    const arcRadius = getWidth(polygon);
    let angle = polygon.orientation;
    for (let i = 0, l = polygon.sides; i < l; i++) {
        out.push({
            x: polygon.x + Math.cos(angle) * polygon.circumradius,
            y: polygon.y + Math.sin(angle) * polygon.circumradius,
            radius: arcRadius,
            orientation: angle + arcOrientation,
            angle: arcAngle
        });
        angle += angleDelta;
    }
    return out;
}
export function getExtensions(polygon) {
    const out = [];
    const angleDelta = CIRCLE_RAD / polygon.sides;
    const triangleAngle = angleDelta * ((polygon.sides / 2) | 0);
    const arcAngle = (PI - triangleAngle);
    const arcOrientation = PI - arcAngle / 2 - PI;
    let angle = polygon.orientation;
    for (let i = 0, l = polygon.sides; i < l; i++) {
        out.push({
            x: polygon.x + Math.cos(angle) * polygon.circumradius,
            y: polygon.y + Math.sin(angle) * polygon.circumradius,
            radius: polygon.extension,
            orientation: angle + arcOrientation,
            angle: arcAngle
        });
        angle += angleDelta;
    }
    return out;
}
export function getSector(arc) {
    const out = [];
    out.push({
        x: arc.x + Math.cos(arc.orientation) * arc.radius,
        y: arc.y + Math.sin(arc.orientation) * arc.radius,
    });
    out.push(arc);
    out.push({
        x: arc.x + Math.cos(arc.orientation + arc.angle) * arc.radius,
        y: arc.y + Math.sin(arc.orientation + arc.angle) * arc.radius,
    });
    return out;
}
//# sourceMappingURL=maths.js.map