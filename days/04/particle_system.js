class ParticleSystem {
    constructor(config) {
        // copy attributes from configuration
        this.x = config.x;
        this.y = config.y;
        this.alive = true;
        this.mirror_x = Math.cos(config.mirror_angle);
        this.mirror_y = Math.sin(config.mirror_angle);
        this.lifetime = config.lifetime;
        this.acceleration = config.acceleration;
        this.damping = config.damping;

        this.particles = new Array(config.n_particles);
        for (let i = 0; i < config.n_particles; i++) {
            this.particles[i] = new Particle(this);
        }
    }

    update() {
        this.alive = false;
        for (let i in this.particles) {
            let particle = this.particles[i];
            if (particle.alive) {
                this.alive = true;
                particle.update();
            }
        }
    }

    draw(ctx) {
        if (!this.alive){
            return;
        }
        for (let i in this.particles) {
            let particle = this.particles[i];
            if (particle.alive) {
                particle.draw(ctx);
            }
        }
    }
}

class Particle {
    constructor(parent) {
        this.parent = parent;
        this.x = parent.x;
        this.y = parent.y;
        this.px = this.x;
        this.py = this.y;
        this.alive = true;
        this.lifetime = parent.lifetime;
        this.damping = parent.damping;
    }

    update() {
        if (this.alive){
            this.lifetime--;
            if (this.lifetime <= 0){
                this.alive = false;
                return;
            }
            let vx = this.x - this.px;
            let vy = this.y - this.py;
            vx -= vx * this.damping;
            vy -= vy * this.damping;

            let ax = randfloat(-this.parent.acceleration, this.parent.acceleration);
            let ay = randfloat(-this.parent.acceleration, this.parent.acceleration);
            vx += ax;
            vy += ay;
            this.px = this.x;
            this.py = this.y;
            this.x += vx;
            this.y += vy;
        }
    }

    draw(ctx) {
        if (!this.alive) {
            return
        }
        ctx.beginPath();
        ctx.moveTo(this.px, this.py);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = '#FFF';
        ctx.stroke();
    }
}