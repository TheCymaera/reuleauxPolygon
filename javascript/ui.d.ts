import { Renderer } from "./reuleaux/renderer.js";
export declare const renderer: Renderer;
export declare const autoDrawPolygon: HTMLInputElement;
export declare const autoDrawCircles: HTMLInputElement;
export declare const autoDrawArcs: HTMLInputElement;
export declare const sides: HTMLInputElement;
export declare const circumradius: HTMLInputElement;
export declare const orientation: HTMLInputElement;
export declare const extension: HTMLInputElement;
export declare const lineWidth: HTMLInputElement;
export declare const polygonColor: HTMLInputElement;
export declare const circleColor: HTMLInputElement;
export declare const arcColor: HTMLInputElement;
export declare const extensionColor: HTMLInputElement;
export declare const extensionRadiiColor: HTMLInputElement;
export declare const lineCap: HTMLSelectElement;
export declare const lineJoin: HTMLSelectElement;
export declare function getPolygon(): {
    x: number;
    y: number;
    sides: number;
    circumradius: number;
    orientation: number;
    extension: number;
};
export declare function clear(): void;
export declare function draw(drawPolygon?: boolean, drawCircles?: boolean, drawArcs?: boolean): void;
export declare function manualDraw(): boolean;
export declare function toggleManualDraw(toggle?: boolean): boolean;
export declare function resolution(): number;
export declare function changeResolution(resolution: number): void;