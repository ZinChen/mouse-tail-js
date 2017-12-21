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
// Add request animation frame
// Add initial first mouse pos setup for tale
// Add limit distance to tale

  moveTale() {
    this.talex = this.talex || this.x;
    var xd = this.x - this.talex;
    var directionx = xd > 0 ? 1 : -1;
    this.talex += Math.min(this.speedx, Math.abs(xd)) * directionx;

    this.taley = this.taley || this.y;
    var yd = this.y - this.taley;
    var directiony = yd > 0 ? 1 : -1;
    this.taley += Math.min(this.speedy, Math.abs(yd)) * directiony;

    var tale = this.mouseTale;
    tale.setAttribute("cx", this.talex);
    tale.setAttribute("cy", this.taley);

    this.requestId = requestAnimationFrame(this.moveTale.bind(this));
  }

  setMouseEvents() {
    this.el.addEventListener('mousemove', e => {
      var mousepos = getMousePos();
      var circle = this.mouseCircle;
      circle.setAttribute("cx", mousepos.x);
      circle.setAttribute("cy", mousepos.y);
      // this.moveTaleTo(mousepos);
      this.x = mousepos.x;
      this.y = mousepos.y;
      console.log(mousepos);
      console.log(this.talex);
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
