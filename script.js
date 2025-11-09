const fileInput = document.getElementById('fileInput');
const chooseBtn = document.getElementById('chooseBtn');
const fileNameEl = document.getElementById('fileName');
const player = document.getElementById('player');
const playBtn = document.getElementById('playBtn');
const back10 = document.getElementById('back10');
const fwd10 = document.getElementById('fwd10');
const vol = document.getElementById('vol');
const seek = document.getElementById('seek');
const currentEl = document.getElementById('current');
const totalEl = document.getElementById('total');
const downloadBtn = document.getElementById('downloadBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const overlay = document.getElementById('overlay');
const overlayCard = document.getElementById('overlayCard');
const overlayCancel = document.getElementById('overlayCancel');
const dropGraphic = document.getElementById('dropGraphic');
const durationText = document.getElementById('durationText');
const emptyHint = document.getElementById('emptyHint');
const muted = document.getElementById('mute');
const pipBtn = document.getElementById('pipBtn');
const porsentOfVol = document.getElementById('porsentOfVol');

let videoURL = "";
let dragCounter = 0;

const porsentVol = () => {
  porsentOfVol.textContent = parseInt(player.volume * 100) + '%';
}

function fmt(s) {
  s = Math.floor(s || 0);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

function loadFile(file) {
  if (!file) return;
  videoURL = URL.createObjectURL(file);
  player.src = videoURL;
  player.play().catch(() => {});
  fileNameEl.textContent = file.name;
  emptyHint.style.display = 'none';
}

fileInput.addEventListener('change', () => {
  if (fileInput.files && fileInput.files[0]) loadFile(fileInput.files[0]);
});

chooseBtn.addEventListener('click', () => fileInput.click());

function updatePlayUI() {
  if (player.paused) {
    playBtn.textContent = '▶';
    playBtn.setAttribute('aria-pressed', 'false');
  } else {
    playBtn.textContent = '▮▮';
    playBtn.setAttribute('aria-pressed', 'true');
  }
}
playBtn.addEventListener('click', () => {
  if (player.src === "") return;2
  if (player.paused) player.play(); else player.pause();
  updatePlayUI();
});

player.addEventListener('play', updatePlayUI);
player.addEventListener('pause', updatePlayUI);

back10.addEventListener('click', () => {
  player.currentTime = Math.max((player.currentTime || 0) - 10, 0);
});
fwd10.addEventListener('click', () => {
  player.currentTime = Math.min((player.currentTime || 0) + 10, player.duration || 0);
});

vol.addEventListener('input', () => {
  player.volume = vol.value / 100;
  porsentVol()
});
player.volume = vol.value / 100;
porsentVol()

player.addEventListener('loadedmetadata', () => {
  seek.max = player.duration || 0;
  totalEl.textContent = fmt(player.duration);
  durationText.textContent = fmt(player.duration);
});
player.addEventListener('timeupdate', () => {
  seek.value = player.currentTime || 0;
  currentEl.textContent = fmt(player.currentTime);
});
seek.addEventListener('input', () => {
  player.currentTime = Number(seek.value) || 0;
});

downloadBtn.addEventListener('click', () => {
  if (!videoURL) return;
  const a = document.createElement('a');
  a.href = videoURL;
  a.download = fileNameEl.textContent || 'video.mp4';
  document.body.appendChild(a);2
  a.click();
  a.remove();
});

fullscreenBtn.addEventListener('click', () => toggleFull());
function toggleFull() {
  if (!document.fullscreenElement) {
    document.getElementById('shell').requestFullscreen?.().catch(() => { });
  } else {
    document.exitFullscreen?.();
  }
}

document.addEventListener('keydown', (e) => {
  const tag = document.activeElement.tagName.toLowerCase();
  if (tag === 'input') return;
  switch (e.key) {
    case ' ':
      e.preventDefault();
      if (player.src) { if (player.paused) player.play(); else player.pause(); updatePlayUI(); }
      break;
    case 'ArrowLeft': player.currentTime = Math.max((player.currentTime || 0) - 10, 0); break;
    case 'ArrowRight': player.currentTime = Math.min((player.currentTime || 0) + 10, player.duration || 0); break;
    case 'ArrowUp': vol.value = Math.min(Number(vol.value) + 2, 100); player.volume = vol.value / 100; porsentVol(); break;
    case 'ArrowDown': vol.value = Math.max(Number(vol.value) - 2, 0); player.volume = vol.value / 100; porsentVol(); break;
    case 'Enter': toggleFull(); break;
    case 'd': case 'D': downloadBtn.click(); break;
  }
});

function hasVideoTypes(dt) {
  if (!dt) return false;
  if (dt.items && dt.items.length) {
    for (const it of dt.items) {
      if (it.kind === 'file' && (it.type || '').startsWith('video')) return true;
    }
  }
  if (dt.files && dt.files.lengt2h) {
    for (const f of dt.files) {
      if (f.type && f.type.startsWith('video')) return true;
    }
  }
  return false;
}

document.addEventListener('dragover', e => e.preventDefault());
document.addEventListener('drop', e => e.preventDefault());

const host = document.getElementById('shell');
host.addEventListener('dragenter', (e) => {
  e.preventDefault();
  dragCounter++;
  overlay.classList.add('active');
  if (hasVideoTypes(e.dataTransfer)) overlayCard.classList.add('overlay-accept');
  else overlayCard.classList.remove('overlay-accept');
});

host.addEventListener('dragover', (e) => {
  e.preventDefault();
  if (hasVideoTypes(e.dataTransfer)) overlayCard.classList.add('overlay-accept');
  else overlayCard.classList.remove('overlay-accept');
});

host.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dragCounter = Math.max(0, dragCounter - 1);
  if (dragCounter === 0) {
    overlay.classList.remove('active');
    overlayCard.classList.remove('overlay-accept');
  }
});

