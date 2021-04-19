export class Renderer {
    constructor(ctx) {
        this.viewX = -10;
        this.viewY = -10;
        this.viewWidth = 10;
        this.viewHeight = 10;
        this.ctx = ctx;
        this.resize();
    }
    resize(viewX = this.viewX, viewY = this.viewY, viewWidth = this.viewWidth, viewHeight = this.viewHeight) {
        this.viewX = viewX;
        this.viewY = viewY;
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;
        const canvas = this.ctx.canvas;
        this.resX = canvas.width / viewWidth;
        this.resY = canvas.height / viewHeight;
        return this;
    }
    distanceX(x) {
        return x * this.resX;
    }
    distanceY(y) {
        return y * this.resY;
    }
    pixelX(x) {
        return this.distanceX(x - this.viewX);
    }
    pixelY(y) {
        return this.ctx.canvas.height - this.distanceY(y - this.viewY);
    }
    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    tracePolygon(points) {
        const p1 = points[0];
        if (!p1)
            return this;
        this.ctx.moveTo(this.pixelX(p1.x), this.pixelY(p1.y));
        for (let i = 1, l = points.length; i < l; i++) {
            const point = points[i];
            this.ctx.lineTo(this.pixelX(point.x), this.pixelY(point.y));
        }
        return this;
    }
    traceCircle(circle) {
        this.ctx.ellipse(this.pixelX(circle.x), this.pixelY(circle.y), this.distanceX(circle.radius), this.distanceY(circle.radius), 0, 0, Math.PI * 2);
        return this;
    }
    traceArc(arc) {
        this.ctx.ellipse(this.pixelX(arc.x), this.pixelY(arc.y), Math.abs(this.distanceX(arc.radius)), Math.abs(this.distanceY(arc.radius)), 0, -arc.orientation, -(arc.orientation + arc.angle), true);
        return this;
    }
    drawPolygon(points, closePath = true) {
        this.ctx.beginPath();
        this.tracePolygon(points);
        if (closePath)
            this.ctx.closePath();
        this.ctx.stroke();
        return this;
    }
    drawCircle(circle) {
        this.ctx.beginPath();
        this.traceCircle(circle);
        this.ctx.stroke();
        return this;
    }
    drawArc(arc) {
        this.ctx.beginPath();
        this.traceArc(arc);
        this.ctx.stroke();
        return this;
    }
}
//# sourceMappingURL=renderer.js.map