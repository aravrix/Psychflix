const SAVED_DATA_URL="./data/videos.json";
function savedThumb(v){
 const box=document.createElement("div");box.className="thumbnail thumbnail-fallback";
 const sources=v.thumbnail&&!v.youtubeId?[v.thumbnail]:v.youtubeId?[...["maxresdefault","sddefault","hqdefault","mqdefault"].map(q=>`https://i.ytimg.com/vi/${encodeURIComponent(v.youtubeId)}/${q}.jpg`)]:[];
 if(!sources.length){box.classList.add("thumbnail-unavailable");return box;}
 const img=document.createElement("img");img.alt="";img.loading="lazy";let i=0;
 function next(){if(i>=sources.length){img.remove();box.classList.add("thumbnail-unavailable");return;}img.src=sources[i++];}
 img.onerror=next;img.onload=()=>{if(img.naturalWidth===120&&img.naturalHeight===90)next();else box.classList.remove("thumbnail-fallback");};next();box.appendChild(img);return box;
}
function savedCard(v){
 const card=document.createElement("article");card.className="card";
 const link=document.createElement("a");link.className="card-link";link.href=v.page;link.appendChild(savedThumb(v));
 const h=document.createElement("h3");h.textContent=v.title;link.appendChild(h);
 const actions=document.createElement("div");actions.className="card-actions";actions.appendChild(window.PsychflixBookmarks.createButton(v.id));card.append(link,actions);return card;
}
function menu(open){const s=document.getElementById("sidebar"),o=document.getElementById("overlay"),b=document.getElementById("menuBtn");s.classList.toggle("active",open);o.classList.toggle("active",open);s.setAttribute("aria-hidden",String(!open));b.setAttribute("aria-expanded",String(open));document.body.classList.toggle("menu-open",open);if(open)document.getElementById("closeBtn").focus();else b.focus();}
async function init(){
 document.getElementById("menuBtn").onclick=()=>menu(true);document.getElementById("closeBtn").onclick=()=>menu(false);document.getElementById("overlay").onclick=()=>menu(false);document.addEventListener("keydown",e=>{if(e.key==="Escape")menu(false);});
 const nav=document.getElementById("sidebarCategories"),response=await fetch(SAVED_DATA_URL);if(!response.ok)throw Error("Could not load videos");const videos=await response.json();
 [...new Set(videos.map(v=>v.category))].forEach(c=>{const a=document.createElement("a");a.href="./category.html?name="+encodeURIComponent(c);a.textContent=c;nav.appendChild(a);});
 const grid=document.getElementById("savedVideos"),count=document.getElementById("savedCount");
 function render(){const ids=window.PsychflixBookmarks.read(),items=ids.map(id=>videos.find(v=>v.id===id)).filter(Boolean);grid.replaceChildren();count.textContent=items.length+" saved "+(items.length===1?"video":"videos")+" · saved on this device";if(!items.length){const empty=document.createElement("p");empty.className="empty-saved";empty.textContent="No saved videos yet. Use the ☆ button on any video to add it here.";grid.appendChild(empty);return;}items.forEach(v=>grid.appendChild(savedCard(v)));}
 render();window.addEventListener("psychflix:bookmarks-changed",render);
}
init().catch(error=>{console.error(error);document.getElementById("savedVideos").textContent="Saved videos could not be loaded.";});
