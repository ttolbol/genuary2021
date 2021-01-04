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
        this.debug = !!config.debug;
        this.hue = config.hue;
        this.hue_variance = config.hue_variance;

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

        if (this.debug){
            ctx.beginPath();
            ctx.moveTo(this.x - this.mirror_x * 32, this.y - this.mirror_y * 32);
            ctx.lineTo(this.x + this.mirror_x * 32, this.y + this.mirror_y * 32);
            ctx.strokeStyle = '#00FFFF';
            ctx.stroke();
        }

        for (let i in this.particles) {
            let particle = this.particles[i];
            if (particle.alive) {
                particle.draw(ctx);
            }
        }
    }

    mirror(x, y){
        let a = {x: x - this.x, y: y - this.y};
        let dot_product = a.x * this.mirror_x + a.y * this.mirror_y;
        let a1 = {x: this.mirror_x * dot_product, y: this.mirror_y * dot_product};
        let a2 = {x: a.x - a1.x, y: a.y - a1.y};
        return {x: this.x + a1.x - a2.x, y: this.y + a1.y - a2.y};
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
        this.hue = (parent.hue + randfloat(-parent.hue_variance, parent.hue_variance)) % 360;
        if (this.hue < 0){
            this.hue += 360;
        }
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
        ctx.strokeStyle = 'hsl(' + this.hue + ', 75%, 60%)';
        // draw
        ctx.beginPath();
        ctx.moveTo(this.px, this.py);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        // draw mirrored
        ctx.beginPath();
        let mirrored_p = this.parent.mirror(this.px, this.py);
        let mirrored = this.parent.mirror(this.x, this.y);
        ctx.moveTo(mirrored_p.x, mirrored_p.y);
        ctx.lineTo(mirrored.x, mirrored.y);
        ctx.stroke();
    }
}