/* Browser-local bookmarks: no account, cookies, or external database required. */
(function(){
  const KEY="psychflix:saved-video-ids";
  const PREF_KEY="psychflix:save-source";
  function getSource(){try{return localStorage.getItem(PREF_KEY)||"";}catch(error){return "";}}
  function setSource(source){if(source!=="local")return false;try{localStorage.setItem(PREF_KEY,source);return true;}catch(error){return false;}}

  function read(){
    try{const value=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(value)?value.filter(x=>typeof x==="string"):[];}
    catch(error){console.warn("Psychflix bookmarks could not be read.",error);return[];}
  }
  function write(ids){
    try{localStorage.setItem(KEY,JSON.stringify([...new Set(ids)]));window.dispatchEvent(new CustomEvent("psychflix:bookmarks-changed"));}
    catch(error){console.warn("Psychflix bookmarks could not be saved. Check browser storage settings.",error);}
  }
  function has(id){return getSource()==="local" && read().includes(String(id));}
  function toggle(id){if(getSource()!=="local"){window.dispatchEvent(new CustomEvent("psychflix:source-required"));return false;}const key=String(id),ids=read();write(ids.includes(key)?ids.filter(x=>x!==key):[...ids,key]);return has(key);}
  function createButton(id){
    const button=document.createElement("button");button.type="button";button.className="bookmark-btn";
    function update(){const saved=has(id);button.classList.toggle("is-saved",saved);button.setAttribute("aria-pressed",String(saved));button.setAttribute("aria-label",saved?"Remove bookmark":"Save video");button.title=saved?"Remove bookmark":"Save video";button.textContent=saved?"★":"☆";}
    button.addEventListener("click",event=>{event.preventDefault();event.stopPropagation();toggle(id);update();});
    update();return button;
  }
  window.PsychflixBookmarks={read,has,toggle,createButton,getSource,setSource};
})();
