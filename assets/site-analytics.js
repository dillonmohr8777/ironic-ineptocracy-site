// Site-wide analytics loader. IDs live in <meta> tags on every prerendered
// page so the minified SPA bundle never needs a rebuild:
//   <meta name="ga4-measurement-id" content="G-XXXXXXXXXX">
//   <meta name="meta-pixel-id" content="1234567890">
// Run scripts/set-analytics-ids.mjs to stamp real IDs across every page.
(function () {
  function metaContent(name) {
    var el = document.querySelector('meta[name="' + name + '"]');
    var value = el && el.content ? el.content.trim() : "";
    return value && value.indexOf("REPLACE") === -1 ? value : "";
  }

  var ga4Id = metaContent("ga4-measurement-id");
  var pixelId = metaContent("meta-pixel-id");

  if (ga4Id && /^G-[A-Z0-9]+$/.test(ga4Id)) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + ga4Id;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", ga4Id, { send_page_view: true });

    // SPA route changes: re-fire page_view when the router pushes state.
    var push = history.pushState;
    history.pushState = function () {
      push.apply(this, arguments);
      window.gtag("event", "page_view", {
        page_location: window.location.href,
        page_title: document.title,
      });
    };
    window.addEventListener("popstate", function () {
      window.gtag("event", "page_view", {
        page_location: window.location.href,
        page_title: document.title,
      });
    });
  }

  if (pixelId && /^[0-9]{5,}$/.test(pixelId)) {
    !(function (f, b, e, v, n, t) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      b.getElementsByTagName(e)[0].parentNode.insertBefore(t, b.getElementsByTagName(e)[0]);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
  }

  // Conversion tracking: the dossier signup form lives inside the SPA, so a
  // document-level submit listener catches it without touching the bundle.
  document.addEventListener(
    "submit",
    function (event) {
      var form = event.target;
      if (!form || !form.querySelector) return;
      var emailField = form.querySelector('input[type="email"]');
      if (!emailField) return;
      if (window.gtag) {
        window.gtag("event", "generate_lead", {
          lead_source: window.location.pathname,
        });
      }
      if (window.fbq) window.fbq("track", "Lead");
    },
    true
  );
})();
