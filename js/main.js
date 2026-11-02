(function () {
  const list = document.getElementById("publication-list");
  const toggle = document.getElementById("publication-toggle");
  const summary = document.getElementById("publication-summary");
  const search = document.getElementById("publication-search");
  const chart = document.getElementById("research-chart");
  const INITIAL_COUNT = 8;
  let data = [];
  let expanded = false;

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

  /* ---------- Daftar publikasi ---------- */

  function renderPublications() {
    const query = search.value.trim();
    const needle = query.toLowerCase();
    const filtered = needle
      ? data.filter(function (p) {
          return (p.title + " " + p.authors + " " + p.source + " " + p.year).toLowerCase().indexOf(needle) !== -1;
        })
      : data;
    const visible = expanded || needle ? filtered : filtered.slice(0, INITIAL_COUNT);

    list.innerHTML = visible.length
      ? visible
          .map(function (p) {
            const cites = Number(p.citedBy) || 0;
            return (
              '<li class="publication-item">' +
              '<span class="pub-year">' + escapeHTML(p.year || "—") + "</span>" +
              "<div>" +
              '<a class="pub-title" href="' + escapeHTML(p.href) + '" target="_blank" rel="noreferrer">' + highlight(p.title, query) + "</a>" +
              '<p class="pub-meta">' + highlight(p.authors, query) + "</p>" +
              '<p class="pub-meta">' + (p.source ? highlight(p.source, query) + " · " : "") + "dikutip " + cites + "×</p>" +
              "</div></li>"
            );
          })
          .join("")
      : '<li class="muted">Tidak ada publikasi yang cocok dengan “' + escapeHTML(query) + "”.</li>";

    toggle.classList.toggle("hidden", Boolean(needle) || data.length <= INITIAL_COUNT);
    toggle.textContent = expanded ? "Tampilkan lebih sedikit" : "Lihat semua " + data.length + " publikasi";
    toggle.setAttribute("aria-expanded", String(expanded));
  }

  function computeMetrics(publications) {
    const cites = publications
      .map(function (p) {
        return Number(p.citedBy) || 0;
      })
      .sort(function (a, b) {
        return b - a;
      });
    let h = 0;
    while (h < cites.length && cites[h] >= h + 1) h++;
    return {
      total: cites.reduce(function (sum, c) {
        return sum + c;
      }, 0),
      hIndex: h,
      i10: cites.filter(function (c) {
        return c >= 10;
      }).length,
    };
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  /* ---------- Grafik publikasi & sitasi per tahun ---------- */

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
      chart.innerHTML = '<p class="muted">Belum ada data.</p>';
      return;
    }

    const W = 640;
    const H = 260;
    const padT = 24;
    const padB = 26;
    const plotH = H - padT - padB;
    const step = W / years.length;
    const barW = Math.min(26, step * 0.5);
    const maxPubs = Math.max.apply(null, years.map(function (y) { return byYear[y].pubs; }));
    const maxCites = Math.max.apply(null, years.map(function (y) { return byYear[y].cites; })) || 1;

    const points = years.map(function (y, i) {
      return {
        year: y,
        cx: step * i + step / 2,
        barH: (byYear[y].pubs / maxPubs) * plotH * 0.85,
        cy: padT + plotH - (byYear[y].cites / maxCites) * plotH * 0.95,
        pubs: byYear[y].pubs,
        cites: byYear[y].cites,
      };
    });

    const linePath = points.map(function (pt, i) { return (i ? "L" : "M") + pt.cx.toFixed(1) + " " + pt.cy.toFixed(1); }).join(" ");

    let svg = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Grafik jumlah publikasi dan sitasi per tahun">';
    [0.5, 1].forEach(function (f) {
      const y = padT + plotH - plotH * f;
      svg += '<line class="grid-line" x1="0" x2="' + W + '" y1="' + y + '" y2="' + y + '"/>';
    });
    points.forEach(function (pt) {
      const y = padT + plotH - pt.barH;
      svg += '<rect class="bar" x="' + (pt.cx - barW / 2).toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + pt.barH.toFixed(1) + '"/>';
      svg += '<text x="' + pt.cx.toFixed(1) + '" y="' + (y - 6).toFixed(1) + '" text-anchor="middle">' + pt.pubs + "</text>";
      svg += '<text x="' + pt.cx.toFixed(1) + '" y="' + (H - 6) + '" text-anchor="middle">' + (years.length > 8 ? "’" + pt.year.slice(2) : pt.year) + "</text>";
    });
    svg += '<path class="cite-line" d="' + linePath + '"/>';
    points.forEach(function (pt, i) {
      svg += '<circle class="cite-dot" cx="' + pt.cx.toFixed(1) + '" cy="' + pt.cy.toFixed(1) + '" r="3.5"/>';
      svg += '<rect class="hit" data-i="' + i + '" x="' + (pt.cx - step / 2).toFixed(1) + '" y="0" width="' + step.toFixed(1) + '" height="' + H + '" fill="transparent"/>';
    });
    svg += "</svg>";

    chart.innerHTML = svg + '<div class="chart-tooltip"></div>';

    const tooltip = chart.querySelector(".chart-tooltip");
    const svgEl = chart.querySelector("svg");
    chart.querySelectorAll(".hit").forEach(function (hit) {
      hit.addEventListener("pointerenter", function () {
        const pt = points[Number(hit.dataset.i)];
        const scale = svgEl.getBoundingClientRect().width / W;
        tooltip.textContent = pt.year + ": " + pt.pubs + " publikasi, " + pt.cites + " sitasi";
        tooltip.style.left = pt.cx * scale + "px";
        tooltip.style.top = Math.min(pt.cy, padT + plotH - pt.barH) * scale + "px";
        tooltip.classList.add("is-shown");
      });
      hit.addEventListener("pointerleave", function () {
        tooltip.classList.remove("is-shown");
      });
    });
  }

  fetch("data/publications.json")
    .then(function (response) {
      if (!response.ok) throw new Error("Gagal memuat publikasi");
      return response.json();
    })
    .then(function (publications) {
      data = publications;
      const m = computeMetrics(publications);
      summary.textContent = publications.length + " publikasi, " + m.total + " sitasi (termasuk riset bersama)";
      setText("stat-publications", publications.length);
      setText("stat-citations", m.total);
      setText("stat-hindex", m.hIndex);
      setText("metric-citations", m.total);
      setText("metric-hindex", m.hIndex);
      setText("metric-i10", m.i10);
      renderChart(publications);
      renderPublications();
    })
    .catch(function () {
      summary.textContent = "Publikasi belum bisa dimuat.";
      chart.innerHTML = '<p class="muted">Grafik belum bisa dimuat.</p>';
    });

  toggle.addEventListener("click", function () {
    expanded = !expanded;
    renderPublications();
    if (!expanded) document.getElementById("publikasi").scrollIntoView();
  });

  let timer;
  search.addEventListener("input", function () {
    clearTimeout(timer);
    timer = setTimeout(renderPublications, 120);
  });
})();
