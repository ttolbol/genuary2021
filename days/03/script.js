// Make something human.
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// initialize config with default values
let config = {
    size: 16,
    pupil_size: 4,
    iris_size: 9,
    blink_period: 5,  // average time between blinks (seconds)
    awake_duration: 10,
    x: 300,
    y: 300,
    hue: 218,
    wakeup_chance: 0.05,
    notice_chance: 0.3,
    damping: 0.95,
    blink_speed: 0.1,
    attention_radius: 90
};

let config_limits = {
    size: [12, 20, 'float'],
    x: [32, 768, 'float'],
    y: [32, 568, 'float'],
    hue: [0, 360, 'float'],
    awake_duration: [5, 20, 'float']
};

let eyes;
let events;
randomize();

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < eyes.length; i++){
        let eye = eyes[i];
        eye.update();
        eye.draw(ctx);
    }

    if (events.new.length === 0){
        let all_asleep = true;
        for (let i = 0; i < eyes.length; i++) {
            let eye = eyes[i];
            if (eye.awake){
                all_asleep = false;
                break;
            }
        }
        if (all_asleep){
            let idx = randint(0, eyes.length-1);
            eyes[idx].wake(randfloat(0, canvas.width), randfloat(0, canvas.height));
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
    while(eyes.length < 100){
        randomize_config(config, config_limits);
        let new_eye = new Eyes(config, eyes.length, events);
        let add = true;
        for(let i = 0; i < eyes.length; i++){
            let dx = new_eye.x - eyes[i].x;
            let dy = new_eye.y - eyes[i].y;
            let dist = Math.sqrt(dx ** 2 + dy **2);
            if (dist < 30){
                add = false;
                break;
            }
        }
        if (add) {
            eyes.push(new_eye);
        }
    }
}

draw();