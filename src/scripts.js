class Tale {
  constructor(options) {
    this.speedX;
    this.speedY;
    this.el = options.el;
    this.mouseCircle = this.el.querySelector('#mouse-circle');
    this.setMouseEvents();
  }

  handleMouseOver() {

  }

  setMouseEvents() {


    this.el.addEventListener('mousemove', e => {
      var mousepos = getMousePos();
      var circle = this.mouseCircle;
      circle.setAttribute("cx", mousepos.x);
      circle.setAttribute("cy", mousepos.y);
      console.log(mousepos);
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
