/* =========================================================
   Undangan Pernikahan — Wildan & Bilqis
   Vanilla JS. Semua data utama ada di weddingConfig.
   ========================================================= */

const weddingConfig = {
  // Backend pesan (db.py / Flask + Google Spreadsheet).
  // Kosongkan ("") untuk memakai localStorage seperti sebelumnya.
  apiBase: "", // contoh: "http://127.0.0.1:5000"

  groom: "Moh. Agung romadhani",
  bride: "Onik Dewi Parawesti",
  // Ubah tanggal pernikahan di sini (format: YYYY-MM-DDTHH:MM:SS)
  weddingDate: "2026-09-24T08:00:00",
  dateLabel: "Kamis, 24 September 2026",

  music: {
    src: "assets/music/lagu.mp3", // taruh file lagu di folder ini
    title: "Segara Madu",
    artist: "artist — R2M_Project",
    // Foto/cover HANYA bisa diganti di sini (lewat code), bukan oleh pengunjung.
    cover: "assets/image/cover_lagu.jpeg",
    volume: 0.7,
  },

  quote: {
    text: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram di sampingnya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.",
    source: "QS. Ar-Rum : 21",
  },

  // Detail acara — ubah sesuai kebutuhan
  events: [
    {
      name: "Akad Nikah",
      icon: "❦",
      date: "Selasa, 26 Mei 2026",
      time: "19.00 WIB — selesai",
      place: "Randujalak",
    },
    {
      name: "Resepsi",
      icon: "✽",
      date: "Kamis, 24 September 2026",
      time: "11.00 WIB — selesai",
      place: "Randujalak",
    },
  ],

  // Lokasi (query dipakai untuk peta & petunjuk arah)
  location: {
    name: "Lokasi Acara",
    address: "Alamat tempat acara",
    query: "-7.774542,113.479647",
  },

  gifts: [
    { type: "Bank BNI", number: "1790839887", holder: "Onik Dewiparawesti" },
    // { type: "Bank Mandiri", number: "0987654321", holder: "Onik Dewiparawesti" },
  ],

  chapters: [
    // { title: " ", subtitle: " ", text: " " },
    // { title: " ", subtitle: " ", text: " " },
    // { title: " ", subtitle: " ", text: " " },
  ],

  gallery: [
    // { src: "", alt: "Wildan dan Bilqis saat matahari terbenam", caption: "our day" },
    // { src: "", alt: "Buket bunga kering dan cincin pernikahan", caption: "the ring" },
    // { src: "", alt: "Berjalan bersama di padang rumput senja", caption: "together" },
    // { src: "", alt: "Dekorasi meja pernikahan dengan lilin dan mawar", caption: "the day" },
    // { src: "", alt: "Tangan mempelai saling menggenggam", caption: "forever" },
    // { src: "", alt: "Tangan mempelai saling menggenggam", caption: "forever" },
  ],
};

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const pad = (n) => String(n).padStart(2, "0");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("on");
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove("on"), 2600);
}

/* ---------------------------------------------------------
   Isi data dari config
--------------------------------------------------------- */
$$('[data-name="groom"]').forEach((el) => (el.textContent = weddingConfig.groom));
$$('[data-name="bride"]').forEach((el) => (el.textContent = weddingConfig.bride));
$("#loadGroom").textContent = weddingConfig.groom;
$("#loadBride").textContent = weddingConfig.bride;
$("#heroDate").textContent = weddingConfig.dateLabel;
$("#pTitle").textContent = weddingConfig.music.title;
$("#pArtist").textContent = weddingConfig.music.artist;
$("#playerImg").src = weddingConfig.music.cover;

/* ---------------------------------------------------------
   Loading screen + partikel
--------------------------------------------------------- */
(function particles() {
  const box = $(".loader-particles");
  const n = reduced ? 0 : 22;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("i");
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDuration = 8 + Math.random() * 10 + "s";
    p.style.animationDelay = -Math.random() * 12 + "s";
    const s = 2 + Math.random() * 4;
    p.style.width = p.style.height = s + "px";
    box.appendChild(p);
  }
})();

