/* The Ironic Ineptocracy - 2026 Hyperreal Cinema Site Engine
   1. Mobile nav toggle
   2. Motion-safe scroll reveals and scroll choreography
   3. Hyperreal cinema hero depth parallax and optional ambient soundscape
   4. 2026 AAA Character Select Deck + Web Audio API <canvas> voice visualizer
   5. Interactive Cold Open screenplay viewer and Tier-1 world route map
   6. Swipe dossier rail, fine-pointer depth cards, and resilient Garnier Dossier capture */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  var motionOK = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  if (motionOK) document.documentElement.classList.add("motion-ok");

  var finePointer = window.matchMedia("(pointer: fine)").matches;

  var routeName = window.location.pathname
    .replace(/^\/|\/$/g, "")
    .replace(/\//g, "-") || "home";
  document.body.setAttribute("data-route", routeName);

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        var openHeader = document.querySelector(".site-header");
        if (openHeader) openHeader.classList.remove("is-hidden");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---- Scroll reveals (motion-safe) ---- */
  var reveals = document.querySelectorAll(".reveal");
  reveals.forEach(function (el, index) {
    if (el.matches(".swipe-card, [data-depth-card]")) {
      el.classList.add("reveal--card");
    } else if (el.matches(".case-sequence__visual, .figure-frame, .evidence-stack")) {
      el.classList.add("reveal--photo");
    } else if (el.matches(".sequence-step")) {
      el.classList.add("reveal--wipe");
    } else {
      if (index % 3 === 1) el.classList.add("reveal--left");
      if (index % 3 === 2) el.classList.add("reveal--right");
    }
    el.style.setProperty("--reveal-delay", String((index % 4) * 70) + "ms");
  });

  if (motionOK && "IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Scroll choreography: progress, hero exit, sticky evidence depth ---- */
  var hero = document.querySelector(".hero");
  var header = document.querySelector(".site-header");
  var parallaxItems = Array.prototype.slice.call(document.querySelectorAll("[data-parallax] .evidence-stack"));
  var sequenceSteps = Array.prototype.slice.call(document.querySelectorAll("[data-sequence-step]"));
  var frameQueued = false;
  var lastScrollTop = window.scrollY || document.documentElement.scrollTop;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function updateScrollScene() {
    frameQueued = false;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    document.documentElement.style.setProperty("--site-progress", String(scrollTop / maxScroll));

    if (header) {
      var delta = scrollTop - lastScrollTop;
      var menuOpen = nav && nav.classList.contains("is-open");
      header.classList.toggle("is-scrolled", scrollTop > 24);
      if (scrollTop < 96 || menuOpen || delta < -6) {
        header.classList.remove("is-hidden");
      } else if (scrollTop > 140 && delta > 6) {
        header.classList.add("is-hidden");
      }
    }

    if (hero && motionOK) {
      var heroRect = hero.getBoundingClientRect();
      var heroProgress = clamp(-heroRect.top / Math.max(heroRect.height * 0.75, 1), 0, 1);
      hero.style.setProperty("--hero-progress", String(heroProgress));
    }

    if (motionOK) {
      parallaxItems.forEach(function (item) {
        var rect = item.getBoundingClientRect();
        var centerDelta = rect.top + rect.height / 2 - window.innerHeight / 2;
        var shift = clamp(centerDelta * -0.055, -34, 34);
        item.style.setProperty("--parallax-y", shift.toFixed(2) + "px");
      });
    }

    if (sequenceSteps.length) {
      var viewportTarget = window.innerHeight * 0.52;
      var closest = null;
      var closestDistance = Infinity;
      sequenceSteps.forEach(function (step) {
        var rect = step.getBoundingClientRect();
        var distance = Math.abs(rect.top + rect.height / 2 - viewportTarget);
        if (distance < closestDistance) {
          closest = step;
          closestDistance = distance;
        }
      });
      sequenceSteps.forEach(function (step) {
        step.classList.toggle("is-active", step === closest);
      });
    }
    lastScrollTop = scrollTop;
  }

  function requestScrollScene() {
    if (!frameQueued) {
      frameQueued = true;
      window.requestAnimationFrame(updateScrollScene);
    }
  }

  window.addEventListener("scroll", requestScrollScene, { passive: true });
  window.addEventListener("resize", requestScrollScene, { passive: true });
  updateScrollScene();

  /* ---- Hyperreal Cinema Hero 3D Pointer Depth ---- */
  var cinemaHero = document.querySelector(".hero--cinema");
  if (cinemaHero && motionOK && finePointer) {
    cinemaHero.addEventListener("pointermove", function (event) {
      var rect = cinemaHero.getBoundingClientRect();
      var nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      var ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      cinemaHero.style.setProperty("--mx", nx.toFixed(3));
      cinemaHero.style.setProperty("--my", ny.toFixed(3));
    });
    cinemaHero.addEventListener("pointerleave", function () {
      cinemaHero.style.setProperty("--mx", "0");
      cinemaHero.style.setProperty("--my", "0");
    });
  }

  /* ---- Optional Control-Room Ambient Audio Bed (Muted by Default) ---- */
  var ambientBtn = document.querySelector("[data-ambient-toggle]");
  var ambientState = { ctx: null, gain: null, active: false };
  if (ambientBtn) {
    ambientBtn.addEventListener("click", function () {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!ambientState.ctx) {
        try {
          var ctx = new AudioCtx();
          var master = ctx.createGain();
          master.gain.value = 0.0001;
          master.connect(ctx.destination);

          /* Filtered rainfall noise bed */
          var bufferSize = ctx.sampleRate * 3;
          var noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          var out = noiseBuffer.getChannelData(0);
          var lastOut = 0.0;
          for (var i = 0; i < bufferSize; i++) {
            var white = Math.random() * 2 - 1;
            out[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = out[i];
            out[i] *= 2.8;
          }
          var noise = ctx.createBufferSource();
          noise.buffer = noiseBuffer;
          noise.loop = true;

          var rainFilter = ctx.createBiquadFilter();
          rainFilter.type = "bandpass";
          rainFilter.frequency.value = 620;
          rainFilter.Q.value = 0.7;

          var rainGain = ctx.createGain();
          rainGain.gain.value = 0.09;
          noise.connect(rainFilter);
          rainFilter.connect(rainGain);
          rainGain.connect(master);
          noise.start(0);

          /* Low architectural room hum */
          var hum = ctx.createOscillator();
          hum.type = "sine";
          hum.frequency.value = 54;
          var humGain = ctx.createGain();
          humGain.gain.value = 0.035;
          hum.connect(humGain);
          humGain.connect(master);
          hum.start(0);

          ambientState.ctx = ctx;
          ambientState.gain = master;
        } catch (e) {
          return;
        }
      }

      if (ambientState.ctx.state === "suspended") {
        ambientState.ctx.resume().catch(function () {});
      }

      ambientState.active = !ambientState.active;
      var now = ambientState.ctx.currentTime;
      ambientState.gain.gain.cancelScheduledValues(now);
      ambientState.gain.gain.setTargetAtTime(ambientState.active ? 0.45 : 0.0001, now, 0.25);
      ambientBtn.setAttribute("aria-pressed", ambientState.active ? "true" : "false");
      var label = ambientBtn.querySelector("[data-ambient-label]");
      if (label) {
        label.textContent = ambientState.active ? "Ambient Audio: On" : "Ambient Audio: Off";
      }
    });
  }

  /* ---- Shared Web Audio Voice Audition Player + Canvas Visualizer ---- */
  var activeVoiceController = null;

  function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) return "00:00";
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  function createVoicePlayer(consoleEl) {
    var btn = consoleEl.querySelector("[data-voice-btn]");
    var btnText = consoleEl.querySelector("[data-voice-btn-text]");
    var canvas = consoleEl.querySelector("canvas.voice-scope");
    var timeEl = consoleEl.querySelector("[data-voice-time]");
    var statusEl = consoleEl.querySelector("[data-voice-status]");
    var lineEl = consoleEl.querySelector("[data-voice-line]");
    if (!btn || !canvas) return null;

    var ctx2d = canvas.getContext("2d");
    var audio = new Audio();
    audio.preload = "none";
    audio.crossOrigin = "anonymous";

    var audioCtx = null;
    var analyser = null;
    var freqData = null;
    var waveData = null;
    var rafId = 0;
    var currentSrc = consoleEl.getAttribute("data-audio-src") || "";

    function drawIdle(progressRatio) {
      if (!ctx2d) return;
      var w = canvas.width;
      var h = canvas.height;
      ctx2d.clearRect(0, 0, w, h);

      /* Subtle telemetry grid */
      ctx2d.strokeStyle = "rgba(243, 238, 226, 0.08)";
      ctx2d.lineWidth = 1;
      ctx2d.beginPath();
      ctx2d.moveTo(0, h / 2);
      ctx2d.lineTo(w, h / 2);
      ctx2d.stroke();

      var bars = 44;
      var gap = 4;
      var bw = Math.max(2, (w - gap * (bars + 1)) / bars);
      for (var i = 0; i < bars; i++) {
        var seed = Math.sin(i * 0.65) * 0.5 + 0.5;
        var amp = (0.12 + seed * 0.28) * h;
        var x = gap + i * (bw + gap);
        var ratio = i / bars;
        ctx2d.fillStyle = progressRatio && ratio <= progressRatio
          ? "#f05a28"
          : "rgba(211, 34, 24, 0.42)";
        ctx2d.fillRect(x, (h - amp) / 2, bw, amp);
      }
    }

    function drawLive() {
      if (!ctx2d || audio.paused || audio.ended) return;
      rafId = window.requestAnimationFrame(drawLive);

      var w = canvas.width;
      var h = canvas.height;
      ctx2d.clearRect(0, 0, w, h);

      /* Center line */
      ctx2d.strokeStyle = "rgba(243, 238, 226, 0.1)";
      ctx2d.lineWidth = 1;
      ctx2d.beginPath();
      ctx2d.moveTo(0, h / 2);
      ctx2d.lineTo(w, h / 2);
      ctx2d.stroke();

      if (analyser && freqData && waveData && motionOK) {
        analyser.getByteFrequencyData(freqData);
        analyser.getByteTimeDomainData(waveData);

        var bars = 44;
        var gap = 4;
        var bw = Math.max(2, (w - gap * (bars + 1)) / bars);
        var step = Math.max(1, Math.floor(freqData.length / bars));
        for (var i = 0; i < bars; i++) {
          var val = freqData[i * step] / 255;
          var bh = Math.max(4, val * (h * 0.86));
          var x = gap + i * (bw + gap);
          var grad = ctx2d.createLinearGradient(0, h - bh, 0, h);
          grad.addColorStop(0, "#f05a28");
          grad.addColorStop(1, "#d32218");
          ctx2d.fillStyle = grad;
          ctx2d.fillRect(x, (h - bh) / 2, bw, bh);
        }

        /* Crisp oscilloscope trace overlay */
        ctx2d.strokeStyle = "#f3eee2";
        ctx2d.lineWidth = 1.5;
        ctx2d.beginPath();
        var slice = w / waveData.length;
        for (var j = 0; j < waveData.length; j++) {
          var v = waveData[j] / 128.0;
          var y = (v * h) / 2;
          if (j === 0) ctx2d.moveTo(0, y);
          else ctx2d.lineTo(j * slice, y);
        }
        ctx2d.stroke();
      } else {
        var progress = audio.duration ? audio.currentTime / audio.duration : 0.5;
        drawIdle(progress);
      }

      if (timeEl) {
        timeEl.textContent = formatTime(audio.currentTime) + " / " + formatTime(audio.duration || 0);
      }
    }

    function ensureAudioGraph() {
      if (analyser) return;
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      try {
        audioCtx = new AudioCtx();
        var source = audioCtx.createMediaElementSource(audio);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.78;
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        freqData = new Uint8Array(analyser.frequencyBinCount);
        waveData = new Uint8Array(analyser.fftSize);
      } catch (e) {
        analyser = null;
      }
    }

    function stop() {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      audio.pause();
      btn.setAttribute("aria-pressed", "false");
      if (btnText) btnText.textContent = "Play Voice Audition";
      if (statusEl) statusEl.textContent = "Neural Voice Ready // Click to Audition";
      drawIdle(audio.duration ? audio.currentTime / audio.duration : 0);
    }

    function play() {
      if (!currentSrc) {
        if (statusEl) statusEl.textContent = "Voice Audition Staging";
        return;
      }
      if (activeVoiceController && activeVoiceController !== controller) {
        activeVoiceController.stop();
      }
      activeVoiceController = controller;

      if (audio.getAttribute("data-loaded-src") !== currentSrc) {
        audio.src = currentSrc;
        audio.setAttribute("data-loaded-src", currentSrc);
      }

      ensureAudioGraph();
      if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume().catch(function () {});
      }

      btn.setAttribute("aria-pressed", "true");
      if (btnText) btnText.textContent = "Pause Audition";
      if (statusEl) statusEl.textContent = "Transmitting // Live Neural Spectrum";

      var playPromise = audio.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(function () {
            drawLive();
          })
          .catch(function () {
            stop();
            if (statusEl) statusEl.textContent = "Tap again to enable audio playback";
          });
      } else {
        drawLive();
      }
    }

    audio.addEventListener("loadedmetadata", function () {
      if (timeEl) {
        timeEl.textContent = formatTime(audio.currentTime) + " / " + formatTime(audio.duration);
      }
    });

    audio.addEventListener("ended", function () {
      audio.currentTime = 0;
      stop();
      if (timeEl) timeEl.textContent = "00:00 / " + formatTime(audio.duration || 0);
      if (statusEl) statusEl.textContent = "Audition Complete // Replay Anytime";
    });

    audio.addEventListener("error", function () {
      stop();
      if (statusEl) statusEl.textContent = "Audio clip unavailable on this host";
    });

    btn.addEventListener("click", function () {
      if (audio.paused || audio.ended) play();
      else stop();
    });

    drawIdle(0);

    var controller = {
      play: play,
      stop: stop,
      setTrack: function (src, lineText, labelText, durationLabel) {
        stop();
        currentSrc = src || "";
        audio.currentTime = 0;
        audio.removeAttribute("data-loaded-src");
        if (lineEl && lineText) lineEl.textContent = lineText;
        if (timeEl) timeEl.textContent = "00:00 / " + (durationLabel || "00:14");
        if (statusEl) {
          statusEl.textContent = labelText || "Neural Voice Ready // Click to Audition";
        }
        drawIdle(0);
      }
    };

    return controller;
  }

  /* Initialize standalone inline voice players (individual character pages) */
  document.querySelectorAll("[data-voice-player]").forEach(function (el) {
    createVoicePlayer(el);
  });

  /* ---- 2026 AAA Character Select & Biometric Deck ---- */
  var primaryDeckController = null;

  document.querySelectorAll("[data-cast-deck]").forEach(function (deck, deckIndex) {
    var rosterBtns = Array.prototype.slice.call(deck.querySelectorAll(".roster-card"));
    var portraitRig = deck.querySelector(".portrait-rig");
    var stageWebp = deck.querySelector("[data-stage-webp]");
    var stageImg = deck.querySelector("[data-stage-img]");
    var stageFile = deck.querySelector("[data-stage-file]");
    var stageBadge = deck.querySelector("[data-stage-badge]");
    var stageCallsign = deck.querySelector("[data-stage-callsign]");
    var stageCoords = deck.querySelector("[data-stage-coords]");

    var intelOrigin = deck.querySelector("[data-intel-origin]");
    var intelName = deck.querySelector("[data-intel-name]");
    var intelStats = deck.querySelector("[data-intel-stats]");
    var intelBio = deck.querySelector("[data-intel-bio]");
    var intelQuote = deck.querySelector("[data-intel-quote]");
    var intelLink = deck.querySelector("[data-intel-link]");
    var nextBtn = deck.querySelector("[data-cast-next]");

    var meterThreat = deck.querySelector("[data-meter-threat]");
    var meterThreatVal = deck.querySelector("[data-meter-threat-val]");
    var meterLoyalty = deck.querySelector("[data-meter-loyalty]");
    var meterLoyaltyVal = deck.querySelector("[data-meter-loyalty-val]");
    var meterReach = deck.querySelector("[data-meter-reach]");
    var meterReachVal = deck.querySelector("[data-meter-reach-val]");

    var voiceConsole = deck.querySelector("[data-deck-voice]");
    var voiceCtrl = voiceConsole ? createVoicePlayer(voiceConsole) : null;

    var activeIdx = 0;

    function selectIndex(idx, shouldAutoPlay) {
      if (!rosterBtns.length) return;
      activeIdx = (idx + rosterBtns.length) % rosterBtns.length;
      var card = rosterBtns[activeIdx];

      rosterBtns.forEach(function (b, i) {
        var selected = i === activeIdx;
        b.setAttribute("aria-selected", selected ? "true" : "false");
        b.setAttribute("tabindex", selected ? "0" : "-1");
      });

      if (portraitRig) {
        portraitRig.classList.add("is-switching");
        window.setTimeout(function () {
          portraitRig.classList.remove("is-switching");
        }, 190);
      }

      var webp = card.getAttribute("data-img-webp") || "";
      var jpg = card.getAttribute("data-img-jpg") || "";
      var alt = card.getAttribute("data-img-alt") || "";
      if (stageWebp && webp) stageWebp.setAttribute("srcset", webp);
      if (stageImg && jpg) {
        stageImg.setAttribute("src", jpg);
        stageImg.setAttribute("alt", alt);
      }

      if (stageFile) stageFile.textContent = card.getAttribute("data-file") || "";
      if (stageBadge) stageBadge.textContent = card.getAttribute("data-badge") || "";
      if (stageCallsign) stageCallsign.textContent = card.getAttribute("data-callsign") || "";
      if (stageCoords) stageCoords.textContent = card.getAttribute("data-coords") || "";

      if (intelOrigin) intelOrigin.textContent = card.getAttribute("data-origin") || "";
      if (intelName) intelName.textContent = card.getAttribute("data-name") || "";
      if (intelBio) intelBio.textContent = card.getAttribute("data-bio") || "";
      if (intelQuote) intelQuote.textContent = card.getAttribute("data-quote") || "";

      if (intelStats) {
        var chips = (card.getAttribute("data-stats") || "").split("|").filter(Boolean);
        intelStats.innerHTML = "";
        chips.forEach(function (chipText) {
          var span = document.createElement("span");
          span.className = "stat-chip";
          span.textContent = chipText.trim();
          intelStats.appendChild(span);
        });
      }

      var threat = parseInt(card.getAttribute("data-threat") || "50", 10);
      var loyalty = parseInt(card.getAttribute("data-loyalty") || "50", 10);
      var reach = parseInt(card.getAttribute("data-reach") || "50", 10);

      if (meterThreat) meterThreat.style.setProperty("--meter", (threat / 100).toFixed(2));
      if (meterThreatVal) meterThreatVal.textContent = String(threat) + " / 100";
      if (meterLoyalty) meterLoyalty.style.setProperty("--meter", (loyalty / 100).toFixed(2));
      if (meterLoyaltyVal) meterLoyaltyVal.textContent = String(loyalty) + " / 100";
      if (meterReach) meterReach.style.setProperty("--meter", (reach / 100).toFixed(2));
      if (meterReachVal) meterReachVal.textContent = String(reach) + " / 100";

      if (intelLink) {
        var href = card.getAttribute("data-href") || "/characters";
        var ctaText = card.getAttribute("data-cta") || "Open full subject file";
        intelLink.setAttribute("href", href);
        intelLink.textContent = ctaText;
      }

      if (voiceCtrl) {
        var audioSrc = card.getAttribute("data-audio-src") || "";
        var audioLine = card.getAttribute("data-audio-line") || "";
        var voiceTag = card.getAttribute("data-voice-tag") || "Neural Voice Ready // Click to Audition";
        var durationLabel = card.getAttribute("data-duration") || "00:14";
        voiceCtrl.setTrack(audioSrc, audioLine, voiceTag, durationLabel);
        if (shouldAutoPlay) {
          voiceCtrl.play();
        }
      }
    }

    rosterBtns.forEach(function (btn, idx) {
      btn.addEventListener("click", function () {
        selectIndex(idx, false);
      });
      btn.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          selectIndex(idx + 1, false);
          rosterBtns[(idx + 1) % rosterBtns.length].focus();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          selectIndex(idx - 1, false);
          rosterBtns[(idx - 1 + rosterBtns.length) % rosterBtns.length].focus();
        }
      });
    });

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        selectIndex(activeIdx + 1, false);
      });
    }

    /* 3-Layer Portrait Rig Pointer Depth */
    if (portraitRig && motionOK && finePointer) {
      portraitRig.addEventListener("pointermove", function (e) {
        var rect = portraitRig.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        portraitRig.style.setProperty("--tilt-x", (-(py - 0.5) * 6).toFixed(2) + "deg");
        portraitRig.style.setProperty("--tilt-y", ((px - 0.5) * 7).toFixed(2) + "deg");
        portraitRig.style.setProperty("--glare-x", (px * 100).toFixed(1) + "%");
        portraitRig.style.setProperty("--glare-y", (py * 100).toFixed(1) + "%");
      });
      portraitRig.addEventListener("pointerleave", function () {
        portraitRig.style.setProperty("--tilt-x", "0deg");
        portraitRig.style.setProperty("--tilt-y", "0deg");
        portraitRig.style.setProperty("--glare-x", "50%");
        portraitRig.style.setProperty("--glare-y", "30%");
      });
    }

    if (deckIndex === 0) {
      primaryDeckController = {
        playCurrent: function () {
          if (voiceCtrl) voiceCtrl.play();
        }
      };
    }

    selectIndex(0, false);
  });

  /* Hero "Play Cast Voices" CTA shortcut */
  document.querySelectorAll("[data-auto-audition]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      window.setTimeout(function () {
        if (primaryDeckController) primaryDeckController.playCurrent();
      }, 320);
    });
  });

  /* ---- Interactive Cold Open Screenplay Viewer ---- */
  document.querySelectorAll("[data-script-viewer]").forEach(function (viewer) {
    var tabs = Array.prototype.slice.call(viewer.querySelectorAll("[data-script-tab]"));
    var scenes = Array.prototype.slice.call(viewer.querySelectorAll("[data-script-scene]"));
    var page = viewer.querySelector(".script-page");
    var modeBtn = viewer.querySelector("[data-script-mode]");

    function activateScene(targetId) {
      tabs.forEach(function (tab) {
        var active = tab.getAttribute("data-script-tab") === targetId;
        tab.setAttribute("aria-selected", active ? "true" : "false");
      });
      scenes.forEach(function (scene) {
        var active = scene.getAttribute("data-script-scene") === targetId;
        scene.hidden = !active;
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activateScene(tab.getAttribute("data-script-tab"));
      });
    });

    if (modeBtn && page) {
      modeBtn.addEventListener("click", function () {
        var isPaper = page.classList.toggle("is-paper");
        modeBtn.setAttribute("aria-pressed", isPaper ? "true" : "false");
        modeBtn.textContent = isPaper ? "Night Room Mode" : "Paper Script Mode";
      });
    }
  });

  /* ---- Interactive Tier-1 Story World Map Progression ---- */
  document.querySelectorAll("[data-world-route]").forEach(function (routeWrap) {
    var stopBtns = Array.prototype.slice.call(routeWrap.querySelectorAll("[data-route-stop]"));
    var svgNodes = Array.prototype.slice.call(routeWrap.querySelectorAll("[data-route-node]"));
    var coordsEl = routeWrap.querySelector("[data-route-coords]");
    var cityEl = routeWrap.querySelector("[data-route-city]");
    var subjectsEl = routeWrap.querySelector("[data-route-subjects]");
    var summaryEl = routeWrap.querySelector("[data-route-summary]");
    var pressureEl = routeWrap.querySelector("[data-route-pressure]");

    function selectStop(stopId) {
      var activeBtn = null;
      stopBtns.forEach(function (btn) {
        var match = btn.getAttribute("data-route-stop") === stopId;
        btn.setAttribute("aria-selected", match ? "true" : "false");
        if (match) activeBtn = btn;
      });
      svgNodes.forEach(function (node) {
        var match = node.getAttribute("data-route-node") === stopId;
        node.classList.toggle("is-active", match);
      });
      if (!activeBtn) return;

      if (coordsEl) coordsEl.textContent = activeBtn.getAttribute("data-coords") || "";
      if (cityEl) cityEl.textContent = activeBtn.getAttribute("data-city") || "";
      if (subjectsEl) subjectsEl.textContent = activeBtn.getAttribute("data-subjects") || "";
      if (summaryEl) summaryEl.textContent = activeBtn.getAttribute("data-summary") || "";
      if (pressureEl) pressureEl.textContent = activeBtn.getAttribute("data-pressure") || "";
    }

    stopBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        selectStop(btn.getAttribute("data-route-stop"));
      });
    });

    svgNodes.forEach(function (node) {
      node.addEventListener("click", function () {
        selectStop(node.getAttribute("data-route-node"));
      });
      node.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectStop(node.getAttribute("data-route-node"));
        }
      });
    });

    if (stopBtns.length) {
      selectStop(stopBtns[0].getAttribute("data-route-stop"));
    }
  });

  /* ---- Swipe dossier: buttons, keyboard, native drag and live counter ---- */
  document.querySelectorAll("[data-swipe-section]").forEach(function (section) {
    var rail = section.querySelector("[data-swipe-rail]");
    var cards = Array.prototype.slice.call(section.querySelectorAll(".swipe-card"));
    var previous = section.querySelector("[data-swipe-prev]");
    var next = section.querySelector("[data-swipe-next]");
    var count = section.querySelector("[data-swipe-count]");
    if (!rail || !cards.length) return;

    function stepWidth() {
      if (cards.length < 2) return cards[0].getBoundingClientRect().width;
      return Math.abs(cards[1].offsetLeft - cards[0].offsetLeft);
    }

    function move(direction) {
      rail.scrollBy({ left: stepWidth() * direction, behavior: motionOK ? "smooth" : "auto" });
    }

    if (previous) previous.addEventListener("click", function () { move(-1); });
    if (next) next.addEventListener("click", function () { move(1); });

    rail.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      }
    });

    var countQueued = false;
    function updateCount() {
      countQueued = false;
      var target = rail.scrollLeft + rail.clientWidth * 0.24;
      var activeIndex = 0;
      var nearest = Infinity;
      cards.forEach(function (card, index) {
        var distance = Math.abs(card.offsetLeft - target);
        if (distance < nearest) {
          nearest = distance;
          activeIndex = index;
        }
      });
      if (count) {
        count.textContent =
          String(activeIndex + 1).padStart(2, "0") +
          " / " +
          String(cards.length).padStart(2, "0");
      }
    }

    rail.addEventListener("scroll", function () {
      if (!countQueued) {
        countQueued = true;
        window.requestAnimationFrame(updateCount);
      }
    }, { passive: true });

    if (finePointer) {
      var dragging = false;
      var startX = 0;
      var startScroll = 0;
      var dragged = false;

      rail.addEventListener("pointerdown", function (event) {
        if (event.button !== 0) return;
        dragging = true;
        dragged = false;
        startX = event.clientX;
        startScroll = rail.scrollLeft;
        rail.setPointerCapture(event.pointerId);
      });

      rail.addEventListener("pointermove", function (event) {
        if (!dragging) return;
        var delta = event.clientX - startX;
        if (Math.abs(delta) > 5) dragged = true;
        rail.scrollLeft = startScroll - delta;
      });

      function endDrag(event) {
        if (!dragging) return;
        dragging = false;
        if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
      }

      rail.addEventListener("pointerup", endDrag);
      rail.addEventListener("pointercancel", endDrag);
      rail.addEventListener("click", function (event) {
        if (dragged) {
          event.preventDefault();
          event.stopPropagation();
          dragged = false;
        }
      }, true);
    }

    updateCount();
  });

  /* ---- Fine-pointer depth on evidence cards ---- */
  if (motionOK && finePointer) {
    document.querySelectorAll("[data-depth-card]").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        var rect = card.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width - 0.5;
        var y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--tilt-x", (-y * 4).toFixed(2) + "deg");
        card.style.setProperty("--tilt-y", (x * 5).toFixed(2) + "deg");
      });
      card.addEventListener("pointerleave", function () {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  /* ---- Lazy-start the evidence video, pause under reduced motion ---- */
  var video = document.querySelector("video[data-autoplay]");
  if (video && motionOK && "IntersectionObserver" in window) {
    var vio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            video.play().catch(function () {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    vio.observe(video);
  }

  /* ---- Resilient Garnier Dossier Lead Capture ---- */
  var DEFAULT_ENDPOINT = "/api/dossier-leads";
  var STORAGE_KEY = "ineptocracy.dossierLeads";

  function resolveEndpoint() {
    var meta = document.querySelector(
      'meta[name="ineptocracy-dossier-endpoint"], meta[name="ineptocracy-newsletter-endpoint"]'
    );
    var metaValue = meta && meta.content ? meta.content.trim() : "";
    return (
      (window.INEPTOCRACY_DOSSIER_ENDPOINT || "").trim() ||
      metaValue ||
      (window.INEPTOCRACY_NEWSLETTER_ENDPOINT || "").trim() ||
      DEFAULT_ENDPOINT
    );
  }

  function isSameOrigin(url) {
    if (url.indexOf("/") === 0) return true;
    try {
      return new URL(url, window.location.href).origin === window.location.origin;
    } catch (e) {
      return false;
    }
  }

  function utmParams() {
    var search = new URLSearchParams(window.location.search);
    return {
      utmSource: search.get("utm_source") || undefined,
      utmMedium: search.get("utm_medium") || undefined,
      utmCampaign: search.get("utm_campaign") || undefined,
      utmContent: search.get("utm_content") || undefined,
      utmTerm: search.get("utm_term") || undefined
    };
  }

  function submitLead(data) {
    var endpoint = resolveEndpoint();
    var lead = Object.assign(
      {
        email: data.email,
        firstName: (data.firstName || "").trim() || undefined,
        source: data.source,
        sourcePage: window.location.pathname,
        project: "The Ironic Ineptocracy",
        capturedAt: new Date().toISOString(),
        pageUrl: window.location.href
      },
      utmParams()
    );

    try {
      var stored = window.localStorage.getItem(STORAGE_KEY);
      var leads = stored ? JSON.parse(stored) : [];
      var idx = leads.findIndex(function (l) { return l.email === lead.email; });
      if (idx >= 0) leads[idx] = lead;
      else leads.push(lead);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {}

    if (isSameOrigin(endpoint)) {
      return fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
        keepalive: true
      }).then(function (res) {
        return res
          .json()
          .catch(function () { return {}; })
          .then(function (body) {
            if (!res.ok || !body.ok) {
              var err = new Error(body.error || "Dossier lead endpoint returned " + res.status);
              err.httpStatus = res.status;
              throw err;
            }
            return { delivered: true };
          });
      });
    }

    var params = new URLSearchParams();
    params.set("email", lead.email);
    params.set("fields[email]", lead.email);
    if (lead.firstName) {
      params.set("firstName", lead.firstName);
      params.set("fields[name]", lead.firstName);
    }
    params.set("source", lead.source);
    params.set("project", lead.project);
    params.set("capturedAt", lead.capturedAt);
    params.set("sourcePage", lead.sourcePage);
    params.set("pageUrl", lead.pageUrl);
    params.set("userAgent", window.navigator.userAgent);
    ["utmSource", "utmMedium", "utmCampaign", "utmContent", "utmTerm"].forEach(function (key) {
      if (lead[key]) params.set(key, lead[key]);
    });
    return fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: params.toString(),
      keepalive: true
    }).then(function () {
      return { delivered: true };
    });
  }

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function revealDossierPreview(form) {
    var targetId = form.getAttribute("data-preview-target");
    var preview = targetId
      ? document.getElementById(targetId)
      : document.querySelector("[data-dossier-preview]");
    if (preview) {
      preview.hidden = false;
      preview.scrollIntoView({ behavior: motionOK ? "smooth" : "auto", block: "nearest" });
    }
  }

  document.querySelectorAll("form[data-signup]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var button = form.querySelector('button[type="submit"]');
      var email = form.querySelector('input[type="email"]');
      var name = form.querySelector('input[name="firstName"]');
      var buttonLabel = button ? button.textContent : "";

      function setStatus(text, cls, linkHref, linkText) {
        if (!status) return;
        status.textContent = text;
        status.classList.remove("is-success", "is-error");
        if (cls) status.classList.add(cls);
        if (linkHref) {
          status.appendChild(document.createTextNode(" "));
          var a = document.createElement("a");
          a.href = linkHref;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.textContent = linkText;
          status.appendChild(a);
        }
      }

      if (!email || !EMAIL_RE.test(email.value.trim())) {
        setStatus(
          form.getAttribute("data-error") || "TRANSMISSION FAILED. Check the address and try again.",
          "is-error"
        );
        return;
      }

      if (button) {
        button.disabled = true;
        button.textContent = form.getAttribute("data-pending-label") || "Opening file";
      }
      setStatus(form.getAttribute("data-pending") || "Opening the channel.", "");

      submitLead({
        email: email.value.trim(),
        firstName: name ? name.value : "",
        source: form.getAttribute("data-signup") || "site"
      })
        .then(function () {
          setStatus(
            form.getAttribute("data-success") || "ACCESS GRANTED. The first file is unlocked below.",
            "is-success",
            form.getAttribute("data-success-href"),
            form.getAttribute("data-success-link-text")
          );
          revealDossierPreview(form);
          form.reset();
        })
        .catch(function () {
          /* Resilient fallback: if mail relay env vars are pending or on static preview,
             still log address locally and unlock the spoiler-safe Garnier Dossier preview. */
          var targetId = form.getAttribute("data-preview-target");
          var hasPreview = Boolean(
            (targetId && document.getElementById(targetId)) ||
            document.querySelector("[data-dossier-preview]")
          );
          if (hasPreview) {
            setStatus(
              "CLEARANCE LOGGED. Instant spoiler-safe Garnier Dossier preview unlocked below.",
              "is-success"
            );
            revealDossierPreview(form);
            form.reset();
          } else {
            setStatus(
              form.getAttribute("data-error") || "TRANSMISSION FAILED. Check the address and try again.",
              "is-error"
            );
          }
        })
        .then(function () {
          if (button) {
            button.disabled = false;
            button.textContent = buttonLabel;
          }
        });
    });
  });
})();
