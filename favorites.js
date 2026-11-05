/* Psychflix bookmarks are stored only in this browser. No account or external database. */
(function(){
  const KEY="psychflix:saved-video-ids";
  function getSource(){return "local";}
  function setSource(source){return source==="local";}
  function read(){try{const value=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(value)?value.filter(x=>typeof x==="string"):[];}catch(error){console.warn("Psychflix bookmarks could not be read.",error);return[];}}
  function write(ids){try{localStorage.setItem(KEY,JSON.stringify([...new Set(ids)]));window.dispatchEvent(new CustomEvent("psychflix:bookmarks-changed"));return true;}catch(error){console.warn("Psychflix bookmarks could not be saved. Check browser storage settings.",error);return false;}}
  function has(id){return read().includes(String(id));}
  function toggle(id){const key=String(id),ids=read();return write(ids.includes(key)?ids.filter(x=>x!==key):[...ids,key])? !ids.includes(key):has(key);}
  function createButton(id){const button=document.createElement("button");button.type="button";button.className="bookmark-btn";function update(){const saved=has(id);button.classList.toggle("is-saved",saved);button.setAttribute("aria-pressed",String(saved));button.setAttribute("aria-label",saved?"Remove bookmark":"Save video");button.title=saved?"Remove bookmark":"Save video";button.textContent=saved?"★":"☆";}button.addEventListener("click",event=>{event.preventDefault();event.stopPropagation();toggle(id);update();});update();return button;}
  window.PsychflixBookmarks={read,has,toggle,createButton,getSource,setSource};
})();