// TRIPLE NESTED LOOP
const img = document.getElementById('canvas');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 600;

// initialize config with default values
let config = {
    start_angle: 0,
    starts: 3,
    strands: 180,
    steps: 300,
    turns: 3,
    width: 45,
    twists: 15,
    twirl: 0.3,
    hue_start: 70,
    hue_variance: 150
};

let config_limits = {
    start_angle: [0, 360, 'float'],
    starts: [1, 6, 'int'],
    turns: [0, 5, 'float'],
    width: [15, 60, 'float'],
    twists: [0, 30, 'float'],
    twirl: [-1, 1, 'float'],
    hue_start: [0, 360, 'float'],
    hue_variance: [0, 360, 'float']
};

randomize_config(config, config_limits);

function draw(ctx, config) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = 'lighter';

    let alpha = 10 / config.strands;
    for (let strand = 0; strand < config.strands; strand++) {
        let hue = (config.hue_start + config.hue_variance * (strand / config.strands)) % 360;
        ctx.strokeStyle = 'hsla(' + hue + ', 100%, 50%, ' + alpha + ')'; // set strand color
        for (let start = 0; start < config.starts; start++) {
            ctx.beginPath();
            for (let step = 0; step < config.steps; step++) {
                let phase = config.start_angle + 360 * start / config.starts;
                let offset = config.width * strand / config.strands - config.width * 0.5;
                let deg = config.turns * 360 * (step / config.steps);
                deg += phase;
                deg += offset;
                let r = sqrt2 * (canvas.width / 2) * step / config.steps;

                let twisting = Math.sin(config.twists * Math.PI * 2 * step / config.steps);
                r += twisting * deg2rad(config.width) / (2 * Math.PI) * r;
                deg += twisting * offset * config.twirl;

                let x = canvas.width / 2 + Math.cos(deg2rad(deg)) * r;
                let y = canvas.height / 2 + Math.sin(deg2rad(deg)) * r;

                if (step === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }
    }
    img.src = canvas.toDataURL();
}

function randomize(){
    set_random_seed(get_random_seed());
    randomize_config(config, config_limits);
    draw(ctx, config);
}

draw(ctx, config);