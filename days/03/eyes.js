class Eyes {
    constructor(config, id, events) {
        // copy attributes from configuration
        this.size = config.size;
        this.pupil_size = config.pupil_size * this.size;
        this.separation = this.size * 2;
        this.x = config.x;
        this.y = config.y;
        this.blink_period = config.blink_period;
        this.awake_duration = config.awake_duration;
        this.hue = config.hue;
        this.wakeup_chance = config.wakeup_chance;
        this.damping = config.damping;
        this.attention_radius = config.attention_radius;
        this.notice_chance = config.notice_chance;
        this.blink_speed = config.blink_speed

        this.openness_target = 0.0;
        this.openness = 0.0;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 1 + Math.ceil(this.size/2) * 2;
        this.canvas.height = 1 + Math.ceil(this.size/2) * 2;
        this.ctx = this.canvas.getContext('2d');
        this.look_x_target = 0;
        this.look_x = 0;
        this.look_y_target = 0;
        this.look_y = 0;
        this.awake = false;
        this.awake_time = 0;
        this.next_blink = this.blink_period;

        this.id = id;
        this.events = events;
        this.rerender = true;
    }

    update() {
        if (Math.abs(this.look_x_target - this.look_x) > 0.01) {
            this.look_x += (this.look_x_target - this.look_x) * (1 - this.damping);
            this.rerender = true;
        } else {
            this.look_x = this.look_x_target;
        }
        if (Math.abs(this.look_y_target - this.look_y) > 0.01) {
            this.look_y += (this.look_y_target - this.look_y) * (1 - this.damping);
            this.rerender = true;
        } else {
            this.look_y = this.look_y_target;
        }

        if (Math.abs(this.openness_target - this.openness) > 0.01) {
            this.openness += (this.openness_target - this.openness) * this.blink_speed;
            this.rerender = true;
        } else {
            this.openness = this.openness_target;
        }

        if (this.awake) {
            this.next_blink -= 1 / 60;
            if (this.next_blink < 0) {
                this.blink();
            }

            this.awake_time += 1 / 60;

            if (this.awake_time > this.awake_duration) {
                this.sleep();
            }
        }
        // events
        for (let i = 0; i < this.events.old.length; i++) {
            let event = this.events.old[i];
            if (this.eval_event(event)) {
                break;
            }
        }
    }

    eval_event(event) {
        if (this.id === event.id) {
            return false;
        }
        let dx = this.x - event.x;
        let dy = this.y - event.y;
        let dist = Math.sqrt(dx ** 2 + dy ** 2);
        if (dist > this.attention_radius) {
            return false;
        }
        let probability = this.awake ? this.notice_chance : this.wakeup_chance * event.severity;
        probability *= map_range(dist, 0, this.attention_radius, 1, 0);
        if (randfloat(0, 1) < probability){
            this.wake(event.x, event.y);
            return true;
        }
        return false;
    }

    blink() {
        this.next_blink = this.blink_period;
        this.openness = 0.0;
        this.look_x_target = 0;
        this.look_y_target = 0;
        this.events.new.push({x: this.x, y: this.y, id: this.id, severity: 0.3});
    }

    wake(x, y) {
        if (!this.awake) {
            this.events.new.push({x: this.x, y: this.y, id: this.id, severity: 0.1});
            this.awake_time = 0;
            this.awake = true;
            this.openness_target = 1.0;
        }
        
        let dx = x - this.x;
        let dy = y - this.y;
        let m = Math.sqrt(dx ** 2 + dy ** 2);
        this.look_x_target = dx / m;
        this.look_y_target = dy / m;
    }

    sleep() {
        if (this.awake) {
            this.events.new.push({x: this.x, y: this.y, id: this.id, severity: 0.5});
        }
        
        this.openness_target = 0.0;
        this.awake = false;
    }

    render_eye(ctx) {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.openness < 0.01) {
            return;
        }

        // draw eyeball
        let x = this.canvas.width / 2;
        let y = this.canvas.height / 2;
        this.ctx.beginPath()
        this.ctx.arc(x, y, this.size / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = "#FFF";
        this.ctx.fill();

        // draw pupil
        let dx = this.look_x * (this.size - this.pupil_size) * 0.5;
        let dy = this.look_y * (this.size - this.pupil_size) * 0.5;
        this.ctx.beginPath()
        this.ctx.arc(x + dx, y + dy, this.pupil_size / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = "#000";
        this.ctx.fill();

        // open / close eye
        this.ctx.globalCompositeOperation = 'destination-in'
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        let cp = (this.size / 2) * this.openness;
        this.ctx.bezierCurveTo(x - cp, y - cp, x + cp, y - cp, x + this.size / 2, y);
        this.ctx.bezierCurveTo(x + cp, y + cp, x - cp, y + cp, 0, y);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
        this.ctx.strokeStyle = "#000";
        this.ctx.stroke();
    }

    draw(ctx) {
        if (this.rerender) {
            this.render_eye();
            this.rerender = false;
        }
        if (this.openness < 0.01) {
            return;
        }
        ctx.drawImage(this.canvas, this.x - (this.separation + this.size) / 2, this.y - this.size / 2);
        ctx.drawImage(this.canvas, this.x + (this.separation + this.size) / 2, this.y - this.size / 2);
    }
}