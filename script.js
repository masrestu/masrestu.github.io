
const canvas = document.getElementById('starfieldCanvas');
const ctx = canvas.getContext('2d');

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

const stars = [];
const numStars = 100;

class Star {
    constructor() {
        this.originX = Math.random() * canvas.width;
        this.originY = Math.random() * canvas.height;
        this.radius = Math.random() * Math.min(canvas.width, canvas.height) / 4 + 10;
        this.angle = Math.random() * Math.PI * 2;
        this.angularSpeed = (Math.random() * 0.0002 + 0.00005);

        this.x = this.originX + this.radius * Math.cos(this.angle);
        this.y = this.originY + this.radius * Math.sin(this.angle);

        this.size = Math.random() * 0.8 + 0.2;
        this.baseOpacity = Math.random() * 0.7 + 0.3;

        this.attractionFactor = (Math.random() * 0.0002 + 0.00005);
    }

    update() {
        this.angle += this.angularSpeed;

        let dx = mouseX - this.originX;
        let dy = mouseY - this.originY;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 1) {
            this.originX += dx * this.attractionFactor;
            this.originY += dy * this.attractionFactor;
        }

        this.x = this.originX + this.radius * Math.cos(this.angle);
        this.y = this.originY + this.radius * Math.sin(this.angle);

        const margin = 50;
        if (this.originX < -margin || this.originX > canvas.width + margin ||
            this.originY < -margin || this.originY > canvas.height + margin) {
            this.originX = Math.random() * canvas.width;
            this.originY = Math.random() * canvas.height;
            this.angle = Math.random() * Math.PI * 2;
        }
    }

    draw() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const distFromCenter = Math.sqrt(Math.pow(this.x - centerX, 2) + Math.pow(this.y - centerY, 2));

        const maxDistance = Math.sqrt(Math.pow(canvas.width / 2, 2) + Math.pow(canvas.height / 2, 2));

        let fadeFactor = 1 - Math.pow(distFromCenter / maxDistance, 2);
        fadeFactor = Math.max(0, Math.min(1, fadeFactor));

        const finalOpacity = this.baseOpacity * fadeFactor;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
        ctx.fill();
    }
}

function initStars() {
    stars.length = 0;
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }
}

function getDiagonalGradientDegree(viewportWidth, viewportHeight) {
    if (viewportWidth <= 0 || viewportHeight <= 0) {
        if (viewportWidth === 0 && viewportHeight === 0) return 0;
        if (viewportWidth === 0) return 90;
        if (viewportHeight === 0) return 0;
    }
    const angleInRadians = Math.atan2(viewportHeight, viewportWidth);
    const angleInDegrees = angleInRadians * (180 / Math.PI);
    return angleInDegrees;
}

function drawBackground(degree = 0) {
    const diagonalDegree = getDiagonalGradientDegree(canvas.width, canvas.height);
    degree = 90 - diagonalDegree;
    const angleInRadians = degree * Math.PI / 180;

    const diagonal = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
    const halfDiagonal = diagonal / 2;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const x0 = centerX - halfDiagonal * Math.cos(angleInRadians);
    const y0 = centerY - halfDiagonal * Math.sin(angleInRadians);
    const x1 = centerX + halfDiagonal * Math.cos(angleInRadians);
    const y1 = centerY + halfDiagonal * Math.sin(angleInRadians);

    const gradient = ctx.createLinearGradient(x0, y0, x1, y1);

    gradient.addColorStop(0.0, '#000000');
    gradient.addColorStop(0.5, '#0a0a0f');
    gradient.addColorStop(1.0, '#000000');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function animate() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();

    for (let i = 0; i < numStars; i++) {
        stars[i].update();
        stars[i].draw();
    }

    requestAnimationFrame(animate);
}

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

window.onload = function () {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    mouseX = canvas.width / 2;
    mouseY = canvas.height / 2;

    initStars();
    animate();
};

window.addEventListener('resize', () => {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    initStars();
});