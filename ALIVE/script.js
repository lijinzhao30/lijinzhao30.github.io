'use strict';
document.documentElement.classList.add('js');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

// A user-initiated player; chapter buttons seek the same complete film.
const film = $('#demo-video');
const filmPlay = $('#film-play');
film.controls = false;
function playFilm(at) {
  film.controls = true;
  if (Number.isFinite(at)) film.currentTime = at;
  filmPlay.hidden = true;
  film.play().catch(() => { filmPlay.hidden = false; });
}
filmPlay.addEventListener('click', () => playFilm());
film.addEventListener('play', () => { filmPlay.hidden = true; });
film.addEventListener('error', () => { $('#video-error').hidden = false; });
film.addEventListener('ended', () => { filmPlay.hidden = false; });
$$('[data-seek]').forEach(button => button.addEventListener('click', () => {
  $('#demo').scrollIntoView({behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start'});
  playFilm(Number(button.dataset.seek));
}));
film.addEventListener('timeupdate', () => {
  const chapterButtons = $$('.chapter');
  const at = [...chapterButtons].reverse().find(button => film.currentTime >= Number(button.dataset.seek));
  chapterButtons.forEach(button => {
    button.classList.toggle('active', button === at);
    if (button === at) button.setAttribute('aria-current', 'true'); else button.removeAttribute('aria-current');
  });
});

// Same model order, values, colors, and zero baseline as the research film.
const models = [
  {name:'ALIVE',short:'ALIVE',icon:'alive',color:'linear-gradient(0deg,#2486c7,#37ddc0)'},
  {name:'JoyAI-VL-Interaction',short:'JoyAI',icon:'joy',color:'linear-gradient(0deg,#e8b87565,#e8b875da)'},
  {name:'AURA',short:'AURA',icon:'aura',color:'linear-gradient(0deg,#b49cdd65,#b49cddda)'},
  {name:'VideoChat3',short:'VideoChat3',icon:'videochat',color:'linear-gradient(0deg,#70acd965,#70acd9da)'}
];
const benchmarks = [
  {name:'OVO-Bench',metric:'Overall accuracy (%)',values:[68.9,60.6,65.3,58.8]},
  {name:'StreamingBench',metric:'Overall accuracy (%)',values:[76.0,67.4,73.1,68.7]},
  {name:'ProactiveVideoQA',metric:'PAUC · ω = 0.5',values:[51.6,28.8,32.0,37.6]},
  {name:'IPIBench',metric:'Overall accuracy (%)',values:[40.3,20.2,21.6,12.0]},
  {name:'FSI-Bench',metric:'EDP · Macro accuracy (%)',values:[52.8,17.4,8.3,5.9]}
];
$('#benchmark-grid').innerHTML = benchmarks.map((benchmark,index) => `<article class="benchmark-card"><h3>${benchmark.name}</h3><p class="metric">${benchmark.metric}</p><div class="plot" role="img" aria-label="${benchmark.name}: ${models.map((model,i) => model.name + ' ' + benchmark.values[i].toFixed(1)).join('; ')}">${benchmark.values.map((score,i) => `<div class="bar-slot"><div class="bar-stack ${i===0?'alive':''}" data-score="${score}" data-delay="${index*100+i*60}" style="--bar:${models[i].color};--h:${score/80*74}%"><img class="bar-logo" src="assets/models/${models[i].icon}.png" width="34" height="34" alt="" aria-hidden="true"><span class="bar-score" aria-hidden="true">${score.toFixed(1)}</span></div></div>`).join('')}</div><div class="bar-labels" aria-hidden="true">${models.map(model => `<span>${model.short}</span>`).join('')}</div><div class="chart-rule"></div></article>`).join('');
let chartFrame = 0;
function animateCharts() {
  cancelAnimationFrame(chartFrame);
  const bars = $$('.bar-stack');
  const start = performance.now();
  function update(now) {
    bars.forEach(bar => {
      const progress = reducedMotion.matches ? 1 : Math.min(1, Math.max(0, (now - start - Number(bar.dataset.delay)) / 1650));
      const eased = 1 - (1-progress)**3;
      const value = Number(bar.dataset.score) * eased;
      bar.style.setProperty('--h', (value/80*74) + '%');
      bar.querySelector('.bar-score').textContent = value.toFixed(1);
    });
    if (!reducedMotion.matches && now - start < 2250) chartFrame = requestAnimationFrame(update);
  }
  update(start);
}
const chartObserver = new IntersectionObserver(entries => {
  if (entries.some(entry => entry.isIntersecting)) { animateCharts(); chartObserver.disconnect(); }
}, {threshold:.18});
chartObserver.observe($('#benchmark-grid'));
$('#replay-results').addEventListener('click', animateCharts);

// Large figures remain zoomable without sacrificing legibility on small screens.
const figureNames = {teaser:'Interactive streaming at a glance', method:'Two-stage training of ALIVE', dataset:'Data construction and statistics'};
const figureDialog = $('#figure-dialog');
$$('[data-figure]').forEach(button => button.addEventListener('click', () => {
  const name = button.dataset.figure;
  $('#full-figure').src = 'assets/figures/' + name + '.webp';
  $('#full-figure').alt = button.querySelector('img').alt;
  $('#figure-title').textContent = figureNames[name];
  $('#figure-pdf').href = 'assets/figures/' + name + '.pdf';
  figureDialog.showModal();
}));
$('#close-figure').addEventListener('click', () => figureDialog.close());
figureDialog.addEventListener('click', event => {
  const box = figureDialog.getBoundingClientRect();
  if (event.target === figureDialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) figureDialog.close();
});
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
}), {threshold:.08});
$$('.reveal').forEach(element => revealObserver.observe(element));
const navigationObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) $$('.nav-links a').forEach(a => a.classList.toggle('active', a.hash === '#' + entry.target.id));
}), {rootMargin:'-15% 0px -65% 0px', threshold:0});
$$('section[id]').forEach(section => navigationObserver.observe(section));

