var Tilt = function(options) {
  var card = options.card,
      shine = card.querySelector('.shine'),
      moveOpt = {
        card: {
          t: 0,
          r: 0.02
        },
        shine: {
          t: 0.5,
          r: 0
        }
      };

  var setTransform = function(el, pos, opt) {
    var val = {
      t: {
        x: (window.innerWidth / 2 - pos.x) * opt.t,
        y: (window.innerHeight / 2 - pos.y) * opt.t
      },
      r: {
        x: (window.innerHeight / 2 - pos.y) * opt.r,
        y: -1 * (window.innerWidth / 2 - pos.x) * opt.r
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
  };

  this.onMousemove = function() {
    var mousepos = getMousePos();
    setTransform(card, mousepos, moveOpt.card);
    setTransform(shine, mousepos, moveOpt.shine);
  };
};

// from http://www.quirksmode.org/js/events_properties.html#position
function getMousePos(e) {
  var posx = 0, posy = 0;
  if (!e) var e = window.event;
  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  return { x : posx, y : posy };
}

card = document.querySelector('.content-wrapper');
tilt = new Tilt({card: card});

document.addEventListener('mousemove', function() {
  tilt.onMousemove();
});
