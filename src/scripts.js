class Tale {
  constructor(options) {
    this.el = options.el;
    this.tale = {
      el: this.el.querySelector('#mouse-tale'),
      x: 0,
      y: 0,
      speed: 3,
      maxDistance: 30
    };
    this.tale2 = {
      el: this.el.querySelector('#mouse-tale2'),
      x: 0,
      y: 0,
      speed: 4,
      maxDistance: 30
    };
    this.tale3 = {
      el: this.el.querySelector('#mouse-tale3'),
      x: 0,
      y: 0,
      speed: 5,
      maxDistance: 30
    };
    this.coords = {
      x: 0,
      y: 0
    };
    this.mouseCircle = this.el.querySelector('#mouse-circle');
    this.setMouseEvents();
  }

// TODO:
// Add request animation frame +
// Add initial first mouse pos setup for tale +
// Add limit distance to tale

// wait in requestAnimFrame for mousepos is got +
// and then start requestAnimFrame with mousetalefunc +
// Calc hipotenuse in separate method +

  animate() {
    this.moveTale(this.tale, this.coords);
    this.moveTale(this.tale2, this.coords);
    this.moveTale(this.tale3, this.coords);

    this.requestId = requestAnimationFrame(this.animate.bind(this));
  }

  setTalePos(tale, pos) {
    tale.x = pos.x;
    tale.y = pos.y;

    tale.el.setAttribute("cx", tale.x);
    tale.el.setAttribute("cy", tale.y);
  }

  moveTale(tale, destCoords) {
    tale.x = tale.x || destCoords.x;
    tale.y = tale.y || destCoords.y;

    // if (!window.ctrlPressed) {
    //   this.requestId = requestAnimationFrame(
    //     this.moveTale.bind(this)
    //   );
    //   return;
    // }

    let taleDelta = this.taleDelta(
      tale,
      destCoords,
      tale.speed
    );

    tale.x += taleDelta.dx;
    tale.y += taleDelta.dy;

    tale.el.setAttribute("cx", tale.x);
    tale.el.setAttribute("cy", tale.y);
  }

  taleDelta(elFrom, elTo, step) {
    let p1 = elFrom;
    let p2 = elTo;
    let dx, dy;

    if (p1.x == p2.x || p1.y == p2.y) {
      dx = p1.x == p2.x ? 0 : p2.x - p1.x;
      dy = p1.y == p2.y ? 0 : p2.y - p1.y;
    } else {
      let directionx = p2.x > p1.x ? 1 : -1;
      let directiony = p2.y > p1.y ? 1 : -1;

      let dxOrigin = p2.x - p1.x;
      let dyOrigin = p2.y - p1.y;
      let tg = dyOrigin / dxOrigin;
      let tgScr = tg * tg;

      let sinsq = tgScr / (1 + tgScr);
      let cossq = 1 - sinsq;
      let sin = Math.sqrt(sinsq);
      let cos = Math.sqrt(cossq);

      dx = step * cos * directionx;
      dy = step * sin * directiony;
    }

    return {
      dx,
      dy
    };
  }

  setMouseEvents() {
    window.onkeydown = e => {
      this.ctrlPressed = true;
    };
    window.onkeyup = e => {
      this.ctrlPressed = false;
    };
    this.el.addEventListener('mousemove', e => {
      var mousepos = getMousePos();
      var circle = this.mouseCircle;
      circle.setAttribute("cx", mousepos.x);
      circle.setAttribute("cy", mousepos.y);
      this.coords.x = mousepos.x;
      this.coords.y = mousepos.y;
    });

    this.el.addEventListener('mouseleave', e => {
      cancelAnimationFrame(this.requestId);
    });

    this.el.addEventListener('mouseenter', e => {
      this.coords = getMousePos();
      this.requestId = requestAnimationFrame(
        this.animate.bind(this)
      );
    });
  }
}

// from http://www.quirksmode.org/js/events_properties.html#position
function getMousePos(e) {
  var posx = 0, posy = 0;
  e = e || window.event;
  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    var docScrolls = getDocScrolls();
    posx = e.clientX + docScrolls.left;
    posy = e.clientY + docScrolls.top;
  }
  return { x: posx, y: posy };
}

function getDocScrolls() {
  return {
    left: document.body.scrollLeft + document.documentElement.scrollLeft,
    top: document.body.scrollTop + document.documentElement.scrollTop
  };
}

var el = document.querySelector('#main-svg');
var tilt = new Tale({el: el});
