class Tilt {
  constructor(options) {
    this.speedX;
    this.speedY;
    this.velocityX;
    this.velocityY;
    this.card = options.card;
    this.shine = card.querySelector('.shine'),
    this.moveOpt = {
      card: {
        t: 0,
        r: 0.02
      },
      shine: {
        t: 0.3,
        r: 0
      }
    };
    this.setMouseEventsOnCard();
  }

  handleMouseOver() {

  }

  calcPosFromMiddle() {

  }

  setMouseEventsOnCard() {
    this.card.addEventListener('mousemove', e => {
      var mousepos = getMousePos();
      var relmousepos = this.getRelativeMousePos(this.card, mousepos);
      console.log(relmousepos);
      this.setTransform(this.card, relmousepos, this.moveOpt.card);
      this.setTransform(this.shine, relmousepos, this.moveOpt.shine);
    });

    this.card.addEventListener('mouseleave', e => {
      console.log('leave :');
      console.log(e);
    });

    this.card.addEventListener('mouseenter', e => {
      console.log('=> enter :');
      console.log(e);
    });
  }

  getRelativeMousePos(el, mousepos) {
    var bounds = el.getBoundingClientRect();
    var docScrolls = getDocScrolls();
    var relmousepos = {
      x: mousepos.x - bounds.left - docScrolls.left,
      y: mousepos.y - bounds.top - docScrolls.top
    };
    var halfX = bounds.width / 2;
    var halfY = bounds.height / 2;

    relmousepos.x -= halfX;
    relmousepos.y -= halfY;

    if (Math.abs(relmousepos.x) > halfX) {
      relmousepos.x = null;
    }

    if (Math.abs(relmousepos.y) > halfY) {
      relmousepos.y = null;
    }
    return relmousepos;
  }

  setTransform(el, pos, opt) {
    if ( !pos.x || !pos.y ) {
      return;
    }

    var val = {
      t: {
        x: pos.x * opt.t,
        y: pos.y * opt.t
      },
      r: {
        x: -1 * pos.y * opt.r,
        y: pos.x * opt.r
      }
    },
    transformStyle = [
      'perspective(1000px)',
      'translateX(', val.t.x , 'px)',
      'translateY(', val.t.y, 'px)',
      'rotateX(', val.r.x, 'deg)',
      'rotateY(', val.r.y, 'deg)',
    ];
    transformStyle = transformStyle.join('');

    el.style.WebkitTransform =
    el.style.transform = transformStyle;
  }

  onMousemove() {
    var mousepos = getMousePos();
    this.setTransform(card, mousepos, this.moveOpt.card);
    this.setTransform(shine, mousepos, this.moveOpt.shine);
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

var card = document.querySelector('.content-wrapper');
var tilt = new Tilt({card: card});

// document.addEventListener('mousemove', function() {
//   tilt.onMousemove();
// });
