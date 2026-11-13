/* ==========================================================================
   ARSLAN'S PREMIUM BACKEND LEARNING PLATFORM - DAY 11 SCRIPT
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
   3. THREE.JS 3D MIDDLEWARE PIPELINE VISUALIZER
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

    // Create Middleware Pipeline Group
    const pipelineGroup = new THREE.Group();

    // Central Express Server Core
    const coreGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const coreMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        roughness: 0.2,
        metalness: 0.8
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    pipelineGroup.add(coreMesh);

    // Orbiting Middleware Nodes (Logger, Auth, BodyParser, Static)
    const numNodes = 4;
    const radius = 3.0;
    const pipelineNodes = [];

    for (let i = 0; i < numNodes; i++) {
        const angle = (i / numNodes) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        const nodeGeo = new THREE.SphereGeometry(0.35, 32, 32);
        const nodeMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            roughness: 0.1,
            metalness: 0.9
        });
        const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
        nodeMesh.position.set(x, y, 0);
        pipelineGroup.add(nodeMesh);
        pipelineNodes.push(nodeMesh);

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
        pipelineGroup.add(line);
    }

    scene.add(pipelineGroup);

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

        pipelineGroup.rotation.y += deltaX * 0.008;
        pipelineGroup.rotation.x += deltaY * 0.008;

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

        pipelineGroup.rotation.y += deltaX * 0.008;
        pipelineGroup.rotation.x += deltaY * 0.008;

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
            pipelineGroup.rotation.y += 0.005;
            pipelineGroup.rotation.x += 0.002;
        }

        coreMesh.rotation.x += 0.01;
        coreMesh.rotation.y += 0.01;

        pipelineNodes.forEach(node => {
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
        question: "What is Express middleware?",
        options: [
            "A database management tool",
            "Functions with access to `req`, `res`, and `next` that execute during the request cycle",
            "A frontend CSS animation library",
            "A compiler for TypeScript"
        ],
        correct: 1,
        explanation: "Middleware functions intercept requests and responses to perform tasks like logging, parsing, and auth."
    },
    {
        question: "What function must be called inside middleware to pass control to the next function in the stack?",
        options: ["forward()", "next()", "continue()", "proceed()"],
        correct: 1,
        explanation: "Calling `next()` hands execution over to the subsequent middleware or route handler."
    },
    {
        question: "What happens if you omit `next()` or a response in a custom middleware function?",
        options: [
            "Express skips the middleware automatically",
            "The client request hangs indefinitely waiting for a response",
            "The server throws an immediate syntax error",
            "Express logs a warning"
        ],
        correct: 1,
        explanation: "Without `next()` or `res.send()`, the request-response cycle remains open and hangs."
    },
    {
        question: "How do you mount middleware globally across all routes in an Express application?",
        options: ["app.use(middleware)", "app.route(middleware)", "app.mount(middleware)", "app.global(middleware)"],
        correct: 0,
        explanation: "`app.use()` binds middleware functions to the Express application pipeline globally."
    },
    {
        question: "Which built-in Express middleware is used to serve static assets like CSS, images, and HTML files?",
        options: ["express.static()", "express.assets()", "express.public()", "express.files()"],
        correct: 0,
        explanation: "`express.static('folderName')` serves static files out of the box."
    },
    {
        question: "What popular third-party middleware package is widely used for HTTP request logging?",
        options: ["winston", "morgan", "bunyan", "chalk"],
        correct: 1,
        explanation: "`morgan` is the standard HTTP request logger middleware for Node.js."
    },
    {
        question: "Can middleware be applied to a single specific route rather than globally?",
        options: [
            "No, middleware must always apply to all routes",
            "Yes, by passing the middleware function as an argument directly into the route definition",
            "Only in POST requests",
            "Only when using TypeScript"
        ],
        correct: 1,
        explanation: "Route-specific middleware is passed directly between the path and handler callback (e.g., `app.get('/path', mw, handler)`)."
    },
    {
        question: "What are the three core arguments received by an Express middleware function callback?",
        options: ["app, router, next", "req, res, next", "request, response, body", "client, server, callback"],
        correct: 1,
        explanation: "Middleware functions receive `req` (request), `res` (response), and `next` (next function)."
    },
    {
        question: "What status code should authentication middleware return if an API key or token is invalid or missing?",
        options: ["200 OK", "401 Unauthorized", "404 Not Found", "500 Internal Server Error"],
        correct: 1,
        explanation: "401 Unauthorized indicates that the request lacks valid authentication credentials."
    },
    {
        question: "In what order does Express execute middleware functions?",
        options: [
            "Random order",
            "Alphabetical order by function name",
            "In the exact top-to-bottom order they are defined in code",
            "Reverse order of definition"
        ],
        correct: 2,
        explanation: "Express executes middleware sequentially in the order they are mounted in your script."
    },
    {
        question: "What built-in middleware parses incoming JSON payloads into `req.body`?",
        options: ["express.json()", "express.parser()", "express.urlencoded()", "express.text()"],
        correct: 0,
        explanation: "`express.json()` parses JSON request bodies."
    },
    {
        question: "Can custom middleware modify the `req` or `res` objects before they reach the route handler?",
        options: [
            "Yes, properties can be attached to `req` (e.g., `req.user = ...`) for downstream handlers to use",
            "No, request and response objects are strictly immutable",
            "Only when using TypeScript",
            "Only in GET requests"
        ],
        correct: 0,
        explanation: "Middleware frequently decorates `req` with custom properties (like timestamps, user data, or auth tokens)."
    },
    {
        question: "Which of the following represents a valid custom authentication middleware check?",
        options: [
            "if (!req.headers['authorization']) return res.status(401).json({ error: 'No token' }); next();",
            "if (req.url === '/') next();",
            "app.use(auth);",
            "All of the above"
        ],
        correct: 0,
        explanation: "Checking request headers and returning early with 401 (or calling `next()`) is standard auth middleware practice."
    },
    {
        question: "Why do developers modularize middleware into separate files and folders in larger projects?",
        options: [
            "To keep codebase architecture clean, maintainable, and separation-of-concerns focused",
            "Because Express requires at least 10 middleware files",
            "To make files run faster on CPU cores",
            "It is mandatory for Node.js execution"
        ],
        correct: 0,
        explanation: "Modularization keeps code organized and scalable as backend applications grow."
    },
    {
        question: "What happens if you send a response (`res.send()`) inside a middleware function and still call `next()` afterwards?",
        options: [
            "Express ignores it",
            "Express throws a 'Cannot set headers after they are sent' runtime error",
            "The server restarts automatically",
            "The client receives two responses"
        ],
        correct: 1,
        explanation: "Once a response is sent, headers are finalized; attempting to call `next()` or send another response triggers a header error."
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
            <p class="text-secondary mb-4">${quizScore >= 80 ? 'Masterful understanding of Express middleware architecture!' : 'Good effort! Review the lessons on the next() function and middleware pipelines and try again.'}</p>
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
const STORAGE_KEY = "arslan_phase2_day11_progress";

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