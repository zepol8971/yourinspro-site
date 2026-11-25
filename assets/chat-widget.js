/* Your Insurance Pro - scripted (non-AI) chat assistant.
   No third-party services. Lead submissions go to the same FormSubmit endpoint as quote.html.
   Bookings are handled on /book/. */
(function () {
  'use strict';
  if (window.__yipChat) return;
  window.__yipChat = true;

  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/Quotes@YourInsPro.com';
  var PHONE_DISPLAY = '904-JOSE-PRO (904-567-3776)';
  var SMS = 'sms:+19045673776';
  var LINES = ['Home', 'Auto', 'Renters', 'Condo', 'Landlord', 'Life', 'Business', 'Flood', 'Other'];

  var script = document.currentScript;
  var BASE = script && script.src ? script.src.replace(/assets\/chat-widget\.js.*$/, '') : '/';
  var site = { hours: 'Mon-Fri 9-5 ET', carriers_note: 'Home, auto, life & business carriers' };

  var SVG_NS = 'http://www.w3.org/2000/svg';
  function icon(d) {
    var s = document.createElementNS(SVG_NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('focusable', 'false');
    var p = document.createElementNS(SVG_NS, 'path');
    p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', 'currentColor');
    p.setAttribute('stroke-width', '2'); p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round');
    s.appendChild(p); return s;
  }
  var ICON_CHAT = 'M4 5h16v11H9l-5 4z';
  var ICON_X = 'M6 6l12 12M18 6L6 18';

  function el(tag, cls, text, attrs) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  var root = el('div', 'yip-chat');
  var launch = el('button', 'yip-chat-launch', null, { type: 'button', 'aria-haspopup': 'dialog', 'aria-expanded': 'false' });
  launch.appendChild(icon(ICON_CHAT)); launch.appendChild(document.createTextNode('Chat with us'));
  var panel = el('div', 'yip-chat-panel', null, { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'yip-chat-title' });
  panel.hidden = true;
  var head = el('div', 'yip-chat-head');
  var ht = el('h2', null, null, { id: 'yip-chat-title' });
  ht.appendChild(document.createTextNode('Your Insurance Pro'));
  ht.appendChild(el('small', null, 'Automated assistant'));
  var closeBtn = el('button', 'yip-chat-x', null, { type: 'button', 'aria-label': 'Close chat' });
  closeBtn.appendChild(icon(ICON_X));
  head.appendChild(ht); head.appendChild(closeBtn);
  var log = el('div', 'yip-chat-log', null, { role: 'log', 'aria-live': 'polite', 'aria-label': 'Conversation' });
  var acts = el('div', 'yip-chat-acts', null, { 'aria-label': 'Quick options' });
  var formWrap = null;
  panel.appendChild(head); panel.appendChild(log); panel.appendChild(acts);
  root.appendChild(launch); root.appendChild(panel);

  function say(text, who, link) {
    var m = el('div', 'yip-chat-msg ' + (who === 'me' ? 'yip-chat-me' : 'yip-chat-bot'));
    m.appendChild(document.createTextNode(text));
    if (link) { m.appendChild(document.createTextNode(' ')); m.appendChild(link); }
    log.appendChild(m); log.scrollTop = log.scrollHeight;
  }
  function btn(label, fn, primary) {
    var b = el('button', 'yip-chat-btn' + (primary ? ' primary' : ''), label, { type: 'button' });
    b.addEventListener('click', fn); return b;
  }
  function linkBtn(label, href, primary) {
    return el('a', 'yip-chat-btn' + (primary ? ' primary' : ''), label, { href: href });
  }
  function setActs(items) {
    acts.textContent = '';
    items.forEach(function (i) { acts.appendChild(i); });
  }

  function mainMenu() {
    setActs([
      btn('Get a quote', function () { say('Get a quote', 'me'); leadForm('quote'); }),
      btn('Quick question', function () { say('Quick question', 'me'); faqMenu(); }),
      btn('Request a callback', function () { say('Request a callback', 'me'); leadForm('callback'); }),
      btn('Book a virtual meeting', function () { say('Book a virtual meeting', 'me'); bookMeeting(); }),
      btn('Text Jose', function () { say('Text Jose', 'me'); textJose(); })
    ]);
  }

  function backBtn() { return btn('Back to menu', function () { removeForm(); mainMenu(); }); }

  function textJose() {
    say('You can text Jose at ' + PHONE_DISPLAY + '.', 'bot');
    setActs([linkBtn('Text 904-JOSE-PRO', SMS, true), backBtn()]);
  }
  function bookMeeting() {
    say('Pick a day and time for a virtual meeting on our booking page.', 'bot');
    setActs([linkBtn('Open booking page', BASE + 'book/', true), backBtn()]);
  }

  var FAQ = [
    ['What do you write?', function () {
      return 'We help with home, auto, renters, condo, landlord, life, business and flood insurance. ' + (site.carriers_note || '') + '.';
    }],
    ['Where are you?', function () {
      return 'Your Insurance Pro serves Clay County, Florida and the surrounding Northeast Florida area, and Jose is licensed in FL, CT, GA, LA, MS and VA.';
    }],
    ['What are your hours?', function () {
      return 'Office hours: ' + (site.hours || 'Mon-Fri 9-5 ET') + '. You can text Jose anytime at ' + PHONE_DISPLAY + '.';
    }],
    ['Are you independent?', function () {
      return 'Yes. We are an independent agency and shop multiple carriers to compare options for you.';
    }],
    ['How fast is a quote?', function () {
      return 'Most requests are answered the same business day, once Jose has the basics.';
    }]
  ];
  function faqMenu() {
    say('What would you like to know?', 'bot');
    var items = FAQ.map(function (f) {
      return btn(f[0], function () { say(f[0], 'me'); say(f[1](), 'bot'); faqAfter(); });
    });
    items.push(btn('Something else', function () { say('Something else', 'me'); personal(); }));
    items.push(backBtn());
    setActs(items);
  }
  function faqAfter() {
    setActs([btn('Another question', faqMenu), btn('Request a callback', function () { leadForm('callback'); }), backBtn()]);
  }
  function personal() {
    say('Jose will answer that personally — want a callback?', 'bot');
    setActs([btn('Request a callback', function () { leadForm('callback'); }, true), linkBtn('Text 904-JOSE-PRO', SMS), backBtn()]);
  }

  function removeForm() {
    if (formWrap) { formWrap.remove(); formWrap = null; }
    log.hidden = false; acts.hidden = false;
  }

  var opened = 0;
  function leadForm(kind) {
    removeForm();
    say(kind === 'quote' ? 'Great. Tell me a little about what you need.' : 'Happy to set up a callback. Where should Jose reach you?', 'bot');
    log.hidden = true; acts.hidden = true;
    var f = el('form', 'yip-chat-form', null, { novalidate: 'novalidate', 'aria-label': kind === 'quote' ? 'Quote request' : 'Callback request' });
    var n = 0;
    function field(label, tag, attrs, req) {
      var id = 'yip-f-' + (++n);
      f.appendChild(el('label', 'l', label + (req ? ' *' : ''), { 'for': id }));
      var i = el(tag, null, null, attrs); i.id = id;
      if (req) i.setAttribute('aria-required', 'true');
      f.appendChild(i); return i;
    }
    var name = field('Full name', 'input', { type: 'text', autocomplete: 'name', maxlength: '100' }, true);
    var phone = field('Phone', 'input', { type: 'tel', autocomplete: 'tel', maxlength: '30' }, true);
    var email = field('Email', 'input', { type: 'email', autocomplete: 'email', maxlength: '120' }, true);
    var type = field('Insurance type', 'select', {}, true);
    type.appendChild(el('option', null, 'Choose one', { value: '' }));
    LINES.forEach(function (l) { type.appendChild(el('option', null, l, { value: l })); });
    var when = field('Best time to call', 'input', { type: 'text', maxlength: '80', placeholder: 'e.g. weekdays after 3 PM' }, true);
    var note = field('Short note (optional)', 'textarea', { rows: '3', maxlength: '500' }, false);
    f.appendChild(el('div', 'yip-chat-warn', "Please don't send Social Security, driver's license, or bank numbers here.", { role: 'note' }));
    var cl = el('label', 'yip-chat-consent');
    var cb = el('input', null, null, { type: 'checkbox', 'aria-required': 'true' });
    var cs = el('span');
    cs.appendChild(document.createTextNode('I agree that Your Insurance Pro may contact me at the phone number and email I provided by call, text message and email, including calls and texts sent using automated technology, about insurance quotes, policies and services from Your Insurance Pro. Message frequency varies. Message and data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase. See our '));
    cs.appendChild(el('a', null, 'Privacy Policy', { href: BASE + 'privacy.html', target: '_blank', rel: 'noopener' }));
    cs.appendChild(document.createTextNode(' and '));
    cs.appendChild(el('a', null, 'Terms', { href: BASE + 'terms.html', target: '_blank', rel: 'noopener' }));
    cs.appendChild(document.createTextNode('. *'));
    cl.appendChild(cb); cl.appendChild(cs); f.appendChild(cl);
    var honey = el('input', null, null, { type: 'text', name: '_honey', tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true' });
    honey.style.display = 'none'; f.appendChild(honey);
    var err = el('div', 'yip-chat-err', null, { role: 'alert' }); f.appendChild(err);
    var row = el('div', 'row');
    var send = el('button', 'yip-chat-btn primary', kind === 'quote' ? 'Send quote request' : 'Request callback', { type: 'submit' });
    var cancel = btn('Cancel', function () { removeForm(); mainMenu(); });
    row.appendChild(send); row.appendChild(cancel); f.appendChild(row);

    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (honey.value) return;
      if (Date.now() - opened < 4000) { err.textContent = 'Please review your details and press send again.'; return; }
      var v = function (x) { return x.value.trim(); };
      if (!v(name)) { err.textContent = 'Please enter your name.'; name.focus(); return; }
      if (v(phone).replace(/\D/g, '').length < 10) { err.textContent = 'Please enter a 10-digit phone number.'; phone.focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v(email))) { err.textContent = 'Please enter a valid email.'; email.focus(); return; }
      if (!type.value) { err.textContent = 'Please choose an insurance type.'; type.focus(); return; }
      if (!v(when)) { err.textContent = 'Please tell us the best time to call.'; when.focus(); return; }
      if (!cb.checked) { err.textContent = 'Please check the consent box so we can contact you.'; cb.focus(); return; }
      err.textContent = '';
      var data = {
        _subject: 'Website chat - ' + (kind === 'quote' ? 'Get a quote' : 'Callback request'),
        _template: 'table', _captcha: 'false',
        source: 'chat-widget', 'Request type': kind === 'quote' ? 'Get a quote' : 'Callback',
        Name: v(name), Phone: v(phone), Email: v(email), 'Coverage wanted': type.value,
        'Best time to call': v(when), Notes: v(note),
        _honey: honey.value,
        'Contact consent': 'Yes',
        'Consent wording': cs.textContent,
        'Consent timestamp': new Date().toISOString(),
        'Page URL': location.href
      };
      send.disabled = true; send.textContent = 'Sending...';
      fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (!res.ok || String(res.j && res.j.success) === 'false') throw new Error('fail');
          removeForm();
          say('Thanks, ' + v(name) + '! Your request was sent to Jose. He will reach out ' + (kind === 'quote' ? 'the same business day' : 'at your requested time') + '.', 'bot');
          setActs([backBtn()]);
          focusFirst();
        })
        .catch(function () {
          send.disabled = false; send.textContent = kind === 'quote' ? 'Send quote request' : 'Request callback';
          err.textContent = "Sorry, that didn't go through. Please text or call " + PHONE_DISPLAY + '.';
        });
    });
    formWrap = f;
    panel.insertBefore(f, acts);
    opened = Date.now();
    name.focus();
  }

  function focusables() {
    return Array.prototype.filter.call(panel.querySelectorAll('button,a[href],input,select,textarea'), function (e) {
      return !e.disabled && e.tabIndex !== -1 && !e.closest('[hidden]') && e.offsetParent !== null;
    });
  }
  function focusFirst() {
    var f = focusables(); var t = acts.querySelector('button,a') || f[0] || closeBtn; t.focus();
  }

  var started = false;
  function open() {
    panel.hidden = false; launch.hidden = true; launch.setAttribute('aria-expanded', 'true');
    if (!started) {
      started = true;
      say("Hi! I'm Your Insurance Pro's automated assistant. I can answer quick questions, get your info to Jose, or set up a call.", 'bot');
      mainMenu();
    }
    focusFirst();
  }
  function close() {
    panel.hidden = true; launch.hidden = false; launch.setAttribute('aria-expanded', 'false');
    launch.focus();
  }
  launch.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  panel.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    var f = focusables(); if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    else if (!panel.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
  });

  function buildBar() {
    var bar = el('nav', 'yip-bar', null, { 'aria-label': 'Call or text Jose' });
    var c = el('a', 'yip-bar-btn', null, { href: 'tel:+19045673776', 'aria-label': 'Call Jose at 904-567-3776' });
    c.appendChild(icon('M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z')); c.appendChild(document.createTextNode('Call'));
    var t = el('a', 'yip-bar-btn alt', null, { href: SMS, 'aria-label': 'Text Jose at 904-567-3776' });
    t.appendChild(icon('M4 5h16v11H9l-5 4z')); t.appendChild(document.createTextNode('Text Jose'));
    bar.appendChild(c); bar.appendChild(t); return bar;
  }
  function buildMenu() {
    var host = document.querySelector('header .bar .actions') || document.querySelector('header .bar');
    if (!host) return;
    var b = el('button', 'yip-menu-btn', null, { type: 'button', 'aria-label': 'Open menu', 'aria-expanded': 'false', 'aria-controls': 'yip-menu' });
    b.appendChild(icon('M4 7h16M4 12h16M4 17h16'));
    var m = el('nav', 'yip-menu', null, { id: 'yip-menu', 'aria-label': 'Site menu' }); m.hidden = true;
    [['Home', 'index.html'], ['Book a meeting', 'book/'], ['Get a quote', 'quote.html'], ['Carriers & Help', 'carriers.html']].forEach(function (l) {
      m.appendChild(el('a', null, l[0], { href: BASE + l[1] }));
    });
    function set(o) { m.hidden = !o; b.setAttribute('aria-expanded', String(o)); b.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); }
    b.addEventListener('click', function () { set(m.hidden); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !m.hidden) { set(false); b.focus(); } });
    document.addEventListener('click', function (e) { if (!m.hidden && !m.contains(e.target) && !b.contains(e.target)) set(false); });
    host.appendChild(b);
    (document.querySelector('header') || document.body).appendChild(m);
  }
  function init() {
    var css = el('link', null, null, { rel: 'stylesheet', href: BASE + 'assets/chat-widget.css' });
    document.head.appendChild(css);
    document.body.appendChild(root);
    document.body.appendChild(buildBar());
    document.body.classList.add('yip-has-bar');
    buildMenu();
    fetch(BASE + 'content/site.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (j) { if (j.hours) site.hours = j.hours; if (j.carriers_note) site.carriers_note = j.carriers_note; })
      .catch(function () {});
  }
  if (document.body) init(); else document.addEventListener('DOMContentLoaded', init);
})();