(function petals() {
  const box = $(".petals");
  const n = reduced ? 0 : 14;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("i");
    p.textContent = Math.random() > 0.5 ? "✿" : "❀";
    p.style.left = Math.random() * 100 + "%";
    p.style.fontSize = 10 + Math.random() * 12 + "px";
    p.style.animationDuration = 12 + Math.random() * 12 + "s";
    p.style.animationDelay = -Math.random() * 16 + "s";
    box.appendChild(p);
  }
})();

(function loaderProgress() {
  const bar = $("#loaderBar");
  const fill = bar.querySelector("i");
  let v = 0;
  const timer = setInterval(() => {
    v = Math.min(100, v + 6 + Math.random() * 10);
    fill.style.width = v + "%";
    if (v >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        bar.classList.add("done");
        $("#btnOpen").hidden = false;
        $("#btnOpen").focus();
      }, 250);
    }
  }, 120);
})();

document.body.classList.add("locked");

$("#btnOpen").addEventListener("click", () => {
  $("#loader").classList.add("hide");
  document.body.classList.remove("locked");
  $("#site").classList.add("on");
  $("#nav").classList.add("on");
  $("#miniPlayer").hidden = false;
  Player.play(); // musik dimulai setelah interaksi user
  setTimeout(() => $("#loader").remove(), 1000);
});

/* ---------------------------------------------------------
   Musik global — satu objek Audio untuk seluruh halaman
--------------------------------------------------------- */
const Player = {
  el: $("#audio"),
  ready: false,
  init() {
    this.el.src = weddingConfig.music.src;
    this.el.volume = weddingConfig.music.volume;
    this.el.addEventListener("timeupdate", () => this.sync());
    this.el.addEventListener("loadedmetadata", () => this.sync());
    this.el.addEventListener("error", () => {
      $("#tDur").textContent = "--:--";
    });
    this.el.addEventListener("play", () => this.icons(true));
    this.el.addEventListener("pause", () => this.icons(false));
  },
  play() {
    const p = this.el.play();
    if (p) p.catch(() => toast("Tekan tombol ♪ untuk memutar musik"));
  },
  toggle() {
    this.el.paused ? this.play() : this.el.pause();
  },
  mute() {
    this.el.muted = !this.el.muted;
    const ico = this.el.muted ? "🔇" : "🔊";
    $("#mMute").textContent = ico;
    $("#pMute").textContent = ico;
  },
  icons(playing) {
    $("#pPlay").textContent = playing ? "❚❚" : "▶";
    $("#mPlay").classList.toggle("playing", playing);
  },
  fmt(s) {
    if (!isFinite(s)) return "0:00";
    return Math.floor(s / 60) + ":" + pad(Math.floor(s % 60));
  },
  sync() {
    const d = this.el.duration || 0;
    const pct = d ? (this.el.currentTime / d) * 100 : 0;
    $("#progressFill").style.width = pct + "%";
    $("#progress").setAttribute("aria-valuenow", Math.round(pct));
    $("#tCur").textContent = this.fmt(this.el.currentTime);
    $("#tDur").textContent = this.fmt(d);
  },
  seekTo(ratio) {
    if (this.el.duration) this.el.currentTime = ratio * this.el.duration;
  },
};
Player.init();

$("#pPlay").addEventListener("click", () => Player.toggle());
$("#mPlay").addEventListener("click", () => Player.toggle());
$("#pMute").addEventListener("click", () => Player.mute());
$("#mMute").addEventListener("click", () => Player.mute());
$("#pVol").addEventListener("input", (e) => {
  Player.el.volume = +e.target.value;
  if (Player.el.muted) Player.mute();
});
$("#progress").addEventListener("click", (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  Player.seekTo((e.clientX - r.left) / r.width);
});
$("#progress").addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") Player.el.currentTime += 5;
  if (e.key === "ArrowLeft") Player.el.currentTime -= 5;
});
/* Foto cover tidak bisa diubah pengunjung — hanya lewat weddingConfig.music.cover */

