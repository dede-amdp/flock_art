let recording = false;
let videoDuration = 600;
let index = 0;
let cnv, particles = [];
const max_speed = 2;
const colors = [["006BA6", "0496FF", "FFBC42", "D81159", "8F2D56"],
["540D6E", "EE4266", "FFD23F", "3BCEAC", "0EAD69"],
["3AB795", "A0E8AF", "86BAA1", "FFCF56", "177E89"]];
const all_colors = [].concat.apply([], colors);
const bkgc0 = "#171738";
const bkgc1 = "#EDEAD0"

function setup() {
    cnv = createCanvas(1080, 1080);
    for (let i = 0; i < 1000; i++) {
        let x = Math.random() * width;//Math.random() * width / 2 + width / 4;
        let y = Math.random() * height;//Math.random() * height / 2 + height / 4;
        let vx = Math.random() * 2 - 1;//(width / 2 - x) / (3 * width / 4);
        let vy = Math.random() * 2 - 1;//(height / 2 - y) / (3 * height / 4);
        particles.push(new Particle(x, y, vx, vy, "#" + random(colors[2]), 10));
    }
    background(bkgc0);
}

function draw() {
    if (index == 0 && recording) capturer.start(); // start campturing the frames
    let qtree = new Quadtree(new Rect(0, 0, width, height), 4);
    background(bkgc0 + "11");
    for (let p of particles) {
        qtree.insert(p);
    }
    for (let p of particles) p.update(qtree, 20, [0.3, 0.3, 0.3]);
    if (index < videoDuration && recording) capturer.capture(canvas); // save frame
    else if (recording) { capturer.save(); capturer.stop(); noLoop(); }// stop the animation and save it
    index++;
}