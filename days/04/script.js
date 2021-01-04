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
    lifetime: 60,
    damping: 0.2,
};

let config_limits = {
    x: [0, canvas.width, 'float'],
    y: [0, canvas.height, 'float'],
    n_particles: [5, 25, 'int'],
    acceleration: [0.5, 0.8, 'float'],

};

initialize();

function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let live_systems = false;
    for(const ps of particle_systems){
        ps.update();
        if (ps.alive){
            live_systems = true;
        }
    }

    for(const ps of particle_systems){
        ps.draw(ctx);
    }

    if (live_systems) {
        requestAnimationFrame(function () {
            draw();
        });
    }
}

function initialize(){
    particle_systems = new Array(25);
    for (let i = 0; i < particle_systems.length; i++){
        randomize_config(config, config_limits);
        particle_systems[i] = new ParticleSystem(config);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
}

function randomize() {
    set_random_seed(get_random_seed());
    initialize();
}