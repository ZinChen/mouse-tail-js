class TaleCircle {
  constructor(options) {
    this.el = options.el;
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.r = options.r || 40;
    this.speed = options.speed || 3;
    this.maxDistance = options.maxDistance || 300;
  }
}

class CollisionState {
  constructor(name) {
    this.name = name;
  }
  toString() {
    return `${this.name}`;
  }
}
CollisionState.NOT_CHANGED = new CollisionState('NOT_CHANGED');
CollisionState.IN = new CollisionState('IN');
CollisionState.OUT = new CollisionState('OUT');

class Tale {
  constructor(options) {
    this.el = options.el;
    this.el.cx = this.el.clientWidth / 2;
    this.el.cy = this.el.clientHeight / 2;
    this.mouse = {
      el: this.el.querySelector('#mouse-circle'),
      x: 0,
      y: 0,
      r: 60,
      scale: 1
    };
    this.tales = [
      new TaleCircle({
        el: this.el.querySelector('#mouse-tale-1'),
        speed: 2
      }),
      new TaleCircle({
        el: this.el.querySelector('#mouse-tale-2'),
        speed: 3
      }),
      new TaleCircle({
        el: this.el.querySelector('#mouse-tale-3'),
        speed: 4
      }),
      new TaleCircle({
        el: this.el.querySelector('#mouse-tale-4'),
        speed: 5
      })
    ];
    this.setMouseEvents();
    this.initializeCircles({
      x: this.el.cx,
      y: this.el.cy
    });
    this.collisions = [];
    this.collision = {
      step: 0.5 / this.tales.length
    };
    this.requestId = null;
    this.iddle = false;
    this.iddleFramesMax = 100;
    this.iddleFrames = 0;
    this.demoOptions = {
      r: Math.min(this.el.cx, this.el.cy) / 2,
      step: 0.053,
      angle: 0,
      cx: this.el.clientWidth / 2,
      cy: this.el.clientHeight / 2
    };

    // Initialiaze demo spin
    this.iddle = true;
    this.iddleFrames = this.iddleFramesMax++;
    this.requestId = requestAnimationFrame(
      this.animate.bind(this)
    );
  }

  initializeCircles(pos = null) {
    this.setCirclePos(this.mouse, pos);
    this.setCircleRadius(this.mouse);
    this.tales.forEach((tale) => {
      this.setCirclePos(tale, this.mouse);
      this.setCircleRadius(tale);
    });
  }

  animate() {
    if (this.iddle) {
      this.iddleFrames++;
    }

    if (this.iddleFrames > this.iddleFramesMax) {
      this.demo();
      this.setCirclePos(this.mouse);
      // cancelAnimationFrame(this.requestId);
      // this.requestId = null;
      // return;
    }

    // if (this.ctrlPressed) {
      this.tales.forEach((tale) => {
        this.moveTale(tale, this.mouse);
      });

      this.calculateCollisions();
    // }

    this.requestId = requestAnimationFrame(this.animate.bind(this));
  }

  demo() {
    let opts = this.demoOptions;
    let minStep = 0.004;
    let velocity = Math.pow(Math.cos(opts.angle), 2);
    opts.angle += opts.step * velocity + minStep;
    if (opts.angle >= 2 * Math.PI) {
      opts.angle = 0;
    }
    this.mouse.x = opts.cx + opts.r * Math.cos(opts.angle);
    this.mouse.y = opts.cy + opts.r * Math.sin(opts.angle);
  }

  // TODO:
  // - Create class for Tale +
  // - Create class for collision +
  // - Add animation library +
  // - Change Mouse circle radius on collision +
  // - Jelly animation on collision +


  animScale(el) {
    TweenMax.to(el.el, 0.7, {
      css: { scale: el.scale },
      ease: Elastic.easeOut.config(2, 0.3)
    });
  }

  animShake(item) {
    let circles = item.el.querySelectorAll('.inner-circle');
    circles.forEach((circle, i) => {
      let delay = i * 0.08;
      TweenMax.to(circle, 0.15, {
        delay: delay,
        scaleY: 1.15,
        force3D: true,
        ease: Quad.easeInOut,
        onComplete: () => {
          TweenMax.to(circle, 2.5, {
            scaleY: 1,
            force3D: true,
            ease: Elastic.easeOut,
            easeParams: [1.2, 0.12]
          });
        }
      });
    });
  }

