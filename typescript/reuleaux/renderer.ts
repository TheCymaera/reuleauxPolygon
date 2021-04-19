import { Arc, Circle, Point } from "./maths.js";

export class Renderer {
	readonly ctx: CanvasRenderingContext2D;

	readonly viewX = -10;
	readonly viewY = -10;
	readonly viewWidth = 10;
	readonly viewHeight = 10;

	readonly resX: number;
	readonly resY: number;

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
		this.resize();
	}

	resize(viewX = this.viewX, viewY = this.viewY, viewWidth = this.viewWidth, viewHeight = this.viewHeight): this {
		(this as any).viewX = viewX;
		(this as any).viewY = viewY;
		(this as any).viewWidth = viewWidth;
		(this as any).viewHeight = viewHeight;

		const canvas = this.ctx.canvas;
		(this as any).resX = canvas.width / viewWidth;
		(this as any).resY = canvas.height / viewHeight;
		return this;
	}

	distanceX(x: number) {
		return x * this.resX;
	}

	distanceY(y: number) {
		return y * this.resY;
	}

	pixelX(x: number) {
		return this.distanceX(x - this.viewX);
	}

	pixelY(y: number) {
		return this.ctx.canvas.height - this.distanceY(y - this.viewY);
	}

	clear() {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
	}

	tracePolygon(points: Point[]): this {
		const p1 = points[0];
		if (!p1) return this;
		
		this.ctx.moveTo(this.pixelX(p1.x), this.pixelY(p1.y));

		for (let i = 1, l = points.length; i < l; i++) {
			const point = points[i];
			this.ctx.lineTo(this.pixelX(point.x), this.pixelY(point.y));
		}
		return this;
	}

	traceCircle(circle: Circle): this {
		this.ctx.ellipse(
			this.pixelX(circle.x),
			this.pixelY(circle.y),
			this.distanceX(circle.radius),
			this.distanceY(circle.radius),
			0,0,
			Math.PI*2
		);
		return this;
	}

	traceArc(arc: Arc): this {
		this.ctx.ellipse(
			this.pixelX(arc.x),
			this.pixelY(arc.y),
			Math.abs(this.distanceX(arc.radius)),
			Math.abs(this.distanceY(arc.radius)),
			0,
			-arc.orientation,
			-(arc.orientation + arc.angle),
			true
		);
		return this;
	}
	
	drawPolygon(points: Point[], closePath = true): this {
		this.ctx.beginPath();
		this.tracePolygon(points);
		if (closePath) this.ctx.closePath();
		this.ctx.stroke();
		return this;
	}

	drawCircle(circle: Circle): this {
		this.ctx.beginPath();
		this.traceCircle(circle);
		this.ctx.stroke();
		return this;
	}

	drawArc(arc: Arc):  this {
		this.ctx.beginPath();
		this.traceArc(arc);
		this.ctx.stroke();
		return this;
	}
}