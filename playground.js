var editor1 = {};
var editor2 = {};

function restart() {
    code1 = editor1.getValue();
    code2 = editor2.getValue();
    cancelAnimationFrame(updateid);
    start(code1, code2);
}

function copyToClipboard() {
    var burstSize = document.getElementById('st1').innerHTML;
    var burstDelay = document.getElementById('st2').innerHTML;
    var updateEvent = editor1.getValue();
    var initEvent = editor2.getValue();
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
        s2: 4,
        tb1: `p.rotation+=0.01;
p.g += 0.5; // Gradually change color to cyan over time
if(p.life % 50 == 0) {p.a -= 0.02;} // Slowly fade out
p.xscale /= 1.01; p.yscale /= 1.01; // Decrease size over time`,
        tb2: `p.life = 300; 
p.rot = (p.i * Math.PI * 2 / burstsize) + time/700; // Ensures rotation is spread evenly
if(bursts%30==0) {p.rot = 2* Math.PI * Math.random();}
p.x = 300; p.y = 200; // The center of the "spell"
p.r = 150 + Math.random() * 105; // Start with a purple color
p.g = 0;
p.b = 150 + Math.random() * 105;
p.speed = 2; // Spread particles evenly in a circular pattern
p.rotation = p.rot; // Assign the calculated rotation
p.xscale = p.yscale = 0.65; // Initial size of particles`
    },
    {
        value: "option4",
        text: "Ex Machina",
        s1: 10,
        s2: 9,
        tb1: `// Determine behavior based on phase
switch (p.phase) {
    case 0: // Particles explode outwards
        p.speed *= 1.01;
        p.rot += Math.sin(time/1000)/10;
        break;
    case 1: // Particles spiral
        p.rotation += p.rot/10;
        break;
    case 2: // Particles collapse back towards the center
        p.speed *= 0.99;
        p.rot -= Math.sin(time/1000)/10;
        break;
    case 3: // Particles move in a circle
        p.rotation += Math.PI / 100;
        break;
    case 4: // Particles zig-zag
        p.rotation += Math.sin(time/100) / 10;
        break;
}

// Color shifting and scale adjustments vary by phase
switch (p.phase) {
    case 0: // Rapid color shifting
        p.r = 150 + ((Math.sin(time/100)*100 + Math.random()*10)%105);
        p.g = 50 + ((Math.sin(time/200)*200 + Math.random()*10)%205);
        p.b = 50 + ((Math.sin(time/300)*200 + Math.random()*10)%205);
        break;
    case 1: // Slow color shifting
        if(p.life % 50 == 0) {
            p.r = 100 + ((Math.sin(time/1000)*150 + Math.random()*10)%155);
            p.g = 50 + ((Math.sin(time/2000)*200 + Math.random()*10)%205);
            p.b = 100 + ((Math.sin(time/3000)*150 + Math.random()*10)%155);
        }
        break;
    case 2: // Color shifting in reverse
        p.r = 150 + ((Math.cos(time/100)*100 + Math.random()*10)%105);
        p.g = 50 + ((Math.cos(time/200)*200 + Math.random()*10)%205);
        p.b = 50 + ((Math.cos(time/300)*200 + Math.random()*10)%205);
        break;
    case 3: // Colors fade over time
        p.r *= 0.99;
        p.g *= 0.99;
        p.b *= 0.99;
        break;
    case 4: // Random color shifting
        if(p.life % 50 == 0) {
            p.r = 100 + (Math.random() * 155);
            p.g = 50 + (Math.random() * 205);
            p.b = 100 + (Math.random() * 155);
        }
        break;
}

// Scale adjustments
p.xscale *= 0.999;
p.yscale *= 0.999;
p.a -= 0.001;`,
        tb2: `p.life = 1000;
p.rot = (Math.PI * 2 / burstsize) + (time/200) % Math.PI*2; // Vary the initial direction over time
p.x = 300; p.y = 200; // The center
p.r = (100 + Math.sin(time/100)*155)%255; // Colors will change over time
p.g = (100 + Math.sin(time/250)*155)%255;
p.b = (100 + Math.sin(time/400)*155)%255;
p.speed = 2 + Math.sin(time/1000); // Speed will vary over time
p.rotation = (6.28 - ((6.28 / 10) * (p.i % 10))) - time / (100 + (Math.sin(time / 1250) * 50));
p.xscale = p.yscale = 0.5 + Math.abs(Math.sin(time/500)); // Size will vary over time
p.phase = Math.floor(time/100) % 5; // Assign a phase based on the time`
    }
];

window.onload = function() {
    ParticleCanvas(document.getElementById('display'), 600, 400, "", "");
    editor1 = ace.edit("tb1");
    editor1.session.setMode("ace/mode/javascript");
    editor2 = ace.edit("tb2");
    editor2.session.setMode("ace/mode/javascript");
    var select = document.getElementById("preset-select");

    for (var i = 0; i < presets.length; i++) {
        var option = document.createElement("option");
        option.value = presets[i].value;
        option.text = presets[i].text;
        select.add(option);
    }

    select.selectedIndex = 3;
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
        editor1.setValue(selectedPreset.tb1, 1);
        editor2.setValue(selectedPreset.tb2, 1);
    }
    restart()
}