// All recordings are present in the HTML. Only the selected video is fetched.
const demoLinks = $$('.demo-open');
const demoDialog = $('#demo-dialog');
const galleryPlayer = $('#gallery-player');
let activeDemo = -1;
let returnToDemo = null;
let playRequest = 0;
function openDemo(index) {
  if (index < 0 || index >= demoLinks.length) return;
  const link = demoLinks[index];
  const card = link.closest('.demo-card');
  activeDemo = index;
  const request = ++playRequest;
  galleryPlayer.pause();
  film.pause();
  demoDialog.dataset.category = card.dataset.category;
  demoDialog.classList.toggle('is-portrait', link.dataset.portrait === 'true');
  $('#demo-dialog-tag').textContent = card.querySelector('.demo-tag').textContent;
  const title = card.querySelector('h4');
  $('#demo-dialog-title').textContent = title.textContent;
  $('#demo-dialog-title').lang = title.lang;
  $('#demo-dialog-description').textContent = card.querySelector('.demo-copy p').textContent;
  $('#demo-dialog-description').lang = title.lang;
  const collection = link.closest('.demo-collection');
  const peers = [...collection.querySelectorAll('.demo-open')];
  $('#demo-dialog-position').textContent = (collection.id === 'realworld-demos' ? 'Real-world' : 'Web video') + ' · ' + (peers.indexOf(link) + 1) + ' / ' + peers.length;
  $('#previous-demo').disabled = index === 0;
  $('#next-demo').disabled = index === demoLinks.length - 1;
  $('#gallery-video-error').hidden = true;
  $('#gallery-video-direct').href = link.href;
  galleryPlayer.setAttribute('aria-label', title.textContent);
  galleryPlayer.poster = link.querySelector('img').src;
  galleryPlayer.src = link.href;
  if (!demoDialog.open) demoDialog.showModal();
  galleryPlayer.play().catch(() => {
    // A browser may require a second click; native controls remain available.
    if (request === playRequest && galleryPlayer.error) $('#gallery-video-error').hidden = false;
  });
}
demoLinks.forEach((link,index) => link.addEventListener('click', event => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  returnToDemo = link;
  openDemo(index);
}));
$('#previous-demo').addEventListener('click', () => openDemo(activeDemo - 1));
$('#next-demo').addEventListener('click', () => openDemo(activeDemo + 1));
$('#close-demo').addEventListener('click', () => demoDialog.close());
demoDialog.addEventListener('close', () => {
  ++playRequest;
  galleryPlayer.pause();
  galleryPlayer.removeAttribute('src');
  galleryPlayer.load();
  returnToDemo?.focus({preventScroll:true});
});
demoDialog.addEventListener('click', event => {
  const box = demoDialog.getBoundingClientRect();
  if (event.target === demoDialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) demoDialog.close();
});
galleryPlayer.addEventListener('error', () => {
  if (demoDialog.open && galleryPlayer.hasAttribute('src')) $('#gallery-video-error').hidden = false;
});
// Prevent the research film and a gallery clip from speaking over one another.
[film,galleryPlayer].forEach(player => player.addEventListener('play', () => {
  [film,galleryPlayer].forEach(other => { if (other !== player) other.pause(); });
}));
