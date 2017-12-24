class Tale {
  constructor(options) {
    this.speedx = 3;
    this.speedy = 3;
    this.talex;
    this.taleY;
    this.x = 0;
    this.y = 0;
    this.taleMaxistance = {
      x: 30,
      y: 30
    };
    this.el = options.el;
    this.mouseCircle = this.el.querySelector('#mouse-circle');
    this.mouseTale = this.el.querySelector('#mouse-tale');
    this.setMouseEvents();

    this.requestId = requestAnimationFrame(this.moveTale.bind(this));
  }

  handleMouseOver() {

  }

// TODO:
// Add request animation frame +
// Add initial first mouse pos setup for tale
// Add limit distance to tale

// wait in requestAnimFrame for mousepos is got
// and then start requestAnimFrame with mousetalefunc
// Calc hipotenuse in separate method

  moveTale() {
    this.talex = this.talex || this.x;
    this.taley = this.taley || this.y;


    if (!window.ctrlPressed) {
      this.requestId = requestAnimationFrame(this.moveTale.bind(this));
      return;

    }
    var taleNewPos = this.calcDirectRoute({
      x : this.talex,
      y : this.taley
    }, {
      x : this.x,
      y : this.y
    }, 3);
    // console.log(taleNewPos);

    var xd = this.x - this.talex;
    var directionx = xd > 0 ? 1 : -1;
    if (taleNewPos.x) xd = taleNewPos.x;
    this.talex += Math.min(this.speedx, Math.abs(xd)) * directionx;

    var yd = this.y - this.taley;
    var directiony = yd > 0 ? 1 : -1;
    if (taleNewPos.y) yd = taleNewPos.y;
    this.taley += Math.min(this.speedy, Math.abs(yd)) * directiony;

    var tale = this.mouseTale;
    tale.setAttribute("cx", this.talex);
    tale.setAttribute("cy", this.taley);

    this.requestId = requestAnimationFrame(this.moveTale.bind(this));
  }

  calcDirectRoute(posFrom, posTo, length) {
    var p1 = posFrom;
    var p2 = posTo;

    // if x eqals then return only y
    // if y equals then return only x
    if (p1.x == p2.x && p1.y == p2.y) {
      return {
        x : 0,
        y : 0
      };
    } else if (p1.x == p2.x) {
      return {
        x : p1.x,
        y : 0
      };
    } else if (p1.y == p2.y) {
      return {
        x : 0,
        y : p1.y
      };
    }

    var dxOrigin = p2.x - p1.x; // Math.abs()
    var dyOrigin = p2.y - p1.y; // Math.abs()
    var tg = dyOrigin / dxOrigin;

    var sinsq = 1 / (1 + 1/tg * tg);
    var cossq = 1 - sinsq;
    var sin = Math.sqrt(sinsq);
    var cos = Math.sqrt(cossq);

    var dx = length * cos;
    var dy = length * sin;

    // console.log({p1: p1, p2: p2});
    // console.log("tg: " + tg);
    // console.log("sinsq:" + sinsq);
    // console.log("cossq:" + cossq);
    // console.log("dx: " + dx);
    // console.log("dy: " + dy);

    return {
      x: dx,
      y: dy
    };
  }

  setMouseEvents() {
    window.onkeydown = function(e) {
      this.ctrlPressed = true;
    };
    window.onkeyup = function(e) {
      this.ctrlPressed = false;
    };
    this.el.addEventListener('mousemove', e => {
      var mousepos = getMousePos();
      var circle = this.mouseCircle;
      circle.setAttribute("cx", mousepos.x);
      circle.setAttribute("cy", mousepos.y);
      // this.moveTaleTo(mousepos);
      this.x = mousepos.x;
      this.y = mousepos.y;
      // console.log(mousepos);
      // console.log(this.talex);
    });

    this.el.addEventListener('mouseleave', e => {
      console.log('leave :');
      console.log(e);
    });

    this.el.addEventListener('mouseenter', e => {
      console.log('=> enter :');
      console.log(e);
    });
  }

  onMousemove() {
    var mousepos = getMousePos();
    this.setTransform(card, mousepos, this.moveOpt.card);
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
  return { x : posx, y : posy };
}

function getDocScrolls() {
  return {
    left: document.body.scrollLeft + document.documentElement.scrollLeft,
    top: document.body.scrollTop + document.documentElement.scrollTop
  };
}

var el = document.querySelector('#main-svg');
var tilt = new Tale({el: el});

// document.addEventListener('mousemove', function() {
//   tilt.onMousemove();
// });
