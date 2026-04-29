// preview.js — saas-dark interactive preview
// Self-contained. Reads CSS custom properties at runtime.
(function () {
  "use strict";

  function el(tag, attrs, children) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === "style") Object.assign(e.style, attrs[k]);
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), attrs[k]);
      else if (k === "class") e.className = attrs[k];
      else e.setAttribute(k, attrs[k]);
    }
    if (children) (Array.isArray(children) ? children : [children]).forEach((c) => {
      if (c == null) return;
      e.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
    });
    return e;
  }
  function copy(s) {
    try { navigator.clipboard.writeText(s); }
    catch (_) {
      const ta = document.createElement("textarea");
      ta.value = s; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
    }
  }
  const toastEl = document.getElementById("toast");
  let toastTimer = null;
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1400);
  }

  // ── color ramps ───────────────────────────────────────────────────────────
  const greySteps = [0,50,100,200,300,400,500,600,700,800,900,950];
  const accentSteps = [50,100,200,300,400,500,600,700,800,900,950];
  function buildRamp(rootId, prefix, steps) {
    const root = document.getElementById(rootId);
    root.appendChild(el("div", { class: "lbl" }, prefix));
    steps.forEach((s) => {
      const sw = el("button", {
        type: "button",
        class: "swatch",
        "data-step": prefix + "-" + s,
        "aria-label": prefix + "-" + s + " (click to copy)",
        style: { background: "var(--color-" + prefix + "-" + s + ")" },
        onclick: () => {
          const v = getComputedStyle(document.documentElement).getPropertyValue("--color-" + prefix + "-" + s).trim();
          copy("oklch(" + v + ")");
          showToast(prefix + "-" + s + " copied");
        },
      });
      root.appendChild(sw);
    });
  }
  buildRamp("rampGrey", "grey", greySteps);
  buildRamp("rampAccent", "accent", accentSteps);

  // ── semantic / status / chart grids ───────────────────────────────────────
  const semantic = ["bg-base","bg-surface","bg-elevated","bg-overlay","text-primary","text-secondary","text-tertiary","text-disabled","border-subtle","border-default","border-strong","border-focus","accent","accent-hover","accent-press","accent-subtle"];
  const status = ["success","warning","error","info"];
  const chart = ["color-chart-1","color-chart-2","color-chart-3","color-chart-4","color-chart-5","color-chart-6","color-chart-7","color-chart-8"];

  function buildGrid(rootId, tokens) {
    const root = document.getElementById(rootId);
    tokens.forEach((t) => {
      const block = el("div", { class: "colorblock", style: { background: "var(--" + t + ")" } });
      const name = el("div", { class: "name" }, t);
      const val = el("div", { class: "val" });
      val.id = "val-" + t;
      const tile = el("button", {
        type: "button",
        class: "tile",
        style: { cursor: "pointer", textAlign: "left", border: "1px solid var(--border-subtle)" },
        onclick: () => { copy("var(--" + t + ")"); showToast(t + " copied"); },
      }, [block, name, val]);
      root.appendChild(tile);
    });
  }
  buildGrid("semanticGrid", semantic);
  buildGrid("statusGrid", status);
  buildGrid("chartGrid", chart);

  // ── contrast matrix ───────────────────────────────────────────────────────
  const fgList = [["text-primary","Body"],["text-secondary","Body"],["text-tertiary","Body"],["accent","Large"]];
  const bgList = ["bg-base","bg-surface","bg-elevated","bg-overlay"];
  const matrixEl = document.getElementById("contrastMatrix");
  function getColor(varName) {
    const tmp = document.createElement("span");
    tmp.style.color = "var(" + varName + ")";
    document.body.appendChild(tmp);
    const rgb = getComputedStyle(tmp).color;
    document.body.removeChild(tmp);
    const m = rgb.match(/\d+(\.\d+)?/g);
    if (!m) return [0,0,0];
    return [+m[0]/255, +m[1]/255, +m[2]/255];
  }
  function relLum(c) {
    const lin = (x) => x <= 0.03928 ? x/12.92 : Math.pow((x+0.055)/1.055, 2.4);
    return 0.2126*lin(c[0]) + 0.7152*lin(c[1]) + 0.0722*lin(c[2]);
  }
  function ratio(a, b) {
    const la = relLum(a) + 0.05, lb = relLum(b) + 0.05;
    return Math.max(la, lb) / Math.min(la, lb);
  }
  function buildMatrix() {
    while (matrixEl.firstChild) matrixEl.removeChild(matrixEl.firstChild);
    const head = document.createElement("tr");
    head.appendChild(document.createElement("th"));
    bgList.forEach((b) => { const th = document.createElement("th"); th.textContent = b; head.appendChild(th); });
    matrixEl.appendChild(head);
    fgList.forEach((pair) => {
      const fg = pair[0];
      const tr = document.createElement("tr");
      const th = document.createElement("th"); th.textContent = fg; tr.appendChild(th);
      bgList.forEach((b) => {
        const r = ratio(getColor("--" + fg), getColor("--" + b));
        const td = document.createElement("td");
        const span = document.createElement("span");
        span.className = r >= 4.5 ? "ok" : "fail";
        span.textContent = r.toFixed(2);
        td.appendChild(span);
        tr.appendChild(td);
      });
      matrixEl.appendChild(tr);
    });
  }
  buildMatrix();

  // ── typography scale ──────────────────────────────────────────────────────
  const sizes = [
    ["xs","12px","1.6","0.01em","400","body"],
    ["sm-dense","13px","1.5","0","400","body"],
    ["sm","14px","1.5","0","400","body"],
    ["base","16px","1.6","-0.01em","400","body"],
    ["lg","20px","1.4","-0.02em","500","body"],
    ["xl","24px","1.3","-0.02em","600","display"],
    ["2xl","32px","1.2","-0.03em","600","display"],
    ["3xl","40px","1.1","-0.04em","700","display"],
    ["4xl","56px","1.0","-0.05em","700","display"],
  ];
  const typeRoot = document.getElementById("typeScale");
  sizes.forEach((row) => {
    const name = row[0], size = row[1], lh = row[2], tr = row[3], w = row[4], fam = row[5];
    const node = el("div", { class: "type-row" }, [
      el("div", { class: "key" }, "text-" + name),
      el("div", { class: "meta" }, size + " · " + lh + " · " + tr + " · " + w),
      el("div", {
        class: "specimen",
        style: {
          fontSize: size, lineHeight: lh, letterSpacing: tr, fontWeight: w,
          fontFamily: "var(--font-" + fam + ")"
        }
      }, "The quick brown fox jumps over"),
      el("button", {
        type: "button",
        class: "copy-btn",
        onclick: () => { copy("text-" + name); showToast("text-" + name + " copied"); }
      }, "copy"),
    ]);
    typeRoot.appendChild(node);
  });

  // ── spacing scale ─────────────────────────────────────────────────────────
  const spacing = [["1","4px"],["2","8px"],["3","12px"],["4","16px"],["6","24px"],["8","32px"],["12","48px"],["16","64px"],["24","96px"],["32","128px"]];
  const spaceRoot = document.getElementById("spacingScale");
  spacing.forEach((pair) => {
    const n = pair[0], val = pair[1];
    const bar = el("div", { class: "bar", style: { width: val } });
    const row = el("button", {
      type: "button",
      class: "spacing-row",
      onclick: () => { copy("var(--space-" + n + ")"); showToast("space-" + n + " copied"); }
    }, [
      el("div", { class: "key" }, "space-" + n),
      el("div", null, bar),
      el("div", { class: "val" }, val),
    ]);
    spaceRoot.appendChild(row);
  });

  // ── shadows ───────────────────────────────────────────────────────────────
  const shadows = ["xs","sm","md","lg","xl"];
  const shadowRoot = document.getElementById("shadowRow");
  shadows.forEach((s) => {
    shadowRoot.appendChild(el("div", { class: "shadow-sample", style: { boxShadow: "var(--shadow-" + s + ")" } }, "shadow-" + s));
  });

  // ── motion ────────────────────────────────────────────────────────────────
  const durations = [["fast","100ms"],["normal","150ms"],["slow","250ms"],["deliberate","400ms"],["spring","350ms"]];
  const dot = document.getElementById("motionDot");
  const durationRoot = document.getElementById("durationRow");
  durations.forEach((pair) => {
    const n = pair[0], v = pair[1];
    durationRoot.appendChild(el("button", {
      class: "motion-btn",
      type: "button",
      onclick: () => playMotion(v, n === "spring" ? "var(--easing-spring)" : "var(--easing-out)"),
    }, n + " · " + v));
  });
  function playMotion(duration, easing) {
    dot.style.transition = "none";
    dot.style.transform = "translateX(0)";
    requestAnimationFrame(() => {
      dot.style.transition = "transform " + duration + " " + easing;
      dot.style.transform = "translateX(calc(100% - 24px))";
      setTimeout(() => {
        dot.style.transition = "transform " + duration + " " + easing;
        dot.style.transform = "translateX(0)";
      }, parseInt(duration) + 100);
    });
  }

  const easings = [
    ["out","cubic-bezier(0, 0, 0.2, 1)", [0,0,0.2,1]],
    ["in","cubic-bezier(0.4, 0, 1, 1)", [0.4,0,1,1]],
    ["in-out","cubic-bezier(0.4, 0, 0.2, 1)", [0.4,0,0.2,1]],
    ["spring","cubic-bezier(0.34, 1.56, 0.64, 1)", [0.34,1.56,0.64,1]],
  ];
  const easingRoot = document.getElementById("easingGrid");
  easings.forEach((row) => {
    const name = row[0], val = row[1], ctrl = row[2];
    const x1 = ctrl[0]*100, y1 = 100 - ctrl[1]*100, x2 = ctrl[2]*100, y2 = 100 - ctrl[3]*100;
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "120");
    svg.style.marginTop = "var(--space-2)";
    const rect = document.createElementNS(ns, "rect");
    rect.setAttribute("x", "0"); rect.setAttribute("y", "0");
    rect.setAttribute("width", "100"); rect.setAttribute("height", "100");
    rect.setAttribute("fill", "var(--bg-elevated)");
    rect.setAttribute("stroke", "var(--border-subtle)");
    svg.appendChild(rect);
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", "M0,100 C" + x1 + "," + y1 + " " + x2 + "," + y2 + " 100,0");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "var(--accent)");
    path.setAttribute("stroke-width", "1.5");
    svg.appendChild(path);
    const tile = el("div", { class: "tile" }, [
      el("div", { class: "name" }, name),
      el("div", { class: "val" }, val),
      svg,
    ]);
    easingRoot.appendChild(tile);
  });

  // ── theme toggle ──────────────────────────────────────────────────────────
  const root = document.documentElement;
  document.getElementById("themeToggle").addEventListener("click", () => {
    const isDark = root.dataset.theme === "dark";
    root.dataset.theme = isDark ? "light" : "dark";
    try { localStorage.setItem("dei-theme", root.dataset.theme); } catch (_) {}
    buildMatrix();
  });
  try {
    const saved = localStorage.getItem("dei-theme");
    if (saved) root.dataset.theme = saved;
  } catch (_) {}

  // ── size selector ─────────────────────────────────────────────────────────
  document.querySelectorAll(".pill[data-size]").forEach((b) => {
    b.addEventListener("click", () => {
      document.querySelectorAll(".pill[data-size]").forEach((x) => x.removeAttribute("aria-pressed"));
      b.setAttribute("aria-pressed", "true");
      document.querySelector(".content").style.maxWidth = b.dataset.size + "px";
    });
  });

  // ── sidebar active state ──────────────────────────────────────────────────
  const links = document.querySelectorAll(".sidebar a");
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((l) => l.classList.remove("active"));
        const a = document.querySelector('.sidebar a[href="#' + e.target.id + '"]');
        if (a) a.classList.add("active");
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll("section").forEach((s) => obs.observe(s));

  // ── export menu ──────────────────────────────────────────────────────────
  document.getElementById("exportBtn").addEventListener("click", () => {
    alert("Files in this folder:\n  tokens.json\n  tokens.css\n  tokens.ts\n  tokens.tailwind.js\n  tokens.figma.json\n  system.md");
  });
})();
