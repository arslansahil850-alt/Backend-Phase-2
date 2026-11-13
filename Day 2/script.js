/* ==========================================================================
   ARSLAN'S PREMIUM BACKEND LEARNING PLATFORM - DAY 02 SCRIPT
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
   3. THREE.JS 3D MODULE NETWORK VISUALIZER
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

    // Create Modular Network Group (Central app.js connected to modules)
    const networkGroup = new THREE.Group();

    // Central Core Node (app.js)
    const centerGeo = new THREE.DodecahedronGeometry(1.0);
    const centerMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        roughness: 0.3,
        metalness: 0.7
    });
    const centerMesh = new THREE.Mesh(centerGeo, centerMat);
    networkGroup.add(centerMesh);

    // Orbiting Satellite Nodes (Modules)
    const numModules = 5;
    const radius = 3.2;
    const moduleNodes = [];

    for (let i = 0; i < numModules; i++) {
        const angle = (i / numModules) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        // Satellite Geometry (Cube representing module file)
        const nodeGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
        const nodeMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            roughness: 0.2,
            metalness: 0.8
        });
        const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
        nodeMesh.position.set(x, y, 0);
        networkGroup.add(nodeMesh);
        moduleNodes.push(nodeMesh);

        // Connecting Line (Representation of require() links)
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(x, y, 0)
        ]);
        const lineMat = new THREE.LineBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.6
        });
        const line = new THREE.Line(lineGeo, lineMat);
        networkGroup.add(line);
    }

    scene.add(networkGroup);

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

        networkGroup.rotation.y += deltaX * 0.008;
        networkGroup.rotation.x += deltaY * 0.008;

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

        networkGroup.rotation.y += deltaX * 0.008;
        networkGroup.rotation.x += deltaY * 0.008;

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

        // Idle rotation
        if (!isDragging) {
            networkGroup.rotation.z += 0.003;
            networkGroup.rotation.y += 0.004;
        }

        // Rotate individual module nodes
        moduleNodes.forEach(node => {
            node.rotation.x += 0.01;
            node.rotation.y += 0.01;
        });

        renderer.render(scene, camera);
    }
    animate();
}

/* ==========================================
   4. INTERACTIVE QUIZ SYSTEM (15 MCQs)
   ========================================== */
const quizData = [
    {
        question: "What module standard does Node.js use by default?",
        options: ["AMD", "ES Modules (ESM)", "CommonJS", "SystemJS"],
        correct: 2,
        explanation: "Node.js historically and by default uses the CommonJS module system."
    },
    {
        question: "Which keyword/function is used to import a CommonJS module into another file?",
        options: ["import", "require()", "fetch()", "include()"],
        correct: 1,
        explanation: "The built-in `require()` function is used to load and execute modules in CommonJS."
    },
    {
        question: "How do you export functionality from a file in CommonJS?",
        options: ["export default", "module.exports", "global.export", "return.exports"],
        correct: 1,
        explanation: "`module.exports` is the object that Node returns when a file is imported via `require()`."
    },
    {
        question: "What is the scope of variables declared inside a CommonJS module?",
        options: [
            "Global scope across the entire Node process",
            "Local scope enclosed within that module only",
            "Shared scope between all files in the same directory",
            "Block scope accessible to HTML script tags"
        ],
        correct: 1,
        explanation: "Every Node file is wrapped in a module wrapper, isolating variables to module-local scope."
    },
    {
        question: "What relative prefix must be used when requiring a custom local JavaScript module?",
        options: ["./ or ../", "node_modules/", "http://", "global/"],
        correct: 0,
        explanation: "Local custom modules require relative paths starting with `./` or `../` so Node knows not to search `node_modules`."
    },
    {
        question: "What function wraps every CommonJS module file before execution in Node.js?",
        options: ["Event Loop Wrapper", "Module Wrapper Function", "Async Context Handler", "Strict Wrapper"],
        correct: 1,
        explanation: "Node wraps code in `(function(exports, require, module, __filename, __dirname) { ... })`."
    },
    {
        question: "What happens if you run `require('./utils')` where `utils` is a directory?",
        options: [
            "Node throws a Fatal Directory Error",
            "Node automatically searches for `utils/index.js`",
            "Node reads all `.js` files inside `utils` simultaneously",
            "Node creates a new directory named `utils.js`"
        ],
        correct: 1,
        explanation: "If requiring a folder path, Node defaults to searching for an `index.js` file inside that folder."
    },
    {
        question: "What is the relationship between `exports` and `module.exports`?",
        options: [
            "`exports` is a shorthand reference pointing to `module.exports`",
            "`exports` overrides `module.exports` completely",
            "`exports` is browser-only, while `module.exports` is server-only",
            "They are completely unrelated variables"
        ],
        correct: 0,
        explanation: "`exports` is simply a reference variable initialized to point to `module.exports`."
    },
    {
        question: "If you assign a new object directly to `exports = { foo: 'bar' }`, what happens?",
        options: [
            "It successfully exports the object",
            "It breaks the reference link to `module.exports` and exports nothing",
            "Node crashes with a SyntaxError",
            "It converts the module into ES Modules mode"
        ],
        correct: 1,
        explanation: "Reassigning `exports` breaks its reference to `module.exports`. Always reassign `module.exports` directly if replacing the object."
    },
    {
        question: "How does Node handle requiring the exact same module multiple times in different files?",
        options: [
            "It re-executes the module code every time `require()` is called",
            "It caches the module result after the first load and reuses the cached export",
            "It throws a Duplicate Module Warning",
            "It creates isolated duplicate instances in memory"
        ],
        correct: 1,
        explanation: "Node caches modules after their initial execution in `require.cache` for maximum performance."
    },
    {
        question: "Which global parameter in the module wrapper gives the file name of the current script?",
        options: ["__dirname", "__filename", "process.filename", "module.id"],
        correct: 1,
        explanation: "`__filename` contains the absolute path of the executing file."
    },
    {
        question: "What is the main benefit of modular architecture in backend projects?",
        options: [
            "Faster internet transfer speeds",
            "Separation of concerns, code reusability, and clean maintainability",
            "Elimination of all syntax errors",
            "Automatic database synchronization"
        ],
        correct: 1,
        explanation: "Modules divide complex applications into organized, reusable, and single-responsibility code blocks."
    },
    {
        question: "Which built-in Node.js module handles file paths across different operating systems?",
        options: ["fs", "path", "http", "os"],
        correct: 1,
        explanation: "The core `path` module provides utility methods for resolving and formatting directory and file paths."
    },
    {
        question: "Can you export functions, primitive values, and objects from a single module?",
        options: [
            "No, modules can only export strings",
            "Yes, by bundling them inside the `module.exports` object",
            "No, only functions can be exported",
            "Yes, but only if written in TypeScript"
        ],
        correct: 1,
        explanation: "`module.exports` can hold any valid JS data structure including functions, arrays, objects, and primitives."
    },
    {
        question: "Which of the following describes a circular dependency in Node modules?",
        options: [
            "A module requiring itself recursively",
            "Module A requiring Module B, while Module B also requires Module A",
            "Requiring an npm package without installing it",
            "Using `require()` inside an infinite `while` loop"
        ],
        correct: 1,
        explanation: "A circular dependency occurs when two or more modules depend on each other directly or indirectly."
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
            <p class="text-secondary mb-4">${quizScore >= 80 ? 'Masterful understanding of CommonJS modules!' : 'Good effort! Re-read the module encapsulation lessons and try again.'}</p>
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
const STORAGE_KEY = "arslan_phase2_day02_progress";

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