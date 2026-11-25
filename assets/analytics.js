/* Your Insurance Pro: site traffic stats.
   - Cloudflare Web Analytics: cookieless, always on (counts visits, no personal data).
   - Google Analytics 4: loads ONLY after the visitor taps "Accept" on the cookie notice.
   Choice is remembered in this browser; "Cookie settings" link in the footer reopens it. */
(function () {
  var CF_TOKEN = "41b3bd086dab435692b5edc115a4d7ca";      // Cloudflare Web Analytics beacon token
  var GA_ID = "G-0KTN9TCDMH";            // Google Analytics 4 measurement ID (G-...)
  var KEY = "yip-analytics-consent";  // "yes" | "no"

  function add(src, attrs) {
    var s = document.createElement("script");
    s.src = src; s.defer = true;
    for (var k in attrs) s.setAttribute(k, attrs[k]);
    document.head.appendChild(s);
  }
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  if (CF_TOKEN.indexOf("__") !== 0) {
    add("https://static.cloudflareinsights.com/beacon.min.js", { "data-cf-beacon": JSON.stringify({ token: CF_TOKEN }) });
  }

  var gaLoaded = false;
  function loadGA() {
    if (gaLoaded || GA_ID.indexOf("G-") !== 0) return;
    gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });
    add("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID), {});
  }

  function banner() {
    if (document.getElementById("yip-consent")) return;
    var css = document.createElement("style");
    css.textContent =
      "#yip-consent{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:2147483000;" +
      "max-width:560px;margin:0 auto;background:#10274a;color:#fff;border-radius:12px;padding:14px 16px;" +
      "box-shadow:0 8px 30px rgba(0,0,0,.3);font:14px/1.45 -apple-system,Segoe UI,Arial,sans-serif}" +
      "#yip-consent p{margin:0 0 10px}#yip-consent a{color:#9fe3da}" +
      "#yip-consent .b{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap}" +
      "#yip-consent button{font:600 14px/1 inherit;border-radius:8px;padding:10px 16px;cursor:pointer;border:1px solid #fff}" +
      "#yip-consent .y{background:#1fa89a;border-color:#1fa89a;color:#fff}#yip-consent .n{background:transparent;color:#fff}";
    document.head.appendChild(css);
    var d = document.createElement("div");
    d.id = "yip-consent"; d.setAttribute("role", "dialog"); d.setAttribute("aria-label", "Cookie notice");
    var root = (location.pathname.split("/").length > 2) ? "../" : "";
    d.innerHTML = "<p>We use cookies from Google Analytics to see which pages help visitors most. " +
      "No ads, and we never sell your info. <a href='" + root + "privacy.html#analytics'>Privacy policy</a></p>" +
      "<div class='b'><button class='n' type='button'>No thanks</button><button class='y' type='button'>Accept</button></div>";
    d.querySelector(".y").onclick = function () { set("yes"); d.remove(); loadGA(); };
    d.querySelector(".n").onclick = function () { set("no"); d.remove(); };
    document.body.appendChild(d);
  }

  window.yipCookieSettings = function () { banner(); return false; };

  function start() {
    var c = get();
    if (c === "yes") loadGA();
    else if (c !== "no" && GA_ID.indexOf("G-") === 0) banner();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
