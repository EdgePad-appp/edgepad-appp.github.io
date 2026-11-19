(() => {
  // ------------------------------------------------------------------
  // Спільний скрипт української (/) та англійської (/en/) сторінок.
  // Файл для завантаження. Щоб випустити нову версію, замініть EdgePad.dmg
  // у корені сайту і змініть тут номер версії та розмір у мегабайтах.
  const RELEASE = {
    version: '1.2.1',
    sizeMB: 2.5,
    file: '/EdgePad.dmg',
  };
  // Продаж. checkout — посилання на оплату з Creem (Products → EdgePad → Share).
  // Поки воно порожнє, кнопка «Купити» лише каже, що продаж скоро відкриється.
  const STORE = {
    price: '$2',
    checkout: 'https://www.creem.io/product/prod_5KFUcEc7kQLLhs3rM1wYvk',
  };
  // ------------------------------------------------------------------

  // Мова береться з <html lang>. Тут тексти, які скрипт пише сам.
  const EN = document.documentElement.lang === 'en';
  const T = EN ? {
    size: `${RELEASE.sizeMB} MB`,
    pct: (n) => `${n}%`,
    soonLabel: 'Sales open soon',
    soonToast: 'Sales open soon. Try EdgePad free in the meantime.',
    selected: 'Selected. Press ⌘C to copy',
    fileCopied: 'File link copied',
    siteCopied: 'Site link copied',
    shareText: 'Brightness, volume, scrubbing and tracks from the edges of your Mac trackpad',
    tabs: {
      zones: ['EdgePad settings window, Edges tab', 'The action and width of each edge, slider speed and scrub step.'],
      corners: ['EdgePad settings window, Corners tab', 'An action for each top corner and the corner size in millimeters.'],
      feedback: ['EdgePad settings window, Feedback tab', 'Scroll sound, haptic feedback, the on-screen indicator and pointer lock.'],
    },
    tracks: ['Sunset', 'Night City', 'Daybreak'],
    sec: 's',
    mm: 'mm',
    next: 'Next track',
    prev: 'Previous track',
    brightness: 'Brightness',
    volume: 'Volume',
  } : {
    size: `${String(RELEASE.sizeMB).replace('.', ',')} МБ`,
    pct: (n) => `${n} %`,
    soonLabel: 'Продаж відкривається найближчим часом',
    soonToast: 'Продаж скоро відкриється. Поки що спробуйте EdgePad безкоштовно.',
    selected: 'Виділено. Натисніть ⌘C, щоб скопіювати',
    fileCopied: 'Посилання на файл скопійовано',
    siteCopied: 'Посилання на сайт скопійовано',
    shareText: 'Яскравість, гучність, перемотка і треки з країв трекпада Mac',
    tabs: {
      zones: ['Вікно налаштувань EdgePad, вкладка «Краї»', 'Дія і ширина кожного краю, швидкість повзунків і крок перемотки.'],
      corners: ['Вікно налаштувань EdgePad, вкладка «Кути»', 'Дія для кожного верхнього кута та їхній розмір у міліметрах.'],
      feedback: ['Вікно налаштувань EdgePad, вкладка «Відгук»', 'Звук прокрутки, тактильний відгук, індикатор на екрані та фіксація курсора.'],
    },
    tracks: ['Захід сонця', 'Нічне місто', 'Світанок'],
    sec: 'с',
    mm: 'мм',
    next: 'Наступний трек',
    prev: 'Попередній трек',
    brightness: 'Яскравість',
    volume: 'Гучність',
  };

  // Перемикач мови запамʼятовує вибір, і головна сторінка далі сама відкриває англійську.
  document.querySelectorAll('.lang-switch a').forEach((a) => {
    a.addEventListener('click', () => {
      try { localStorage.setItem('edgepad.lang', a.lang === 'en' ? 'en' : 'uk'); } catch (_) {}
    });
  });

  const $ = (id) => document.getElementById(id);
  const toast = $('toast');
  let toastTimer = 0;
  function showToast(text) {
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  const fileURL = new URL(RELEASE.file, location.href).href;
  const siteURL = location.href.split('#')[0];
  document.querySelectorAll('[data-version]').forEach((el) => { el.textContent = RELEASE.version; });
  document.querySelectorAll('[data-size]').forEach((el) => { el.textContent = T.size; });
  document.querySelectorAll('.js-download').forEach((a) => { a.href = RELEASE.file; });
  document.querySelectorAll('[data-price]').forEach((el) => { el.textContent = STORE.price; });
  const buyButton = $('buyButton');
  if (STORE.checkout) {
    buyButton.href = STORE.checkout;
  } else {
    $('buyLabel').textContent = T.soonLabel;
    buyButton.classList.add('is-soon');
    buyButton.addEventListener('click', (event) => {
      event.preventDefault();
      showToast(T.soonToast);
    });
  }
  $('fileLink').textContent = fileURL;
  $('year').textContent = new Date().getFullYear();

  async function copy(text, done) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(done);
    } catch (_) {
      const range = document.createRange();
      range.selectNodeContents($('fileLink'));
      const selection = getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      showToast(T.selected);
    }
  }
  $('copyFile').addEventListener('click', () => copy(fileURL, T.fileCopied));
  $('share').addEventListener('click', async () => {
    const data = { title: 'EdgePad', text: T.shareText, url: siteURL };
    if (navigator.share) {
      try { await navigator.share(data); return; } catch (error) { if (error && error.name === 'AbortError') return; }
    }
    copy(siteURL, T.siteCopied);
  });

  // --- вкладки зі скриншотами застосунку ---
  const TABS = {
    zones: { src: '/assets/app-zones.jpg', alt: T.tabs.zones[0], text: T.tabs.zones[1] },
    corners: { src: '/assets/app-corners.jpg', alt: T.tabs.corners[0], text: T.tabs.corners[1] },
    feedback: { src: '/assets/app-feedback.jpg', alt: T.tabs.feedback[0], text: T.tabs.feedback[1] },
  };
  Object.values(TABS).forEach((tab) => { const img = new Image(); img.src = tab.src; });
  document.querySelectorAll('.tabs button').forEach((button) => {
    button.addEventListener('click', () => {
      const tab = TABS[button.dataset.tab];
      document.querySelectorAll('.tabs button').forEach((b) => b.setAttribute('aria-selected', String(b === button)));
      $('app-shot').setAttribute('aria-labelledby', button.id);
      $('appShot').src = tab.src;
      $('appShot').alt = tab.alt;
      $('tabText').textContent = tab.text;
    });
  });

  // ------------------------------------------------------------------
  // Демо трекпада. Логіка та сама, що в програмі: жест вмикається, коли палець
  // торкається смуги й рухається вздовж краю (≥ 3 мм); подвійне торкання кута
  // перемикає трек.
  const pad = $('pad');
  const finger = $('finger');
  const dimmer = $('dimmer');
  const cursor = $('cursor');
  const eq = $('eq');
  const clip = $('clip');
  const hud = $('hud');
  const zones = {
    left: pad.querySelector('.zone.left'),
    right: pad.querySelector('.zone.right'),
    bottom: pad.querySelector('.zone.bottom'),
  };
  const corners = { left: $('cornerLeft'), right: $('cornerRight') };
  const GLOW = { left: 'rgba(255,106,61,.75)', right: 'rgba(47,107,255,.75)', bottom: 'rgba(139,92,246,.8)' };

  const MM = { w: 124.8, h: 76.8 };           // трекпад, на якому робили EdgePad
  const LOCK_MM = 3, GIVE_UP_MM = 9, RATIO = 1.5, RANGE_MM = 50, STEP_MM = 10, SEEK_S = 5, DETENTS = 16;
  const CORNER_MM = 16, TAP_MAX_MS = 350, TAP_MOVE_MM = 3, DOUBLE_GAP_MS = 400;
  const CORNER_X = CORNER_MM / MM.w, CORNER_Y = CORNER_MM / MM.h;
  const TRACKS = [
    { title: T.tracks[0], dur: 245, sky: ['#17183F', '#4B2780', '#D2537C', '#FFB25B'], sun: '#FFB86B' },
    { title: T.tracks[1], dur: 231, sky: ['#04051A', '#14205A', '#3A3F9E', '#7A6BFF'], sun: '#C9D4FF' },
    { title: T.tracks[2], dur: 263, sky: ['#1A2C4F', '#3D6A9E', '#F2A07B', '#FFE3A3'], sun: '#FFF0B8' },
  ];
  const S = { zw: 0.10, bright: 0.86, vol: 0.45, t: 84, track: 0, cx: 0.62, cy: 0.38 };

  const ICON = {
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    vol: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
    mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M17 9.5l5 5M22 9.5l-5 5"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 5H18v14h-2.4zM4 5l10.5 7L4 19z"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h2.4v14H6zM20 5v14L9.5 12z"/></svg>',
    fwd: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 6v12l8.5-6zM12.5 6v12L21 12z"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 6v12l-8.5-6zM11.5 6v12L3 12z"/></svg>',
  };

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const fmt = (s) => { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const secondsText = (s) => {
    const v = Math.round(s);
    if (v === 0) return `0 ${T.sec}`;
    const sign = v > 0 ? '+' : '−';
    const m = Math.abs(v);
    return m >= 60 ? `${sign}${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}` : `${sign}${m} ${T.sec}`;
  };

  // --- звук прокрутки (як у програмі: що вищий рівень, то вищий звук) ---
  let audio = null;
  let soundOn = true;
  const soundButton = $('sound');
  function unlockAudio() {
    try {
      if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
    } catch (_) { audio = null; }
  }
  function tick(level, strength = 1) {
    if (!soundOn || !audio || audio.state !== 'running') return;
    const t = audio.currentTime;
    const f = 1400 + 1700 * clamp(level, 0, 1);
    const gain = audio.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.16 * strength, t + 0.0015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.032);
    gain.connect(audio.destination);
    const harmonic = audio.createGain();
    harmonic.gain.value = 0.4;
    harmonic.connect(gain);
    const o1 = audio.createOscillator();
    o1.frequency.value = f;
    o1.connect(gain);
    const o2 = audio.createOscillator();
    o2.frequency.value = f * 2.02;
    o2.connect(harmonic);
    o1.start(t); o2.start(t);
    o1.stop(t + 0.04); o2.stop(t + 0.04);
  }
  soundButton.addEventListener('click', () => {
    soundOn = !soundOn;
    soundButton.setAttribute('aria-pressed', String(soundOn));
    if (soundOn) { unlockAudio(); setTimeout(() => tick(0.6), 30); }
  });

  // --- індикатор ---
  const hudSeg = $('hudSeg');
  const segs = [];
  for (let i = 0; i < 16; i++) {
    const s = document.createElement('i');
    s.style.setProperty('--i', i);
    hudSeg.appendChild(s);
    segs.push(s);
  }
  let hudTimer = 0;
  function showCompact(kind, icon, title, value) {
    hud.dataset.layout = 'compact';
    hud.dataset.kind = kind;
    $('hudBadge').innerHTML = icon;
    $('hudTitle').textContent = title;
    if (value == null) {
      hud.classList.add('no-bar');
      $('hudValue').textContent = '';
    } else {
      hud.classList.remove('no-bar');
      $('hudValue').textContent = T.pct(Math.round(value * 100));
      segs.forEach((s, i) => s.classList.toggle('on', (i + 0.5) / 16 <= value));
    }
    hud.classList.add('show');
    clearTimeout(hudTimer);
  }
  function showSeek(delta, position, start, duration) {
    hud.dataset.layout = 'seek';
    hud.dataset.kind = 'seek';
    $('seekTitle').textContent = TRACKS[S.track].title;
    $('seekDelta').innerHTML = (delta >= 0 ? ICON.fwd : ICON.back) + secondsText(delta);
    $('seekNow').textContent = fmt(position);
    $('seekDur').textContent = fmt(duration);
    $('seekFill').style.width = (position / duration * 100).toFixed(2) + '%';
    $('seekKnob').style.left = (position / duration * 100).toFixed(2) + '%';
    $('seekStart').style.left = (start / duration * 100).toFixed(2) + '%';
    hud.classList.add('show');
    clearTimeout(hudTimer);
  }
  function hideHudSoon(ms = 900) {
    clearTimeout(hudTimer);
    hudTimer = setTimeout(() => hud.classList.remove('show'), ms);
  }

  function applyTrack() {
    const track = TRACKS[S.track];
    clip.style.setProperty('--s1', track.sky[0]);
    clip.style.setProperty('--s2', track.sky[1]);
    clip.style.setProperty('--s3', track.sky[2]);
    clip.style.setProperty('--s4', track.sky[3]);
    clip.style.setProperty('--sun', track.sun);
    $('nowTitle').textContent = track.title;
    $('tDur').textContent = fmt(track.dur);
  }

  function render() {
    const track = TRACKS[S.track];
    dimmer.style.opacity = ((1 - S.bright) * 0.86).toFixed(3);
    eq.style.setProperty('--vol', Math.max(0.05, S.vol).toFixed(3));
    $('tNow').textContent = fmt(S.t);
    $('prog').style.width = (S.t / track.dur * 100).toFixed(2) + '%';
    cursor.style.left = (S.cx * 100).toFixed(2) + '%';
    cursor.style.top = (S.cy * 100).toFixed(2) + '%';
  }

  function zonesAt(x, y) {
    const z = S.zw, out = [];
    if (x <= z) out.push('left');
    if (x >= 1 - z) out.push('right');
    if (y <= z) out.push('bottom');
    return out;
  }
  function cornerAt(x, y) {
    if (y < 1 - CORNER_Y) return null;
    if (x <= CORNER_X) return 'left';
    if (x >= 1 - CORNER_X) return 'right';
    return null;
  }

  function placeFinger(x, y, on, edge) {
    finger.style.left = (x * 100).toFixed(2) + '%';
    finger.style.top = ((1 - y) * 100).toFixed(2) + '%';
    finger.style.setProperty('--glow', edge ? GLOW[edge] : 'rgba(255,255,255,.4)');
    finger.classList.toggle('show', on);
  }

  // --- подвійне торкання кута ---
  let lastTap = null;
  function registerTap(corner, start, end, user) {
    if (lastTap && lastTap.corner === corner && start - lastTap.end <= DOUBLE_GAP_MS) {
      lastTap = null;
      switchTrack(corner === 'right' ? 1 : -1, corner, user);
    } else {
      lastTap = { corner, end };
    }
  }
  function switchTrack(direction, corner, user) {
    S.track = (S.track + direction + TRACKS.length) % TRACKS.length;
    S.t = 0;
    clip.classList.add('switching');
    setTimeout(() => { applyTrack(); clip.classList.remove('switching'); render(); }, 180);
    corners[corner].classList.add('flash');
    setTimeout(() => corners[corner].classList.remove('flash'), 450);
    showCompact('media', direction > 0 ? ICON.next : ICON.prev, direction > 0 ? T.next : T.prev, null);
    hideHudSoon(1300);
    if (user) {
      tick(0.75, 1.2);
      setTimeout(() => tick(1, 1.2), 70);
    }
  }

  // --- жести по краях ---
  let g = null;

  function down(x, y, user) {
    if (g) up();
    const cands = zonesAt(x, y);
    g = {
      sx: x, sy: y, lx: x, ly: y, cands, user,
      phase: cands.length ? 'pending' : 'cursor',
      ccx: S.cx, ccy: S.cy,
      start: performance.now(),
      corner: cornerAt(x, y),
    };
    cursor.classList.add('live');
    pad.classList.add('touching');
    placeFinger(x, y, true);
  }

  function moveCursor(x, y) {
    S.cx = clamp(S.cx + (x - g.lx) * 1.25, 0.02, 0.96);
    S.cy = clamp(S.cy - (y - g.ly) * 1.25 * 0.62, 0.04, 0.9);
  }

  function activate(edge, x, y) {
    g.phase = 'active';
    g.edge = edge;
    g.along = edge === 'bottom' ? x : y;
    cursor.classList.remove('live');
    S.cx = g.ccx;           // EdgePad повертає курсор туди, де він був на початку дотику
    S.cy = g.ccy;
    zones[edge].classList.add('on');
    if (edge === 'left') showCompact('bright', ICON.sun, T.brightness, S.bright);
    else if (edge === 'right') showCompact('vol', S.vol < 0.005 ? ICON.mute : ICON.vol, T.volume, S.vol);
    else { g.seekStart = S.t; g.offset = 0; showSeek(0, S.t, S.t, TRACKS[S.track].dur); }
  }

  function move(x, y) {
    if (!g) return;
    const dx = (x - g.sx) * MM.w;
    const dy = (y - g.sy) * MM.h;
    if (g.corner && Math.hypot(dx, dy) > TAP_MOVE_MM) g.corner = null;

    if (g.phase === 'pending') {
      moveCursor(x, y);
      const d = Math.hypot(dx, dy);
      if (d >= LOCK_MM) {
        let vertical = null;
        if (Math.abs(dy) >= Math.abs(dx) * RATIO) vertical = true;
        else if (Math.abs(dx) >= Math.abs(dy) * RATIO) vertical = false;
        if (vertical === null) {
          if (d >= GIVE_UP_MM) g.phase = 'cursor';
        } else {
          const match = g.cands.filter((e) => (e !== 'bottom') === vertical);
          if (match.length) activate(match[0], x, y);
          else g.phase = 'cursor';
        }
      }
    } else if (g.phase === 'cursor') {
      moveCursor(x, y);
    } else if (g.phase === 'active') {
      const along = g.edge === 'bottom' ? x : y;
      const deltaMM = (along - g.along) * (g.edge === 'bottom' ? MM.w : MM.h);
      g.along = along;
      if (g.edge === 'left' || g.edge === 'right') {
        const key = g.edge === 'left' ? 'bright' : 'vol';
        const minimum = key === 'bright' ? 0.06 : 0;
        const old = S[key];
        const value = clamp(old + deltaMM / RANGE_MM, minimum, 1);
        S[key] = value;
        if (value !== old && g.user &&
            (Math.trunc(value * DETENTS) !== Math.trunc(old * DETENTS) || value === 1 || value === minimum)) {
          tick(value);
        }
        if (key === 'bright') showCompact('bright', ICON.sun, T.brightness, value);
        else showCompact('vol', value < 0.005 ? ICON.mute : ICON.vol, T.volume, value);
      } else {
        const duration = TRACKS[S.track].dur;
        const before = Math.trunc(g.offset / SEEK_S);
        g.offset += deltaMM / STEP_MM * SEEK_S;
        const target = clamp(g.seekStart + g.offset, 0, duration - 1);
        g.offset = target - g.seekStart;
        S.t = target;
        if (g.user && Math.trunc(g.offset / SEEK_S) !== before) tick(target / duration);
        showSeek(g.offset, target, g.seekStart, duration);
      }
    }
    placeFinger(x, y, true, g.phase === 'active' ? g.edge : null);
    g.lx = x;
    g.ly = y;
  }

  function up() {
    if (!g) return;
    const now = performance.now();
    if (g.phase === 'active') {
      zones[g.edge].classList.remove('on');
      hideHudSoon();
    } else if (g.corner && now - g.start <= TAP_MAX_MS) {
      registerTap(g.corner, g.start, now, g.user);
    }
    g = null;
    cursor.classList.remove('live');
    pad.classList.remove('touching');
    finger.classList.remove('show');
  }

  // --- справжній палець / миша ---
  let pointerId = null;
  function toPad(e) {
    const r = pad.getBoundingClientRect();
    return {
      x: clamp((e.clientX - r.left) / r.width, 0, 1),
      y: clamp(1 - (e.clientY - r.top) / r.height, 0, 1),
    };
  }
  pad.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (pointerId !== null) return;
    unlockAudio();
    stopGhost();
    pointerId = e.pointerId;
    pad.classList.add('user-touching');
    try { pad.setPointerCapture(e.pointerId); } catch (_) {}
    const p = toPad(e);
    down(p.x, p.y, true);
    render();
    e.preventDefault();
  });
  pad.addEventListener('pointermove', (e) => {
    if (e.pointerId !== pointerId) return;
    const p = toPad(e);
    move(p.x, p.y);
    render();
  });
  const release = (e) => {
    if (e.pointerId !== pointerId) return;
    pointerId = null;
    pad.classList.remove('user-touching');
    up();
    render();
    scheduleGhost(8000);
  };
  pad.addEventListener('pointerup', release);
  pad.addEventListener('pointercancel', release);
  pad.addEventListener('lostpointercapture', release);

  // --- ширина зон ---
  const zw = $('zw');
  const zwOut = $('zwOut');
  function setZone() {
    const pct = Number(zw.value);
    S.zw = pct / 100;
    pad.style.setProperty('--zw', S.zw);
    pad.style.setProperty('--cw', CORNER_X);
    pad.style.setProperty('--ch', CORNER_Y);
    zwOut.textContent = `${T.pct(pct)} · ${Math.round(S.zw * MM.w)} ${T.mm}`;
    pad.classList.toggle('narrow', S.zw * pad.clientWidth < 30);
  }
  zw.addEventListener('input', setZone);
  window.addEventListener('resize', setZone);

  // --- автодемо, поки ніхто не торкається ---
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ghostToken = 0;
  let ghostTimer = 0;
  let inView = true;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  function ghostScript() {
    const side = S.zw / 2;
    const corner = [1 - CORNER_X / 2, 1 - CORNER_Y / 2];
    return [
      { path: [[side, 0.70], [side, 0.28], [side, 0.68]], dur: 2600 },          // яскравість
      { wait: 700 },
      { path: [[1 - side, 0.26], [1 - side, 0.70], [1 - side, 0.42]], dur: 2400 }, // гучність
      { wait: 700 },
      { path: [[0.22, side], [0.78, side], [0.48, side]], dur: 2800 },           // перемотка
      { wait: 900 },
      { tap: corner }, { wait: 120 }, { tap: corner },                          // наступний трек
      { wait: 1500 },
      { path: [[0.40, 0.62], [0.56, 0.44], [0.66, 0.56]], dur: 1500 },          // звичайний рух курсора
      { wait: 1600 },
    ];
  }

  async function waitVisible(alive) {
    while (alive() && (!inView || document.hidden)) await sleep(400);
  }

  async function stroke(path, dur, alive) {
    await waitVisible(alive);
    if (!alive()) return;
    down(path[0][0], path[0][1], false);
    render();
    const segsCount = path.length - 1;
    const start = performance.now();
    await new Promise((resolve) => {
      function frame(now) {
        if (!alive()) { resolve(); return; }
        // The frame time can be a little earlier than `start`; a negative t would pick path[-1].
        const t = clamp((now - start) / dur, 0, 1);
        const f = t * segsCount;
        const i = Math.min(segsCount - 1, Math.floor(f));
        const k = ease(Math.min(1, f - i));
        const [ax, ay] = path[i];
        const [bx, by] = path[i + 1];
        move(ax + (bx - ax) * k, ay + (by - ay) * k);
        render();
        if (t < 1) requestAnimationFrame(frame); else resolve();
      }
      requestAnimationFrame(frame);
    });
    if (alive()) { up(); render(); }
  }

  async function tapAt(point, alive) {
    await waitVisible(alive);
    if (!alive()) return;
    down(point[0], point[1], false);
    await sleep(90);
    if (alive()) { up(); render(); }
  }

  async function ghostLoop() {
    if (reduceMotion) return;
    const token = ++ghostToken;
    const alive = () => token === ghostToken;
    while (alive()) {
      for (const step of ghostScript()) {
        if (!alive()) break;
        if (step.wait) { await sleep(step.wait); continue; }
        if (step.tap) { await tapAt(step.tap, alive); continue; }
        await stroke(step.path, step.dur, alive);
        if (S.t > TRACKS[S.track].dur - 40) S.t = 60;
      }
    }
  }
  function stopGhost() {
    ghostToken++;
    clearTimeout(ghostTimer);
    if (g && pointerId === null) up();
  }
  function scheduleGhost(ms) {
    clearTimeout(ghostTimer);
    ghostTimer = setTimeout(ghostLoop, ms);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => { inView = entries[0].isIntersecting; }, { threshold: 0.2 }).observe(pad);
  }

  applyTrack();
  setZone();
  render();
  showCompact('vol', ICON.vol, T.volume, S.vol);
  hideHudSoon();
  scheduleGhost(1400);
})();
