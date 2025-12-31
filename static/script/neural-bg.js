const canvas = document.getElementById('neuralCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let signals = []; // Array to hold active synaptic signals
let mouse = { x: null, y: null, radius: 180 }; // Increased interaction radius

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.baseSize = this.size;
        this.density = (Math.random() * 30) + 1;

        // Pulse properties (Neuron firing)
        this.isPulsing = false;
        this.pulseScale = 1;
        this.pulseSpeed = 0.1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Mouse interaction
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;

                // Gentle attraction/repel mix
                const directionX = forceDirectionX * force * this.density;
                const directionY = forceDirectionY * force * this.density;

                this.x -= directionX;
                this.y -= directionY;

                // Trigger pulse if close to mouse
                if (!this.isPulsing && Math.random() < 0.02) {
                    this.triggerPulse();
                }
            }
        }

        // Random spontaneous firing
        if (!this.isPulsing && Math.random() < 0.001) {
            this.triggerPulse();
        }

        // Pulse Animation
        if (this.isPulsing) {
            this.pulseScale += this.pulseSpeed;
            if (this.pulseScale > 2.5) {
                this.pulseSpeed = -0.1; // Shrink
            } else if (this.pulseScale < 1) {
                this.isPulsing = false;
                this.pulseScale = 1;
                this.pulseSpeed = 0.1; // Reset
            }
        }

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    triggerPulse() {
        this.isPulsing = true;
        this.pulseScale = 1;
        this.pulseSpeed = 0.1;
    }

    draw() {
        ctx.fillStyle = this.isPulsing ? 'rgba(6, 182, 212, 1)' : 'rgba(124, 58, 237, 0.5)'; // Cyan when pulsing, Purple base

        // Draw Glow
        if (this.isPulsing) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = "rgba(6, 182, 212, 0.8)";
        } else {
            ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * this.pulseScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
    }
}

class Signal {
    constructor(startParticle, endParticle) {
        this.start = startParticle;
        this.end = endParticle;
        this.progress = 0;
        this.speed = 0.05 + Math.random() * 0.05; // Random speed
    }

    update() {
        this.progress += this.speed;
    }

    draw() {
        const currentX = this.start.x + (this.end.x - this.start.x) * this.progress;
        const currentY = this.start.y + (this.end.y - this.start.y) * this.progress;

        ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // Bright white signal
        ctx.shadowBlur = 10;
        ctx.shadowColor = "white";
        ctx.beginPath();
        ctx.arc(currentX, currentY, 1.5, 0, Math.PI * 2); // Small bright dot
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function init() {
    particles = [];
    signals = [];
    const numberOfParticles = Math.floor((width * height) / 9000);
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update Particles
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Check connections
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                // Draw Connection Line
                ctx.beginPath();
                // Dynamic opacity based on distance
                let opacity = 0.1 - distance / 1200;
                if (particles[i].isPulsing || particles[j].isPulsing) opacity += 0.1; // Brighten connection if node fires

                ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();

                // Chance to fire a signal
                if (Math.random() < 0.0005) { // Rare event per frame per pair
                    signals.push(new Signal(particles[i], particles[j]));
                }
            }
        }
    }

    // Update & Draw Signals
    for (let i = signals.length - 1; i >= 0; i--) {
        signals[i].update();
        if (signals[i].progress >= 1) {
            // Signal reached destination -> Trigger pulse at destination
            signals[i].end.triggerPulse();
            signals.splice(i, 1); // Remove finished signal
        } else {
            signals[i].draw();
        }
    }

    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    resize();
    init();
});

resize();
init();
animate();