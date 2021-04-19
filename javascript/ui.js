import { canvas } from "./canvasApp.js";
import { Renderer } from "./reuleaux/renderer.js";
import * as reuleaux from "./reuleaux/maths.js";
export const renderer = new Renderer(canvas.getContext("2d"));
export const autoDrawPolygon = document.querySelector("#autoDrawPolygon");
export const autoDrawCircles = document.querySelector("#autoDrawCircles");
export const autoDrawArcs = document.querySelector("#autoDrawArcs");
export const sides = document.querySelector("#sides");
export const circumradius = document.querySelector("#circumradius");
export const orientation = document.querySelector("#orientation");
export const extension = document.querySelector("#extension");
export const lineWidth = document.querySelector("#lineWidth");
export const polygonColor = document.querySelector("#polygonColor");
export const circleColor = document.querySelector("#circleColor");
export const arcColor = document.querySelector("#arcColor");
export const extensionColor = document.querySelector("#extensionColor");
export const extensionRadiiColor = document.querySelector("#extensionRadiiColor");
export const lineCap = document.querySelector("#lineCap");
export const lineJoin = document.querySelector("#lineJoin");
export function getPolygon() {
    return {
        x: 0,
        y: 0,
        sides: sides.valueAsNumber || 0,
        circumradius: circumradius.valueAsNumber || 0,
        orientation: orientation.valueAsNumber * (Math.PI / 180) || 0,
        extension: extension.valueAsNumber || 0
    };
}
export function clear() {
    renderer.clear();
}
export function draw(drawPolygon = autoDrawPolygon.checked, drawCircles = autoDrawCircles.checked, drawArcs = autoDrawArcs.checked) {
    renderer.ctx.lineWidth = lineWidth.valueAsNumber;
    renderer.ctx.lineCap = lineCap.value;
    renderer.ctx.lineJoin = lineJoin.value;
    renderer.ctx.miterLimit = 1;
    const polygon = getPolygon();
    const arcs = reuleaux.getArcs(polygon);
    const extensions = reuleaux.getExtensions(polygon);
    if (drawPolygon) {
        renderer.ctx.strokeStyle = polygonColor.value;
        renderer.drawPolygon(arcs);
        if (polygon.extension !== 0) {
            renderer.ctx.strokeStyle = extensionRadiiColor.value;
            for (const arc of extensions) {
                const sectorPolygon = reuleaux.getSector(arc);
                renderer.drawPolygon(sectorPolygon, false);
            }
        }
    }
    if (drawCircles) {
        renderer.ctx.strokeStyle = circleColor.value;
        for (const arc of arcs)
            renderer.drawCircle(arc);
    }
    if (drawArcs) {
        if (polygon.extension === 0) {
            (async () => {
                renderer.ctx.strokeStyle = arcColor.value;
                renderer.ctx.beginPath();
                for (const arc of arcs)
                    renderer.traceArc(arc);
                renderer.ctx.closePath();
                renderer.ctx.stroke();
            })();
        }
        else {
            renderer.ctx.strokeStyle = arcColor.value;
            for (const arc of arcs)
                renderer.drawArc(arc);
            renderer.ctx.strokeStyle = extensionColor.value;
            for (const arc of extensions)
                renderer.drawArc(arc);
        }
    }
}
const manualDrawInput = document.querySelector("#manualDraw");
manualDrawInput.addEventListener("change", () => toggleManualDraw(manualDrawInput.checked));
toggleManualDraw(manualDrawInput.checked);
export function manualDraw() {
    return manualDrawInput.checked;
}
export function toggleManualDraw(toggle) {
    return manualDrawInput.checked = document.documentElement.toggleAttribute("data-manual-draw", toggle);
}
const resolutionInput = document.querySelector("#resolution");
resolutionInput.addEventListener("input", () => changeResolution(resolutionInput.valueAsNumber));
export function resolution() {
    return resolutionInput.valueAsNumber;
}
export function changeResolution(resolution) {
    resolutionInput.valueAsNumber = canvas.height = canvas.width = resolution;
    renderer.resize();
}
changeResolution(resolutionInput.valueAsNumber);
document.querySelector("#drawPolygon").addEventListener("click", () => draw(true, false, false));
document.querySelector("#drawCircles").addEventListener("click", () => draw(false, true, false));
document.querySelector("#drawArcs").addEventListener("click", () => draw(false, false, true));
document.querySelector("#clear").addEventListener("click", () => clear());
const container = document.querySelector("aside");
container.addEventListener("input", () => {
    if (!manualDraw())
        clear(), draw();
});
if (!manualDraw())
    clear(), draw();
//# sourceMappingURL=ui.js.map