// Small areas of symmetry
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let particle_systems;

// initialize config with default values
let config = {
    x: 300,
    y: 300,
    n_particles: 10,
    acceleration: 1,
    lifetime: 30,
    damping: 0.2,
    mirror_angle: Math.PI / 2,
    hue: 0,
    hue_variance: 60
};

let config_limits = {
    n_particles: [5, 25, 'int'],
    acceleration: [0.8, 1.2, 'float'],
    damping: [0.1, 0.6, 'float'],
    hue: [0, 360, 'int']
};

initialize();

function draw(lifetime) {
    if (lifetime > 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (const ps of particle_systems) {
            ps.update();
        }

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (const ps of particle_systems) {
            ps.draw(ctx);
        }
        ctx.restore();

        requestAnimationFrame(function () {
            draw(lifetime - 1);
        });
    }
}

function initialize(){
    particle_systems = new Array(25);
    for (let iy = 0; iy < 5; iy++) {
        for (let ix = 0; ix < 5; ix++) {
            randomize_config(config, config_limits);
            config.x = canvas.width / 10 + ix * canvas.width / 5;
            config.y = canvas.height / 10 + iy * canvas.height / 5;
            let i = iy * 5 + ix;
            particle_systems[i] = new ParticleSystem(config);
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(60);
}

function randomize() {
    set_random_seed(get_random_seed());
    initialize();
}