/* ---------------------------------------------------------
   Quote, Acara, Lokasi, Hadiah
--------------------------------------------------------- */
$("#quoteText").textContent = weddingConfig.quote.text;
$("#quoteSrc").textContent = "— " + weddingConfig.quote.source;

$("#events").innerHTML = weddingConfig.events
  .map(
    (e, i) => `
  <article class="event-card reveal" data-anim="up" style="transition-delay:${i * 0.1}s">
    <span class="event-icon" aria-hidden="true">${e.icon}</span>
    <h3>${e.name}</h3>
    <p class="event-date">${e.date}</p>
    <p class="event-time">${e.time}</p>
    <p class="event-place">${e.place}</p>
  </article>`
  )
  .join("");

(function initLocation() {
  const loc = weddingConfig.location;
  $("#locName").textContent = loc.name;
  $("#locAddr").textContent = loc.address;
  const q = encodeURIComponent(loc.query || loc.address);
  $("#mapFrame").src = `https://www.google.com/maps?q=${q}&output=embed`;
  $("#locLink").href = `https://www.google.com/maps/search/?api=1&query=${q}`;
})();

$("#gifts").innerHTML = weddingConfig.gifts
  .map(
    (g, i) => `
  <article class="gift-card reveal" data-anim="up" style="transition-delay:${i * 0.1}s">
    <p class="gift-bank">${g.type}</p>
    <p class="gift-num" data-num="${g.number}">${g.number}</p>
    <p class="gift-holder">a.n. ${g.holder}</p>
    <button class="btn-outline small" data-copy="${g.number}">SALIN NOMOR</button>
  </article>`
  )
  .join("");

$("#gifts").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-copy]");
  if (!btn) return;
  navigator.clipboard?.writeText(btn.dataset.copy).then(
    () => toast("Nomor rekening disalin"),
    () => toast("Gagal menyalin")
  );
});

/* ---------------------------------------------------------
   Countdown
--------------------------------------------------------- */
(function countdown() {
  const target = new Date(weddingConfig.weddingDate).getTime();
  const cells = { d: $("#cdD"), h: $("#cdH"), m: $("#cdM"), s: $("#cdS") };
  const set = (el, val) => {
    if (el.textContent === val) return;
    el.textContent = val;
    el.classList.remove("tick");
    void el.offsetWidth;
    el.classList.add("tick");
  };
  const tick = () => {
    const diff = target - Date.now();
    if (diff <= 0) {
      $("#countdown").hidden = true;
      $("#cdDone").hidden = false;
      clearInterval(t);
      return;
    }
    const s = Math.floor(diff / 1000);
    set(cells.d, pad(Math.floor(s / 86400)));
    set(cells.h, pad(Math.floor((s % 86400) / 3600)));
    set(cells.m, pad(Math.floor((s % 3600) / 60)));
    set(cells.s, pad(s % 60));
  };
  tick();
  const t = setInterval(tick, 1000);
})();

/* ---------------------------------------------------------
   Chapters
--------------------------------------------------------- */
$("#chapters").innerHTML = weddingConfig.chapters
  .map(
    (c, i) => `
  <article class="chapter reveal" data-anim="right" style="transition-delay:${i * 0.09}s">
    <h3>${c.title}</h3>
    <p><strong>${c.subtitle}</strong><br />${c.text}</p>
  </article>`
  )
  .join("");

/* ---------------------------------------------------------
   Gallery + tilt 3D + lightbox
--------------------------------------------------------- */
const galleryGrid = $("#galleryGrid");
galleryGrid.innerHTML = weddingConfig.gallery
  .map(
    (g, i) => `
  <button class="gframe reveal" data-anim="up" data-i="${i}" style="transition-delay:${i * 0.07}s" aria-label="Perbesar foto: ${g.alt}">
    <figure class="polaroid">
      <img src="${g.src}" alt="${g.alt}" loading="lazy" width="900" height="900" />
      <figcaption>${g.caption}</figcaption>
    </figure>
  </button>`
  )
  .join("");

