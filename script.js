console.log("Psychflix JS Loaded");

const DATA_URL = "./data/videos.json";
let videos = [];

function getThumbnailCandidates(video) {
    if (video.youtubeId) {
        const id = encodeURIComponent(video.youtubeId);
        return [
            `https://i3.ytimg.com/vi/${id}/maxresdefault.jpg`,
            `https://i3.ytimg.com/vi/${id}/sddefault.jpg`,
            `https://i3.ytimg.com/vi/${id}/hqdefault.jpg`,
            `https://i3.ytimg.com/vi/${id}/mqdefault.jpg`,
            `https://i3.ytimg.com/vi/${id}/default.jpg`
        ];
    }
    return video.thumbnail ? [video.thumbnail] : [];
}

function createThumbnail(video) {
    const wrapper = document.createElement("div");
    wrapper.className = "thumbnail";
    const candidates = getThumbnailCandidates(video);
    if (!candidates.length) return wrapper;

    const img = document.createElement("img");
    img.alt = "";
    img.loading = "lazy";
    let candidateIndex = 0;
    img.src = candidates[candidateIndex++];
    img.addEventListener("error", () => {
        if (candidateIndex < candidates.length) {
            img.src = candidates[candidateIndex++];
        } else {
            img.remove();
        }
    });
    wrapper.appendChild(img);
    return wrapper;
}

function renderLibrary(list) {
    const library = document.getElementById("videoLibrary");
    const noResults = document.getElementById("noResults");
    const searchValue = document.getElementById("search")?.value.trim() || "";
    if (!library) return;

    library.innerHTML = "";
    if (!list.length) {
        noResults.hidden = searchValue.length === 0;
        return;
    }
    noResults.hidden = true;

    const groups = new Map();
    list.forEach(video => {
        const category = video.category || "Other";
        if (!groups.has(category)) groups.set(category, []);
        groups.get(category).push(video);
    });

    groups.forEach((items, category) => {
        const section = document.createElement("section");
        section.className = "row-section";
        const heading = document.createElement("div");
        heading.className = "row-header";
        const h2 = document.createElement("h2");
        h2.textContent = category;
        heading.appendChild(h2);

        const container = document.createElement("div");
        container.className = "row-container";
        const left = document.createElement("button");
        left.className = "scroll-btn left";
        left.type = "button";
        left.textContent = "❮";
        left.setAttribute("aria-label", `Scroll ${category} left`);

        const row = document.createElement("div");
        row.className = "cards-row";

        items.forEach(video => {
            const card = document.createElement("a");
            card.className = "card";
            card.href = video.page;
            card.dataset.videoId = video.id;
            card.appendChild(createThumbnail(video));
            const title = document.createElement("h3");
            title.textContent = video.title;
            card.appendChild(title);
            row.appendChild(card);
        });

        const right = document.createElement("button");
        right.className = "scroll-btn right";
        right.type = "button";
        right.textContent = "❯";
        right.setAttribute("aria-label", `Scroll ${category} right`);

        container.append(left, row, right);
        section.append(heading, container);
        library.appendChild(section);
    });
}

function closeSidebar() {
    document.getElementById("sidebar")?.classList.remove("active");
    document.getElementById("overlay")?.classList.remove("active");
}

function setupControls() {
    const search = document.getElementById("search");
    search?.addEventListener("input", () => {
        const term = search.value.toLowerCase().trim();
        const filtered = videos.filter(video =>
            [video.title, video.category, video.id].some(value =>
                String(value || "").toLowerCase().includes(term)
            )
        );
        renderLibrary(filtered);
    });

    document.getElementById("videoLibrary")?.addEventListener("click", event => {
        const button = event.target.closest(".scroll-btn");
        if (!button) return;
        const row = button.parentElement.querySelector(".cards-row");
        row?.scrollBy({
            left: button.classList.contains("right") ? 300 : -300,
            behavior: "smooth"
        });
    });

    document.getElementById("menuBtn")?.addEventListener("click", () => {
        document.getElementById("sidebar")?.classList.add("active");
        document.getElementById("overlay")?.classList.add("active");
    });
    document.getElementById("closeBtn")?.addEventListener("click", closeSidebar);
    document.getElementById("overlay")?.addEventListener("click", closeSidebar);

    document.querySelector(".random-btn")?.addEventListener("click", () => {
        if (!videos.length) return;
        const selected = videos[Math.floor(Math.random() * videos.length)];
        window.location.href = selected.page;
    });

    const reportBtn = document.querySelector(".report-btn");
    if (reportBtn) {
        reportBtn.addEventListener("click", () => {
            const pagePath = window.location.pathname
                .replace(".html", "")
                .replace(/^\//, "");
            const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLScL-7fFr9poBvRtffsSbd9OaG9LlhA7WmDuRv4zMbO1-l_EEA/viewform?usp=pp_url&entry.1712958836=" +
                encodeURIComponent(pagePath);
            window.open(formUrl, "_blank", "noopener,noreferrer");
        });
    }
}

async function init() {
    setupControls();
    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error(`Could not load videos.json: ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("videos.json must contain an array.");

        const ids = new Set();
        videos = data.filter(video => {
            if (!video.id || !video.title || !video.category || !video.page) return false;
            if (ids.has(video.id)) {
                console.warn("Duplicate video ID skipped:", video.id);
                return false;
            }
            ids.add(video.id);
            return true;
        });
        renderLibrary(videos);
    } catch (error) {
        console.error(error);
        document.getElementById("videoLibrary").innerHTML =
            '<p class="loading-message">The video library could not load. Check that data/videos.json exists and that the site is running through a web server.</p>';
    }
}

init();
