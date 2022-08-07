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

    draw() {
        noStroke();
        fill(this.color);
        circle(this.p.x, this.p.y, this.r);
    }

    move() {
        this.p.x += this.v.x;
        this.p.y += this.v.y;
        if (this.p.x >= width) this.p.x = 1;
        if (this.p.x <= 0) this.p.x = width - 1;
        if (this.p.y >= height) this.p.y = 1;
        if (this.p.y <= 0) this.p.y = height - 1;
    }

    follow(particles, threshold, weights = [0.3, 0.3, 0.3]) {

        // alignment, cohesion and separation
        if (particles.data.length == 0 && !particles.divided) return;
        let n_particles = 0;
        let alignment = { x: 0, y: 0 };
        let cohesion = { x: 0, y: 0 };
        let separation = { x: 0, y: 0 };
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
                    alignment.x += p.v.x;
                    alignment.y += p.v.y;
                    cohesion.x += p.p.x;
                    cohesion.y += p.p.y;
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

            this.v.x += weights[0] * alignment.x + weights[1] * cohesion.x + weights[2] * separation.x;
            this.v.y += weights[0] * alignment.y + weights[1] * cohesion.y + weights[2] * separation.y;
        }
        this.v.x += Math.random() * 2 - 1;
        this.v.y += Math.random() * 2 - 1;
        let velocity = Math.sqrt(this.v.x * this.v.x + this.v.y * this.v.y);
        this.v.x /= velocity;
        this.v.y /= velocity;
        this.v.x *= max_speed;
        this.v.y *= max_speed;


    }

    update(particles, threshold, weight) {
        this.follow(particles, threshold, weight);
        this.move();
        this.draw();
    }


}