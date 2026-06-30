export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private size: number;
    private BALLRADIUS = 20;
    private ballPos = [0,0];
    private ballVel = [8,8];
    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    public start(): void {
        console.log("Hello")
        this.gameloop();
        this.size = 0
        
    }
    private drawCircle(centerx: number, centery: number, radius: number, colour: string): void{
        this.ctx.beginPath();
        this.ctx.arc(centerx, centery, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = colour;
        this.ctx.fill();
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = colour;
        this.ctx.stroke();
    }
    public clearScreen(): void{
        this.ctx.fillStyle = "#00437a";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }
    private resizeCanvas(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    private gameloop = () => {
        //update ball position
        //check for input left/right arrow
        //check for ball collision
        this.clearScreen();
        console.log(this.size);
        this.drawCircle(this.ballPos[0], this.ballPos[1], this.BALLRADIUS, "red")
        this.ballPos[0] = this.ballPos[0] + this.ballVel[0]
        this.ballPos[1] = this.ballPos[1] + this.ballVel[1]
        if (this.ballPos[0] <= 0 || this.ballPos[0] >= this.canvas.width - 10){
            this.ballVel[0] = -this.ballVel[0]
        }
         if (this.ballPos[1] <= 0 || this.ballPos[1] >= this.canvas.height - 100){
            this.ballVel[1] = -this.ballVel[1]
        }
        console.log("hi")
        requestAnimationFrame(this.gameloop)

    }
}