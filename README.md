# Main


## P5.js setup
> sets up the simulation

populates the random particles in the particles array

 

---

## P5.js draw
> animation loop

draws the particles and records the animation

 

---
---
# Particle


## Particle class
> Class used ot model particles in the flock simulation

### Inputs
- float x: x coordinate of the particle;
 - float y: y coordinate of the particle;
 - float vx: x component of the velocity of the particle;
 - float vy: y component of the velocity of the particle;
 - string c: color (in hex);
 - (optional) float r: radius of the particle;

 
|Field Name|Description|
|:---:|:---:|
|**This.p**|position of the particle|
|**This.v**|velocity of the particle|
|**This.color**|color of the particle|
|**This.r**|radius of the particle|

---

## Particle::draw
> draws the particle on the canvas

the particles will be draw as colored circles

 

---

## Particle::move
> updates the position of the particle based on its velocity



```c
this.p.x += this.v.x;
this.p.y += this.v.y;
```
 

---

## Particle::follow
> computes the alignment, cohesion and separation for the particle based on ist neighbourhood

check [Boids](https://en.wikipedia.org/wiki/Boids) to understand why these computations are needed.
### Inputs
- Quadtree particles: quadtree that holds all the particles of the simulation;
 - float threshold: distance from a particle within which another particle is considered part of the neighbourhood;
 - (optional) list weights: list of 3 weights used to balance the effects of the alignment, cohesion and separation;

 

---

## Particle::update
> updates the particle

computes and applies the alignment, cohesion and separation behaviours and the moves the particle and draws it.
### Inputs
- list particles: list of particles used for the flock simulation;
 - float threshold: threshold used for the flock simulation;
 - (optional) list weights: list of weights used for the flock simulation;


```c
this.follow(particles, threshold, weights);
this.move();
this.draw();
```
 

---
---
# Quadtree


## Rect class
> class used to define spacial boundaries for the Quadtree class

it simply holds two points to define a rectangle: point A is the top-left vertex while point B is the bottom-right vertex.
 This class also provides two utility methods: 
 - intersects: tells if two rectangles intersect;
 - contains: tells if a point is contained in the rectangle.
### Inputs
- float ax: x coordinate of point A;
 - float ay: y coordinate of point A;
 - float bx: x coordinate of point B;
 - float by: y coordinate of point B;

 
|Field Name|Description|
|:---:|:---:|
|**This.a**|coordinates of point A (top-left)|

|**This.b**|coordinates of point B (bottom-right)|

|**This.w**|width of the rectangle|

|**This.h**|height of the rectangle|

---

## Quadtree class
> Quadtree data structure used to ease up the flock behaviour computations

This data structure subdivides (in this case) the canvas in smaller sections so that only part of all the entities in the flock simulation will be considered in the distance check
### Inputs
- Rect rect: rectangle that defines the area covered by the Quadtree;
 - (optional) int capacity: capacity of the Quadtree before its division;
 - (optional) bool limit_area: boolean used to decide if the division of the Quadtree has to be stopped if its area is less than 1;

 
|Field Name|Description|
|:---:|:---:|
|**This.divided**|boolean used to state if the Quadtree has been divided|

|**This.children**|javascript object containing the 4 Quadtrees in which the Quadtree will be split if the data exceeds the capacity|

|**This.data**|list of elements that the Quadtree holds if it's not split|

---

## Quadtree::insert
> inserts data in the Quadtree

This method checks if the point that has to be inserted is in the area covered by the Quadtree, if this is true and the data that the Quadtree holds does not exceed the capacity, the point will be inserted in the data list, otherwise the Quadtree will be split and its data will be given to its children: the point will be inserted in one of the children just now created.
### Inputs
- Particle point: it's the point that will be inserted. It does not have to be a Particle, it just needs to ave a position p;


```c
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
```
 

---

## Quadtree::query
> given a range, return all the data in that range

given a range as a rectangle, the method will query all the Quadtrees to find the data within the rectangle
### Inputs
- Rect area: rectangle target of the query;

### Outputs
- list queried: list that holds the result of the query
 

---
---

generated with [EasyGen](http://easygen.altervista.org/) - [On Github](https://github.com/dede-amdp/easygen).
