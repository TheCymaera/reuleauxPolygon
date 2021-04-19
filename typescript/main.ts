import * as ui from "./ui.js";
import * as canvasApp from "./canvasApp.js";

console.log(`For debugging, see "window.app".`);
window["app"] = { ui, canvasApp };

// configure canvas app
canvasApp.downloadImageSettings.name = "reuleaux-polygon.png";

// set renderer clipspace
const viewWidth = 500, viewHeight = 500;
ui.renderer.resize(-viewWidth/2, -viewHeight/2, viewWidth, viewHeight);

// auto-draw
if (!ui.manualDraw()) ui.draw();