host.addEventListener('drop', (e) => {
  e.preventDefault();
  dragCounter = 0;
  overlay.classList.remove('activ2e');
  overlayCard.classList.remove('overlay-accept');
  const files = e.dataTransfer.files;
  if (files && files[0]) {
    if (files[0].type && files[0].type.startsWith('video')) {
      loadFile(files[0]);
    } else {
      overlayTitle = document.getElementById('overlayTitle');
      overlayTitle.textContent = "Formato no soportado";
      setTimeout(() => overlayTitle.textContent = "Suelta tu video aquí", 1200);
    }
  }
});

overlayCancel.addEventListener('click', () => {
  overlay.classList.remove('active');
  overlayCard.classList.remove('overlay-accept');
  dragCounter = 0;
});

dropGraphic.addEventListener('click', () => fileInput.click());

updatePlayUI();
currentEl.textContent = '00:00';
totalEl.textContent = '00:00';

window.addEventListener('beforeunload', () => {
  try { if (videoURL) URL.revokeObjectURL(videoURL); } catch (e) { }
});

const mutedBtn = () => {
  if (muted.textContent == '🔊') {
    document.getElementById('mute').textContent = '🔈'
    player.volume = 0;
    vol.value = 0;
  } else {
    document.getElementById('mute').textContent = '🔊'
    player.volume = 0.5;
    vol.value = 50;
  }
  porsentVol()
}

muted.addEventListener('click', mutedBtn)
document.addEventListener('keydown', (m) => {
  if (m.key == 'm' || m.key == 'M') {
    mutedBtn()
  }
})

pipBtn.addEventListener('click', async () => {
  try {
    if (player !== document.pictureInPictureElement) {
      await player.requestPictureInPicture();
    } else {
      await document.exitPictureInPicture();
    }
  } catch (err) {
    console.error("Error con Picture-in-Picture:", err);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'p' || e.key === 'P') {
    pipBtn.click();
  }
});

if (window.electronAPI) {
  window.electronAPI.onOpenVideo((filePath) => {
    // Creamos un objeto File a partir de la ruta
    const video = document.getElementById("player");
    video.src = filePath;
    video.play().catch(() => {});
    document.getElementById("fileName").textContent = filePath.split(/[/\\]/).pop();
    document.getElementById("emptyHint").style.display = "none";
  });
}
