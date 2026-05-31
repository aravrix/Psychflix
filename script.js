console.log("Psychflix JS Loaded");

/* =====================
   SEARCH
===================== */

const searchInput = document.getElementById("search");

if (searchInput) {

    searchInput.addEventListener("input", () => {

        const value = searchInput.value.toLowerCase();

        const cards = document.querySelectorAll(".card");

        cards.forEach(card => {

            const title = card.querySelector("h3").textContent.toLowerCase();

            if (title.includes(value)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }

        });

    });

}

/* =====================
   SCROLL BUTTONS
===================== */

const rows = document.querySelectorAll(".cards-row");

rows.forEach(row => {

    const container = row.parentElement;

    const leftBtn = container.querySelector(".left");
    const rightBtn = container.querySelector(".right");

    if (leftBtn && rightBtn) {

        rightBtn.addEventListener("click", () => {

            row.scrollBy({
                left: 300,
                behavior: "smooth"
            });

        });

        leftBtn.addEventListener("click", () => {

            row.scrollBy({
                left: -300,
                behavior: "smooth"
            });

        });

    }

});

/* =====================
   RANDOM CONCEPT
===================== */

const videos = [
    "../video/Memory.html",
    "../video/example2.html"
];

const randomBtn = document.querySelector(".random-btn");

if (randomBtn) {

    randomBtn.addEventListener("click", () => {

        const randomPage =
            videos[Math.floor(Math.random() * videos.length)];

        window.location.href = randomPage;

    });

}

/* =====================
   SIDEBAR
===================== */

const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

if (menuBtn && closeBtn && sidebar && overlay) {

    menuBtn.addEventListener("click", () => {

        sidebar.classList.add("active");
        overlay.classList.add("active");

    });

    closeBtn.addEventListener("click", () => {

        sidebar.classList.remove("active");
        overlay.classList.remove("active");

    });

    overlay.addEventListener("click", () => {

        sidebar.classList.remove("active");
        overlay.classList.remove("active");

    });

}

/* =====================
   REPORT BUTTON
===================== */

const reportBtn = document.querySelector(".report-btn");

if (reportBtn) {

    console.log("Report button found");

    reportBtn.addEventListener("click", () => {

        const pageName = window.location.pathname
            .split("/")
            .pop()
            .replace(".html", "");

        const formUrl =
            "https://docs.google.com/forms/d/e/1FAIpQLScL-7fFr9poBvRtffsSbd9OaG9LlhA7WmDuRv4zMbO1-l_EEA/viewform?usp=pp_url&entry.1712958836=" +
            encodeURIComponent(pageName);

        window.open(formUrl, "_blank");

    });

}