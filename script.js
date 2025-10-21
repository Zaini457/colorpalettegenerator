const palette = document.getElementById("palette");
const generateBtn = document.getElementById("generate");
const saveBtn = document.getElementById("save");
const savedPalettesDiv = document.getElementById("saved-palettes");
const themeToggle = document.getElementById("theme-toggle");

let colors = [];

function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

function generatePalette() {
  palette.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const color = colors[i] && colors[i].locked ? colors[i].value : randomColor();
    colors[i] = { value: color, locked: colors[i]?.locked || false };

    const box = document.createElement("div");
    box.classList.add("color-box");
    if (colors[i].locked) box.classList.add("locked");
    box.style.backgroundColor = color;

    const lock = document.createElement("div");
    lock.classList.add("lock-icon");
    lock.textContent = colors[i].locked ? "🔒" : "🔓";
    lock.addEventListener("click", (e) => {
      e.stopPropagation();
      colors[i].locked = !colors[i].locked;
      lock.textContent = colors[i].locked ? "🔒" : "🔓";
      generatePalette();
    });

    const text = document.createElement("div");
    text.classList.add("color-code");
    text.textContent = color;

    box.appendChild(lock);
    box.appendChild(text);

    box.addEventListener("click", () => {
      navigator.clipboard.writeText(color);
      text.textContent = "Copied!";
      setTimeout(() => (text.textContent = color), 1000);
    });

    palette.appendChild(box);
  }
}

function savePalette() {
  const currentPalette = colors.map(c => c.value);
  if (currentPalette.length) {
    const saved = JSON.parse(localStorage.getItem("palettes") || "[]");
    saved.push(currentPalette);
    localStorage.setItem("palettes", JSON.stringify(saved));
    displaySavedPalettes();
  }
}

function displaySavedPalettes() {
  savedPalettesDiv.innerHTML = "";
  const saved = JSON.parse(localStorage.getItem("palettes") || "[]");
  saved.forEach(palette => {
    const div = document.createElement("div");
    div.classList.add("saved-item");
    palette.forEach(color => {
      const colorDiv = document.createElement("div");
      colorDiv.classList.add("saved-color");
      colorDiv.style.backgroundColor = color;
      div.appendChild(colorDiv);
    });
    savedPalettesDiv.appendChild(div);
  });
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  const darkMode = document.body.classList.contains("dark");
  themeToggle.textContent = darkMode ? "🌙 Dark Mode" : "🌞 Light Mode";
  localStorage.setItem("theme", darkMode ? "dark" : "light");
}

generateBtn.addEventListener("click", generatePalette);
saveBtn.addEventListener("click", savePalette);
themeToggle.addEventListener("click", toggleTheme);

window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") document.body.classList.add("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "🌙 Dark Mode" : "🌞 Light Mode";
  generatePalette();
  displaySavedPalettes();
});
