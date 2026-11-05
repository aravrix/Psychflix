console.log("Psychflix JS Loaded");
const DATA_URL="./data/videos.json";
let videos=[];

function thumbnailSources(video){
  if(video.thumbnail && !video.youtubeId) return [video.thumbnail];
  if(!video.youtubeId) return [];
  const id=encodeURIComponent(video.youtubeId);
  return [
    `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${id}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${id}/mqdefault.jpg`
  ];
}
function createThumbnail(video){
  const wrap=document.createElement("div");
  wrap.className="thumbnail thumbnail-fallback";
  const sources=thumbnailSources(video);
  if(!sources.length){wrap.classList.add("thumbnail-unavailable");return wrap;}
  const img=document.createElement("img");
  img.alt="";img.loading="lazy";img.decoding="async";
  let index=0;
  function next(){
    if(index>=sources.length){img.remove();wrap.classList.add("thumbnail-unavailable");return;}
    img.src=sources[index++];
  }
  img.addEventListener("load",()=>{
    if(img.naturalWidth===120 && img.naturalHeight===90){next();return;}
    wrap.classList.remove("thumbnail-fallback");
  });
  img.addEventListener("error",next);
  next();wrap.appendChild(img);return wrap;
}
function cardFor(video){
  const card=document.createElement("article");card.className="card";
  const link=document.createElement("a");link.className="card-link";link.href=video.page;
  link.appendChild(createThumbnail(video));
  const title=document.createElement("h3");title.textContent=video.title;link.appendChild(title);
  const actions=document.createElement("div");actions.className="card-actions";
  actions.appendChild(window.PsychflixBookmarks.createButton(video.id));
  card.append(link,actions);return card;
}
function categoryHref(category){return "./category.html?name="+encodeURIComponent(category);}
function renderHome(list){
  const root=document.getElementById("videoLibrary"),noResults=document.getElementById("noResults");
  const term=document.getElementById("search")?.value.trim()||"";
  root.replaceChildren();
  if(!list.length){noResults.hidden=!term;return;}
  noResults.hidden=true;
  const groups=new Map();
  list.forEach(v=>{if(!groups.has(v.category))groups.set(v.category,[]);groups.get(v.category).push(v);});
  groups.forEach((items,category)=>{
    const section=document.createElement("section");section.className="row-section";
    const header=document.createElement("div");header.className="row-header";
    const heading=document.createElement("a");heading.className="category-heading-link";heading.href=categoryHref(category);
    const h2=document.createElement("h2");h2.textContent=category+"  →";heading.appendChild(h2);header.appendChild(heading);
    const container=document.createElement("div");container.className="row-container";
    const left=document.createElement("button");left.className="scroll-btn left";left.type="button";left.textContent="‹";left.setAttribute("aria-label","Scroll "+category+" left");
    const row=document.createElement("div");row.className="cards-row";
    items.forEach(v=>row.appendChild(cardFor(v)));
    const right=document.createElement("button");right.className="scroll-btn right";right.type="button";right.textContent="›";right.setAttribute("aria-label","Scroll "+category+" right");
    container.append(left,row,right);section.append(header,container);root.appendChild(section);
  });
}
function setMenu(open){
  const sidebar=document.getElementById("sidebar"),overlay=document.getElementById("overlay"),button=document.getElementById("menuBtn");
  sidebar.classList.toggle("active",open);overlay.classList.toggle("active",open);
  sidebar.setAttribute("aria-hidden",String(!open));button.setAttribute("aria-expanded",String(open));
  button.setAttribute("aria-label",open?"Menu open":"Open menu");
  document.body.classList.toggle("menu-open",open);
  if(open) document.getElementById("closeBtn").focus(); else button.focus();
}
function populateCategories(){
  const nav=document.getElementById("sidebarCategories");nav.replaceChildren();
  [...new Set(videos.map(v=>v.category))].forEach(category=>{
    const a=document.createElement("a");a.href=categoryHref(category);a.textContent=category;nav.appendChild(a);
  });
}
function setup(){
  document.getElementById("search").addEventListener("input",e=>{
    const q=e.target.value.toLowerCase().trim();
    renderHome(videos.filter(v=>[v.title,v.category,v.id].some(x=>String(x||"").toLowerCase().includes(q))));
  });
  document.getElementById("videoLibrary").addEventListener("click",e=>{
    const button=e.target.closest(".scroll-btn");if(!button)return;
    button.parentElement.querySelector(".cards-row").scrollBy({left:button.classList.contains("right")?300:-300,behavior:"smooth"});
  });
  document.getElementById("menuBtn").addEventListener("click",()=>setMenu(true));
  document.getElementById("closeBtn").addEventListener("click",()=>setMenu(false));
  document.getElementById("overlay").addEventListener("click",()=>setMenu(false));
  document.addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false);});
  document.querySelector(".random-btn").addEventListener("click",()=>{if(videos.length)location.href=videos[Math.floor(Math.random()*videos.length)].page;});
}
async function init(){
  setup();
  try{
    const response=await fetch(DATA_URL);if(!response.ok)throw new Error("Video data request failed");
    const data=await response.json();if(!Array.isArray(data))throw new Error("videos.json must be an array");
    const seen=new Set();
    videos=data.filter(v=>v.id&&v.title&&v.category&&v.page&&!seen.has(v.id)&&seen.add(v.id));
    populateCategories();renderHome(videos);
  }catch(error){console.error(error);document.getElementById("videoLibrary").textContent="The video library could not load. Please check data/videos.json.";}
}
init();
