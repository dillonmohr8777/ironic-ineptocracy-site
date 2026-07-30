/* The Ironic Ineptocracy — site behavior
   1. nav toggle  2. motion-safe scroll reveals  3. dossier signup form
   The form handler preserves the lead-capture contract of the previous build:
   localStorage first, then POST to the endpoint resolved from
   window.INEPTOCRACY_DOSSIER_ENDPOINT -> meta tags -> /api/dossier-leads. */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  var motionOK = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  if (motionOK) document.documentElement.classList.add("motion-ok");

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
      { rootMargin: "0px 0px -10% 0px" }
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
      var heroProgress = clamp(-heroRect.top / Math.max(heroRect.height * 0.72, 1), 0, 1);
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

    if (window.matchMedia("(pointer: fine)").matches) {
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

  /* ---- Fine-pointer depth on evidence cards; zero effect for touch/reduced motion ---- */
  if (motionOK && window.matchMedia("(pointer: fine)").matches) {
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
  if (video) {
    if (motionOK && "IntersectionObserver" in window) {
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
  }

  /* ---- Dossier lead capture ---- */
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
              throw new Error(body.error || "Dossier lead endpoint returned " + res.status);
            }
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
    });
  }

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
        setStatus(form.getAttribute("data-error") ||
          "TRANSMISSION FAILED. Check the address and try again.", "is-error");
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
            form.getAttribute("data-success") || "ACCESS GRANTED. The first file is queued.",
            "is-success",
            form.getAttribute("data-success-href"),
            form.getAttribute("data-success-link-text")
          );
          form.reset();
        })
        .catch(function () {
          setStatus(form.getAttribute("data-error") ||
            "TRANSMISSION FAILED. Check the address and try again.", "is-error");
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