  calculateCollisions() {
    let t = this;
    this.tales.forEach((tale, i) => {
      let state = t.getCollissionState(t.mouse, tale, i * -10);
      // calculate grow step mouse.r / this.talse.length / 2
      if (state == CollisionState.IN) {
        t.mouse.scale += t.collision.step;
        t.animScale(t.mouse);
        t.animShake(t.mouse);
      } else if (state == CollisionState.OUT) {
        t.mouse.scale -= t.collision.step;
        t.animScale(t.mouse);
        t.animShake(t.mouse);
        t.animShake(tale);
      }
    });

    for (let i = 0; i < this.tales.length - 1; i++) {
      for (let j = i + 1; j < this.tales.length; j++) {
        let tale1 = this.tales[i];
        let tale2 = this.tales[j];
        let state = this.getCollissionState(tale1, tale2, i*100 + j);
        if (state == CollisionState.IN) {
          // this.animShake(tale1);
          // this.animShake(tale2);
        } else if (state == CollisionState.OUT) {
          // this.animShake(tale1);
          // this.animShake(tale2);
        } else {

        }
      }
    }
  }

  getCollissionState(el1, el2, index) {
    let state = CollisionState.NOT_CHANGED;
    let talesDistance = Math.hypot( el2.x - el1.x , el2.y - el1.y );
    let collisionDistance = el2.r + el2.r;
    if ( talesDistance <= collisionDistance && !this.collisions[index] ) {
        this.collisions[index] = true;
        state = CollisionState.IN;
        // console.log(`Collision of ${i} and ${j}`);
    } else if (talesDistance > el2.r + el2.r && this.collisions[index] ) {
        this.collisions[index] = false;
        state = CollisionState.OUT;
    }
    return state;
  }

  setCirclePos(circle, pos = null) {
    if (pos) {
      circle.x = pos.x;
      circle.y = pos.y;
    }

    circle.el.style.top = Math.round(circle.y) + "px";
    circle.el.style.left = Math.round(circle.x) + "px";
  }

  setCircleRadius(circle, r) {
    if (r) {
      circle.r = r;
    }

    circle.el.style.width = circle.r + "px";
    circle.el.style.height = circle.r + "px";
  }

  moveTale(tale, destCoords) {
    tale.x = tale.x || destCoords.x;
    tale.y = tale.y || destCoords.y;

    let taleDelta = this.taleDelta(
      tale,
      destCoords,
      tale.speed
    );

    tale.x += taleDelta.dx;
    tale.y += taleDelta.dy;

    this.setCirclePos(tale);
  }

  taleDelta(elFrom, elTo, step) {
    let p1 = elFrom;
    let p2 = elTo;
    let dx, dy;
    let directionx = p2.x > p1.x ? 1 : -1;
    let directiony = p2.y > p1.y ? 1 : -1;
    let dxOrigin = p2.x - p1.x;
    let dyOrigin = p2.y - p1.y;
    let maxDi = elFrom.maxDistance;
    let distance = Math.hypot(dxOrigin, dyOrigin);

    if (maxDi && distance > maxDi) {
      step *= distance / maxDi;
    }

    if ( dxOrigin == 0 || dyOrigin == 0 ) {
      dx = p1.x == p2.x ? 0 : step * directionx;
      dy = p1.y == p2.y ? 0 : step * directiony;
    } else {
      let sin = Math.abs(dyOrigin / distance);
      let cos = Math.abs(dxOrigin / distance);

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

    this.mouse.el.addEventListener("click",  e => {
      this.animShake(this.mouse);
    });

    this.el.addEventListener('mousemove', e => {
      var mousepos = getMousePos();
      this.setCirclePos(this.mouse, mousepos);

      if (this.iddleFrames >= this.iddleFramesMax) {
        this.iddleFrames = 0;
        this.iddle = false;
      }

      if (this.requestId === null) {
        this.requestId = requestAnimationFrame(
          this.animate.bind(this)
        );
      }
    });

    this.el.addEventListener('mouseleave', e => {
      // this.initializeCircles(getMousePos());
      this.iddle = true;
      this.iddleFrames = 0;
    });

    this.el.addEventListener('mouseenter', e => {
      // this.initializeCircles(getMousePos());

      if (this.iddleFrames >= this.iddleFramesMax) {
        this.iddleFrames = 0;
        this.iddle = false;
      }

      if (this.requestId === null) {
        this.requestId = requestAnimationFrame(
          this.animate.bind(this)
        );
      }
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

var el = document.querySelector('.wrapper');
var tilt = new Tale({el: el});
