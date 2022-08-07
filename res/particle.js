/* #@
@name: Particle class
@brief: Class used ot model particles in the flock simulation
@inputs:
- float x: x coordinate of the particle;
- float y: y coordinate of the particle;
- float vx: x component of the velocity of the particle;
- float vy: y component of the velocity of the particle;
- string c: color (in hex);
- (optional) float r: radius of the particle;
@this.p: position of the particle
@this.v: velocity of the particle
@this.color: color of the particle
@this.r: radius of the particle
@# */
class Particle {
    constructor(x, y, vx, vy, c, r = 2) {
        this.p = {};
        this.v = {};
        this.p.x = x;
        this.p.y = y;
        this.v.x = vx;
        this.v.y = vy;
        this.color = c;
        this.r = r;
    }

    /* #@
    @name: Particle::draw
    @brief: draws the particle on the canvas
    @notes: the particles will be draw as colored circles
    @# */
    draw() {
        noStroke();
        fill(this.color);
        circle(this.p.x, this.p.y, this.r);
    }

    /* #@
    @name: Particle::move
    @brief: updates the position of the particle based on its velocity
    @# */
    move() {
        /* #@codestart@# */
        this.p.x += this.v.x;
        this.p.y += this.v.y;
        /* #@codeend@# */
        if (this.p.x >= width) this.p.x = 1;
        if (this.p.x <= 0) this.p.x = width - 1;
        if (this.p.y >= height) this.p.y = 1;
        if (this.p.y <= 0) this.p.y = height - 1;
    }

    /* #@
    @name: Particle::follow
    @brief: computes the alignment, cohesion and separation for the particle based on ist neighbourhood
    @notes: check [Boids](https://en.wikipedia.org/wiki/Boids) to understand why these computations are needed.
    @inputs:
    - Quadtree particles: quadtree that holds all the particles of the simulation;
    - float threshold: distance from a particle within which another particle is considered part of the neighbourhood;
    - (optional) list weights: list of 3 weights used to balance the effects of the alignment, cohesion and separation;
    @# */
    follow(particles, threshold, weights = [0.3, 0.3, 0.3]) {
        // compute alignment, cohesion and separation for the particles within a threshold
        if (particles.data.length == 0 && !particles.divided) return; // if the quadtree is empty
        let n_particles = 0; // number of particles in the neighbourhood
        // alignment, cohesion and separation vectors
        let alignment = { x: 0, y: 0 };
        let cohesion = { x: 0, y: 0 };
        let separation = { x: 0, y: 0 };
        // area to check for the neighbourhood
        let area = new Rect(this.p.x - threshold,
            this.p.y - threshold,
            this.p.x + threshold,
            this.p.y + threshold);
        let neighbours = particles.query(area);
        for (let p of neighbours) {
            if (p != this) {
                let dx = this.p.x - p.p.x;
                let dy = this.p.y - p.p.y;
                let distance = dx * dx + dy * dy;
                if (distance < threshold * threshold) {
                    // compute alignment
                    alignment.x += p.v.x;
                    alignment.y += p.v.y;
                    // compute cohesion
                    cohesion.x += p.p.x;
                    cohesion.y += p.p.y;
                    //compute separation
                    separation.x += p.p.x - this.p.x;
                    separation.y += p.p.y - this.p.y;
                    n_particles += 1;
                }
            }
        }
        if (n_particles != 0) {
            alignment.x /= n_particles;
            alignment.y /= n_particles;
            cohesion.x /= n_particles;
            cohesion.y /= n_particles;
            separation.x /= n_particles;
            separation.y /= n_particles;

            cohesion.x -= this.p.x;
            cohesion.y -= this.p.y;
            separation.x *= -1;
            separation.y *= -1;

            // apply alignment, cohesion and separation to the velocity of the particle
            this.v.x += weights[0] * alignment.x + weights[1] * cohesion.x + weights[2] * separation.x;
            this.v.y += weights[0] * alignment.y + weights[1] * cohesion.y + weights[2] * separation.y;
        }

        this.v.x += Math.random() * 2 - 1; // add a random component
        this.v.y += Math.random() * 2 - 1; // add a random component
        // normalize vector
        let velocity = Math.sqrt(this.v.x * this.v.x + this.v.y * this.v.y);
        this.v.x /= velocity;
        this.v.y /= velocity;
        // clamp vector to the max_speed constant defined in the main.js file
        this.v.x *= max_speed;
        this.v.y *= max_speed;
    }

    /* #@
    @name: Particle::update
    @brief: updates the particle
    @notes: computes and applies the alignment, cohesion and separation  behaviours and the moves the particle and draws it.
    @inputs:
    - list particles: list of particles used for the flock simulation;
    - float threshold: threshold used for the flock simulation;
    - (optional) list weights: list of weights used for the flock simulation;
    @# */
    update(particles, threshold, weights = [0.3, 0.3, 0.3]) {
        /* #@codestart@# */
        this.follow(particles, threshold, weights);
        this.move();
        this.draw();
        /* #@codeend@# */
    }
}