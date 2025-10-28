// --- Shared BaseScore Storage ---
function saveBaseScore(value) {
  localStorage.setItem("BaseScore", value);
}

function loadBaseScore() {
  return localStorage.getItem("BaseScore") || 0;
}
