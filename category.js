const DATA_URL="./data/videos.json";
function sources(v){if(v.thumbnail&&!v.youtubeId)return[v.thumbnail];if(!v.youtubeId)return[];const id=encodeURIComponent(v.youtubeId);return[`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,`https://i.ytimg.com/vi/${id}/sddefault.jpg`,`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,`https://i.ytimg.com/vi/${id}/mqdefault.jpg`];}
function thumb(v){const box=document.createElement("div");box.className="thumbnail thumbnail-fallback";const list=sources(v);if(!list.length){box.classList.add("thumbnail-unavailable");return box;}const img=document.createElement("img");img.alt="";img.loading="lazy";let n=0;function next(){if(n>=list.length){img.remove();box.classList.add("thumbnail-unavailable");return;}img.src=list[n++];}img.onerror=next;img.onload=()=>{if(img.naturalWidth===120&&img.naturalHeight===90){next();return;}box.classList.remove("thumbnail-fallback");};next();box.appendChild(img);return box;}
function card(v){const el=document.createElement("article");el.className="card";const link=document.createElement("a");link.className="card-link";link.href=v.page;link.appendChild(thumb(v));const h=document.createElement("h3");h.textContent=v.title;link.appendChild(h);const actions=document.createElement("div");actions.className="card-actions";actions.appendChild(window.PsychflixBookmarks.createButton(v.id));el.append(link,actions);return el;}
function setMenu(open){const s=document.getElementById("sidebar"),o=document.getElementById("overlay"),b=document.getElementById("menuBtn");s.classList.toggle("active",open);o.classList.toggle("active",open);s.setAttribute("aria-hidden",String(!open));b.setAttribute("aria-expanded",String(open));b.setAttribute("aria-label",open?"Menu open":"Open menu");document.body.classList.toggle("menu-open",open);if(open)document.getElementById("closeBtn").focus();else b.focus();}
async function init(){
 document.getElementById("menuBtn").onclick=()=>setMenu(true);document.getElementById("closeBtn").onclick=()=>setMenu(false);document.getElementById("overlay").onclick=()=>setMenu(false);document.addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false);});
 const response=await fetch(DATA_URL);if(!response.ok)throw Error("Could not load video data");const videos=await response.json();
 const categories=[...new Set(videos.map(v=>v.category))],nav=document.getElementById("sidebarCategories");
 const home=document.createElement("a");home.href="./index.html";home.textContent="Home";nav.appendChild(home);
 categories.forEach(c=>{const a=document.createElement("a");a.href="./category.html?name="+encodeURIComponent(c);a.textContent=c;nav.appendChild(a);});
 const name=new URLSearchParams(location.search).get("name")||"",matching=videos.filter(v=>v.category===name);
 document.title="Psychflix – "+(name||"Category");document.getElementById("categoryTitle").textContent=name||"Category not found";document.getElementById("categoryCount").textContent=matching.length+" videos";
 const grid=document.getElementById("categoryVideos");grid.replaceChildren();matching.forEach(v=>grid.appendChild(card(v)));
 if(!matching.length)grid.textContent="No videos found in this category.";
}
init().catch(error=>{console.error(error);document.getElementById("categoryVideos").textContent="The category could not be loaded.";});