if (!reduced && window.matchMedia("(hover:hover)").matches) {
  $$(".gframe").forEach((f) => {
    const base = getComputedStyle(f).transform;
    f.addEventListener("pointermove", (e) => {
      const r = f.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      f.style.transform = `perspective(900px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) translate3d(${x * 10}px,${y * 10}px,26px) scale(1.05)`;
    });
    f.addEventListener("pointerleave", () => {
      f.style.transform = base === "none" ? "" : base;
    });
  });
}

const LB = {
  i: 0,
  open(i) {
    this.i = i;
    $("#lightbox").hidden = false;
    document.body.classList.add("locked");
    this.render();
    $("#lbClose").focus();
  },
  render() {
    const g = weddingConfig.gallery[this.i];
    const img = $("#lbImg");
    img.src = g.src;
    img.alt = g.alt;
    img.style.animation = "none";
    void img.offsetWidth;
    img.style.animation = "";
  },
  step(d) {
    const n = weddingConfig.gallery.length;
    this.i = (this.i + d + n) % n;
    this.render();
  },
  close() {
    $("#lightbox").hidden = true;
    document.body.classList.remove("locked");
  },
};
galleryGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".gframe");
  if (btn) LB.open(+btn.dataset.i);
});
$("#lbClose").addEventListener("click", () => LB.close());
$("#lbPrev").addEventListener("click", () => LB.step(-1));
$("#lbNext").addEventListener("click", () => LB.step(1));
$("#lightbox").addEventListener("click", (e) => {
  if (e.target.id === "lightbox") LB.close();
});
document.addEventListener("keydown", (e) => {
  if ($("#lightbox").hidden) return;
  if (e.key === "Escape") LB.close();
  if (e.key === "ArrowRight") LB.step(1);
  if (e.key === "ArrowLeft") LB.step(-1);
});

/* ---------------------------------------------------------
   Pesan / ucapan
   MessageStore dibuat API-ready: cukup ganti isi method-nya
   dengan fetch() ke backend/database bila sudah tersedia.
--------------------------------------------------------- */
const API = (weddingConfig.apiBase || "").replace(/\/$/, "");

