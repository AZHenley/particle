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

function restart() {
    code1 = document.getElementById('tb1').value;
    code2 = document.getElementById('tb2').value;
    cancelAnimationFrame(updateid);
    start(code1, code2);
}

function copyToClipboard() {
    var burstSize = document.getElementById('st1').innerHTML;
    var burstDelay = document.getElementById('st2').innerHTML;
    var updateEvent = document.getElementById('tb1').value;
    var initEvent = document.getElementById('tb2').value;
    var str = "Burst size: " + burstSize + "\nBurst delay: " + burstDelay + "\n\nUpdate event:\n" + updateEvent + "\n\nInit event:\n" + initEvent;
    
    navigator.clipboard.writeText(str).then(function() {
        console.log('Copied to clipboard.');
    }, function(err) {
        console.error('Could not copy: ', err);
    });
}

var presets = [
    {
        value: "option1",
        text: "Penta Clover",
        s1: 5,
        s2: 10,
        tb1: `p.rotation += p.rot;
if(p.life % 20 == 0) { p.g -= 1; p.b+=1; p.a-=0.01;}
if(p.life<100){p.a/=1.05; p.xscale/=1.05; p.yscale/=1.05;}`,
        tb2: `p.life = 1000;
p.rot=0.02+(Math.sin(time/200)/25);
p.x = 300; p.y = 200;
p.r = (0);
p.g = (175+Math.sin(time/400)*50);
p.b = (25+Math.sin(time/2000)*25);
p.speed = 1.50;
p.rotation=(6.28-((6.28/5)*(p.i%5)))-time/100;`
    },
    {
        value: "option2",
        text: "Oppenheimer",
        s1: 10,
        s2: 3,
        tb1: `p.rotation += p.rot;
if(p.life % 20 == 0) { p.g/=1.02; p.r/=1.01; p.a-=0.05;}
if(p.life<50){p.a/=1.05; p.xscale/=1.05; p.yscale/=1.05;}`,
        tb2: `p.life = 1000;
    p.rot=0.02+(Math.sin(time/200)/25)+(Math.sin(time/1975)/50);
    p.x = 300; p.y = 200;
    p.r = 200+Math.random()*50;//(0);
    p.g = Math.random()*25;//(175+Math.sin(time/400)*50);
    p.b = Math.random()*1;//(25+Math.sin(time/2100)*25);
    p.speed = 1.25+(Math.sin(time/77)/3);
    p.rotation=(6.28-((6.28/10)*(p.i%10)))-time/(100+(Math.sin(time/1250)*50));
    p.xscale=p.yscale=0.65;`
    },
    {
        value: "option3",
        text: "Radiance",
        s1: 10,
        s2: 3,
        tb1: `p.rotation+=0.01;
p.g += 0.5; // Gradually change color to cyan over time
if(p.life % 50 == 0) {p.a -= 0.02;} // Slowly fade out
p.xscale /= 1.01; p.yscale /= 1.01; // Decrease size over time`,
        tb2: `p.life = 400; 
p.rot = (p.i * Math.PI * 2 / burstsize) + time/700; // Ensures rotation is spread evenly
if(bursts%30==0) {p.rot = 2* Math.PI * Math.random();}
p.x = 300; p.y = 200; // The center of the "spell"
p.r = 150 + Math.random() * 105; // Start with a purple color
p.g = 0;
p.b = 150 + Math.random() * 105;
p.speed = 2; // Spread particles evenly in a circular pattern
p.rotation = p.rot; // Assign the calculated rotation
p.xscale = p.yscale = 0.65; // Initial size of particles`
    }
];

window.onload = function() {
    ParticleCanvas(document.getElementById('display'), 600, 400, "", "");
    var select = document.getElementById("preset-select");

    for (var i = 0; i < presets.length; i++) {
        var option = document.createElement("option");
        option.value = presets[i].value;
        option.text = presets[i].text;
        select.add(option);
    }

    presetSelected();
}

function presetSelected() {
    var select = document.getElementById("preset-select");
    var selectedPreset = presets.find(function(preset) {
        return preset.value === select.value;
    });

    if (selectedPreset) {
        document.getElementById("s1").value = selectedPreset.s1;
        document.getElementById("st1").innerText = selectedPreset.s1;
        burstsize = selectedPreset.s1;
        document.getElementById("s2").value = selectedPreset.s2;
        document.getElementById("st2").innerText = selectedPreset.s2;
        burstdelay = selectedPreset.s2;
        document.getElementById("tb1").value = selectedPreset.tb1;
        document.getElementById("tb2").value = selectedPreset.tb2;
    }
}