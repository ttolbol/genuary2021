// Rule 30
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);

randomize();

function get_pixel(imgdata, width, x, y){
    let i = y * (width * 4) + x * 4;
    return [imgdata.data[i], imgdata.data[i + 1], imgdata.data[i + 2], imgdata.data[i + 3]]
}

function set_pixel(imgdata, width, x, y, pixel){
    let r = pixel[0];
    let g = pixel[1];
    let b = pixel[2];
    let a = pixel[3];
    let i = y * (width * 4) + x * 4;
    imgdata.data[i] = r;
    imgdata.data[i + 1] = g;
    imgdata.data[i + 2] = b;
    imgdata.data[i + 3] = a;
}

function set_pixel_bool(imgdata, width, x, y, bool){
    if (bool){
        let pixel = [255, 255, 255, 255];
        set_pixel(imgdata, width, x, y, pixel);
    } else {
        let pixel = [0, 0, 0, 255];
        set_pixel(imgdata, width, x, y, pixel);
    }
}

function get_pixel_bool(imgdata, width, x, y){
    if (x < 0){
        x = width + x;
    }
    x = x % width;
    let pixel = get_pixel(imgdata, width, x, y);
    return pixel[0] > 128;
}

function draw(y) {
    y = y ? y : 0;

    if (y === 0) {
        for (let x = 0; x < canvas.width; x++) {
            set_pixel_bool(imgdata, canvas.width, x, 0, chance.bool());
        }
    } else {
        for (let x = 0; x < canvas.width; x++) {
            let left_cell = get_pixel_bool(imgdata, canvas.width, x - 1, y - 1);
            let central_cell = get_pixel_bool(imgdata, canvas.width, x, y - 1);
            let right_cell = get_pixel_bool(imgdata, canvas.width, x + 1, y - 1);
            let new_cell = (left_cell ^ (central_cell || right_cell));
            set_pixel_bool(imgdata, canvas.width, x, y, new_cell);
        }
        ctx.putImageData(imgdata, 0, 0);
    }
    if (y < canvas.height){
        requestAnimationFrame(function() {
            draw(y + 1);
        });
    }
}

function randomize(){
    set_random_seed(get_random_seed());
    draw();
}