/* === GLOBAL DEFINITIONS === */
let recording = false; // states if the animation has to be recorded
let video_duration = 600; // duration of the video
let index = 0; // frame number
let cnv, particles = []; // canvas and particle array initialization
const max_speed = 2; // max_speed parameter for the particles
// array of color arrays so that different palettes can be used simply by changing the index
const colors = [["006BA6", "0496FF", "FFBC42", "D81159", "8F2D56"],
["540D6E", "EE4266", "FFD23F", "3BCEAC", "0EAD69"],
["3AB795", "A0E8AF", "86BAA1", "FFCF56", "177E89"]];
const all_colors = [].concat.apply([], colors); // array of all the colors
const bkgc0 = "#171738"; // first (dark) background color
const bkgc1 = "#EDEAD0" // second (light) background color

/* #@
@name: P5.js setup
@brief: sets up the simulation
@notes: populates the random particles in the particles array
@# */
function setup() {
    cnv = createCanvas(1080, 1080);
    for (let i = 0; i < 1000; i++) {
        /* in the comments are shown some alternatives, just for fun 😎*/
        let x = Math.random() * width;//Math.random() * width / 2 + width / 4;
        let y = Math.random() * height;//Math.random() * height / 2 + height / 4;
        let vx = Math.random() * 2 - 1;//(width / 2 - x) / (3 * width / 4);
        let vy = Math.random() * 2 - 1;//(height / 2 - y) / (3 * height / 4);
        particles.push(new Particle(x, y, vx, vy, "#" + random(colors[2]), 10));
    }
    background(bkgc0);
}

/* #@
@name: P5.js draw
@brief: animation loop
@notes: draws the particles and records the animation
@# */
function draw() {
    if (index == 0 && recording) capturer.start(); // start campturing the frames
    let qtree = new Quadtree(new Rect(0, 0, width, height), 4);
    background(bkgc0 + "11");
    for (let p of particles) {
        qtree.insert(p);
    }
    for (let p of particles) p.update(qtree, 20, [0.3, 0.3, 0.3]);
    if (index < video_duration && recording) capturer.capture(canvas); // save frame
    else if (recording) { capturer.save(); capturer.stop(); noLoop(); }// stop the animation and save it
    index++;
}