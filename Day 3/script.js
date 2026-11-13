

/* ==========================================================================
   ARSLAN'S PREMIUM BACKEND LEARNING PLATFORM - DAY 03 SCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Initialize all components
    initThemeSystem();
    initNavbarDropdowns();
    initThreeJsVisualizer();
    initQuizSystem();
    loadProgress();
});

/* ==========================================
   1. THEME SYSTEM (Dark, Light, System)
   ========================================== */
function initThemeSystem() {
    const themeBtn = document.getElementById("themeBtn");
    const themeDropdown = document.getElementById("themeDropdown");
    const themeIcon = document.getElementById("themeIcon");
    const htmlTag = document.documentElement;

    // Load saved theme or default to dark
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
            const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            htmlTag.setAttribute("data-theme", systemPrefersDark ? "dark" : "light");
            themeIcon.className = "fa-solid fa-desktop";
        } else {
            htmlTag.setAttribute("data-theme", theme);
            themeIcon.className = theme === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";
        }
    }
}

/* ==========================================
   2. NAVBAR & DAY SELECTOR DROPDOWNS
   ========================================== */
function initNavbarDropdowns() {
    const daySelectorBtn = document.getElementById("daySelectorBtn");
    const dayDropdown = document.getElementById("dayDropdown");
    const mobileToggle = document.getElementById("mobileToggle");
    const navMenu = document.getElementById("navMenu");

    // Day Selector Dropdown toggle
    daySelectorBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = dayDropdown.classList.toggle("show");
        daySelectorBtn.setAttribute("aria-expanded", isOpen);
    });

    // Mobile menu toggle
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            navMenu.classList.toggle("show");
        });
    }

    // Close dropdowns on outside click
    document.addEventListener("click", () => {
        dayDropdown.classList.remove("show");
        daySelectorBtn.setAttribute("aria-expanded", "false");
        if (navMenu) navMenu.classList.remove("show");
    });

    dayDropdown.addEventListener("click", (e) => {
        e.stopPropagation();
    });
}

/* ==========================================
   3. THREE.JS 3D PACKAGE REGISTRY VISUALIZER
   ========================================== */
