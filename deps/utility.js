/**
 * Utilities
 * ==========================================
 * Can be used for commerical or non-commerical purposes.
 * DO NOT RESELL.
 * Attribution is appreciated but not due.
 * ==========================================
 * @module Utilities
 * @author Cymaera
 */

/**
 * @callback Loop
 * @param {number} delta - Time passed since the last invokation
 */
/**
 * Calls a function on every animation frame.
 * @param {Loop} callback
 * @param {number} [throttleRate=1]
 * @returns {void}
 */
export function loop(callback,throttleRate) {
	if (throttleRate === undefined) throttleRate = 1;
	let throttle = throttleRate;
	
	let time = performance.now();
	const loop = function() {
		// loop
		requestAnimationFrame(loop);
		// throttle
		throttle--;
		if (throttle) return;
		throttle = throttleRate;
		// callback
		const newTime = performance.now();
		const delta = newTime - time;
		callback(delta);
		time = newTime;
	}
	requestAnimationFrame(loop);
}


/**
 * Bind an input to an object property
 * @param {HTMLInputElement|string} element 
 * @param {Object} object 
 * @param {string} property 
 * @param {string} type 
 */
export function bindInput(element,object,property,type) {
	/** @type {HTMLInputElement} */
	const input = typeof element !== "string" ? element : document.querySelector(element);

	switch (type) {
		case "int": 
			input.oninput = ()=>{object[property] = parseInt(input.value)};
			input.value = object[property].toString();
			break;
		case "float":
			input.oninput = ()=>{object[property] = parseFloat(input.value)};
			input.value = object[property].toString();
			break;
		case "boolean":
			input.oninput = ()=>{object[property] = input.checked};
			input.checked = object[property];
			break;
		default:
			input.oninput = ()=>{object[property] = input.value};
			input.value = object[property];
			break;
	}
}

/**
 * Binds a select element to an object property.
 * @param {HTMLSelectElement|string} element 
 * @param {Object} object 
 * @param {string} property 
 * @param {{value:any,text:string}[]} options 
 */
export function bindSelect(element,object,property,options) {
	/** @type {HTMLSelectElement} */
	const select = typeof element !== "string" ? element : document.querySelector(element);
	select.addEventListener("input",function() {
		object[property] = options[parseInt(this.value)].value;
	})

	// Generate options
	let html = "";
	for (let i = 0; i < options.length; i++) {
		html += `<option value="${i}">${options[i].text}</option>`;
	}
	select.innerHTML = html;

	// Set value
	for (let i = 0; i < options.length; i++) {
		if (options[i].value === object[property]) {
			select.value = i.toString();
			return;
		}
	}
	
}

/**
 * Convert radians to degrees
 * @param {number} radians
 * @returns {number} degrees
 */
export function radToDeg(radians) {
	return radians * (180/Math.PI)
}

/**
 * Convert radians to degrees
 * @param {number} degrees
 * @returns {number} radians
 */
export function degToRad(degrees) {
	return degrees * (Math.PI/180)
}

/**
 * Download canvas contents
 * @param {HTMLCanvasElement} canvas
 * @param {string} [name]
 * @param {string} [type]
 * @param {number} [encoding]
 */
export function downloadCanvas(canvas,name,type,encoding) {
	const a = document.createElement("a");
	a.href = canvas.toDataURL(type||"image/png",encoding);
	if (name) a.download = name;
	a.click();
}