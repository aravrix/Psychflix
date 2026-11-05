(() => {
  const scriptURL = document.currentScript ? document.currentScript.src : new URL("./script.js", location.href).href;
  const siteRoot = new URL("./", scriptURL);
  const dataURL = new URL("data/videos.json", siteRoot).href;
  let videos = [];

  const asset = path => new URL(path, siteRoot).href;
  const pageURL = value => new URL(String(value || "").replace(/^\.\//, ""), siteRoot).href;

  function getRandomVideo() {
    if (!videos.length) return;
    const current = location.pathname;
    const choices = videos.filter(v => {
      try { return new URL(v.page.replace(/^\.\//, ""), siteRoot).pathname !== current; }
      catch { return true; }
    });
    const pool = choices.length ? choices : videos;
    const video = pool[Math.floor(Math.random() * pool.length)];
    location.href = pageURL(video.page);
  }

  function buildHeader() {
    const header = document.querySelector(".navbar");
    if (!header) return;
    const searchValue = header.querySelector('input[type="search"]')?.value || "";
    const search = document.createElement("form");
    search.className = "nav-search";
    search.innerHTML = '<input type="search" placeholder="Search psychology videos…" aria-label="Search videos">';
    search.querySelector("input").value = searchValue;
    const logo = document.createElement("a");
    logo.className = "logo";
    logo.href = siteRoot.href;
    const image = document.createElement("img");
    image.src = asset("assets/logo.png");
    image.alt = "Psychflix";
    logo.append(image);
    const tools = document.createElement("div");
    tools.className = "nav-tools";
    const saved = document.createElement("a");
    saved.className = "saved-nav";
    saved.href = asset("saved.html");
    saved.title = "Saved videos";
    saved.setAttribute("aria-label", "Saved videos");
    saved.textContent = "☆";
    const random = document.createElement("button");
    random.className = "random-nav";
    random.type = "button";
    random.title = "Open a random video";
    random.setAttribute("aria-label", "Open a random video");
    random.textContent = "⚄";
    random.addEventListener("click", getRandomVideo);
    tools.append(saved, random);
    header.replaceChildren(logo, search, tools);
    search.addEventListener("submit", event => {
      event.preventDefault();
      const query = search.querySelector("input").value.trim();
      location.href = asset("index.html") + (query ? "?q=" + encodeURIComponent(query) : "");
    });
    return search;
  }

  function thumbnail(v, card) {
    const wrap = document.createElement("div");
    wrap.className = "thumbnail thumbnail-fallback";
    const sources = v.thumbnail && !v.youtubeId
      ? [v.thumbnail.startsWith("http") ? v.thumbnail : new URL(v.thumbnail.replace(/^\.\//, ""), siteRoot).href]
      : v.youtubeId ? ["maxresdefault", "sddefault", "hqdefault", "mqdefault"].map(q => `https://i.ytimg.com/vi/${encodeURIComponent(v.youtubeId)}/${q}.jpg`) : [];
    if (!sources.length) { card.remove(); return wrap; }
    const img = document.createElement("img");
    img.alt = "";
    img.loading = "lazy";
    let index = 0;
    const next = () => {
      if (index >= sources.length) { img.remove(); card.remove(); const row = card.parentElement; if (row && !row.querySelector(".card")) row.closest(".row-section")?.remove(); return; }
      img.src = sources[index++];
    };
    img.onerror = next;
    img.onload = () => {
      if (img.naturalWidth === 120 && img.naturalHeight === 90) next();
      else { wrap.classList.remove("thumbnail-fallback"); if (v.youtubeId && window.PsychflixPreview) wrap.append(window.PsychflixPreview.createButton(v)); }
    };
    next();
    wrap.append(img);
    return wrap;
  }

  function makeCard(v) {
    const card = document.createElement("article");
    card.className = "card";
    const link = document.createElement("a");
    link.className = "card-link";
    link.href = pageURL(v.page);
    link.append(thumbnail(v, card));
    const title = document.createElement("h3");
    title.textContent = v.title;
    link.append(title);
    card.append(link);
    if (v.metaDescription) {
      const descriptionWrap = document.createElement("div");
      descriptionWrap.className = "card-description-wrap";
      const description = document.createElement("p");
      description.className = "card-description";
      description.textContent = v.metaDescription;
      descriptionWrap.append(description);
      card.append(descriptionWrap);
    }
    const actions = document.createElement("div");
    actions.className = "card-actions";
    if (window.PsychflixBookmarks?.createButton) actions.append(window.PsychflixBookmarks.createButton(v.id));
    card.append(actions);
    return card;
  }

  function renderHome(list) {
    const root = document.getElementById("videoLibrary");
    const empty = document.getElementById("noResults");
    if (!root) return;
    root.replaceChildren();
    if (!list.length) { if (empty) empty.hidden = false; return; }
    if (empty) empty.hidden = true;
    const groups = new Map();
    list.forEach(v => { if (!groups.has(v.category)) groups.set(v.category, []); groups.get(v.category).push(v); });
    groups.forEach((items, category) => {
      const section = document.createElement("section");
      section.className = "row-section";
      const header = document.createElement("div");
      header.className = "row-header";
      const heading = document.createElement("a");
      heading.className = "category-heading-link";
      heading.href = asset("category.html") + "?name=" + encodeURIComponent(category);
      const h2 = document.createElement("h2");
      h2.textContent = category + " →";
      heading.append(h2);
      header.append(heading);
      const row = document.createElement("div");
      row.className = "cards-row";
      items.forEach(v => row.append(makeCard(v)));
      section.append(header, row);
      root.append(section);
    });
  }

  function wireReportButton() {
    const button = document.querySelector(".report-btn");
    if (!button || button.dataset.reportBound === "true") return;
    button.dataset.reportBound = "true";
    button.type = "button";
    button.addEventListener("click", () => {
      const title = document.querySelector(".video-title")?.textContent.trim() || document.title;
      const reportURL = new URL("https://docs.google.com/forms/d/e/1FAIpQLScL-7fFr9poBvRtffsSbd9OaG9LlhA7WmDuRv4zMbO1-l_EEA/viewform");
      reportURL.searchParams.set("usp", "pp_url");
      reportURL.searchParams.set("entry.1712958836", location.href);
      window.location.assign(reportURL.href);
    });
  }

  async function init() {
    const searchForm = buildHeader();
    wireReportButton();
    const response = await fetch(dataURL, { cache: "no-cache" });
    if (!response.ok) throw new Error("Could not fetch video catalogue: " + response.status);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Video catalogue is not an array.");
    videos = data.filter(v => v && v.id && v.title && v.page && (v.youtubeId || v.thumbnail));
    const library = document.getElementById("videoLibrary");
    if (!library) return;
    const input = searchForm?.querySelector("input");
    const initialQuery = new URLSearchParams(location.search).get("q") || "";
    window.PsychflixPreview?.init();
    if (input) {
      input.value = initialQuery;
      const filter = () => {
        const q = input.value.toLowerCase().trim();
        renderHome(videos.filter(v => [v.title, v.category, v.id, v.metaDescription].some(x => String(x || "").toLowerCase().includes(q))));
      };
      input.addEventListener("input", filter);
      filter();
    } else renderHome(videos);
  }

  function showLoadError(error) {
    console.error("Psychflix initialisation failed:", error);
    const root = document.getElementById("videoLibrary");
    if (root) root.textContent = "The video library could not load. Please refresh the page.";
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => init().catch(showLoadError), { once: true });
  else init().catch(error => {
    console.error("Psychflix initialisation failed:", error);
    const root = document.getElementById("videoLibrary");
    if (root) root.textContent = "The video library could not load. Please refresh the page.";
  });
})();