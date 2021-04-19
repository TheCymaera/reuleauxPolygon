import { canvas } from "./canvasApp.js";
import { Renderer } from "./reuleaux/renderer.js";
import * as reuleaux from "./reuleaux/maths.js";

export const renderer = new Renderer(canvas.getContext("2d")!);

export const autoDrawPolygon 	= document.querySelector("#autoDrawPolygon") as HTMLInputElement;
export const autoDrawCircles 	= document.querySelector("#autoDrawCircles") as HTMLInputElement;
export const autoDrawArcs 		= document.querySelector("#autoDrawArcs") as HTMLInputElement;

export const sides 			= document.querySelector("#sides") as HTMLInputElement;
export const circumradius 	= document.querySelector("#circumradius") as HTMLInputElement;
export const orientation 	= document.querySelector("#orientation") as HTMLInputElement;
export const extension 		= document.querySelector("#extension") as HTMLInputElement;

export const lineWidth 			= document.querySelector("#lineWidth") as HTMLInputElement;
export const polygonColor 		= document.querySelector("#polygonColor") as HTMLInputElement;
export const circleColor 		= document.querySelector("#circleColor") as HTMLInputElement;
export const arcColor 			= document.querySelector("#arcColor") as HTMLInputElement;
export const extensionColor 	= document.querySelector("#extensionColor") as HTMLInputElement;
export const extensionRadiiColor= document.querySelector("#extensionRadiiColor") as HTMLInputElement;
export const lineCap 			= document.querySelector("#lineCap") as HTMLSelectElement;
export const lineJoin 			= document.querySelector("#lineJoin") as HTMLSelectElement;

export function getPolygon() {
	return {
		x: 0,
		y: 0,
		sides: sides.valueAsNumber || 0,
		circumradius: circumradius.valueAsNumber || 0,
		orientation: orientation.valueAsNumber  * (Math.PI/180) || 0,
		extension: extension.valueAsNumber || 0
	};
}

export function clear() {
	renderer.clear();
}

export function draw(
	drawPolygon = autoDrawPolygon.checked, 
	drawCircles = autoDrawCircles.checked,
	drawArcs = autoDrawArcs.checked
) {
	renderer.ctx.lineWidth = lineWidth.valueAsNumber;
	renderer.ctx.lineCap = lineCap.value as CanvasLineCap;
	renderer.ctx.lineJoin =  lineJoin.value as CanvasLineJoin;
	renderer.ctx.miterLimit = 1;

	const polygon = getPolygon();
	const arcs = reuleaux.getArcs(polygon);
	const extensions = reuleaux.getExtensions(polygon);

	if (drawPolygon) {
		// Draw base shape
		renderer.ctx.strokeStyle = polygonColor.value;
		renderer.drawPolygon(arcs);

		// Draw extensions radii
		//  >> get the sector as a polygon, the straight lines are the radii
		if (polygon.extension !== 0) {	
			renderer.ctx.strokeStyle = extensionRadiiColor.value;
			for (const arc of extensions) {
				const sectorPolygon = reuleaux.getSector(arc);
				renderer.drawPolygon(sectorPolygon,false);
			}
		}
	}

	if (drawCircles) {
		// Draw circles
		renderer.ctx.strokeStyle = circleColor.value;
		for (const arc of arcs) renderer.drawCircle(arc);
	}

	if (drawArcs) {
		if (polygon.extension === 0) {
			(async ()=>{
				// Draw arcs
				renderer.ctx.strokeStyle = arcColor.value;
				renderer.ctx.beginPath();
				for (const arc of arcs) renderer.traceArc(arc);
				renderer.ctx.closePath();
				renderer.ctx.stroke();
			})();
		} else {
			// Draw arcs
			renderer.ctx.strokeStyle = arcColor.value;
			for (const arc of arcs) renderer.drawArc(arc);
			// Draw extensions
			renderer.ctx.strokeStyle = extensionColor.value;
			for (const arc of extensions) renderer.drawArc(arc);
		}
	}
}



const manualDrawInput = document.querySelector("#manualDraw") as HTMLInputElement;
manualDrawInput.addEventListener("change",()=>toggleManualDraw(manualDrawInput.checked));
toggleManualDraw(manualDrawInput.checked);

export function manualDraw(): boolean {
	return manualDrawInput.checked;
}

export function toggleManualDraw(toggle?: boolean): boolean {
	return manualDrawInput.checked = document.documentElement.toggleAttribute("data-manual-draw",toggle);
}


const resolutionInput = document.querySelector("#resolution") as HTMLInputElement;
resolutionInput.addEventListener("input",()=>changeResolution(resolutionInput.valueAsNumber));

export function resolution(): number {
	return resolutionInput.valueAsNumber;
}

export function changeResolution(resolution: number): void {
	resolutionInput.valueAsNumber = canvas.height = canvas.width = resolution;
	renderer.resize();
}

changeResolution(resolutionInput.valueAsNumber);


// manual draw buttons
document.querySelector("#drawPolygon")!.addEventListener("click",()=>draw(true,false,false));
document.querySelector("#drawCircles")!.addEventListener("click",()=>draw(false,true,false));
document.querySelector("#drawArcs")!.addEventListener("click",()=>draw(false,false,true));
document.querySelector("#clear")!.addEventListener("click",()=>clear());


// auto-draw if any value has changed.
const container = document.querySelector("aside")!;
container.addEventListener("input",()=>{
	if (!manualDraw()) clear(), draw();
});
if (!manualDraw()) clear(), draw();