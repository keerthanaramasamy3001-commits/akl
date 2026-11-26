// ---- Edit these settings ----
const CONFIG = {
  email: 'info@akrealitycore.com',      // enquiries are addressed here
  videoFile: '',                        // e.g. 'videos/company.mp4'
  social: { fb: '', in: '', yt: '', ig: '' } // paste your page links
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile menu and dropdowns
const nav = $('#nav'), menuBtn = $('.menu-btn');
function closeMenus() {
  nav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  $$('.has-drop').forEach(li => {
    li.classList.remove('open');
    $('.drop-btn', li).setAttribute('aria-expanded', 'false');
  });
}
menuBtn.addEventListener('click', () => {
  menuBtn.setAttribute('aria-expanded', nav.classList.toggle('open'));
});
$$('.drop-btn').forEach(btn => btn.addEventListener('click', () => {
  btn.setAttribute('aria-expanded', btn.parentElement.classList.toggle('open'));
}));
$$('#nav a, .quote').forEach(a => a.addEventListener('click', () => {
  closeMenus();
  a.blur();
}));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenus(); });

// Pre-select the service in the enquiry form
$$('[data-service]').forEach(a => a.addEventListener('click', () => {
  $('#service').value = a.dataset.service;
}));

// Highlight the menu item for the section on screen
const links = $$('.nav-link');
function spy() {
  const line = $('.header').offsetHeight + 80;
  let current = 'home';
  links.forEach(link => {
    const target = $(link.getAttribute('href'));
    if (target.getBoundingClientRect().top <= line) current = target.id;
  });
  if (innerHeight + scrollY >= document.body.scrollHeight - 2) current = 'contact';
  links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
}
addEventListener('scroll', spy, { passive: true });
spy();

// Hero slider
const slides = $$('.slide'), hero = $('.hero');
let index = 0, timer;
function show(n) {
  slides[index].classList.remove('active');
  index = (n + slides.length) % slides.length;
  slides[index].classList.add('active');
}
function stop() { clearInterval(timer); }
function play() { stop(); if (!calm) timer = setInterval(() => show(index + 1), 6000); }
$('.prev').addEventListener('click', () => { show(index - 1); play(); });
$('.next').addEventListener('click', () => { show(index + 1); play(); });
hero.addEventListener('mouseenter', stop);
hero.addEventListener('mouseleave', play);
play();

// Video popup
const box = $('#video-box');
$$('[data-video]').forEach(b => b.addEventListener('click', () => {
  if (CONFIG.videoFile) {
    $('#video-area').innerHTML = '';
    const video = document.createElement('video');
    Object.assign(video, { src: CONFIG.videoFile, controls: true, autoplay: true });
    $('#video-area').append(video);
  }
  stop();
  box.showModal();
}));
$('.close').addEventListener('click', () => box.close());
box.addEventListener('click', e => { if (e.target === box) box.close(); });
box.addEventListener('close', () => { const v = $('video', box); if (v) v.pause(); play(); });

// Social links
$$('[data-social]').forEach(a => {
  const url = CONFIG.social[a.dataset.social];
  if (url) Object.assign(a, { href: url, target: '_blank', rel: 'noopener' });
  else a.addEventListener('click', e => e.preventDefault());
});

// Enquiry form: opens the visitor's email app with the details filled in
$('#quote-form').addEventListener('submit', e => {
  e.preventDefault();
  const d = new FormData(e.target);
  const body = `Name: ${d.get('name')}\nPhone: ${d.get('phone')}\nEmail: ${d.get('email')}\nService: ${d.get('service')}\n\n${d.get('message')}`;
  location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Enquiry: ' + d.get('service'))}&body=${encodeURIComponent(body)}`;
  $('#form-status').textContent = 'Your email app should open now. Press Send there to complete your enquiry.';
});

$('#year').textContent = new Date().getFullYear();
