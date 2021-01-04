// Rule 30
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let arr = Array(50).fill(false);
let config_cube = {hue: 0, alpha: 0.1, rounds: 10};
let config_circle = {hue: 120, alpha: 0.1, rounds: 10};

initialize();

function draw_circle(ctx, x, y, r, config) {
    config = config ? config : {};
    const segments = config.segments !== undefined ? config.segments : 32;
    const randomness = config.randomness !== undefined ? config.randomness : 0.08;
    const rounds = config.rounds !== undefined ? config.rounds : 20;
    const alpha = config.alpha !== undefined ? config.alpha : 0.1;
    const hue = config.hue !== undefined ? config.hue : randint(0, 360);
    const sat = config.sat !== undefined ? config.sat : 60;
    const lum = config.lum !== undefined ? config.lum : 40;
    ctx.strokeStyle = 'hsla(' + hue + ', ' + sat + '%, ' + lum + '%, ' + alpha + ')';

    // clear background
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF';
    ctx.fill();

    // draw circle
    for (let round = 0; round < rounds; round++) {
        ctx.beginPath();
        for (let i = 0; i < segments; i++) {
            let a = i * (Math.PI * 2 / segments);
            let dx = Math.cos(a) * r * randfloat(1 - randomness, 1 + randomness);
            let dy = Math.sin(a) * r * randfloat(1 - randomness, 1 + randomness);
            if (i === 0) {
                ctx.moveTo(x + dx, y + dy);
            } else {
                ctx.lineTo(x + dx, y + dy);
            }
        }
        ctx.closePath();
        ctx.stroke();
    }
}

function draw_cube(ctx, x, y, r, config) {
    config = config ? config : {};
    const randomness = config.randomness !== undefined ? config.randomness : 0.06;
    const rounds = config.rounds !== undefined ? config.rounds : 20;
    const alpha = config.alpha !== undefined ? config.alpha : 0.05;
    const hue = config.hue !== undefined ? config.hue : randint(0, 360);
    const sat = config.sat !== undefined ? config.sat : 60;
    const lum = config.lum !== undefined ? config.lum : 40;
    ctx.strokeStyle = 'hsla(' + hue + ', ' + sat + '%, ' + lum + '%, ' + alpha + ')';

    const vertices = [
        [Math.cos(-Math.PI / 6), Math.sin(-Math.PI / 6)],
        [Math.cos(Math.PI + Math.PI / 6), Math.sin(Math.PI + Math.PI / 6)],
        [Math.cos(Math.PI / 2), Math.sin(Math.PI / 2)]
    ];

    let rand = () => r * randfloat(1 - randomness, 1 + randomness) - r;

    // clear background
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
        let dx, dy;
        dx = vertices[i][0] * r;
        dy = vertices[i][1] * r;
        if (i === 0) {
            ctx.moveTo(x + dx, y + dy);
        } else {
            ctx.lineTo(x + dx, y + dy);
        }
        dx = (vertices[i][0] + vertices[(i + 1) % 3][0]) * r;
        dy = (vertices[i][1] + vertices[(i + 1) % 3][1]) * r;
        ctx.lineTo(x + dx, y + dy);
        dx = vertices[(i + 1) % 3][0] * r;
        dy = vertices[(i + 1) % 3][1] * r;
        ctx.lineTo(x + dx, y + dy);
    }
    ctx.closePath();
    ctx.fillStyle = '#FFF';
    ctx.fill();

    // draw cube
    for (let round = 0; round < rounds; round++) {
        for (let i = 0; i < 3; i++) {
            let dx, dy;
            ctx.beginPath();
            ctx.moveTo(x + rand(), y + rand());
            dx = vertices[i][0] * r + rand();
            dy = vertices[i][1] * r + rand();
            ctx.lineTo(x + dx, y + dy);
            dx = (vertices[i][0] + vertices[(i + 1) % 3][0]) * r + rand();
            dy = (vertices[i][1] + vertices[(i + 1) % 3][1]) * r + rand();
            ctx.lineTo(x + dx, y + dy);
            dx = vertices[(i + 1) % 3][0] * r + rand();
            dy = vertices[(i + 1) % 3][1] * r + rand();
            ctx.lineTo(x + dx, y + dy);
            ctx.closePath();
            ctx.stroke();
        }
    }
}

function rule30(arr) {
    let new_arr = Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
        let left_cell = arr[i - 1 < 0 ? arr.length - 1 : i - 1];
        let central_cell = arr[i];
        let right_cell = arr[i + 1 >= arr.length ? 0 : i + 1];
        new_arr[i] = (left_cell ^ (central_cell || right_cell));
    }
    return new_arr;
}

function draw(ctx, arr, yi) {
    yi = yi ? yi : 0;
    if (yi === 0) {
        ctx.fillStyle = '#FFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    const r = canvas.width / 30;
    const dx = canvas.width / 22;
    const dy = 0.4 * dx;

    arr = rule30(arr);
    config_cube.hue = (config_cube.hue + 360 / 38) % 360;
    config_circle.hue = (config_circle.hue + 360 / 38) % 360;
    for (let xi = 0; xi < arr.length; xi++) {
        let x = canvas.width - (xi * dx - yi * dx);
        let y = yi * dy + xi * dy - dy * 20;
        if (arr[xi]) {
            draw_cube(ctx, x, y, r, config_cube);
        } else {
            draw_circle(ctx, x, y, 0.8 * r, config_circle);
        }
    }
    if (yi < 38) {
        requestAnimationFrame(function () {
            draw(ctx, arr, yi + 1);
        });
    }
}

function initialize(){
    for (let i = 0; i < arr.length; i++) {
        arr[i] = chance.bool();
    }
    config_cube.hue = randint(0, 360)
    config_circle.hue = (config_cube.hue + 90) % 360;
    draw(ctx, arr);
}

function randomize() {
    set_random_seed(get_random_seed());
    initialize();
}