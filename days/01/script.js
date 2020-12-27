const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const sqrt2 = Math.sqrt(2)

config = {
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

function draw(ctx, config) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let start = 0; start < config.starts; start++) {
        for (let strand = 0; strand < config.strands; strand++) {
            ctx.beginPath();
            for (let step = 0; step < config.steps; step++) {
                let phase = 360 * start / config.starts;
                let offset = config.width * strand / config.strands - config.width * 0.5;
                let deg = config.turns * 360 * (step / config.steps);
                deg += phase;
                deg += offset;
                let r = sqrt2 * (canvas.width / 2) * step / config.steps;

                let twisting = Math.sin(config.twists * Math.PI * 2 * step / config.steps);
                r += twisting * deg2rad(config.width) / (2 * Math.PI) * r;
                deg += twisting * offset * config.twirl;

                let x = 300 + Math.cos(deg2rad(deg)) * r;
                let y = 300 + Math.sin(deg2rad(deg)) * r;

                if (step === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            let hue = (config.hue_start + config.hue_variance * (strand / config.strands)) % 360;
            let alpha = 10 / config.strands;
            ctx.strokeStyle = 'hsla(' + hue + ', 100%, 50%, ' + alpha + ')';
            ctx.stroke();
        }
    }
}

draw(ctx, config);