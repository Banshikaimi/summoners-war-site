// ==========================
// Pages
// ==========================
const pages = {
  home: `
    <h1>Summoner's War : Sky Arena</h1>
    <p class="intro">Le RPG stratégique aux combats intenses</p>
  `,
  types: `
    <h2>Attributs</h2>
    <img src="https://static.wikia.nocookie.net/summoners-war-sky-arena/images/9/94/Property_Relationships.png">
  `,
  modes: `
    <h2>Modes de jeu</h2>
    <img src="https://clan.fastly.steamstatic.com/images/44752586/40c88f023b197abef1a5bcdd45238902d50028cc_400x225.jpg">
  `,
  tutos: `
    <h2>Tutoriels</h2>
    <p>Guides communautaires</p>
  `,
  community: `
    <div id="streamers-list"></div>
  `
};

let updateInterval;
let isUpdating = false;

// ==========================
// Navigation
// ==========================
document.addEventListener('DOMContentLoaded', () => {
  changePage('home');

  document.querySelectorAll('.sidebar-button').forEach(btn => {
    btn.addEventListener('click', () => {
      changePage(btn.dataset.page);
    });
  });
});

function changePage(page) {
  const main = document.getElementById('main-content');
  main.innerHTML = pages[page] || pages.home;
  if (page === 'community') showCommunityStreamers();
}

// ==========================
// Twitch (via backend sécurisé)
// ==========================
async function fetchFrenchSummonersWarStreamers() {
  try {
    const res = await fetch('https://TON_BACKEND.onrender.com/api/streamers');
    const data = await res.json();
    return data.data;
  } catch {
    return [];
  }
}

async function showCommunityStreamers() {
  if (isUpdating) return;
  isUpdating = true;

  const container = document.getElementById('streamers-list');
  container.innerHTML = `<p>Chargement...</p>`;

  const streams = await fetchFrenchSummonersWarStreamers();

  if (!streams.length) {
    container.innerHTML = `<p>Aucun stream en live</p>`;
    isUpdating = false;
    return;
  }

  container.innerHTML = streams.map(s => `
    <a href="https://www.twitch.tv/${s.user_login}" target="_blank">
      <img src="${s.thumbnail_url.replace('{width}',320).replace('{height}',180)}">
      <p>${s.user_name} — ${s.viewer_count} viewers</p>
    </a>
  `).join('');

  updateInterval = setInterval(showCommunityStreamers, 30000);
  isUpdating = false;
}
