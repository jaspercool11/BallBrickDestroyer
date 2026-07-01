export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private livesDisplay: HTMLElement;
    private scoreDisplay: HTMLElement;
    private startButton: HTMLButtonElement;
    private BALLDIAMETER = 40;
    private BALLRADIUS = this.BALLDIAMETER / 2;
    private ballPos = [0, 0];
    private ballVel = [6, 6];
    private batPos = [1800, 1100]
    private BATWIDTH = 250
    private BATHEIGHT = 50
    private lives = 3;
    private score = 0;
    private bricks: any[][]
    private ROW = 12
    private COLLUMN = 3
    private gameOver = false
    private brickPosX = 0
    private brickWidth = 300
    private brickPosY = 0
    private brickHeight = 70
    private activekeys: Set<string> = new Set();
    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.livesDisplay = document.getElementById('Lives') as HTMLElement;
        this.scoreDisplay = document.getElementById('Score') as HTMLElement;
        this.startButton = document.getElementById('Start') as HTMLButtonElement;
        this.startButton.addEventListener("click", (event: PointerEvent) => {
            this.setupNewGame()
            this.start()
  
        })
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.setupInputHandler();

    }
    private start(): void {
        console.log("Hello")
        this.startButton.disabled = true
        this.gameloop();
    }



    private setupInputHandler(): void {
        window.addEventListener("keydown", (event: KeyboardEvent) => {
            this.activekeys.add(event.key);
            console.log("pressed", event.key, this.activekeys);
        })
        window.addEventListener("keyup", (event: KeyboardEvent) => {
            this.activekeys.delete(event.key);
            console.log("released", event.key);
        })
    }
    public setupNewGame(): void {
        this.lives = 3
        this.score = 0
        this.gameOver = false
        this.updateDisplay()
        this.batPos[0] = 1800
        this.batPos[1] = 1100
        this.ballPos[0] = 800
        this.ballPos[1] = 400
        this.initializeBricks();
        this.clearScreen();
        this.drawBricks();
        this.drawBall();
        this.drawBat();
        
    }
    private initializeBricks(): void {
        this.bricks = []
        for (var i = 0; i < this.ROW; i++) {
            this.bricks[i] = []
            for (var j = 0; j < this.COLLUMN; j++) {
                this.bricks[i][j] = { active: true, colour: this.getRandomColor() }
            }
        }
    }
    private drawCircle(centerx: number, centery: number, radius: number, colour: string): void {
        this.ctx.beginPath();
        this.ctx.arc(centerx + radius, centery + radius, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = colour;
        this.ctx.fill();
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = colour;
        this.ctx.stroke();
    }

    private drawBricks(): void {
        for (var i = 0; i < 12; i++) {
            for (var j = 0; j < 3; j++) {
                if (this.bricks[i][j].active) {
                    let brickPosX = this.brickWidth * i
                    let brickPosY = this.brickHeight * j
                    this.ctx.fillStyle = this.bricks[i][j].colour
                    this.ctx.fillRect(brickPosX, brickPosY, this.brickWidth, this.brickHeight)
                }
            }
        }
    }
    private updateBricks(): void {
        for (var i = 0; i < 12; i++) {
            for (var j = 0; j < 3; j++) {
                if (this.bricks[i][j].active) {
                    let brickPosX = this.brickWidth * i
                    let brickPosY = this.brickHeight * j
                    if ((this.ballPos[0] >= brickPosX) &&
                        (this.ballPos[0] < brickPosX + this.brickWidth) &&
                        (this.ballPos[1] < brickPosY + this.brickHeight)) {
                        this.ballVel[1] = -this.ballVel[1]
                        this.bricks[i][j].active = false
                        this.score += 50
                    }

                }
            }
        }

    }
    private getRandomColor(): string {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    public clearScreen(): void {
        this.ctx.fillStyle = "#00437a";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }
    private resizeCanvas(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    private updatePaddle(): void {
        if (this.activekeys.has("ArrowLeft")) {
            this.batPos[0] = this.batPos[0] - 8
            if (this.batPos[0] <= 0) {
                this.batPos[0] = 0
            }
        }
        if (this.activekeys.has("ArrowRight")) {
            this.batPos[0] = this.batPos[0] + 8
            if (this.batPos[0] + this.BATWIDTH >= this.canvas.width) {
                this.batPos[0] = this.canvas.width - this.BATWIDTH
            }
        }

    }

    private drawBall(): void {
        this.drawCircle(this.ballPos[0], this.ballPos[1], this.BALLRADIUS, "red")
    }
    private drawBat(): void {
        this.ctx.fillStyle = "#661515";
        this.ctx.fillRect(this.batPos[0], this.batPos[1], this.BATWIDTH, this.BATHEIGHT)

    }
    private updateDisplay(): void {
        this.livesDisplay.innerHTML = `Lives:${this.lives}`
        this.scoreDisplay.innerHTML = `Score:${this.score}`

    }
    private updateBall(): void {
        this.ballPos[0] = this.ballPos[0] + this.ballVel[0]
        this.ballPos[1] = this.ballPos[1] + this.ballVel[1]

        //check for bouncing off walls
        if (this.ballPos[0] <= 0 || this.ballPos[0] >= this.canvas.width - 10) {
            this.ballVel[0] = -this.ballVel[0]
        }

        //check for bounce off ceiling
        if (this.ballPos[1] <= 0 || this.ballPos[1] >= this.canvas.height - 100) {
            this.ballVel[1] = -this.ballVel[1]
        }

        //check for collision with paddle
        if ((this.ballPos[0] + this.BALLDIAMETER >= this.batPos[0]) &&
            (this.ballPos[0] < this.batPos[0] + this.BATWIDTH) &&
            (this.ballPos[1] + this.BALLDIAMETER > this.batPos[1])) {
            this.ballVel[1] = -this.ballVel[1]
        }
    }
    private gameloop = () => {
        //update ball position
        //check for input left/right arrow
        //check for ball collision
        this.clearScreen();
        this.drawBricks();
        this.updatePaddle();
        this.updateBricks();
        this.updateBall()
        this.drawBall();
        this.drawBat();
        if (this.ballPos[1] > this.batPos[1] + this.BATHEIGHT) {
            this.lives = this.lives - 1
            this.ballPos[0] = 800
            this.ballPos[1] = 400
            this.ballVel[1] = 6
            this.ballVel[0] = 6
            if (this.lives < 1) {
                this.gameOver = true;
                this.startButton.disabled = false
            }
        }
        this.updateDisplay();
        if (!this.gameOver) {
            requestAnimationFrame(this.gameloop)
        }
    }
}