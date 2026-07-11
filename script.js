(function () {
  const STORAGE_KEY = 'reasons';
  const STICKER_KEY = 'stickers';
  const SHARED = true;


  let reasons = [];
  let visibleCount = 30;
  const BATCH = 30;

  const listEl = document.getElementById('dapList');
  const emptyEl = document.getElementById('dapEmpty');
  const moreBtn = document.getElementById('dapMore');
  const searchEl = document.getElementById('dapSearch');
  const moonCountEl = document.getElementById('dapMoonCount');
  const countLineEl = document.getElementById('dapCountLine');
  const shuffleBtn = document.getElementById('dapShuffle');
  const spotlightHolder = document.getElementById('dapSpotlightHolder');

  function makeBlobs() {
    const holder = document.getElementById('dapBlobs');
    const specs = [
      { top: '-60px', left: '-40px', size: 220, color: 'var(--blush-mid)' },
      { top: '120px', left: '78%', size: 260, color: 'var(--lavender)' },
      { top: '55%', left: '-60px', size: 200, color: 'var(--peach)' },
      { top: '80%', left: '70%', size: 240, color: 'var(--blush)' }
    ];
    holder.innerHTML = specs.map(s =>
      `<div class="dap-blob" style="top:${s.top};left:${s.left};width:${s.size}px;height:${s.size}px;background:${s.color};"></div>`
    ).join('');
  }

  function makePetals() {
    const holder = document.getElementById('dapPetals');
    let html = '';
    const hearts = ['#ff9fb2', '#f3bcc9', '#e9c3ec'];
    for (let i = 0; i < 14; i++) {
      const left = Math.random() * 100;
      const size = Math.random() * 10 + 10;
      const duration = (Math.random() * 10 + 14).toFixed(1);
      const delay = (Math.random() * 14).toFixed(1);
      const drift = (Math.random() * 60 - 30).toFixed(0);
      const color = hearts[i % hearts.length];
      html += `<svg class="dap-petal" viewBox="0 0 32 28" style="left:${left}%;width:${size}px;height:${size}px;animation-duration:${duration}s;animation-delay:${delay}s;--dap-drift:${drift}px;">
        <path fill="${color}" d="M16 26C7 20 1 15 1 9 1 4 5 1 9 1c3 0 6 2 7 5 1-3 4-5 7-5 4 0 8 3 8 8 0 6-6 11-15 17z"/>
      </svg>`;
    }
    holder.innerHTML = html;
  }

  async function loadReasons() {
    try {
      const result = await window.storage.get(STORAGE_KEY, SHARED);
      if (result && result.value) {
        reasons = JSON.parse(result.value);
      } else {
        reasons = SEED_REASONS.map((t, i) => ({ id: 'r' + i, text: t }));
        await window.storage.set(STORAGE_KEY, JSON.stringify(reasons), SHARED);
      }
    } catch (e) {
      reasons = SEED_REASONS.map((t, i) => ({ id: 'r' + i, text: t }));
      try { await window.storage.set(STORAGE_KEY, JSON.stringify(reasons), SHARED); } catch (e2) {}
    }
    renderAll();
  }

  function renderAll() {
    moonCountEl.textContent = reasons.length;
    countLineEl.textContent = reasons.length + ' reasons, and it keeps growing';
    renderList();
  }

  function renderList() {
    const query = searchEl.value.trim().toLowerCase();
    const filtered = query
      ? reasons.filter(r => r.text.toLowerCase().includes(query))
      : reasons;

    const slice = query ? filtered : filtered.slice(0, visibleCount);

    listEl.innerHTML = '';
    if (slice.length === 0) {
      emptyEl.style.display = 'block';
    } else {
      emptyEl.style.display = 'none';
      slice.forEach((r) => {
        const idx = reasons.indexOf(r) + 1;
        const card = document.createElement('div');
        card.className = 'dap-card';
        card.innerHTML = `<span class="dap-num">${idx}.</span><p class="dap-text"></p>`;
        card.querySelector('.dap-text').textContent = r.text;
        listEl.appendChild(card);
      });
    }

    moreBtn.style.display = (!query && filtered.length > visibleCount) ? 'block' : 'none';
  }

  moreBtn.addEventListener('click', () => {
    visibleCount += BATCH;
    renderList();
  });

  searchEl.addEventListener('input', () => renderList());

  shuffleBtn.addEventListener('click', () => {
    if (reasons.length === 0) return;
    const pick = reasons[Math.floor(Math.random() * reasons.length)];
    spotlightHolder.innerHTML = `
      <div class="dap-spotlight">
        <button class="dap-spotlight-close" aria-label="close">×</button>
        <span class="dap-spotlight-label">reason #${reasons.indexOf(pick) + 1}</span>
        <p class="dap-spotlight-text"></p>
      </div>
    `;
    spotlightHolder.querySelector('.dap-spotlight-text').textContent = pick.text;
    spotlightHolder.querySelector('.dap-spotlight-close').addEventListener('click', () => {
      spotlightHolder.innerHTML = '';
    });
  });

  makeBlobs();
  makePetals();
  loadReasons();

  /* ---------------- stickers ---------------- */

 

  stickerOptions.innerHTML = BUILT_IN_STICKERS.map(s =>
    `<button type="button" class="dap-sticker-option" data-sticker="${s.id}">${s.svg}</button>`
  ).join('');

  async function loadStickers() {
    try {
      const result = await window.storage.get(STICKER_KEY, SHARED);
      stickers = (result && result.value) ? JSON.parse(result.value) : [];
    } catch (e) {
      stickers = [];
    }
    renderStickers();
  }

  async function saveStickers() {
    try { await window.storage.set(STICKER_KEY, JSON.stringify(stickers), SHARED); } catch (e) {}
  }

  function renderStickers() {
    stickerLayer.innerHTML = '';
    stickers.forEach(s => stickerLayer.appendChild(buildStickerEl(s)));
  }

  function buildStickerEl(s) {
    const el = document.createElement('div');
    el.className = 'dap-sticker';
    el.dataset.id = s.id;
    el.style.left = s.x + '%';
    el.style.top = s.y + '%';
    el.style.width = (s.size || 70) + 'px';
    el.style.height = (s.size || 70) + 'px';
    el.style.transform = `translate(-50%, -50%) rotate(${s.rot || 0}deg)`;
    if (s.type === 'image') {
      el.innerHTML = `<img src="${s.content}" alt="sticker" draggable="false" />`;
    } else {
      el.innerHTML = s.content;
    }
    attachStickerEvents(el, s);
    if (s.id === selectedId) {
      el.classList.add('dap-selected');
      el.appendChild(buildToolbar(s));
    }
    return el;
  }

  function buildToolbar(s) {
    const tb = document.createElement('div');
    tb.className = 'dap-sticker-toolbar';
    tb.innerHTML = `
      <button type="button" data-act="smaller" title="smaller">–</button>
      <button type="button" data-act="bigger" title="bigger">+</button>
      <button type="button" data-act="rotate" title="rotate">↺</button>
      <button type="button" class="dap-sticker-delete" data-act="delete" title="delete">×</button>
    `;
    tb.addEventListener('pointerdown', e => e.stopPropagation());
    tb.addEventListener('click', (e) => {
      const act = e.target.closest('button')?.dataset.act;
      if (!act) return;
      if (act === 'smaller') s.size = Math.max(28, (s.size || 70) - 12);
      if (act === 'bigger') s.size = Math.min(220, (s.size || 70) + 12);
      if (act === 'rotate') s.rot = ((s.rot || 0) + 20) % 360;
      if (act === 'delete') {
        stickers = stickers.filter(x => x.id !== s.id);
        selectedId = null;
      }
      saveStickers();
      renderStickers();
    });
    return tb;
  }

  function attachStickerEvents(el, s) {
    let dragging = false;
    let startX, startY, origX, origY;

    el.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      dragging = true;
      selectedId = s.id;
      el.setPointerCapture(e.pointerId);
      startX = e.clientX;
      startY = e.clientY;
      origX = s.x;
      origY = s.y;
      renderStickers();
    });

    el.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const rootRect = document.getElementById('dapRoot').getBoundingClientRect();
      const dx = ((e.clientX - startX) / rootRect.width) * 100;
      const dy = ((e.clientY - startY) / rootRect.height) * 100;
      s.x = Math.min(98, Math.max(2, origX + dx));
      s.y = Math.min(98, Math.max(2, origY + dy));
      el.style.left = s.x + '%';
      el.style.top = s.y + '%';
    });

    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      saveStickers();
    }
    el.addEventListener('pointerup', endDrag);
    el.addEventListener('pointercancel', endDrag);
  }

  document.getElementById('dapRoot').addEventListener('pointerdown', (e) => {
    if (!e.target.closest('.dap-sticker')) {
      if (selectedId !== null) { selectedId = null; renderStickers(); }
    }
  });

  function addSticker(type, content) {
    const s = {
      id: 's' + Date.now() + Math.floor(Math.random() * 999),
      type,
      content,
      x: 20 + Math.random() * 60,
      y: 15 + Math.random() * 60,
      size: 70,
      rot: Math.floor(Math.random() * 20 - 10)
    };
    stickers.push(s);
    selectedId = s.id;
    saveStickers();
    renderStickers();
  }

  stickerFab.addEventListener('click', () => {
    stickerPanel.hidden = !stickerPanel.hidden;
  });
  stickerPanelClose.addEventListener('click', () => { stickerPanel.hidden = true; });

  stickerOptions.addEventListener('click', (e) => {
    const btn = e.target.closest('.dap-sticker-option');
    if (!btn) return;
    const found = BUILT_IN_STICKERS.find(s => s.id === btn.dataset.sticker);
    if (found) addSticker('svg', found.svg);
  });

  stickerUpload.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 260;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        addSticker('image', dataUrl);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
    stickerUpload.value = '';
  });

  loadStickers();
})();

if ("serviceWorker" in navigator) {

    window.addEventListener("load", async () => {

        const registration =
            await navigator.serviceWorker.register("./service-worker.js");

        registration.addEventListener("updatefound", () => {

            const worker = registration.installing;

            worker.addEventListener("statechange", () => {

                if (
                    worker.state === "installed" &&
                    navigator.serviceWorker.controller
                ) {

                    showUpdatePopup();

                }

            });

        });

    });

}

function showUpdatePopup() {

    document
        .getElementById("updatePopup")
        .classList.remove("hidden");

}

document
.getElementById("updateBtn")
.addEventListener("click", () => {

    window.location.reload();

});


setInterval(async () => {

    if (!navigator.serviceWorker) return;

    const registration = await navigator.serviceWorker.getRegistration();

    if (registration) {

        registration.update();

    }

}, 60000);
