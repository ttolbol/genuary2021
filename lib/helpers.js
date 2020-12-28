let chance = new Chance();
let seed = get_seed_from_url();
set_random_seed(seed);

const sqrt2 = Math.sqrt(2);

function map_range(val, in_min, in_max, out_min, out_max){
    let out = (val - in_min) / (in_max - in_min);
    out *= out_max - out_min;
    out += out_min;
    return out
}

Math.log10 = Math.log10 || function(x) {
  return Math.log(x) * Math.LOG10E;
};

function deg2rad(deg) {
  return deg * Math.PI / 180;
}

function randint(a, b){
    return chance.integer({min: a, max: b});
}

function randfloat(a, b){
    return chance.floating({min: a, max: b});
}

function set_random_seed(new_seed){
    seed = new_seed;
    chance = new Chance(seed);
    const url = new URL(window.location);
    url.searchParams.set('seed', seed);
    window.history.replaceState({}, '', url);
}

function get_random_seed(){
    let seed = '';
    while (seed.length < 12){
        seed += Math.round(Math.random() * 9);  // add a random digit until we have a 12-digit seed
    }
    return seed;
}

function get_seed_from_url(){
    let url = String(window.location);
    let parts = url.split('?');
    if (parts.length > 1){
        let params_str = parts[1];
        let search_params = new URLSearchParams(params_str);
        if (search_params.has('seed')){
            return search_params.get('seed');
        }
    }
    return get_random_seed(); // default to a random seed if none is available in URL
}

function randomize_config(config, config_limits){
    let keys = Object.keys(config_limits);
    for(let i = 0; i < keys.length; i++){
        let key = keys[i];
        let a = config_limits[key][0];
        let b = config_limits[key][1];
        let type = config_limits[key][2];
        if (type === 'float'){
            config[key] = randfloat(a, b);
        } else if (type === 'int'){
            config[key] = randint(a, b);
        }
    }
}