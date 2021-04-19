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
    extension: number;
}
export declare function getWidth(polygon: ReuleauxPolygon): number;
export declare function getVertices(polygon: ReuleauxPolygon): Point[];
export declare function getArcs(polygon: ReuleauxPolygon): Arc[];
export declare function getExtensions(polygon: ReuleauxPolygon): Arc[];
export declare function getSector(arc: Arc): Point[];
