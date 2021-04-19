import { Arc, Circle, Point } from "./maths.js";
export declare class Renderer {
    readonly ctx: CanvasRenderingContext2D;
    readonly viewX = -10;
    readonly viewY = -10;
    readonly viewWidth = 10;
    readonly viewHeight = 10;
    readonly resX: number;
    readonly resY: number;
    constructor(ctx: CanvasRenderingContext2D);
    resize(viewX?: number, viewY?: number, viewWidth?: number, viewHeight?: number): this;
    distanceX(x: number): number;
    distanceY(y: number): number;
    pixelX(x: number): number;
    pixelY(y: number): number;
    clear(): void;
    tracePolygon(points: Point[]): this;
    traceCircle(circle: Circle): this;
    traceArc(arc: Arc): this;
    drawPolygon(points: Point[], closePath?: boolean): this;
    drawCircle(circle: Circle): this;
    drawArc(arc: Arc): this;
}
