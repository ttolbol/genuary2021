// Make something human.
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// initialize config with default values
let config = {
    size: 16,
    separation: 24,
    pupil_size: 9,
    blink_period: 5,
    awake_duration: 10,
    x: 300,
    y: 300,
    hue: 218,
    wakeup_chance: 0.01,
    notice_chance: 0.5,
    damping: 0.95,
    blink_speed: 0.1,
    attention_radius: 600
};

let config_limits = {
    size: [12, 20, 'float'],
    separation: [10, 32, 'float'],
    pupil_size: [0.4, 0.7, 'float'],
    x: [32, 768, 'float'],
    y: [32, 568, 'float'],
    hue: [0, 360, 'float'],
    blink_period: [5, 25, 'float'],
    awake_duration: [5, 20, 'float']
};

let eyes;
let events;
randomize();

function draw() {
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let n_awake = 0;
    for (const eye of eyes){
        eye.update();
        if (eye.awake){
            n_awake++;
        }
        eye.draw(ctx);
    }

    while (n_awake < 5){
        let idx = randint(0, eyes.length-1);
        if (!eyes[idx].awake) {
            eyes[idx].wake(randfloat(0, canvas.width), randfloat(0, canvas.height));
            n_awake++;
        }
    }

    events.old = events.new;
    events.new = [];
    window.requestAnimationFrame(draw);
}

function randomize(){
    set_random_seed(get_random_seed());
    eyes = [];
    events = {old: [], new: []};
    let retries = 0;
    while(eyes.length < 60 && retries < 100){
        randomize_config(config, config_limits);
        let new_eye = new Eyes(config, eyes.length, events);
        let add = true;
        for(let i = 0; i < eyes.length; i++){
            let dx = new_eye.x - eyes[i].x;
            let dy = new_eye.y - eyes[i].y;
            let dist = Math.sqrt(dx ** 2 + dy **2);
            if (dist < 80){
                add = false;
                break;
            }
        }
        if (add) {
            eyes.push(new_eye);
        } else {
            retries++;
        }
    }
}

draw();