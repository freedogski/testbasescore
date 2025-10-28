(() => {
  const sliders = [
    { el: slider1, val: val1, range: range1, max: 10 },
    { el: slider2, val: val2, range: range2, max: 5 },
    { el: slider3, val: val3, range: range3, max: 5 },
  ];

  const totalEl = document.getElementById("total");
  const totalRange = document.getElementById("totalRange");

  const round1 = x => Math.round(x * 10) / 10;

  // -----------------------------
  // CATEGORY & COLOR HELPERS
  // -----------------------------
  function categoryText(v, max) {
    const ranges = max === 10
      ? [
          { limit: 2.0, name: "Poor" },
          { limit: 4.0, name: "Managing" },
          { limit: 6.0, name: "Adequate" },
          { limit: 8.0, name: "Good" },
          { limit: 10.0, name: "Excellent" },
        ]
      : [
          { limit: 1.0, name: "Poor" },
          { limit: 2.0, name: "Managing" },
          { limit: 3.0, name: "Adequate" },
          { limit: 4.0, name: "Good" },
          { limit: 5.0, name: "Excellent" },
        ];

    const category = ranges.find(r => v <= r.limit)?.name || "Excellent";
    const index = ranges.findIndex(r => r.name === category);
    const segmentCount = ranges.length;

    // Divide range into thirds (Low / Mid / High)
    const rangeLow = (index / segmentCount) * max;
    const rangeMid = ((index + 0.5) / segmentCount) * max;

    const level = v <= rangeLow ? "Low" : v <= rangeMid ? "Mid" : "High";
    return { level, category };
  }

  function totalCategoryText(total) {
    if (total <= 0) return "";

    const ranges = [
      { limit: 4.0, name: "Poor" },
      { limit: 8.0, name: "Managing" },
      { limit: 12.0, name: "Adequate" },
      { limit: 16.0, name: "Good" },
      { limit: 20.0, name: "Excellent" },
    ];

    const category = ranges.find(r => total <= r.limit)?.name || "Excellent";
    const segmentSize = 20 / ranges.length;
    const level =
      total <= segmentSize * 1.3
        ? "Low"
        : total <= segmentSize * 2.6
        ? "Mid"
        : "High";

    return `${level}-${category}`;
  }

  function sliderColor(v, max) {
    const pct = v / max;
    const r = pct <= 0.5 ? 255 : Math.round(510 * (1 - pct));
    const g = pct <= 0.5 ? Math.round(510 * pct) : 255;
    return `rgb(${r},${g},0)`;
  }

  // -----------------------------
  // UPDATE FUNCTION
  // -----------------------------
  let lastTotalText = "";

  function update() {
    let total = 0;

    sliders.forEach(({ el, val, range, max }) => {
      const v = round1(parseFloat(el.value));
      val.textContent = v.toFixed(1);
      total += v;

      const { level, category } = categoryText(v, max);
      range.dataset.full = `${level}-${category}`;
      range.dataset.short = `${level}-${category[0]}`;

      const color = sliderColor(v, max);
      el.style.background = `linear-gradient(to right, red, yellow, green)`;
      el.style.setProperty("--slider-color", color);
    });

    const totalValue = round1(total);
    totalEl.textContent = totalValue.toFixed(1);

    const text = totalCategoryText(totalValue);
    if (text !== lastTotalText) {
      totalRange.classList.add("fade-out");
      setTimeout(() => {
        totalRange.textContent = text;
        totalRange.classList.remove("fade-out");
      }, 150);
      lastTotalText = text;
    }
// -----------------------------
// DARK/LIGHT MODE TOGGLE
// -----------------------------
const themeToggle = document.getElementById("theme-toggle");

// Load saved theme from localStorage
const savedTheme = localStorage.getItem("BaseScoreTheme");
if (savedTheme) document.documentElement.dataset.theme = savedTheme;

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme;
  const newTheme = current === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = newTheme;
  localStorage.setItem("BaseScoreTheme", newTheme);
});

    saveBaseScore(totalValue); // optional: persist total
  }

  // -----------------------------
  // ARROW BUTTONS
  // -----------------------------
  document.querySelectorAll(".arrow-btn").forEach(btn => {
    let timer, interval;

    const stepAction = () => {
      const target = document.getElementById(btn.dataset.target);
      const dir = btn.dataset.dir;
      const step = parseFloat(target.step) || 0.1;
      let val = parseFloat(target.value) || 0;
      val += dir === "up" ? step : -step;
      val = round1(Math.min(parseFloat(target.max), Math.max(parseFloat(target.min), val)));
      target.value = val;
      update();
    };

    const startHold = () => {
      stepAction();
      timer = setTimeout(() => (interval = setInterval(stepAction, 100)), 300);
    };

    const stopHold = () => {
      clearTimeout(timer);
      clearInterval(interval);
    };

    btn.addEventListener("mousedown", startHold);
    btn.addEventListener("mouseup", stopHold);
    btn.addEventListener("mouseleave", stopHold);
    btn.addEventListener("touchstart", e => {
      e.preventDefault();
      startHold();
    }, { passive: false });
    btn.addEventListener("touchend", stopHold);
    btn.addEventListener("touchcancel", stopHold);
  });

  // -----------------------------
  // TICK MARKS
  // -----------------------------
  document.querySelectorAll(".tick-container").forEach(tc => {
    for (let i = 0; i <= 5; i++) {
      const tick = document.createElement("div");
      tick.className = "tick";
      tick.style.left = i * 20 + "%";
      tc.appendChild(tick);
    }
  });

  update();
})();
