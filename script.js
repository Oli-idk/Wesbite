//credit to backgroud code https://github.com/Esophose
(function() {

  window.onload = init;

  var canvas,
    context;

  var backgroundColor = "rgb(15, 15, 20)";
  var particleColor = "rgb(236, 240, 241)";

  var mouseX,
    mouseY,
    mouseDown;

  var particles = [];

  var maxDistanceBetween,
    repelDistance;

  function updateAndDraw() {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (var p in particles) {
      var particle = particles[p];
      particle.update();
      particle.draw();
    }

    maxDistanceBetween = Math.min(maxDistanceBetween + 1, canvas.width / 12);

    window.requestAnimationFrame(updateAndDraw);
  }

  function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", function() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      maxDistanceBetween = Math.max(canvas.width, canvas.height) / 400;
    }, false);

    window.addEventListener("mousemove", function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, false);

    window.addEventListener("mousedown", function(e) {
      mouseDown = true;
    }, false);

    window.addEventListener("mouseup", function(e) {
      mouseDown = false;
    }, false);

    maxDistanceBetween = Math.max(canvas.width, canvas.height) / 40;
    repelDistance = Math.max(canvas.width, canvas.height) / 8;

    for (var i = 0; i < 120; i++) {
      particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
    }

    updateAndDraw();
  }

  var Particle = function(x, y) {
    this.x = x;
    this.y = y;
    this.vx = Math.random() * 4 - 2;
    this.vy = Math.random() * 4 - 2;
    this.radius = 2.5;

    this.update = function() {
      this.x += this.vx;
      this.y += this.vy;

      var distanceFromMouse = Math.sqrt(Math.pow(mouseX - this.x, 2) + Math.pow(mouseY - this.y, 2));
      if (distanceFromMouse < repelDistance) {
        var repel = {
          x: this.x - mouseX,
          y: this.y - mouseY
        };
        var distanceFraction = (repelDistance - distanceFromMouse) / repelDistance / 5;
        repel.x *= distanceFraction;
        repel.y *= distanceFraction;

        if (mouseDown) {
          this.x -= repel.x;
          this.y -= repel.y;
        } else {
          this.x += repel.x;
          this.y += repel.y;
        }

      }

      if (this.x > canvas.width + this.radius * 2) this.x = -this.radius * 2;
      if (this.y > canvas.height + this.radius * 2) this.y = -this.radius * 2;
      if (this.x < -this.radius * 2) this.x = canvas.width + this.radius * 2;
      if (this.y < -this.radius * 2) this.y = canvas.height + this.radius * 2;
    };

    this.draw = function() {
      context.beginPath();

      for (var p in particles) {
        var other = particles[p];

        var distanceBetween = Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
        if (distanceBetween <= maxDistanceBetween) {
          context.beginPath();
          context.strokeStyle = "hsla(176, 100%, 50%, " + (0.75 - distanceBetween / maxDistanceBetween) + ")";
          context.lineWidth = 2 - distanceBetween / maxDistanceBetween;
          context.moveTo(this.x, this.y);
          context.lineTo(other.x, other.y);
          context.stroke();
          context.closePath();
        }
      }

      context.fillStyle = particleColor;
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      context.fill();

      context.closePath();
    };
  };

})();
