/* Short, centred, click-to-play previews. */
(function(){
  let dialog;
  let stopTimer=null;
  function stopPreview(){
    if(stopTimer){clearTimeout(stopTimer);stopTimer=null;}
    if(!dialog)return;
    dialog.querySelector(".preview-frame")?.replaceChildren();
    if(dialog.open)dialog.close();
  }
  function ensureDialog(){
    if(dialog)return dialog;
    dialog=document.createElement("dialog");
    dialog.className="preview-dialog";
    dialog.setAttribute("aria-label","Video preview");
    dialog.innerHTML='<div class="preview-dialog-inner"><button class="preview-close" type="button" aria-label="Close preview">✕</button><div class="preview-frame"></div></div>';
    document.body.append(dialog);
    dialog.querySelector(".preview-close").addEventListener("click",stopPreview);
    dialog.addEventListener("click",e=>{if(e.target===dialog)stopPreview();});
    dialog.addEventListener("close",()=>{if(stopTimer){clearTimeout(stopTimer);stopTimer=null;}dialog.querySelector(".preview-frame")?.replaceChildren();});
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&dialog.open)stopPreview();});
    return dialog;
  }
  function createButton(video){
    const button=document.createElement("button");
    button.type="button";
    button.className="live-preview-btn";
    button.textContent="Preview";
    button.setAttribute("aria-label","Preview "+video.title);
    button.addEventListener("click",e=>{
      e.preventDefault();e.stopPropagation();
      if(!video.youtubeId)return;
      const d=ensureDialog();
      if(stopTimer){clearTimeout(stopTimer);stopTimer=null;}
      const frame=d.querySelector(".preview-frame");
      const iframe=document.createElement("iframe");
      iframe.src="https://www.youtube-nocookie.com/embed/"+encodeURIComponent(video.youtubeId)+"?autoplay=1&mute=1&playsinline=1&controls=0&disablekb=1&rel=0&start=0";
      iframe.title="Preview of "+video.title;
      iframe.allow="autoplay; encrypted-media";
      iframe.setAttribute("referrerpolicy","strict-origin-when-cross-origin");
      frame.replaceChildren(iframe);
      if(!d.open)d.showModal();
      stopTimer=setTimeout(stopPreview,10000);
    });
    return button;
  }
  function init(){}
  window.PsychflixPreview={createButton,init};
})();