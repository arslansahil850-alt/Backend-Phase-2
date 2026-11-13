/* ==========================================================================
   ARSLAN'S PREMIUM BACKEND LEARNING PLATFORM - PHASE 2 MAIN SCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initThemeSystem();
    initNavbar();
});

/* ==========================================
   1. THEME SYSTEM (Dark, Light, System)
   ========================================== */
function initThemeSystem() {
    const themeBtn = document.getElementById("themeBtn");
    const themeDropdown = document.getElementById("themeDropdown");
    const themeIcon = document.getElementById("themeIcon");
    const htmlTag = document.documentElement;

    const savedTheme = localStorage.getItem("arslan_theme") || "dark";
    setTheme(savedTheme);

    themeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        themeDropdown.classList.toggle("show");
    });

    document.querySelectorAll(".theme-dropdown button").forEach(btn => {
        btn.addEventListener("click", () => {
            const selectedTheme = btn.getAttribute("data-theme-val");
            setTheme(selectedTheme);
            themeDropdown.classList.remove("show");
        });
    });

    document.addEventListener("click", () => {
        themeDropdown.classList.remove("show");
    });

    function setTheme(theme) {
        localStorage.setItem("arslan_theme", theme);
        if (theme === "system") {
            const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            htmlTag.setAttribute("data-theme", systemDark ? "dark" : "light");
            themeIcon.className = "fa-solid fa-desktop";
        } else {
            htmlTag.setAttribute("data-theme", theme);
            themeIcon.className = theme === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";
        }
    }
}

/* ==========================================
   2. NAVBAR & MOBILE MENU TOGGLE
   ========================================== */
function initNavbar() {
    const mobileToggle = document.getElementById("mobileToggle");
    const navMenu = document.getElementById("navMenu");

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            navMenu.classList.toggle("show");
        });

        document.addEventListener("click", () => {
            navMenu.classList.remove("show");
        });
    }
}

/* ==========================================
   3. FRONTEND DAY SEARCH & FILTERING
   ========================================== */
window.filterDays = function() {
    const input = document.getElementById("daySearchInput").value.toLowerCase();
    const cards = document.querySelectorAll(".day-card");

    cards.forEach(card => {
        const searchData = card.getAttribute("data-search");
        if (searchData.includes(input)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
};