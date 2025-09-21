const POPUP_KEY = 'lastPopupTime';
const MINUTES_BETWEEN_POPUPS = 4;

function checkAndOpenPopup() {
  const lastPopupTime = localStorage.getItem(POPUP_KEY);
  const currentTime = Date.now();
  const fourMinutesInMilliseconds = MINUTES_BETWEEN_POPUPS * 60 * 1000;

  if (!lastPopupTime || (currentTime - lastPopupTime) > fourMinutesInMilliseconds) {
    openPopup();
    localStorage.setItem(POPUP_KEY, currentTime);
  }
  else{
    const adFinishedEvent = new CustomEvent('ad_finished', {
    });
    document.dispatchEvent(adFinishedEvent);
    
  }
}

function openPopup() {
  var overlay = document.createElement('div');
  var blur = document.createElement('div');
  overlay.style.background = `url('/adblock.png') repeat center center`;
  overlay.innerHTML = '<script async crossorigin=anonymous src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7431909844582259"></script><ins class=adsbygoogle data-ad-client=ca-pub-7431909844582259 data-ad-format=auto data-ad-slot=9944912704 data-full-width-responsive=true style=display:block></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({})</script>';
  overlay.style.position = 'fixed';
  overlay.style.top = '50%';
  overlay.style.left = '50%';
  overlay.style.transform = 'translate(-50%, -50%)';
  overlay.style.zIndex = '1000';
  overlay.style.width = '450px';
  overlay.style.height = '450px';
  blur.appendChild(overlay);
  blur.style.position = 'fixed';
  blur.style.top = '0';
  blur.style.left = '0';
  blur.style.width = '100%';
  blur.style.height = '100%';
  blur.style.background = 'rgba(0, 0, 0, 0.5)';
  blur.style.zIndex = '999';
  document.body.appendChild(blur);
  var closeButton = document.createElement('div');
  closeButton.innerHTML = '<h1>X</h1>';
  closeButton.style.top = '-20px';
  closeButton.style.height = '10px';
  closeButton.style.right = '0px';
  closeButton.style.position = 'absolute';
  closeButton.style.cursor = 'pointer';
  closeButton.style.zIndex = '1001';
  closeButton.addEventListener('click', function(){

    document.body.removeChild(blur);
    document.body.removeChild(overlay);

    console.log("ad finished");
  });
  setTimeout(function(){
    overlay.appendChild(closeButton);
  }, 1500)
  
  

}
