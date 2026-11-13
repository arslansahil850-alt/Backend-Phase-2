/* ==========================================================================
   ARSLAN'S PREMIUM BACKEND LEARNING PLATFORM - DAY 15 SCRIPT
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
   3. THREE.JS 3D PHASE 2 CORE VISUALIZER
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

    // Create Capstone Ecosystem Group
    const capstoneGroup = new THREE.Group();

    // Central Node Core Octahedron
    const coreGeo = new THREE.OctahedronGeometry(1.2, 0);
    const coreMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        roughness: 0.2,
        metalness: 0.8
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    capstoneGroup.add(coreMesh);

    // Orbiting Phase 2 Nodes
    const numNodes = 6;
    const radius = 3.2;
    const orbitNodes = [];

    for (let i = 0; i < numNodes; i++) {
        const angle = (i / numNodes) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        const nodeGeo = new THREE.SphereGeometry(0.3, 32, 32);
        const nodeMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            roughness: 0.1,
            metalness: 0.9
        });
        const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
        nodeMesh.position.set(x, y, 0);
        capstoneGroup.add(nodeMesh);
        orbitNodes.push(nodeMesh);

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
        capstoneGroup.add(line);
    }

    scene.add(capstoneGroup);

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

        capstoneGroup.rotation.y += deltaX * 0.008;
        capstoneGroup.rotation.x += deltaY * 0.008;

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

        capstoneGroup.rotation.y += deltaX * 0.008;
        capstoneGroup.rotation.x += deltaY * 0.008;

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
            capstoneGroup.rotation.y += 0.005;
            capstoneGroup.rotation.x += 0.002;
        }

        coreMesh.rotation.x += 0.01;
        coreMesh.rotation.y += 0.01;

        orbitNodes.forEach(node => {
            node.rotation.x += 0.02;
            node.rotation.y += 0.02;
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
        question: "Which pattern correctly exports multiple functions using CommonJS in Node.js?",
        options: [
            "export default { fn1, fn2 }",
            "module.exports = { fn1, fn2 }",
            "export { fn1, fn2 }",
            "Node.exports = { fn1, fn2 }"
        ],
        correct: 1,
        explanation: "CommonJS uses `module.exports` or `exports.func` to make functions available across files."
    },
    {
        question: "What core module is used to work with file paths in a cross-platform compatible manner?",
        options: ["fs", "path", "url", "os"],
        correct: 1,
        explanation: "The `path` module (`path.join()`, `path.resolve()`) automatically normalizes slashes across Windows, Mac, and Linux."
    },
    {
        question: "Which HTTP method is designed specifically for partial updates to a resource?",
        options: ["PUT", "PATCH", "POST", "UPDATE"],
        correct: 1,
        explanation: "`PATCH` updates specified fields of a resource, whereas `PUT` replaces the entire resource."
    },
    {
        question: "How do you access JSON request bodies sent to an Express endpoint?",
        options: [
            "req.body (after adding app.use(express.json()))",
            "req.json",
            "req.payload",
            "req.params.body"
        ],
        correct: 0,
        explanation: "`express.json()` middleware parses incoming JSON into the `req.body` object."
    },
    {
        question: "What is the key distinguishing feature of an Express error-handling middleware function?",
        options: [
            "It must return a Promise",
            "It accepts 4 parameters: (err, req, res, next)",
            "It must be placed at the top of the file",
            "It uses the app.error() method"
        ],
        correct: 1,
        explanation: "Express identifies error middleware solely by its 4-parameter signature: `(err, req, res, next)`."
    },
    {
        question: "Which status code indicates a successful resource creation via POST?",
        options: ["200 OK", "201 Created", "204 No Content", "304 Not Modified"],
        correct: 1,
        explanation: "`201 Created` is the standard status code returned when a new resource is successfully generated."
    },
    {
        question: "What package is used to load configuration key-value pairs from a `.env` file into `process.env`?",
        options: ["config", "dotenv", "environment", "node-env"],
        correct: 1,
        explanation: "`dotenv` parses the `.env` file and merges values directly into Node's `process.env` object."
    },
    {
        question: "Why should `.env` files be added to `.gitignore`?",
        options: [
            "To prevent GitHub from running Node.js",
            "To avoid exposing secret credentials, API keys, and database passwords in public source control",
            "To keep file sizes small",
            "It is required by npm"
        ],
        correct: 1,
        explanation: "Committing secret keys to public repositories exposes applications to unauthorized access and security breaches."
    },
    {
        question: "How do you extract a URL dynamic route parameter defined as `/api/v1/users/:userId`?",
        options: ["req.query.userId", "req.params.userId", "req.body.userId", "req.headers.userId"],
        correct: 1,
        explanation: "Named route parameters defined with a colon are populated on the `req.params` object."
    },
    {
        question: "What happens if `next()` is called inside a middleware function without any arguments?",
        options: [
            "Express stops execution",
            "Express passes control to the next matching route or middleware in the stack",
            "An error is thrown",
            "The client receives a 500 error"
        ],
        correct: 1,
        explanation: "Calling `next()` signals Express to move to the subsequent middleware or route handler."
    },
    {
        question: "What status code represents client-side validation errors or missing required payload fields?",
        options: ["400 Bad Request", "401 Unauthorized", "404 Not Found", "500 Internal Server Error"],
        correct: 0,
        explanation: "`400 Bad Request` indicates the server cannot process the request due to invalid client data."
    },
    {
        question: "What query parameter formula computes the starting slice index for array-based pagination?",
        options: [
            "startIndex = page * limit",
            "startIndex = (page - 1) * limit",
            "startIndex = page + limit",
            "startIndex = limit / page"
        ],
        correct: 1,
        explanation: "`startIndex = (page - 1) * limit` correctly calculates the 0-indexed offset for pagination slices."
    },
    {
        question: "What command creates a default `package.json` file in a new Node project folder?",
        options: ["npm init -y", "node start", "npm create app", "node init"],
        correct: 0,
        explanation: "`npm init -y` initializes a standard `package.json` file using default configuration options."
    },
    {
        question: "What is the role of `nodemodule` / `nodemon` in development workflow?",
        options: [
            "To automatically restart the Node application when file changes are detected",
            "To compile JavaScript to C++",
            "To generate REST API documentation",
            "To encrypt database connections"
        ],
        correct: 0,
        explanation: "`nodemon` watches project files and automatically restarts the server upon saving changes."
    },
    {
        question: "What is the primary architectural rule for RESTful endpoint URIs?",
        options: [
            "Use verbs (e.g., `/createTask`, `/deleteUser`)",
            "Use plural nouns representing resources (e.g., `/api/v1/tasks`, `/api/v1/users`)",
            "Always include query parameters for every route",
            "Must end with `.html`"
        ],
        correct: 1,
        explanation: "RESTful URIs use plural nouns for resources, while HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`) specify actions."
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

window.selectQuizAnswer = function (selectedIndex) {
    if (userAnswers[currentQuizIndex] !== null) return;
    userAnswers[currentQuizIndex] = selectedIndex;

    const currentQ = quizData[currentQuizIndex];
    if (selectedIndex === currentQ.correct) {
        if (selectedIndex === currentQ.correct) {
            quizScore += 1;
        }
    }
    renderQuizQuestion();
};

window.prevQuizQuestion = function () {
    if (currentQuizIndex > 0) {
        currentQuizIndex--;
        renderQuizQuestion();
    }
};

window.nextQuizQuestion = function () {
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
            <h3 class="text-gradient mb-3">Phase 2 Exam Completed! 🏆</h3>
<p class="mb-2">Your Final Certification Score: <strong>${quizScore} / ${quizData.length}</strong></p>            <p class="text-secondary mb-4">${quizScore >= 80 ? 'Congratulations! You have mastered Node.js & Express.js!' : 'Good effort! Review the lessons and retake the exam to achieve certification.'}</p>
            <button class="btn btn-primary" onclick="restartQuiz()">Retake Exam</button>
        </div>
    `;
    quizFooter.style.display = "none";
    saveProgressToStorage("quiz", 100);
}

window.restartQuiz = function () {
    currentQuizIndex = 0;
    userAnswers = new Array(quizData.length).fill(null);
    quizScore = 0;
    document.querySelector(".quiz-footer").style.display = "flex";
    renderQuizQuestion();
};

/* ==========================================
   5. HELPER FUNCTIONS & UI INTERACTION
   ========================================== */
window.copyCode = function (button) {
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
const STORAGE_KEY = "arslan_phase2_day15_progress";

window.updateProgress = function () {
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