const MessageStore = {
  key: "wedding_messages_v1",
  async list() {
    if (API) {
      const res = await fetch(`${API}/api/messages`);
      if (!res.ok) throw new Error("Gagal memuat pesan");
      return await res.json();
    }
    try {
      return JSON.parse(localStorage.getItem(this.key)) || [];
    } catch {
      return [];
    }
  },
  async add(msg) {
    if (API) {
      const res = await fetch(`${API}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });
      if (!res.ok) throw new Error("Gagal mengirim pesan");
      return await res.json();
    }
    const all = await this.list();
    const item = { id: Date.now().toString(36), createdAt: new Date().toISOString(), ...msg };
    all.unshift(item);
    localStorage.setItem(this.key, JSON.stringify(all));
    return item;
  },
  async remove(id) {
    if (API) {
      const res = await fetch(`${API}/api/messages/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus pesan");
      return;
    }
    const all = (await this.list()).filter((m) => m.id !== id);
    localStorage.setItem(this.key, JSON.stringify(all));
  },
};

const msgList = $("#msgList");

function fmtTime(iso) {
  if (!iso) return ""; // spreadsheet hanya menyimpan nama & pesan
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return d.toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

async function renderMessages() {
  let items = [];
  try {
    items = await MessageStore.list();
  } catch {
    msgList.innerHTML = `<p class="msg-empty">Gagal memuat pesan. Pastikan server db.py sedang berjalan.</p>`;
    return;
  }
  if (!items.length) {
    msgList.innerHTML = `<p class="msg-empty">Belum ada ucapan. Jadilah yang pertama mengirim doa untuk kami ♡</p>`;
    return;
  }
  msgList.innerHTML = items
    .map(
      (m) => `
    <article class="msg-card" data-id="${m.id}">
      <div class="msg-head">
        <span class="msg-name">${esc(m.name)}</span>
        <button class="dots" aria-label="Menu pesan" aria-haspopup="true">•••</button>
      </div>
      <p class="msg-text">${esc(m.text)}</p>
      <span class="msg-time">${fmtTime(m.createdAt)}</span>
    </article>`
    )
    .join("");
}
renderMessages();

$("#msgForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = $("#mName").value.trim();
  const text = $("#mText").value.trim();
  const err = $("#mErr");
  if (!name || !text) {
    err.textContent = "Nama dan pesan tidak boleh kosong.";
    err.hidden = false;
    (!name ? $("#mName") : $("#mText")).focus();
    return;
  }
  err.hidden = true;
  try {
    await MessageStore.add({ name, text });
  } catch {
    err.textContent = "Gagal mengirim pesan. Coba lagi sebentar lagi.";
    err.hidden = false;
    return;
  }
  await renderMessages();
  e.target.reset();
  toast("Pesan berhasil dikirim ♡");
});

/* dropdown ••• */
function closeMenus() {
  $$(".menu").forEach((m) => m.remove());
}
document.addEventListener("click", (e) => {
  const dots = e.target.closest(".dots");
  if (!dots) {
    if (!e.target.closest(".menu")) closeMenus();
    return;
  }
  const card = dots.closest(".msg-card");
  const existing = card.querySelector(".menu");
  closeMenus();
  if (existing) return;
  const menu = document.createElement("div");
  menu.className = "menu";
  menu.innerHTML = `
    <button data-act="copy">Copy</button>
    <button data-act="reply">Reply</button>
    <button data-act="delete" class="danger">Delete</button>`;
  card.appendChild(menu);
});

msgList.addEventListener("click", async (e) => {
  const btn = e.target.closest(".menu button");
  if (!btn) return;
  const card = btn.closest(".msg-card");
  const id = card.dataset.id;
  const act = btn.dataset.act;
  closeMenus();

  if (act === "copy") {
    const text = card.querySelector(".msg-text").textContent;
    try {
      await navigator.clipboard.writeText(text);
      toast("Pesan disalin");
    } catch {
      toast("Gagal menyalin pesan");
    }
  }
  if (act === "reply") {
    const name = card.querySelector(".msg-name").textContent;
    $("#mText").value = `@${name} `;
    $("#pesan").scrollIntoView({ behavior: "smooth" });
    $("#mText").focus();
  }
  if (act === "delete") {
    confirmDelete(async () => {
      card.classList.add("out");
      await MessageStore.remove(id);
      setTimeout(renderMessages, 380);
      toast("Pesan dihapus");
    });
  }
});

function confirmDelete(onOk) {
  const box = $("#confirm");
  box.hidden = false;
  const ok = $("#cOk");
  const cancel = $("#cCancel");
  const close = () => {
    box.hidden = true;
    ok.onclick = cancel.onclick = null;
  };
  ok.onclick = () => {
    close();
    onOk();
  };
  cancel.onclick = close;
  box.onclick = (e) => {
    if (e.target === box) close();
  };
  ok.focus();
}

/* ---------------------------------------------------------
   Navigasi, scroll reveal, ripple
--------------------------------------------------------- */
$("#btnMasuk").addEventListener("click", () => {
  $("#profil").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
});

$$(".ripple").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const r = btn.getBoundingClientRect();
    const ink = document.createElement("span");
    ink.className = "ripple-ink";
    ink.style.left = e.clientX - r.left + "px";
    ink.style.top = e.clientY - r.top + "px";
    ink.style.width = ink.style.height = "18px";
    btn.appendChild(ink);
    setTimeout(() => ink.remove(), 620);
  });
});

const navToggle = $("#navToggle");
navToggle.addEventListener("click", () => {
  const open = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!open));
  $("#navLinks").classList.toggle("open", !open);
});
$$("#navLinks a").forEach((a) =>
  a.addEventListener("click", () => {
    navToggle.setAttribute("aria-expanded", "false");
    $("#navLinks").classList.remove("open");
  })
);
window.addEventListener("scroll", () => {
  $("#nav").classList.toggle("scrolled", window.scrollY > 20);
});

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        io.unobserve(en.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
);
$$(".reveal").forEach((el) => io.observe(el));

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      $$("#navLinks a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    });
  },
  { threshold: 0.4 }
);
$$("main section[id]").forEach((s) => spy.observe(s));
