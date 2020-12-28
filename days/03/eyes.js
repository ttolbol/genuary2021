class Eyes {
    constructor(config, id, events) {
        // copy attributes from configuration
        this.size = config.size;
        this.pupil_size = config.pupil_size;
        this.iris_size = config.iris_size;
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
        this.canvas.width = Math.ceil(this.size);
        this.canvas.height = Math.ceil(this.size);
        this.ctx = this.canvas.getContext('2d');
        this.look_dir = 0;
        this.attention_target = 0.0;
        this.attention = 0.0;
        this.awake = false;
        this.awake_time = 0;

        this.id = id;
        this.events = events;
        this.rerender = true;
    }

    update() {
        if (Math.abs(this.attention_target - this.attention) > 0.01) {
            this.attention += (this.attention_target - this.attention) * (1 - this.damping);
            this.rerender = true;
        } else {
            this.attention = this.attention_target;
        }

        if (Math.abs(this.openness_target - this.openness) > 0.01) {
            this.openness += (this.openness_target - this.openness) * this.blink_speed;
            this.rerender = true;
        } else {
            this.openness = this.openness_target;
        }

        if (this.awake) {
            let blink_chance = 1 / (60 * this.blink_period);
            if (randfloat(0, 1) < blink_chance) {
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
        let probability = this.awake ? this.notice_chance : this.wakeup_chance;
        probability *= event.severity;
        if (randfloat(0, 1) < probability){
            this.wake(event.x, event.y);
            return true;
        }
        return false;
    }

    blink() {
        this.openness = 0.0;
        this.attention_target = 0.0;
        this.events.new.push({x: this.x, y: this.y, id: this.id, severity: 0.5});
    }

    wake(x, y) {
        if (!this.awake) {
            this.events.new.push({x: this.x, y: this.y, id: this.id, severity: 1.0});
            this.awake_time = 0;
            this.awake = true;
            this.openness_target = 1.0;
        }

        this.attention_target = 1.0;
        this.look_dir = Math.atan2(y - this.y, x - this.x);
    }

    sleep() {
        if (this.awake) {
            this.events.new.push({x: this.x, y: this.y, id: this.id, severity: 0.2});
        }

        this.attention_target = 0.0;
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

        // draw iris
        let dx = Math.cos(this.look_dir) * (this.size - this.iris_size) * 0.5 * this.attention
        let dy = Math.sin(this.look_dir) * (this.size - this.iris_size) * 0.5 * this.attention
        this.ctx.beginPath()
        this.ctx.arc(x + dx, y + dy, this.iris_size / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = 'hsl(' + this.hue + ', 45%, 38%)';
        this.ctx.fill();

        // draw pupil
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
    }

    draw(ctx) {
        if (this.rerender) {
            this.render_eye();
            this.rerender = false;
        }
        if (this.openness < 0.01) {
            return;
        }
        ctx.drawImage(this.canvas, this.x - this.size / 2, this.y - this.size / 2);
    }
}