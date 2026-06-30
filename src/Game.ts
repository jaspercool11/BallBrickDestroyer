export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
private resizeCanvas(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
}
    public start(): void {
        console.log("Hello")
        this.ctx.fillStyle = "#0F021F";
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
    }
}