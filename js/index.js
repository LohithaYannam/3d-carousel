var radius = 240;
var autorotate = true;
var rotatespeed = -50;
var imgwidth = 120;
var imgheight = 170;
var dragSensitivity = 0.5;

setTimeout(init, 1000);

var odrag = document.getElementById('dragcontainer');
var ospin = document.getElementById('spincontainer');
var aimg = ospin.getElementsByTagName('img');
var ele = [...aimg];

ospin.style.width = imgwidth + "px";
ospin.style.height = imgheight + "px";

var ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

function init(delaytime) {
    for (let i = 0; i < ele.length; i++) {
        ele[i].style.transform = `rotateY(${i * (360 / ele.length)}deg) translateZ(${radius}px)`;
        ele[i].style.transition = "transform 1s";
        ele[i].style.transitionDelay = delaytime || (ele.length - i) / 4 + "s";
        
        // Zoom on click
        ele[i].style.cursor = 'zoom-in';
        ele[i].addEventListener('click', function() {
            if (this.style.transform.includes('scale(1.5)')) {
                this.style.transform = this.style.transform.replace(' scale(1.5)', '');
                this.style.cursor = 'zoom-in';
            } else {
                this.style.transform += ' scale(1.5)';
                this.style.cursor = 'zoom-out';
            }
        });

        // Pause on hover
        ele[i].addEventListener('mouseenter', () => playspin(false));
        ele[i].addEventListener('mouseleave', () => playspin(true));
    }
}

function applyTransform(obj) {
    if (ty > 180) ty = 180;
    if (ty < 0) ty = 0;
    obj.style.transform = `rotateX(${-ty}deg) rotateY(${tx}deg)`;
}

function playspin(yes) {
    ospin.style.animationPlayState = yes ? 'running' : 'paused';
}

var sx, sy, nx, ny, desx = 0, desy = 0, tx = 0, ty = 10;

if (autorotate) {
    var animationName = rotatespeed > 0 ? 'spin' : 'spinrevert';
    ospin.style.animation = `${animationName} ${Math.abs(rotatespeed)}s infinite linear`;
}

odrag.addEventListener('pointerdown', function(e) {
    e.preventDefault();
    sx = e.clientX;
    sy = e.clientY;
    playspin(false);
    
    function handleMove(e) {
        nx = e.clientX;
        ny = e.clientY;
        desx = nx - sx;
        desy = ny - sy;
        tx += desx * dragSensitivity;
        ty += desy * 0.1;
        applyTransform(odrag);
        sx = nx;
        sy = ny;
    }
    
    function handleUp() {
        odrag.removeEventListener('pointermove', handleMove);
        odrag.removeEventListener('pointerup', handleUp);
        
        odrag.timer = setInterval(() => {
            desx *= 0.95;
            desy *= 0.95;
            tx += desx * dragSensitivity;
            ty += desy * 0.1;
            applyTransform(odrag);
            
            if (Math.abs(desx) < 0.5 && Math.abs(desy) < 0.5) {
                clearInterval(odrag.timer);
                if (autorotate) playspin(true);
            }
        }, 17);
    }
    
    odrag.addEventListener('pointermove', handleMove);
    odrag.addEventListener('pointerup', handleUp);
});

odrag.addEventListener('wheel', function(e) {
    e.preventDefault();
    var d = e.deltaY > 0 ? -10 : 10;
    radius += d;
    if (radius < 100) radius = 100;
    if (radius > 500) radius = 500;
    init(1);
});