var time = 0;
var bursts = 0;
var burstsize = 3;
var burstdelay = 30;
var count = 0;
var alive = 0;
var lastTime = Date.now();
var frameCount = 0;
var frameRate = 0;
var width = 1;
var height = 1;
var updateid = 0;
var emitters = [];
var app = {};

////

var code1 = "";
var code2 = "";
let slider1 = document.getElementById("s1");
let output1 = document.getElementById("st1");
let fpsText = document.getElementById("fps");
let particlesText = document.getElementById("particles");
output1.innerHTML = slider1.value; 
slider1.oninput = function() {
    output1.innerHTML = this.value;
    burstsize = this.value;
}
let slider2 = document.getElementById("s2");
let output2 = document.getElementById("st2");
output2.innerHTML = slider2.value; 
slider2.oninput = function() {
    output2.innerHTML = this.value;
    burstdelay = this.value;
}

////

function run(obj) {
    obj.x += Math.cos(obj.rotation + Math.PI / 2) * obj.speed;
    obj.y += Math.sin(obj.rotation + Math.PI / 2) * obj.speed;
}

function move(obj, distance, direction) {
    obj.x += Math.cos(direction + Math.PI / 2) * speed;
    obj.y += Math.sin(direction + Math.PI / 2) * speed;
}

function rgbToHex(r, g, b) {
    return ((r << 16) | (g << 8) | b);
}

function makeShape(r, g, b) {
    let shape = new PIXI.Graphics();
    shape.beginFill(rgbToHex(r, g, b));
    shape.drawCircle(0, 0, 5);
    shape.endFill();
    return shape;
}

function updateShape(shape, r, g, b) {
    shape.clear();
    shape.beginFill(rgbToHex(r, g, b));
    shape.drawCircle(0, 0, 5);
    shape.endFill();
    return shape;
}

class Particle {
    constructor(shape, behavior) {
        this.i = 0;
        this.shape = shape;
        this.r = this._r = 0;
        this.g = this._g = 0;
        this.b = this._b = 0;
        this.alpha = 1;
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.speed = 0;
        this.behavior = behavior;
        this.life = 3000;
        this.xscale = 1;
        this.yscale = 1;
        this.shape.x = this.x;
        this.shape.y = this.y;
    }

    update() {
        this.behavior(this);
        if(this.r != this._r || this.g != this._g || this.b != this._b) {
            this.shape = updateShape(this.shape, this.r, this.g, this.b);
        }
        this.shape.x = this.x;
        this.shape.y = this.y;
        this.shape.scale.x = this.xscale;
        this.shape.scale.y = this.yscale;
        this.shape.rotation = this.rotation;
        this.shape.alpha = this.alpha;
        this.zIndex = this.z;
        this.life--;
        if (this.life <= 0) {
            app.stage.removeChild(this.shape);
        }
        run(this);
        this._r = this.r;
        this._g = this.g;
        this._b = this.b;
    }
}

class Emitter {
    constructor(create) {
        this.create = create;
        this.timer = 0;
        this.particles = [];
    }

    update() {
        this.timer++;
        if (this.timer >= burstdelay) {
            bursts++;
            this.timer = 0;
            for (let i = 0; i < burstsize; i++) {
                count += 1;
                let newParticle = this.create();
                app.stage.addChild(newParticle.shape);
                this.particles.push(newParticle);
            }
        }
        alive = app.stage.children.length;
        this.particles.forEach(particle => particle.update());
    }
}

function step(p) {
    eval(code1);
}

function init() {
    let newShape = makeShape(50, 250, 100);
    let p = new Particle(newShape, step);
    p.i = count;
    eval(code2);
    return p;
}

function update() {
    emitters.forEach(emitter => emitter.update());
    updateid = requestAnimationFrame(update);
    time++; 

    let currentTime = Date.now();
    let deltaTime = currentTime - lastTime;
    frameCount++;
    if (deltaTime >= 1000) {
        frameRate = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        fpsText.innerText = frameRate;
    }
    particlesText.innerText = alive;
}

function ParticleCanvas(element, w, h) {
    app = new PIXI.Application({
        width: w,
        height: h,
        backgroundColor: 0xffffff,
    });
    width = w;
    height = h;
    app.stage.sortableChildren = true;
    element.appendChild(app.view);
}

function start(c1, c2) {
    app.stage.removeChildren();
    code1 = c1;
    code2 = c2;
    time = 0; 
    bursts = 0; 
    count = 0;

    emitters = [];
    let emitter = new Emitter(init);
    emitters.push(emitter);
    update();
}
