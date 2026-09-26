(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Navigasi & progres gulir ---------- */

  const nav = document.getElementById("nav");
  const progress = document.getElementById("scroll-progress");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
    nav.classList.toggle("is-scrolled", window.scrollY > 20);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    mobileMenu.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  }

  menuToggle.addEventListener("click", function () {
    setMenu(!mobileMenu.classList.contains("is-open"));
  });

  mobileMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenu(false);
    });
  });

  // Tandai menu aktif sesuai section yang sedang dilihat
  const navLinks = document.querySelectorAll(".nav-links a");
  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  document.querySelectorAll("main section[id]").forEach(function (section) {
    sectionObserver.observe(section);
  });

  /* ---------- Animasi muncul ---------- */

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  function observeReveal(root) {
    root.querySelectorAll(".reveal").forEach(function (element) {
      // Beri jeda bertingkat pada elemen bersaudara
      const siblings = Array.prototype.filter.call(element.parentElement.children, function (child) {
        return child.classList.contains("reveal");
      });
      const index = siblings.indexOf(element);
      element.style.setProperty("--delay", Math.min(index, 6) * 0.08 + "s");
      revealObserver.observe(element);
    });
  }

  observeReveal(document);

  const trajectory = document.getElementById("trajectory");
  if (trajectory) revealObserver.observe(trajectory);

  /* ---------- Efek kursor ---------- */

  if (finePointer && !reduceMotion) {
    const glow = document.getElementById("cursor-glow");
    let gx = 0;
    let gy = 0;
    let tx = 0;
    let ty = 0;

    window.addEventListener(
      "pointermove",
      function (event) {
        tx = event.clientX;
        ty = event.clientY;
        document.body.classList.add("has-pointer");
      },
      { passive: true }
    );

    (function followCursor() {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = "translate(" + gx + "px, " + gy + "px)";
      requestAnimationFrame(followCursor);
    })();

    document.querySelectorAll(".magnetic").forEach(function (button) {
      button.addEventListener("pointermove", function (event) {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        button.style.transform = "translate(" + x * 0.18 + "px, " + y * 0.28 + "px)";
      });
      button.addEventListener("pointerleave", function () {
        button.style.transform = "";
      });
    });

    document.querySelectorAll(".tilt").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = "perspective(800px) rotateX(" + -py * 10 + "deg) rotateY(" + px * 12 + "deg) translateY(-4px)";
      });
      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
      });
    });

    // Foto hero bergerak mengikuti kursor (paralaks)
    const heroVisual = document.getElementById("hero-visual");
    const atom = heroVisual.querySelector(".atom");
    const photo = heroVisual.querySelector(".hero-photo");
    window.addEventListener(
      "pointermove",
      function (event) {
        if (window.scrollY > window.innerHeight) return;
        const px = event.clientX / window.innerWidth - 0.5;
        const py = event.clientY / window.innerHeight - 0.5;
        atom.style.transform = "rotateY(" + px * 14 + "deg) rotateX(" + -py * 14 + "deg)";
        photo.style.transform = "translateX(-50%) translate(" + px * -14 + "px, " + py * -8 + "px)";
      },
      { passive: true }
    );
  }

  // Sorotan mengikuti kursor di dalam kartu
  document.addEventListener(
    "pointermove",
    function (event) {
      const card = event.target.closest && event.target.closest(".spotlight");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", event.clientX - rect.left + "px");
      card.style.setProperty("--my", event.clientY - rect.top + "px");
    },
    { passive: true }
  );

  /* ---------- Teks peran yang diketik ---------- */

  const roles = [
    "Dosen Pendidikan Fisika",
    "Peneliti Media Pembelajaran",
    "Dekan FST Universitas Nurul Huda",
    "Founder PT Sangu Ilmu Cendekia",
    "Kreator Konten Edukasi Sains",
  ];
  const typed = document.getElementById("typed-role");

  if (!reduceMotion) {
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = true;

    function typeLoop() {
      if (deleting) {
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      } else {
        charIndex++;
      }
      typed.textContent = roles[roleIndex].slice(0, charIndex);

      let delay = deleting ? 35 : 70;
      if (!deleting && charIndex === roles[roleIndex].length) {
        deleting = true;
        delay = 2200;
      }
      setTimeout(typeLoop, delay);
    }

    setTimeout(typeLoop, 2600);
  }

  /* ---------- Medan partikel (hero) ---------- */

  const canvas = document.getElementById("field-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let width = 0;
  let height = 0;
  let mouse = { x: -9999, y: -9999 };
  let heroVisible = true;
  const colors = ["46, 230, 197", "142, 240, 168", "228, 247, 107"];

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(110, Math.floor((width * height) / 14000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.6 + 0.6,
        c: colors[i % colors.length],
      });
    }
  }

  function drawField() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Kursor bertindak sebagai sumur gravitasi
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist2 = dx * dx + dy * dy;
      if (dist2 < 40000 && dist2 > 100) {
        const force = 18 / dist2;
        p.vx += dx * force;
        p.vy += dy * force;
      }

      p.vx *= 0.985;
      p.vy *= 0.985;
      // Gerak termal kecil agar partikel tidak berhenti
      p.vx += (Math.random() - 0.5) * 0.02;
      p.vy += (Math.random() - 0.5) * 0.02;
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x += width;
      if (p.x > width) p.x -= width;
      if (p.y < 0) p.y += height;
      if (p.y > height) p.y -= height;

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const ex = p.x - q.x;
        const ey = p.y - q.y;
        const d2 = ex * ex + ey * ey;
        if (d2 < 13000) {
          ctx.strokeStyle = "rgba(" + p.c + "," + (0.16 * (1 - d2 / 13000)).toFixed(3) + ")";
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      if (dist2 < 28000) {
        ctx.strokeStyle = "rgba(46, 230, 197," + (0.3 * (1 - dist2 / 28000)).toFixed(3) + ")";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(" + p.c + ",0.9)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function animateField() {
    if (heroVisible) drawField();
    requestAnimationFrame(animateField);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  if (reduceMotion) {
    drawField();
  } else {
    const hero = document.querySelector(".hero");
    hero.addEventListener("pointermove", function (event) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    });
    hero.addEventListener("pointerleave", function () {
      mouse.x = -9999;
      mouse.y = -9999;
    });
    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
    }).observe(hero);
    animateField();
  }

  /* ---------- Penghitung angka ---------- */

  function animateCounter(element, target) {
    element.dataset.target = String(target);
    if (reduceMotion) {
      element.textContent = target;
      return;
    }
    const start = performance.now();
    const duration = 1800;
    (function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      element.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }

  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target, Number(entry.target.dataset.target));
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  document.querySelectorAll(".counter, .metric-value").forEach(function (element) {
    element.dataset.target = element.dataset.target || element.textContent;
    counterObserver.observe(element);
  });

  /* ---------- Data publikasi ---------- */

  const publicationList = document.getElementById("publication-list");
  const publicationToggle = document.getElementById("publication-toggle");
  const publicationSummary = document.getElementById("publication-summary");
  const publicationSearch = document.getElementById("publication-search");
  const researchChart = document.getElementById("research-chart");
  const INITIAL_COUNT = 6;
  let publicationData = [];
  let publicationExpanded = false;

  function escapeHTML(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function highlight(text, query) {
    const safe = escapeHTML(text);
    if (!query) return safe;
    const pattern = new RegExp("(" + escapeHTML(query).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
    return safe.replace(pattern, "<mark>$1</mark>");
  }

  function renderPublications() {
    const query = publicationSearch.value.trim();
    const needle = query.toLowerCase();
    const filtered = needle
      ? publicationData.filter(function (p) {
          return (p.title + " " + p.authors + " " + p.source + " " + p.year).toLowerCase().indexOf(needle) !== -1;
        })
      : publicationData;
    const visible = publicationExpanded || needle ? filtered : filtered.slice(0, INITIAL_COUNT);

    if (!visible.length) {
      publicationList.innerHTML = '<p class="pub-empty">Tidak ada publikasi yang cocok dengan “' + escapeHTML(query) + "”.</p>";
    } else {
      publicationList.innerHTML = visible
        .map(function (p) {
          const cites = Number(p.citedBy) || 0;
          return [
            '<article class="publication-item reveal">',
            '  <span class="pub-year">' + escapeHTML(p.year || "—") + "</span>",
            "  <div>",
            '    <a class="pub-title" href="' + escapeHTML(p.href) + '" target="_blank" rel="noreferrer">' + highlight(p.title, query) + "</a>",
            '    <p class="pub-authors">' + highlight(p.authors, query) + "</p>",
            p.source ? '    <p class="pub-source">' + highlight(p.source, query) + "</p>" : "",
            "  </div>",
            '  <span class="pub-cite' + (cites ? "" : " is-zero") + '">' + (cites ? "★ " + cites + " sitasi" : "0 sitasi") + "</span>",
            "</article>",
          ].join("");
        })
        .join("");
    }

    publicationToggle.classList.toggle("hidden", Boolean(needle) || publicationData.length <= INITIAL_COUNT);
    publicationToggle.textContent = publicationExpanded ? "Tampilkan lebih sedikit" : "Lihat semua " + publicationData.length + " publikasi";
    publicationToggle.setAttribute("aria-expanded", String(publicationExpanded));
    observeReveal(publicationList);
  }

  function computeMetrics(publications) {
    const cites = publications
      .map(function (p) {
        return Number(p.citedBy) || 0;
      })
      .sort(function (a, b) {
        return b - a;
      });
    let hIndex = 0;
    while (hIndex < cites.length && cites[hIndex] >= hIndex + 1) hIndex++;
    return {
      total: cites.reduce(function (sum, c) {
        return sum + c;
      }, 0),
      hIndex: hIndex,
      i10: cites.filter(function (c) {
        return c >= 10;
      }).length,
    };
  }

  function updateNumber(id, value) {
    const element = document.getElementById(id);
    if (!element) return;
    element.dataset.target = String(value);
    element.textContent = value;
  }

  /* ---------- Grafik publikasi & sitasi ---------- */

  function renderChart(publications) {
    const byYear = {};
    publications.forEach(function (p) {
      if (!/^\d{4}$/.test(p.year || "")) return;
      byYear[p.year] = byYear[p.year] || { pubs: 0, cites: 0 };
      byYear[p.year].pubs += 1;
      byYear[p.year].cites += Number(p.citedBy) || 0;
    });

    const years = Object.keys(byYear).sort();
    if (!years.length) {
      researchChart.innerHTML = '<p class="chart-loading mono">Belum ada data.</p>';
      return;
    }

    const W = 640;
    const H = 280;
    const padL = 8;
    const padR = 8;
    const padT = 30;
    const padB = 30;
    const plotH = H - padT - padB;
    const step = (W - padL - padR) / years.length;
    const barW = Math.min(30, step * 0.5);
    const maxPubs = Math.max.apply(null, years.map(function (y) { return byYear[y].pubs; }));
    const maxCites = Math.max.apply(null, years.map(function (y) { return byYear[y].cites; }));

    const points = years.map(function (y, i) {
      const cx = padL + step * i + step / 2;
      return {
        year: y,
        cx: cx,
        barH: (byYear[y].pubs / maxPubs) * plotH * 0.85,
        cy: padT + plotH - (byYear[y].cites / maxCites) * plotH * 0.95,
        pubs: byYear[y].pubs,
        cites: byYear[y].cites,
      };
    });

    const linePath = points.map(function (pt, i) { return (i ? "L" : "M") + pt.cx.toFixed(1) + " " + pt.cy.toFixed(1); }).join(" ");
    const areaPath = linePath + " L" + points[points.length - 1].cx.toFixed(1) + " " + (padT + plotH) + " L" + points[0].cx.toFixed(1) + " " + (padT + plotH) + " Z";

    let svg = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Grafik jumlah publikasi dan sitasi per tahun">';
    svg += "<defs>";
    svg += '<linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2ee6c5"/><stop offset="1" stop-color="#8ef0a8" stop-opacity="0.35"/></linearGradient>';
    svg += '<linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb547" stop-opacity="0.22"/><stop offset="1" stop-color="#ffb547" stop-opacity="0"/></linearGradient>';
    svg += "</defs>";

    [0.25, 0.5, 0.75, 1].forEach(function (f) {
      const y = padT + plotH - plotH * f;
      svg += '<line class="grid-line" x1="0" x2="' + W + '" y1="' + y + '" y2="' + y + '"/>';
    });

    points.forEach(function (pt, i) {
      const x = pt.cx - barW / 2;
      const y = padT + plotH - pt.barH;
      svg += '<rect class="bar" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + pt.barH.toFixed(1) + '" rx="5" style="transition-delay:' + i * 0.07 + 's"/>';
      svg += '<text class="value-label" x="' + pt.cx.toFixed(1) + '" y="' + (y - 7).toFixed(1) + '" text-anchor="middle">' + pt.pubs + "</text>";
      svg += '<text class="axis-label" x="' + pt.cx.toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle">' + (years.length > 8 ? "’" + pt.year.slice(2) : pt.year) + "</text>";
    });

    svg += '<path class="cite-area" d="' + areaPath + '"/>';
    svg += '<path class="cite-line" d="' + linePath + '" pathLength="1"/>';
    points.forEach(function (pt) {
      svg += '<circle class="cite-dot" cx="' + pt.cx.toFixed(1) + '" cy="' + pt.cy.toFixed(1) + '" r="4.5"/>';
    });
    points.forEach(function (pt, i) {
      svg += '<rect class="hit" data-i="' + i + '" x="' + (pt.cx - step / 2).toFixed(1) + '" y="0" width="' + step.toFixed(1) + '" height="' + H + '" fill="transparent"/>';
    });
    svg += "</svg>";

    researchChart.innerHTML = svg + '<div class="chart-tooltip" id="chart-tooltip"></div>';

    const tooltip = document.getElementById("chart-tooltip");
    const svgEl = researchChart.querySelector("svg");
    researchChart.querySelectorAll(".hit").forEach(function (hit) {
      hit.addEventListener("pointerenter", function () {
        const pt = points[Number(hit.dataset.i)];
        const scale = svgEl.getBoundingClientRect().width / W;
        tooltip.innerHTML = "<strong>" + pt.year + "</strong> · " + pt.pubs + " publikasi · <span style=\"color:var(--amber)\">" + pt.cites + " sitasi</span>";
        tooltip.style.left = pt.cx * scale + "px";
        tooltip.style.top = Math.min(pt.cy, padT + plotH - pt.barH) * scale + "px";
        tooltip.classList.add("is-shown");
      });
      hit.addEventListener("pointerleave", function () {
        tooltip.classList.remove("is-shown");
      });
    });

    new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting) {
        researchChart.classList.add("is-drawn");
        obs.disconnect();
      }
    }, { threshold: 0.3 }).observe(researchChart);
  }

  fetch("data/publications.json")
    .then(function (response) {
      if (!response.ok) throw new Error("Gagal memuat publikasi");
      return response.json();
    })
    .then(function (publications) {
      publicationData = publications;
      const metrics = computeMetrics(publications);
      publicationSummary.textContent = publications.length + " publikasi · " + metrics.total + " sitasi · termasuk riset bersama";

      updateNumber("stat-publications", publications.length);
      updateNumber("stat-citations", metrics.total);
      updateNumber("stat-hindex", metrics.hIndex);
      updateNumber("metric-citations", metrics.total);
      updateNumber("metric-hindex", metrics.hIndex);
      updateNumber("metric-i10", metrics.i10);

      renderChart(publications);
      renderPublications();
    })
    .catch(function () {
      publicationSummary.textContent = "Publikasi belum bisa dimuat";
      researchChart.innerHTML = '<p class="chart-loading mono">Grafik belum bisa dimuat.</p>';
      publicationList.innerHTML = '<p class="pub-empty">Metadata publikasi tidak tersedia. Silakan muat ulang halaman.</p>';
    });

  publicationToggle.addEventListener("click", function () {
    publicationExpanded = !publicationExpanded;
    renderPublications();
    if (!publicationExpanded) {
      document.getElementById("publication").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }
  });

  let searchTimer;
  publicationSearch.addEventListener("input", function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(renderPublications, 120);
  });
})();