function initThreeJsVisualizer() {
    const container = document.getElementById("threejs-canvas-container");
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 7);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 2, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const goldLight = new THREE.PointLight(0xfbbf24, 2, 50);
    goldLight.position.set(-5, -5, 5);
    scene.add(goldLight);

    // Create Package Hub Group (Central registry core with orbiting dependency nodes)
    const registryGroup = new THREE.Group();

    // Central Registry Core
    const coreGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const coreMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        roughness: 0.2,
        metalness: 0.8
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    registryGroup.add(coreMesh);

    // Orbiting Package Nodes
    const numPackages = 6;
    const radius = 3.0;
    const packageNodes = [];

    for (let i = 0; i < numPackages; i++) {
        const angle = (i / numPackages) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        const pkgGeo = new THREE.SphereGeometry(0.4, 32, 32);
        const pkgMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            roughness: 0.1,
            metalness: 0.9
        });
        const pkgMesh = new THREE.Mesh(pkgGeo, pkgMat);
        pkgMesh.position.set(x, y, 0);
        registryGroup.add(pkgMesh);
        packageNodes.push(pkgMesh);

        // Connecting Line
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(x, y, 0)
        ]);
        const lineMat = new THREE.LineBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.5
        });
        const line = new THREE.Line(lineGeo, lineMat);
        registryGroup.add(line);
    }

    scene.add(registryGroup);

    // Mouse interactivity (rotation drag)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    container.addEventListener("mousedown", (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        registryGroup.rotation.y += deltaX * 0.008;
        registryGroup.rotation.x += deltaY * 0.008;

        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("mouseup", () => {
        isDragging = false;
    });

    // Touch support for mobile tablets
    container.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    });

    window.addEventListener("touchmove", (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;

        registryGroup.rotation.y += deltaX * 0.008;
        registryGroup.rotation.x += deltaY * 0.008;

        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    window.addEventListener("touchend", () => {
        isDragging = false;
    });

    // Window Resize Handler
    window.addEventListener("resize", () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        if (!isDragging) {
            registryGroup.rotation.y += 0.005;
            registryGroup.rotation.x += 0.002;
        }

        coreMesh.rotation.x += 0.01;
        coreMesh.rotation.y += 0.01;

        renderer.render(scene, camera);
    }
    animate();
}

/* ==========================================
   4. INTERACTIVE QUIZ SYSTEM (15 MCQs)
   ========================================== */
const quizData = [
    {
        question: "What does npm stand for?",
        options: ["Node Program Manager", "Node Package Manager", "Network Protocol Module", "New Package Method"],
        correct: 1,
        explanation: "npm stands for Node Package Manager, the default package manager for Node.js."
    },
    {
        question: "Which file acts as the central manifest tracking project metadata and dependencies?",
        options: ["config.json", "manifest.js", "package.json", "node_modules.json"],
        correct: 2,
        explanation: "`package.json` is the core manifest file storing project configuration, scripts, and dependencies."
    },
    {
        question: "What command is used to interactively initialize a new `package.json` file?",
        options: ["npm start", "npm init", "npm install", "npm setup"],
        correct: 1,
        explanation: "`npm init` launches an interactive CLI wizard to generate a `package.json` file."
    },
    {
        question: "What is the primary purpose of the `node_modules/` folder?",
        options: [
            "To store raw database backups",
            "To hold downloaded third-party packages and dependencies",
            "To store compiled HTML template files",
            "To configure operating system environment variables"
        ],
        correct: 1,
        explanation: "`node_modules/` contains all installed packages downloaded from the npm registry."
    },
    {
        question: "Why should `node_modules/` generally be excluded from Git version control?",
        options: [
            "Because it is too small to track",
            "Because it is massive and can be instantly regenerated using `npm install`",
            "Because Git cannot read JavaScript files",
            "Because it contains sensitive database passwords"
        ],
        correct: 1,
        explanation: "`node_modules` folders are usually huge; they belong in `.gitignore` since anyone can regenerate them with `npm install`."
    },
    {
        question: "What does Semantic Versioning (SemVer) format look like?",
        options: ["DAY.MONTH.YEAR", "MAJOR.MINOR.PATCH", "PORT.HOST.PROTOCOL", "ID.HASH.VERSION"],
        correct: 1,
        explanation: "SemVer uses the MAJOR.MINOR.PATCH format (e.g., `16.4.5`)."
    },
    {
        question: "In SemVer `16.4.5`, what does changing the MAJOR version number indicate?",
        options: [
            "A minor bug fix",
            "A new feature addition that is fully backward compatible",
            "Breaking changes that are not backward compatible",
            "A minor security patch update"
        ],
        correct: 2,
        explanation: "Incrementing the MAJOR version signals breaking changes that break backward compatibility."
    },
    {
        question: "What flag is used to install a package as a development dependency (`devDependencies`)?",
        options: ["--save-dev", "--production", "--global", "--dev-only"],
        correct: 0,
        explanation: "`npm install <pkg> --save-dev` (or `-D`) saves the package under `devDependencies`."
    },
    {
        question: "What is the purpose of `package-lock.json`?",
        options: [
            "To lock user passwords securely",
            "To record the exact dependency tree versions and hashes for reproducible builds",
            "To prevent anyone from editing `package.json`",
            "To store encryption keys for npm login"
        ],
        correct: 1,
        explanation: "`package-lock.json` locks down exact dependency trees to guarantee identical installations across all environments."
    },
    {
        question: "How do you run a custom script defined as `\"dev\": \"nodemon src/index.js\"` in `package.json`?",
        options: ["npm run dev", "node dev", "npm start-dev", "execute dev"],
        correct: 0,
        explanation: "Custom scripts defined in `package.json` are executed using `npm run <script-name>`."
    },
    {
        question: "Which command installs all dependencies listed in `package.json`?",
        options: ["npm get", "npm install", "npm download", "npm fetch"],
        correct: 1,
        explanation: "`npm install` reads `package.json` and downloads all required dependencies into `node_modules`."
    },
    {
        question: "What does the caret symbol (`^`) prefixing a version number in `package.json` mean?",
        options: [
            "Lock the version permanently and never update",
            "Allow automatic updates to compatible minor and patch versions",
            "Force upgrade to the next major version immediately",
            "Download the package from a remote mirror"
        ],
        correct: 1,
        explanation: "The caret (`^`) permits automatic updates to future minor and patch versions that do not break backward compatibility."
    },
    {
        question: "Which folder structure best follows professional backend architecture principles?",
        options: [
            "Putting all controllers, models, and routes into a single `index.js` file",
            "Separating code into dedicated `controllers/`, `routes/`, `models/`, and `config/` folders",
            "Creating 50 separate root HTML files",
            "Storing all logic inside `node_modules/`"
        ],
        correct: 1,
        explanation: "Separating concerns into structured directories (`controllers`, `routes`, `models`) is standard backend best practice."
    },
    {
        question: "What command creates a `package.json` instantly with default answers skipped?",
        options: ["npm init -y", "npm create fast", "npm start --yes", "npm new"],
        correct: 0,
        explanation: "`npm init -y` (or `--yes`) bypasses the interactive questionnaire and generates a default `package.json`."
    },
    {
        question: "What is the difference between `dependencies` and `devDependencies`?",
        options: [
            "Dependencies are required for production runtime; devDependencies are local development tools",
            "Dependencies are written in Python; devDependencies are in JavaScript",
            "devDependencies run faster than regular dependencies",
            "There is no difference between them"
        ],
        correct: 0,
        explanation: "Dependencies are needed for app execution in production, whereas devDependencies are tools (like linters or live-reloaders) used only during development."
    }
];

let currentQuizIndex = 0;
let userAnswers = new Array(quizData.length).fill(null);
let quizScore = 0;

function initQuizSystem() {
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const quizBody = document.getElementById("quiz-body");
    const questionNumSpan = document.getElementById("quiz-question-number");
    const progressFill = document.getElementById("quizProgressFill");
    const scoreDisplay = document.getElementById("quiz-score-display");
    const prevBtn = document.getElementById("quizPrevBtn");
    const nextBtn = document.getElementById("quizNextBtn");

    if (!quizBody) return;

    const currentQ = quizData[currentQuizIndex];
    questionNumSpan.textContent = `Question ${currentQuizIndex + 1} of ${quizData.length}`;
    progressFill.style.width = `${((currentQuizIndex + 1) / quizData.length) * 100}%`;
    scoreDisplay.textContent = `Score: ${quizScore}`;

    prevBtn.disabled = currentQuizIndex === 0;
    nextBtn.textContent = currentQuizIndex === quizData.length - 1 ? "Finish Quiz" : "Next";

    let html = `<h4>${currentQ.question}</h4><div class="quiz-options">`;
    currentQ.options.forEach((opt, idx) => {
        let btnClass = "quiz-option-btn";
        const selectedOpt = userAnswers[currentQuizIndex];
        if (selectedOpt !== null) {
            if (idx === currentQ.correct) {
                btnClass += " correct";
            } else if (idx === selectedOpt) {
                btnClass += " incorrect";
            }
        }
        html += `<button class="${btnClass}" onclick="selectQuizAnswer(${idx})" ${selectedOpt !== null ? "disabled" : ""}>${String.fromCharCode(65 + idx)}. ${opt}</button>`;
    });
    html += `</div>`;

    if (userAnswers[currentQuizIndex] !== null) {
        const isCorrect = userAnswers[currentQuizIndex] === currentQ.correct;
        html += `<div class="quiz-explanation mt-3 p-3 bg-secondary rounded ${isCorrect ? 'text-success' : 'text-danger'}">
            <strong>${isCorrect ? 'Correct!' : 'Incorrect.'}</strong> ${currentQ.explanation}
        </div>`;
    }

    quizBody.innerHTML = html;
}

window.selectQuizAnswer = function(selectedIndex) {
    if (userAnswers[currentQuizIndex] !== null) return;
    userAnswers[currentQuizIndex] = selectedIndex;

    const currentQ = quizData[currentQuizIndex];
    if (selectedIndex === currentQ.correct) {
        quizScore += Math.round(100 / quizData.length);
    }
    renderQuizQuestion();
};

window.prevQuizQuestion = function() {
    if (currentQuizIndex > 0) {
        currentQuizIndex--;
        renderQuizQuestion();
    }
};

window.nextQuizQuestion = function() {
    if (currentQuizIndex < quizData.length - 1) {
        currentQuizIndex++;
        renderQuizQuestion();
    } else {
        showQuizResults();
    }
};

window.prevQuestion = window.prevQuizQuestion;
window.nextQuestion = window.nextQuizQuestion;

function showQuizResults() {
    const quizBody = document.getElementById("quiz-body");
    const quizFooter = document.querySelector(".quiz-footer");
    
    quizBody.innerHTML = `
        <div class="text-center p-4">
            <h3 class="text-gradient mb-3">Quiz Completed! 🎉</h3>
            <p class="mb-2">Your Final Score: <strong>${quizScore} / 100</strong></p>
            <p class="text-secondary mb-4">${quizScore >= 80 ? 'Masterful understanding of npm and project structuring!' : 'Good effort! Review the lessons and try again to master npm.'}</p>
            <button class="btn btn-primary" onclick="restartQuiz()">Retake Quiz</button>
        </div>
    `;
    quizFooter.style.display = "none";
    saveProgressToStorage("quiz", 100);
}

window.restartQuiz = function() {
    currentQuizIndex = 0;
    userAnswers = new Array(quizData.length).fill(null);
    quizScore = 0;
    document.querySelector(".quiz-footer").style.display = "flex";
    renderQuizQuestion();
};

/* ==========================================
   5. HELPER FUNCTIONS & UI INTERACTION
   ========================================== */
window.toggleSolution = function(solutionId) {
    const solBox = document.getElementById(solutionId);
    if (solBox) {
        solBox.classList.toggle("hidden");
        const btn = solBox.previousElementSibling;
        if (btn) {
            btn.innerHTML = solBox.classList.contains("hidden") ? '<i class="fa-solid fa-eye"></i> Reveal Solution' : '<i class="fa-solid fa-eye-slash"></i> Hide Solution';
        }
    }
};

window.toggleKC = function(kcId) {
    const ansBox = document.getElementById(kcId);
    if (ansBox) {
        ansBox.classList.toggle("hidden");
    }
};

window.copyCode = function(button) {
    const pre = button.closest(".code-example-block").querySelector("pre");
    const codeText = pre.innerText;

    navigator.clipboard.writeText(codeText).then(() => {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        button.style.color = "#4ade80";
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.color = "";
        }, 2000);
    }).catch(err => {
        console.error("Failed to copy code: ", err);
    });
};

/* ==========================================
   6. PROGRESS TRACKING (localStorage)
   ========================================== */
const STORAGE_KEY = "arslan_phase2_day03_progress";

window.updateProgress = function() {
    const checkboxes = document.querySelectorAll(".project-checklist input[type='checkbox']");
    let checkedCount = 0;
    checkboxes.forEach(cb => {
        if (cb.checked) checkedCount++;
    });

    const projectProgress = (checkedCount / checkboxes.length) * 50;
    const quizProgress = userAnswers.filter(a => a !== null).length > 0 ? 50 : 0;
    const totalProgress = Math.round(projectProgress + quizProgress);

    document.getElementById("overallProgressPercent").textContent = `${totalProgress}%`;
    document.getElementById("overallProgressBar").style.width = `${totalProgress}%`;

    saveProgressToStorage("total", totalProgress);
};

function saveProgressToStorage(key, val) {
    let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    data[key] = val;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadProgress() {
    let data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data) return;

    if (data.total) {
        document.getElementById("overallProgressPercent").textContent = `${data.total}%`;
        document.getElementById("overallProgressBar").style.width = `${data.total}%`;
    }
}