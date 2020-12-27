function map_range(val, in_min, in_max, out_min, out_max){
    let out = (val - in_min) / (in_max - in_min);
    out *= out_max - out_min;
    out += out_min;
    return out
}

function deg2rad(deg) {
  return deg * Math.PI / 180;
}