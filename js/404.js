var pathname = window.location.pathname;

if (pathname.includes('/game/')) {
  fetchPageContent('/game/')
    .then(content => {
      if (content) {
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;

        var fetchedMain = tempDiv.querySelector('#main');
        if (fetchedMain) {
          document.getElementById('main').innerHTML = fetchedMain.innerHTML;
          setTimeout(() => {
            
            initSite(); 
            document.querySelectorAll(".sideNav a h1").forEach(h1 => h1.classList.remove("current"));
            var script = document.createElement('script');
            script.src = '/game/game.js';
            document.body.appendChild(script);
            loadGameOptions('all')
          }, 300)
        } else {
          console.error("No #main found in fetched content");
        }
      }
    })
    .catch(err => console.error("Error fetching /game/ content:", err));
}

function fetchPageContent(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.text();
    })
    .catch(err => {
      console.error("Fetch error:", err);
      return null;
    });
}
document.addEventListener('DOMContentLoaded',function(){if(window.location.pathname.includes('/gms/')){
  document.getElementById('gmsDebug').src=window.location.pathname
}})
