/* #@
@name: Rect class
@brief: class used to define spacial boundaries for the Quadtree class
@notes: it simply holds two points to define a rectangle: point A is the top-left vertex while point B is the bottom-right vertex.
This class also provides two utility methods: 
- intersects: tells if two rectangles intersect;
- contains: tells if a point is contained in the rectangle.
@inputs:
- float ax: x coordinate of point A;
- float ay: y coordinate of point A;
- float bx: x coordinate of point B;
- float by: y coordinate of point B;
@this.a: coordinates of point A (top-left)
@this.b: coordinates of point B (bottom-right)
@this.w: width of the rectangle
@this.h: height of the rectangle
@# */
class Rect {
    constructor(ax, ay, bx, by) {
        /*
        . A +---------+
            |         |
            +---------+ B
        */
        this.a = { x: ax, y: ay };
        this.b = { x: bx, y: by };
        this.w = this.b.x - this.a.x;
        this.h = this.b.y - this.a.y;
    }

    intersects(other) {
        let side =
            this.a.x > other.b.x ||
            other.a.x > this.b.x;
        if (side) return false;
        let above =
            this.b.y - this.h > other.a.y + other.h ||
            other.b.y - other.h > this.a.y + this.h
        if (above) return false;
        return true;
    }

    contains(point) {
        return (point.p.x > this.a.x &&
            point.p.x < this.b.x &&
            point.p.y > this.a.y &&
            point.p.y < this.b.y);
    }
}


/* #@
@name: Quadtree class
@brief: Quadtree data structure used to ease up the flock behaviour computations
@notes: This data structure subdivides (in this case) the canvas in smaller sections so that only part of all the entities in the flock simulation will be considered in the distance check
@inputs:
- Rect rect: rectangle that defines the area covered by the Quadtree;
- int capacity: capacity of the Quadtree before its division;
- bool limit_area: boolean used to decide if the division of the Quadtree has to be stopped if its area is less than 1;
@this.divided: boolean used to state if the Quadtree has been divided
@this.children: javascript object containing the 4 Quadtrees in which the Quadtree will be split if the data exceeds the capacity
@this.data: list of elements that the Quadtree holds if it's not split
@# */
class Quadtree {
    constructor(rect, capacity = 10, limit_area = false) {
        this.rect = rect;
        this.capacity = capacity;
        this.divided = false;
        this.children = {
            ne: null,
            se: null,
            sw: null,
            nw: null
        };
        this.data = [];
        this.limit_area = limit_area;
    }

    /* #@
    @name: Quadtree::insert
    @brief: inserts data in the Quadtree
    @notes: This method checks if the point that has to be inserted is in the area covered by the Quadtree, if this is true and the data that the Quadtree holds does not exceed the capacity, the point will be inserted in the data list, otherwise the Quadtree will be split and its data will be given to its children: the point will be inserted in one of the children just now created.
    @inputs:
    - Particle point: it's the point that will be inserted. It does not have to be a Particle, it just needs to ave a position p;
    @# */
    insert(point) {
        if (!this.rect.contains(point)) return;
        if (!this.divided) {
            if (this.data.length == this.capacity) {
                if (this.limit_area && (this.rect.w <= 1 && this.rect.h <= 1)) {
                    throw Error(`Reached surface area limit: <w:${this.rect.w},h:${this.rect.h}>\n`);
                    return; // unreachable but better safe than sorry
                }
                this.divided = true;
                let ne_rect, se_rect, sw_rect, nw_rect;
                /* #@codestart@# */
                // Division of the Quadtree when its capacity is exceeded
                // create the boundaries for the Quadtrees
                nw_rect = new Rect(this.rect.a.x, this.rect.a.y, this.rect.a.x + this.rect.w / 2, this.rect.a.y + this.rect.h / 2);
                sw_rect = new Rect(this.rect.a.x, this.rect.a.y + this.rect.h / 2, this.rect.a.x + this.rect.w / 2, this.rect.b.y);
                ne_rect = new Rect(this.rect.a.x + this.rect.w / 2, this.rect.a.y, this.rect.b.x, this.rect.a.y + this.rect.h / 2);
                se_rect = new Rect(this.rect.a.x + this.rect.w / 2, this.rect.a.y + this.rect.h / 2, this.rect.b.x, this.rect.b.y);
                // creation of the Quadrtrees
                this.children.ne = new Quadtree(ne_rect, this.capacity, this.limit_area);
                this.children.nw = new Quadtree(nw_rect, this.capacity, this.limit_area);
                this.children.se = new Quadtree(se_rect, this.capacity, this.limit_area);
                this.children.sw = new Quadtree(sw_rect, this.capacity, this.limit_area);
                // data is distributed to the children
                while (this.data.length > 0) {
                    let p = this.data.pop();
                    this.children.ne.insert(p);
                    this.children.nw.insert(p);
                    this.children.se.insert(p);
                    this.children.sw.insert(p);
                }
                /* #@codeend@# */
            } else {
                this.data.push(point);
                return;
            }
        }
        this.children.ne.insert(point);
        this.children.nw.insert(point);
        this.children.se.insert(point);
        this.children.sw.insert(point);
    }

    /* #@
    @name: Quadtree::query
    @brief: given a range, return all the data in that range
    @notes: given a range as a rectangle, the method will query all the Quadtrees to find the data within the rectangle
    @inputs: 
    - Rect area: rectangle target of the query;
    @outputs:
    - list queried: list that holds the result of the query
    @# */
    query(area) {
        if (!area.intersects(this.rect)) return [];
        if (!this.divided) return this.data;
        let queried = [];
        queried = queried.concat(this.children.ne.query(area));
        queried = queried.concat(this.children.nw.query(area));
        queried = queried.concat(this.children.se.query(area));
        queried = queried.concat(this.children.sw.query(area));
        return queried;
    }
}