(function() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width;
  canvas.height = height;
  const arcs = [];
  const count = 200;
  const clickEvents = [];
  const speed = 32;
  const scale = 1.4;
  const force = 10;

  class Arc {
    constructor(x, y, radius, dX, dY, color) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.dX = dX;
      this.dY = dY;
      this.scale = 1;
      this.vec = {
        x: 0,
        y: 0
      };
      this.force = 0;
    }
    setScale(scale) {
      this.scale = scale;
    }
    setVec(x, y) {
      this.vec.x = x;
      this.vec.y = y;
    }
    setForce(value) {
      this.force = value;
    }
    draw() {
      const r =
        this.color.r * this.scale < 255 ? this.color.r * this.scale : 255;
      const g =
        this.color.g * this.scale < 255 ? this.color.g * this.scale : 255;
      const b =
        this.color.b * this.scale < 255 ? this.color.b * this.scale : 255;
      ctx.shadowColor = `rgb(${r},${g},${b})`;
      ctx.shadowBlur = 10;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.beginPath();
      ctx.arc(
        this.x + this.vec.x * this.force,
        this.y + this.vec.y * this.force,
        this.radius * this.scale,
        0,
        2 * Math.PI,
        false
      );
      ctx.fill();
    }
  }

  class ClickEvent {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 0;
    }
  }

  canvas.addEventListener("click", e => {
    clickEvents.push(new ClickEvent(e.offsetX, e.offsetY));
  });

  const loop = () => {
    clear();
    for (let i = 0; i < clickEvents.length; i++) {
      clickEvents[i].radius += speed;
      if (clickEvents[i].radius > 2000) {
        clickEvents.splice(i, 1);
        continue;
      }
    }
    arcs.forEach(arc => {
      arc.dX += Math.random() * 0.02;
      arc.dY += Math.random() * 0.01;
      arc.x += Math.cos(arc.dX) * 0.1;
      arc.y += Math.cos(arc.dY) * 0.2;
      arc.color.r += Math.cos(arc.dY) * 1.5;
      arc.color.g += Math.cos(arc.dY) * 1;
      arc.color.b += Math.cos(arc.dX) * 1;
      clickEvents.forEach(clickEvent => {
        const vec = {
          x: arc.x - clickEvent.x,
          y: arc.y - clickEvent.y
        };
        let length = Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2));
        arc.setVec(vec.x / length, vec.y / length);
        if (length < clickEvent.radius) {
          arc.setScale((length / clickEvent.radius) * scale + 1);
          arc.setForce((length / clickEvent.radius) * scale * force);
        }
      });
      arc.draw();
    });
    window.requestAnimationFrame(loop);
  };
  const start = () => {
    window.requestAnimationFrame(loop);
  };
  const clear = () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
  };

  let i = 0;
  while (i < count) {
    arcs.push(
      new Arc(
        Math.floor(Math.random() * width),
        Math.floor(Math.random() * height),
        Math.floor(Math.random() * 2 + 1),
        Math.random(),
        Math.random(),
        {
          r: Math.floor(Math.random() * 255),
          g: Math.floor(Math.random() * 255),
          b: Math.floor(Math.random() * 255)
        }
      )
    );
    i++;
  }

  start();
})();
