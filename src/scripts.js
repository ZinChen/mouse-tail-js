class TaleCircle {
  constructor(options) {
    this.el = options.el;
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.r = options.r ||40;
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
    this.mouse = {
      el: this.el.querySelector('#mouse-circle'),
      x: 0,
      y: 0,
      r: 60
    };
    this.tales = [
      new TaleCircle({
        el: this.el.querySelector('#mouse-tale-1'),
        speed: 3
      }),
      new TaleCircle({
        el: this.el.querySelector('#mouse-tale-2'),
        speed: 4
      }),
      new TaleCircle({
        el: this.el.querySelector('#mouse-tale-3'),
        speed: 5
      }),
      new TaleCircle({
        el: this.el.querySelector('#mouse-tale-4'),
        speed: 6
      })
    ];
    this.setMouseEvents();
    this.initializeCircles({
      x: this.el.clientWidth / 2,
      y: this.el.clientHeight / 2
    });
    this.collisions = [];
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
    // if (this.ctrlPressed) {
      this.tales.forEach((tale) => {
        this.moveTale(tale, this.mouse);
      });
    // }

    this.calculateCollisions();

    this.requestId = requestAnimationFrame(this.animate.bind(this));
  }

  // TODO:
  // - Create class for Tale +
  // - Create class for collision +
  // - Add animation library
  // - Change Mouse circle radius on collision
  // - Jelly animation on collision


  calculateCollisions() {
    let taleClass = this;
    this.tales.forEach(function(tale, i) {
      let collisionState = taleClass.getCollissionState(taleClass.mouse, tale, i * -1);
      // calculate grow step mouse.r / this.talse.length / 2
      if (collisionState == CollisionState.IN) {
        // this.mouse bigger
      } else {
        // this.mouse lesser
      }
    });

    for (let i = 0; i < this.tales.length - 2; i++) {
      for (let j = i + 1; j < this.tales.length - 1; j++) {
        let tale1 = this.tales[i];
        let tale2 = this.tales[j];
        let collisionState = this.getCollissionState(tale1, tale2, i*100 + j);
        if (collisionState == CollisionState.IN) {

        } else if (collisionState == CollisionState.OUT) {

        } else {

        }
      }
    }
  }

  getCollissionState(el1, el2, index) {
    let state = CollisionState.NOT_CHANGED;
    let talesDistance = Math.sqrt(
        Math.pow(el2.x - el2.x, 2) +
        Math.pow(el2.y - el2.y, 2)
        );
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
    let distance = Math.sqrt(
      Math.pow(dxOrigin, 2) + Math.pow(dyOrigin, 2)
    );

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
    this.el.addEventListener('mousemove', e => {
      var mousepos = getMousePos();
      this.setCirclePos(this.mouse, mousepos);
    });

    this.el.addEventListener('mouseleave', e => {
      // this.initializeCircles(getMousePos());
      cancelAnimationFrame(this.requestId);
    });

    this.el.addEventListener('mouseenter', e => {
      // this.initializeCircles(getMousePos());
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

var el = document.querySelector('.wrapper');
var tilt = new Tale({el: el});
