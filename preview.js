/* Centred, sound-on, ten-second previews with a visible countdown. */
(function(){
  let dialog=null, interval=null, remaining=10;
  function clearPlayback(){
    if(interval){clearInterval(interval);interval=null;}
    if(dialog){
      dialog.querySelector(".preview-frame")?.replaceChildren();
      if(dialog.open)dialog.close();
    }
  }
  function ensureDialog(){
    if(dialog)return dialog;
    dialog=document.createElement("dialog");
    dialog.className="preview-dialog";
    dialog.setAttribute("aria-label","Video preview");
    dialog.innerHTML='<div class="preview-dialog-inner"><button class="preview-close" type="button" aria-label="Close preview">✕</button><div class="preview-frame"></div><p class="preview-countdown" aria-live="polite">Preview closes in 10</p></div>';
    document.body.append(dialog);
    dialog.querySelector(".preview-close").addEventListener("click",clearPlayback);
    dialog.addEventListener("click",e=>{if(e.target===dialog)clearPlayback();});
    dialog.addEventListener("close",()=>{if(interval){clearInterval(interval);interval=null;}dialog.querySelector(".preview-frame")?.replaceChildren();});
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&dialog.open)clearPlayback();});
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
      if(interval){clearInterval(interval);interval=null;}
      const iframe=document.createElement("iframe");
      iframe.src="https://www.youtube-nocookie.com/embed/"+encodeURIComponent(video.youtubeId)+"?autoplay=1&mute=0&playsinline=1&controls=1&disablekb=0&rel=0&cc_load_policy=0";
      iframe.title="Preview of "+video.title;
      iframe.allow="autoplay; encrypted-media; picture-in-picture";
      iframe.setAttribute("referrerpolicy","strict-origin-when-cross-origin");
      d.querySelector(".preview-frame").replaceChildren(iframe);
      remaining=10;
      const label=d.querySelector(".preview-countdown");
      label.textContent="Preview closes in "+remaining;
      if(!d.open)d.showModal();
      interval=setInterval(()=>{
        remaining-=1;
        if(remaining<=0){clearPlayback();return;}
        label.textContent="Preview closes in "+remaining;
      },1000);
    });
    return button;
  }
  window.PsychflixPreview={createButton,init(){}};
})();