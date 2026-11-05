console.log("Psychflix JS Loaded");

/* =====================
   SEARCH
===================== */

const searchInput = document.getElementById("search");

if (searchInput) {

    searchInput.addEventListener("input", () => {

        const value = searchInput.value.toLowerCase().trim();

        const cards = document.querySelectorAll(".card");
        const sections = document.querySelectorAll(".row-section");
        const noResults = document.getElementById("noResults");

        let matches = 0;

        cards.forEach(card => {

            const title = card.querySelector("h3")
                .textContent
                .toLowerCase();

            if (title.includes(value)) {

                card.style.display = "";

                matches++;

            } else {

                card.style.display = "none";

            }

        });

        sections.forEach(section => {

            const visibleCards =
                section.querySelectorAll(
                    '.card:not([style*="display: none"])'
                );

            if (visibleCards.length === 0) {

                section.style.display = "none";

            } else {

                section.style.display = "";

            }

        });

        if (matches === 0 && value !== "") {

            noResults.style.display = "block";

        } else {

            noResults.style.display = "none";

        }

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
 "/video/memory/theories-of-forgetting.html",
"/video/sessions/cbt-session-depression.html",
"/video/basics/intro-to-psychology.html",
"/video/learning/observational-learning-explained.html",
"/video/fun/personality-introvert-extrovert-ambivert.html",
"/video/experiments/operant-conditioning-experiment.html",
"/video/memory/types-of-memory.html",
"/video/basics/research-methods-explained.html",
"/video/sessions/narcissism-actual-session.html",
"/video/fun/worlds-quickest-personality-test.html",
"/video/learning/classical-operant-conditioning-explained.html",
"/video/memory/encoding-strategies-memory.html",
"/video/basics/mental-disorders-explained.html",
"/video/experiments/classical-conditioning-experiment.html",
"/video/sessions/actual-session-beersos.html",
"/video/fun/fun-and-awesome-psychology-facts.html",
"/video/learning/full-learning-course.html",
"/video/basics/intro-to-fields.html",
"/video/memory/memory-strategies-method-of-loci.html",
"/video/experiments/observational-learning-experiment.html",
"/video/sessions/dsm-5-real-patient-session-schizophrenia.html",
"/video/basics/sigmund-freud-pleasure-principle.html",
"/video/memory/memory-strategies-chunking.html",
"/video/fun/what-handwriting-says-about-you.html",
"/video/experiments/jean-piagets-conversation-tasks.html"
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

    reportBtn.addEventListener("click", () => {

        const pagePath = window.location.pathname
            .replace(".html", "")
            .replace(/^\//, "");

        const formUrl =
            "https://docs.google.com/forms/d/e/1FAIpQLScL-7fFr9poBvRtffsSbd9OaG9LlhA7WmDuRv4zMbO1-l_EEA/viewform?usp=pp_url&entry.1712958836=" +
            encodeURIComponent(pagePath);

        window.open(formUrl, "_blank");

    });

}