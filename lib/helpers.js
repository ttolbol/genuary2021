function map_range(val, in_min, in_max, out_min, out_max){
    let out = (val - in_min) / (in_max - in_min);
    out *= out_max - out_min;
    out += out_min;
    return out
}

function deg2rad(deg) {
  return deg * Math.PI / 180;
}

function randint(a, b){
    let out = a + Math.random() * (b - a);
    return Math.round(out);
}

function randfloat(a, b){
    return a + Math.random() * (b - a);
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
    return config;
}