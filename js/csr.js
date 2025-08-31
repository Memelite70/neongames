document.addEventListener("DOMContentLoaded", initSite);

function initSite() {
  const mainEl = document.querySelector("#main");
  const preloadCache = new Map();

  document.body.addEventListener("click", e => {
    const link = e.target.closest("a");
    if (!link || link.className=='gameframe_game nocsr' || link.target === "_blank" || link.hasAttribute("download")) return;

    const href = link.getAttribute("href");
    if (!href.startsWith("/")) return;

    if (href === location.pathname) return;
    document.title="Neon Games.io";
    e.preventDefault();
    setCurrentHighlight(href);
    history.pushState({}, "", href);
    loadPage(href);
  });

  window.addEventListener("popstate", () => {
    setCurrentHighlight(location.pathname);
    loadPage(location.pathname);
  });

  document.body.addEventListener("mouseover", e => {
    const link = e.target.closest("a");
    if (!link || !link.getAttribute("href")?.startsWith("/")) return;

    const href = link.getAttribute("href");
    if (href === location.pathname) return;
    if (!preloadCache.has(href)) {
      fetchPageContent(href).then(content => {
        if (content) preloadCache.set(href, content);
      });
    }
  });

  function loadPage(url) {
    mainEl.classList.add("fade-out");

    const showContent = (content) => {
      setTimeout(() => {
        mainEl.innerHTML = content;
        mainEl.classList.remove("fade-out");

        mainEl.querySelectorAll("script").forEach(oldScript => {
          const newScript = document.createElement("script");
          if (oldScript.src) {
            newScript.src = oldScript.src;
          } else {
            newScript.textContent = oldScript.textContent;
          }
          document.body.appendChild(newScript);
          document.body.removeChild(newScript);
        });

        initSite();
      }, 300);
    };

    if (preloadCache.has(url)) {
      showContent(preloadCache.get(url));
    } else {
      fetchPageContent(url).then(content => {
        if (content) showContent(content);
      });
    }
  }

  function fetchPageContent(url) {
    return fetch(url)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
 
        const newContent = doc.querySelector("#main");
        return newContent ? newContent.innerHTML : null;
      })
      .catch(err => {
        console.error("Error loading page:", err);
        return null;
      });
  }

  function setCurrentHighlight(path) {
    document.querySelectorAll(".sideNav a h1").forEach(h1 => h1.classList.remove("current"));
    const activeLink = document.querySelector(`.sideNav a[href="${path}"] h1`);
    const activeLink2 = document.querySelector(`.sideNav a[href="${path}.html"] h1`)
    if (activeLink) {
      activeLink.classList.add("current");
    }
    if (activeLink2) {
      activeLink2.classList.add("current");
    }
  }

  setCurrentHighlight(location.pathname);
}

function csr(url){
  function fetchPageContent(url) {
    return fetch(url)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const newContent = doc.querySelector("#main");
        return newContent ? newContent.innerHTML : null;
      })
      .catch(err => {
        console.error("Error loading page:", err);
        return null;
      });
  }
  fetchPageContent(url)
    .then(content => {
      if (content) {
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;

        var fetchedMain = tempDiv.querySelector('#main');
        if (fetchedMain) {
          document.getElementById('main').innerHTML = fetchedMain.innerHTML;
        } else {
          console.error("No #main found in fetched content");
        }
      }
    })
}