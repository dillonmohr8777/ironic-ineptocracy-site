/* The Ironic Ineptocracy — site behavior
   1. nav toggle  2. motion-safe scroll reveals  3. dossier signup form
   The form handler preserves the lead-capture contract of the previous build:
   localStorage first, then POST to the endpoint resolved from
   window.INEPTOCRACY_DOSSIER_ENDPOINT -> meta tags -> /api/dossier-leads. */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
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
  var motionOK = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  var reveals = document.querySelectorAll(".reveal");
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
