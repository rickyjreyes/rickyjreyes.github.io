(function () {
  "use strict";

  /*
   * Homepage motion remains disabled for crisp typography. The original static
   * .field-visual in index.html is intentionally kept as the no-JavaScript and
   * hard-failure fallback. This file upgrades only that one visual when the
   * browser can create the enhanced DOM safely.
   */

  if (!document || !document.querySelector || !document.createElement) {
    return;
  }

  var hero = document.querySelector(".hero");
  if (!hero) {
    return;
  }

  hero.removeAttribute("data-parallax-ready");
  if (hero.style && hero.style.removeProperty) {
    hero.style.removeProperty("--hero-parallax-progress");
  }

  var oldVisual = hero.querySelector(".field-visual");
  if (!oldVisual || !oldVisual.parentNode) {
    return;
  }

  var wrapper = document.createElement("div");
  wrapper.className = "wct-wrap";

  wrapper.innerHTML = [
    '<div class="field-visual wct-field" aria-label="Interactive finite-band wave field converging into a localized curvature-locked mode" data-active="overview">',
      '<canvas class="wct-canvas" aria-hidden="true" width="688" height="688"></canvas>',
      '<div class="wct-vignette" aria-hidden="true"></div>',
      '<svg class="wct-svg" viewBox="0 0 480 480" aria-hidden="true" focusable="false">',
        '<path class="wct-flow" d="M-18 158C86 132 121 238 236 239"></path>',
        '<path class="wct-flow" d="M34 390C102 331 151 315 236 243"></path>',
        '<path class="wct-flow" d="M145-18C161 92 198 147 239 236"></path>',
        '<path class="wct-flow" d="M493 99C389 122 332 184 244 238"></path>',
        '<path class="wct-flow" d="M501 355C392 340 332 290 244 243"></path>',
        '<path class="wct-flow" d="M330 500C309 382 282 316 243 245"></path>',
        '<circle class="wct-band" cx="240" cy="240" r="145"></circle>',
        '<circle class="wct-band" cx="240" cy="240" r="117"></circle>',
        '<circle class="wct-band" cx="240" cy="240" r="92"></circle>',
        '<path class="wct-shell outer" d="M240 160C286 158 323 195 322 239C321 286 286 321 240 321C194 322 158 286 159 240C160 195 194 161 240 160Z"></path>',
        '<path class="wct-shell" d="M240 187C270 184 296 208 295 239C296 270 271 296 240 294C209 297 184 270 186 240C184 208 210 186 240 187Z"></path>',
      '</svg>',
      '<div class="wct-core" aria-hidden="true"><div class="wct-core-inner"><strong>ψ</strong><span>localized mode</span></div></div>',
      '<button class="wct-hotspot" type="button" data-concept="transport" aria-label="Wave transport" aria-pressed="false">1</button>',
      '<button class="wct-hotspot" type="button" data-concept="band" aria-label="Finite-k selection" aria-pressed="false">2</button>',
      '<button class="wct-hotspot" type="button" data-concept="curvature" aria-label="Curvature feedback" aria-pressed="false">3</button>',
      '<button class="wct-hotspot" type="button" data-concept="lock" aria-label="Phase locking" aria-pressed="false">4</button>',
    '</div>',
    '<div class="wct-panel">',
      '<div class="wct-tabs" aria-label="WCT field concepts">',
        '<button class="wct-tab" data-concept="transport" type="button" aria-pressed="false">Wave transport</button>',
        '<button class="wct-tab" data-concept="band" type="button" aria-pressed="false">Finite-k selection</button>',
        '<button class="wct-tab" data-concept="curvature" type="button" aria-pressed="false">Curvature feedback</button>',
        '<button class="wct-tab" data-concept="lock" type="button" aria-pressed="false">Phase locking</button>',
      '</div>',
      '<div class="wct-copy" aria-live="polite">',
        '<p class="wct-kicker">Interactive WCT field map</p>',
        '<h2 class="wct-title">Distributed field → localized mode</h2>',
        '<p class="wct-description">Hover, focus, or tap a label to isolate each stage of the proposed confinement sequence.</p>',
      '</div>',
      '<p class="wct-note">Illustrative staged field dynamics, rendered in real time when supported; not a numerical simulation or empirical result.</p>',
    '</div>'
  ].join("");

  var field = wrapper.querySelector ? wrapper.querySelector(".wct-field") : null;
  var svg = wrapper.querySelector ? wrapper.querySelector(".wct-svg") : null;
  if (!field || !svg) {
    return;
  }

  /* Replace only after the fallback DOM has been built and validated. */
  oldVisual.parentNode.replaceChild(wrapper, oldVisual);

  var title = wrapper.querySelector(".wct-title");
  var description = wrapper.querySelector(".wct-description");
  var controls = wrapper.querySelectorAll("[data-concept]");

  var concepts = {
    transport: {
      title: "Wave transport",
      description: "Energy and phase propagate through the distributed field toward the confinement region."
    },
    band: {
      title: "Finite-k selection",
      description: "A bounded spectral shell selects preferred spatial scales instead of allowing unrestricted modes."
    },
    curvature: {
      title: "Curvature feedback",
      description: "Field curvature feeds back on the localized configuration and reinforces the confined structure."
    },
    lock: {
      title: "Phase locking",
      description: "Coherent phase relationships organize the selected modes into a persistent localized state."
    }
  };

  function setText(node, value) {
    if (!node) {
      return;
    }
    if (typeof node.textContent !== "undefined") {
      node.textContent = value;
    } else {
      node.innerText = value;
    }
  }

  function conceptFor(element) {
    return element ? element.getAttribute("data-concept") : null;
  }

  function activateConcept(name) {
    if (!concepts[name]) {
      return;
    }

    field.setAttribute("data-active", name);
    setText(title, concepts[name].title);
    setText(description, concepts[name].description);

    var i;
    var active;
    for (i = 0; i < controls.length; i += 1) {
      active = conceptFor(controls[i]) === name;
      controls[i].setAttribute("aria-pressed", active ? "true" : "false");
    }
  }

  function handleActivation(event) {
    event = event || window.event;
    var target = event.currentTarget || event.srcElement;
    activateConcept(conceptFor(target));
  }

  var i;
  for (i = 0; i < controls.length; i += 1) {
    if (controls[i].addEventListener) {
      controls[i].addEventListener("click", handleActivation, false);
      controls[i].addEventListener("mouseover", handleActivation, false);
      controls[i].addEventListener("focus", handleActivation, false);
    } else if (controls[i].attachEvent) {
      controls[i].attachEvent("onclick", handleActivation);
      controls[i].attachEvent("onmouseover", handleActivation);
      controls[i].attachEvent("onfocus", handleActivation);
    }
  }

  /* Canvas is optional. SVG, controls, and copy remain complete without it. */
  var canvas = wrapper.querySelector(".wct-canvas");
  if (!canvas || !canvas.getContext) {
    return;
  }

  var reducedMotion = false;
  try {
    reducedMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  } catch (ignoreMotionQuery) {
    reducedMotion = false;
  }

  if (reducedMotion) {
    return;
  }

  var ctx = null;
  try {
    ctx = canvas.getContext("2d");
  } catch (ignoreCanvasError) {
    ctx = null;
  }

  if (!ctx) {
    return;
  }

  field.className += " wct-canvas-ready";

  var requestFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      return window.setTimeout(function () {
        callback(+new Date());
      }, 33);
    };

  var cancelFrame = window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    function (id) {
      window.clearTimeout(id);
    };

  var particles = [];
  var particleCount = 36;
  var p;
  for (i = 0; i < particleCount; i += 1) {
    p = {
      angle: (Math.PI * 2 * i / particleCount) + ((i % 5) * 0.09),
      phase: (i * 0.137) % 1,
      speed: 0.000030 + ((i % 7) * 0.000004),
      wobble: 0.7 + ((i % 6) * 0.11)
    };
    particles.push(p);
  }

  var cssWidth = 0;
  var cssHeight = 0;
  var pixelRatio = 1;
  var frameId = null;
  var running = true;

  function resizeCanvas() {
    var rect = field.getBoundingClientRect ? field.getBoundingClientRect() : null;
    var width = rect && rect.width ? rect.width : field.offsetWidth;
    var height = rect && rect.height ? rect.height : field.offsetHeight;

    if (!width || !height) {
      return;
    }

    pixelRatio = window.devicePixelRatio || 1;
    if (pixelRatio > 2) {
      pixelRatio = 2;
    }
    if (pixelRatio < 1) {
      pixelRatio = 1;
    }

    cssWidth = width;
    cssHeight = height;

    var targetWidth = Math.max(1, Math.round(width * pixelRatio));
    var targetHeight = Math.max(1, Math.round(height * pixelRatio));

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      if (ctx.setTransform) {
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      } else {
        ctx.scale(pixelRatio, pixelRatio);
      }
    }
  }

  function strokeCircle(x, y, radius, color, width) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  function draw(time) {
    if (!running) {
      return;
    }

    if (!cssWidth || !cssHeight) {
      resizeCanvas();
    }

    var width = cssWidth;
    var height = cssHeight;
    if (!width || !height) {
      frameId = requestFrame(draw);
      return;
    }

    var cx = width * 0.5;
    var cy = height * 0.5;
    var minDim = width < height ? width : height;
    var active = field.getAttribute("data-active") || "overview";
    var t = typeof time === "number" ? time : +new Date();

    ctx.clearRect(0, 0, width, height);

    var bg;
    try {
      bg = ctx.createRadialGradient(cx, cy, minDim * 0.02, cx, cy, minDim * 0.53);
      bg.addColorStop(0, "rgba(103,212,255,0.14)");
      bg.addColorStop(0.28, "rgba(70,121,159,0.045)");
      bg.addColorStop(1, "rgba(2,7,13,0)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
    } catch (ignoreGradient) {
      /* SVG remains the primary visual if gradient APIs are limited. */
    }

    /* Finite-band field rings. */
    var ringAlpha = active === "band" ? 0.34 : 0.10;
    var ringPulse = 1 + Math.sin(t * 0.0012) * 0.012;
    strokeCircle(cx, cy, minDim * 0.302 * ringPulse, "rgba(143,216,255," + ringAlpha + ")", active === "band" ? 1.5 : 0.8);
    strokeCircle(cx, cy, minDim * 0.244 * ringPulse, "rgba(143,216,255," + (ringAlpha * 0.86) + ")", active === "band" ? 1.3 : 0.7);
    strokeCircle(cx, cy, minDim * 0.192 * ringPulse, "rgba(168,153,255," + (ringAlpha * 0.74) + ")", active === "band" ? 1.2 : 0.7);

    /* Distributed wave transport converging toward the center. */
    var transportAlpha = active === "transport" ? 0.70 : 0.26;
    for (i = 0; i < particles.length; i += 1) {
      p = particles[i];
      var progress = (p.phase + t * p.speed) % 1;
      var radial = minDim * (0.47 - progress * 0.37);
      var angle = p.angle + Math.sin((progress * Math.PI * 4) + (t * 0.00055)) * 0.055 * p.wobble;
      var x = cx + Math.cos(angle) * radial;
      var y = cy + Math.sin(angle) * radial;
      var nextRadial = radial - (minDim * 0.022);
      var x2 = cx + Math.cos(angle + 0.01) * nextRadial;
      var y2 = cy + Math.sin(angle + 0.01) * nextRadial;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = "rgba(103,212,255," + (transportAlpha * (0.35 + progress * 0.65)) + ")";
      ctx.lineWidth = active === "transport" ? 1.2 : 0.7;
      ctx.stroke();
    }

    /* Curvature-locked shell: a slightly deformed closed contour. */
    var shellAlpha = active === "curvature" ? 0.66 : 0.14;
    ctx.beginPath();
    var steps = 72;
    var j;
    for (j = 0; j <= steps; j += 1) {
      var a = Math.PI * 2 * j / steps;
      var deformation = 1 + 0.036 * Math.sin((a * 4) - t * 0.0011) + 0.018 * Math.cos((a * 3) + t * 0.0008);
      var r = minDim * 0.169 * deformation;
      var sx = cx + Math.cos(a) * r;
      var sy = cy + Math.sin(a) * r;
      if (j === 0) {
        ctx.moveTo(sx, sy);
      } else {
        ctx.lineTo(sx, sy);
      }
    }
    ctx.closePath();
    ctx.strokeStyle = "rgba(168,153,255," + shellAlpha + ")";
    ctx.lineWidth = active === "curvature" ? 1.8 : 0.8;
    ctx.stroke();

    /* Phase-lock pulse near the localized core. */
    var lockAlpha = active === "lock" ? 0.52 : 0.13;
    var lockPulse = minDim * (0.108 + 0.008 * Math.sin(t * 0.0024));
    strokeCircle(cx, cy, lockPulse, "rgba(103,212,255," + lockAlpha + ")", active === "lock" ? 2 : 0.8);

    frameId = requestFrame(draw);
  }

  function stop() {
    running = false;
    if (frameId !== null) {
      cancelFrame(frameId);
      frameId = null;
    }
  }

  function start() {
    if (!running) {
      running = true;
      resizeCanvas();
      frameId = requestFrame(draw);
    }
  }

  resizeCanvas();
  frameId = requestFrame(draw);

  if (document.addEventListener) {
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    }, false);

    window.addEventListener("resize", resizeCanvas, false);
  } else if (window.attachEvent) {
    window.attachEvent("onresize", resizeCanvas);
  }
}());
