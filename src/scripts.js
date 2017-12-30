class Tale {
  constructor(options) {
    this.el = options.el;
    this.circle = {
      el: this.el.querySelector('#mouse-circle'),
      x: 0,
      y: 0,
      r: 60
    };
    this.tales = [
      {
        el: this.el.querySelector('#mouse-tale'),
        x: 0,
        y: 0,
        r: 40,
        speed: 3,
        maxDistance: 300
      }, {
        el: this.el.querySelector('#mouse-tale2'),
        x: 0,
        y: 0,
        r: 40,
        speed: 4,
        maxDistance: 300
      }, {
        el: this.el.querySelector('#mouse-tale3'),
        x: 0,
        y: 0,
        r: 40,
        speed: 5,
        maxDistance: 300
      }, {
        el: this.el.querySelector('#mouse-tale4'),
        x: 0,
        y: 0,
        r: 40,
        speed: 6,
        maxDistance: 300
      }
    ];
    this.setMouseEvents();
    this.initializeCircles({
      x: this.el.clientWidth / 2,
      y: this.el.clientHeight / 2
    });
    this.collisions = [];
  }

  initializeCircles(pos = null) {
    this.setCirclePos(this.circle, pos);
    this.setCircleRadius(this.circle);
    this.tales.forEach((tale) => {
      this.setCirclePos(tale, this.circle);
      this.setCircleRadius(tale);
    });
  }

  animate() {
    // if (this.ctrlPressed) {
      this.tales.forEach((tale) => {
        this.moveTale(tale, this.circle);
      });
    // }

    this.calculateCollisions();

    this.requestId = requestAnimationFrame(this.animate.bind(this));
  }

  // TODO:
  // - Create class for Tale
  // - Create class for collision
  // - Add animation library
  // - Change Mouse circle radius on collision
  // - Jelly animation on collision


  calculateCollisions() {
    this.tales.forEach(function(tale) {
      // calculate collisions with Mouse circle
    });

    // calculate collisions between tales
    for (let i = 0; i < this.tales.length - 2; i++) {
      let tale = this.tales[i];
      for (let j = i + 1; j < this.tales.length - 1; j++) {
        let otherTale =  this.tales[j];
        let talesDistance = Math.sqrt(
            Math.pow(otherTale.x - tale.x, 2) +
            Math.pow(otherTale.y - tale.y, 2)
            );
        if ( talesDistance <= tale.r + otherTale.r &&
            !this.collisions[i*100 + j]
          ) {
            this.collisions[i*100 + j] = true;
            console.log(`Collision of ${i} and ${j}`);
        } else if (talesDistance > tale.r + otherTale.r &&
            this.collisions[i*100 + j]
          ) {
            this.collisions[i*100 + j] = false;
            console.log(`Collision of ${i} and ${j} stopped!`);
        }
      }
    }
    // mouse + tale: is crossed
    //   in and out events
    // tale x tale: cross events
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
      this.setCirclePos(this.circle, mousepos);
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
