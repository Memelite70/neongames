var gameURL = localStorage.getItem('gameURL');
var gameTitle = localStorage.getItem('Title');
var gameImage = localStorage.getItem('gameimage');
var frame = document.getElementById('gameframe_frame_container');
var pathname = window.location.pathname;

if (pathname.includes('/game/')) {
  var noS = pathname.split('/game/')[1];
  var nme = noS.replace(/-/g, ' ');

  if (nme !== gameTitle) {
    localStorage.setItem('Title', nme);
    fetch('/js/games.json')
      .then(res => res.json())
      .then(games => {
        var gameData = games.find(g => g.title.toLowerCase() === nme.toLowerCase());
        if (gameData) {
          localStorage.setItem('gameURL', gameData.url);
          localStorage.setItem('gameimage', `//${window.location.hostname}${gameData.image}`);

          // Use gameData.url directly so it's not null
          frame.src = `/loader.html?game=${gameData.url}`;
        } else {
          console.error('Game not found in games.json:', nme);
        }
      })
      .catch(err => console.error('Error loading games.json:', err));
  } else {
    // If same title, just load the existing stored URL
    if (gameURL) {
      frame.src = `/loader.html?game=${gameURL}`;
    } else {
      console.error('No stored game URL found for', gameTitle);
    }
  }
}


frame.src = `/loader.html?game=` + gameURL;

function paramGet(name) {
  name = name.replace(/[[]/, '\$$[').replace(/[]$$]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

document.addEventListener('DOMContentLoaded', function () {
  const iframe = document.getElementById('gameframe_frame_container');
  const storedSrc = localStorage.getItem('gameURL');

  if (storedSrc.includes('loader.html')) {
    iframe.src = storedSrc;
  } else {
    iframe.src = '/loader.html?game=' + storedSrc;
  }

  const gmsTitle = document.querySelectorAll('#gmsName');
  gmsTitle.forEach(el => {
    el.innerHTML = localStorage.getItem('Title');
  });
});

function fullscreen() {
  const frame = document.getElementById('gameframe_frame_container');
  frame.requestFullscreen();
  frame.contentWindow.focus();
}

function cloak() {
  const mainGameFrame = document.getElementById('gameframe_frame_container');
  const gameUrl = mainGameFrame.src;
  mainGameFrame.src = `/paused.html?game=${gameUrl}`;
  const left = (screen.width - 1366) / 2;
  const top = (screen.height - 768) / 4;
  const win = window.open('', '_blank', `width=1366,height=768,top=${top},left=${left}`);
  if (window.focus) {
    win.focus();
  }
  win.document.body.style.margin = '0';
  win.document.body.style.height = '100vh';
  win.document.title = window.location.hostname;
  const iframe = win.document.createElement('iframe');
  iframe.style.border = 'none';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.margin = '0';
  iframe.src = gameUrl;
  win.document.body.appendChild(iframe);
  win.addEventListener('close', () => {
    mainGameFrame.src = iframe.src;
  });
}

document.title = localStorage.getItem('Title') + ' Unblocked | Neon Games.io';


function positionResultsBox() {
  const searchInput = document.getElementById("gameSearch");
  const resultsDiv = document.getElementById("results");
  const rect = searchInput.getBoundingClientRect();
  resultsDiv.style.top = rect.bottom + window.scrollY + "px";
  resultsDiv.style.left = rect.left + window.scrollX + "px";
  resultsDiv.style.width = rect.width + "px";
}

function searchGames() {
  const query = document.getElementById("gameSearch").value.toLowerCase();
  const resultsDiv = document.getElementById("results");

  positionResultsBox();
  resultsDiv.innerHTML = "";

  if (!query) {
    resultsDiv.style.display = "none";
    return;
  }

  const filteredGames = gamesList.filter(game =>
    game.title.toLowerCase().includes(query) ||
    game.Categories.some(cat => cat.toLowerCase().includes(query))
  );

  if (filteredGames.length === 0) {
    resultsDiv.innerHTML = "<p style='padding:8px;color:#aaa;'>No results found.</p>";
    resultsDiv.style.display = "block";
    return;
  }

  filteredGames.forEach(game => {
    const gameEl = document.createElement("div");
    gameEl.className = "gameframe_srch";
    gameEl.setAttribute("onclick", `loadgame('${game.url}'); document.getElementById('results').style.display='none';`);
    gameEl.innerHTML = `
      <img onclick="localStorage.setItem('gameimage', this.src);" loading="lazy" src="${game.image}">
      <h1 class="rotating-text">${game.title}</h1>
    `;
    resultsDiv.appendChild(gameEl);
  });

  resultsDiv.style.display = "block";
}

document.getElementById("gameSearch").addEventListener("input", searchGames);
window.addEventListener("resize", positionResultsBox);
window.addEventListener("scroll", positionResultsBox);

// Optional: Hide results when clicking outside
document.addEventListener("click", (e) => {
  if (!document.getElementById("results").contains(e.target) &&
      e.target.id !== "gameSearch") {
    document.getElementById("results").style.display = "none";
  }
});