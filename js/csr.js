document.addEventListener("DOMContentLoaded", initSite);

function initSite() {
  const mainEl = document.querySelector("#main");
  const preloadCache = new Map();

  document.body.addEventListener("click", e => {
    const link = e.target.closest("a");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

    const href = link.getAttribute("href");
    if (!href.startsWith("/")) return;
    if (href === location.pathname) return;

    e.preventDefault();
    document.title = "Neon Games.io";


    document.addEventListener('ad_finished', function () {
      document.getElementById('preload-ad-container').style.top = '350%';
      const auieduiae = document.getElementById('closeButton');
      if (auieduiae) auieduiae.remove();

      console.log("ad finished");
      setCurrentHighlight(href);
      history.pushState({}, "", href);
      loadPage(href);
    }, { once: true });


    checkAndOpenPopup(href);
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
    const activeLink2 = document.querySelector(`.sideNav a[href="${path}.html"] h1`);
    if (activeLink) activeLink.classList.add("current");
    if (activeLink2) activeLink2.classList.add("current");
  }

  setCurrentHighlight(location.pathname);
}
let adTimeout = null; 

function loadGameWithAd(href) {
  let adContainer = document.getElementById("preload-ad-container");
  let overlay = document.getElementById("ad-overlay");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "ad-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.6)";
    overlay.style.backdropFilter = "blur(5px)";
    overlay.style.zIndex = "999";
    overlay.style.transition = "opacity 0.3s ease";
    overlay.style.pointerEvents = "all";
    document.body.appendChild(overlay);
  } else {
    overlay.style.display = "block";
    overlay.style.opacity = "1";
  }

  if (adTimeout) clearTimeout(adTimeout);
  adTimeout = setTimeout(function () {
    adTimeout = null; 
    const adFinishedEvent = new CustomEvent("ad_finished");
    document.dispatchEvent(adFinishedEvent);
  }, 10000);

  if (!adContainer) {
    adContainer = document.createElement("div");
    adContainer.id = "preload-ad-container";
    adContainer.style.position = "fixed";
    adContainer.style.top = "50%";
    adContainer.style.left = "50%";
    adContainer.style.transform = "translate(-50%, -50%)";
    adContainer.style.zIndex = "1000";
    adContainer.style.width = "450px";
    adContainer.style.height = "450px";
    adContainer.style.textAlign = "center";
    document.body.appendChild(adContainer);
  } else {
    adContainer.style.display = "block";
    adContainer.style.top = "50%";
  }

  adContainer.innerHTML = `
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-7431909844582259"
         data-ad-slot="9944912704"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  `;

  var closeButton = document.createElement("div");
  closeButton.innerHTML = "<h1>X</h1>";
  closeButton.style.top = "-10px";
  closeButton.style.height = "10px";
  closeButton.style.right = "10px";
  closeButton.style.position = "absolute";
  closeButton.style.cursor = "pointer";
  closeButton.style.zIndex = "1001";
  closeButton.style.color = "#79b1ec";
  closeButton.id = "closeButton";
  closeButton.addEventListener("click", function () {
    if (adTimeout) {
      clearTimeout(adTimeout);
      adTimeout = null;
    }
    const adFinishedEvent = new CustomEvent("ad_finished");
    document.dispatchEvent(adFinishedEvent);
  });

  setTimeout(function () {
    adContainer.appendChild(closeButton);
  }, 1500);

  try {
    (adsbygoogle = window.adsbygoogle || []).push({});
  } catch (err) {}

  document.addEventListener("ad_finished", function () {
    if (overlay) {
      overlay.style.opacity = "0";
      setTimeout(() => {
        overlay.style.display = "none";
      }, 300);
    }
  }, { once: true });
}




const POPUP_KEY = 'lastPopupTime';
const MINUTES_BETWEEN_POPUPS = 1.2;

function checkAndOpenPopup(href) {
  const lastPopupTime = localStorage.getItem(POPUP_KEY);
  const currentTime = Date.now();
  const fourMinutesInMilliseconds = MINUTES_BETWEEN_POPUPS * 60 * 1000;

  if (!lastPopupTime || (currentTime - lastPopupTime) > fourMinutesInMilliseconds) {
    loadGameWithAd(href);
    localStorage.setItem(POPUP_KEY, currentTime);
  } else {
    const adFinishedEvent = new CustomEvent('ad_finished', {});
    document.dispatchEvent(adFinishedEvent);
  }
}
