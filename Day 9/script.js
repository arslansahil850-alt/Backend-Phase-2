/* ==========================================================================
   ARSLAN'S PREMIUM BACKEND LEARNING PLATFORM - DAY 09 SCRIPT
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
   3. THREE.JS 3D POST REQUEST PAYLOAD VISUALIZER
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

    // Create Payload Stream Group
    const payloadGroup = new THREE.Group();

    // Central Server Core
    const coreGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const coreMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        roughness: 0.2,
        metalness: 0.8
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    payloadGroup.add(coreMesh);

    // Orbiting Payload Nodes (req.body streams)
    const numNodes = 4;
    const radius = 3.0;
    const payloadNodes = [];

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
        payloadGroup.add(nodeMesh);
        payloadNodes.push(nodeMesh);

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
        payloadGroup.add(line);
    }

    scene.add(payloadGroup);

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

        payloadGroup.rotation.y += deltaX * 0.008;
        payloadGroup.rotation.x += deltaY * 0.008;

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

        payloadGroup.rotation.y += deltaX * 0.008;
        payloadGroup.rotation.x += deltaY * 0.008;

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
            payloadGroup.rotation.y += 0.005;
            payloadGroup.rotation.x += 0.002;
        }

        coreMesh.rotation.x += 0.01;
        coreMesh.rotation.y += 0.01;

        payloadNodes.forEach(node => {
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
        question: "Which HTTP method is primarily used to send data to a server to create a new resource?",
        options: ["GET", "POST", "DELETE", "OPTIONS"],
        correct: 1,
        explanation: "POST requests transmit data payloads from client to server for resource creation."
    },
    {
        question: "What Express middleware is required to parse incoming JSON request bodies?",
        options: ["express.json()", "express.parser()", "express.body()", "express.urlencoded()"],
        correct: 0,
        explanation: "`express.json()` parses incoming requests with JSON payloads into `req.body`."
    },
    {
        question: "Where is the parsed data submitted in an Express POST request stored?",
        options: ["req.query", "req.params", "req.body", "req.payload"],
        correct: 2,
        explanation: "Body parser middleware populates `req.body` with the submitted data object."
    },
    {
        question: "What happens if you omit `app.use(express.json())` and attempt to access `req.body` in a POST handler?",
        options: [
            "Express automatically parses JSON anyway",
            "`req.body` will be `undefined`",
            "The server throws a syntax error on startup",
            "The browser crashes"
        ],
        correct: 1,
        explanation: "Without body parser middleware, Express leaves `req.body` undefined."
    },
    {
        question: "Which HTTP status code is standard for a successful resource creation via POST?",
        options: ["200 OK", "201 Created", "204 No Content", "400 Bad Request"],
        correct: 1,
        explanation: "201 Created is the standard REST status code for successful POST creations."
    },
    {
        question: "What status code should your server return if required fields are missing in a POST request body?",
        options: ["200 OK", "401 Unauthorized", "400 Bad Request", "500 Internal Server Error"],
        correct: 2,
        explanation: "400 Bad Request indicates that the server cannot process the request due to client validation failure."
    },
    {
        question: "Which middleware is used to parse traditional HTML form submissions (`application/x-www-form-urlencoded`)?",
        options: ["express.json()", "express.urlencoded({ extended: true })", "express.form()", "express.html()"],
        correct: 1,
        explanation: "`express.urlencoded()` parses URL-encoded form data submissions."
    },
    {
        question: "Are POST requests considered idempotent?",
        options: [
            "Yes, making multiple identical POST requests produces the exact same server state",
            "No, making multiple identical POST requests creates multiple duplicate resources",
            "Only when combined with GET",
            "Never in Express"
        ],
        correct: 1,
        explanation: "POST is not idempotent because repeating it creates duplicate entries."
    },
    {
        question: "How do you check if a required property like `title` was provided in `req.body`?",
        options: [
            "if (!req.body.title) { ... }",
            "if (req.body.title === undefined) { ... }",
            "Both A and B are valid JavaScript validation checks",
            "Express validates required fields automatically"
        ],
        correct: 2,
        explanation: "Both falsy checks and explicit undefined checks are valid."
    },
    {
        question: "What method registers an Express route handler specifically for POST requests?",
        options: ["app.get()", "app.post()", "app.send()", "app.create()"],
        correct: 1,
        explanation: "`app.post(path, callback)` handles incoming HTTP POST requests."
    },
    {
        question: "Why should you validate user input in `req.body` before saving it to a database?",
        options: [
            "To prevent saving malformed, incomplete, or malicious data",
            "Because Express requires validation to compile",
            "To speed up CPU processing",
            "It is optional and never required"
        ],
        correct: 0,
        explanation: "Input validation ensures data integrity and protects against errors or bad payloads."
    },
    {
        question: "Can you return the newly created resource object back to the client in your POST response?",
        options: [
            "Yes, typically inside the JSON response payload (e.g., `res.status(201).json({ data: newObj })`)",
            "No, servers can only return strings",
            "Only when using native Node",
            "Only in XML format"
        ],
        correct: 0,
        explanation: "Returning the created object confirms successful creation to the client."
    },
    {
        question: "In what order should `app.use(express.json())` be placed relative to your routes?",
        options: [
            "At the very bottom after all routes",
            "At the top before any route definitions",
            "Inside individual route callback functions",
            "Order does not matter"
        ],
        correct: 1,
        explanation: "Middleware must be mounted before routes so that requests are parsed before reaching handlers."
    },
    {
        question: "What property type does `req.body` become after parsing a valid JSON payload?",
        options: ["String", "JavaScript Object", "Buffer", "Array Buffer"],
        correct: 1,
        explanation: "`express.json()` parses JSON strings into a native JavaScript object."
    },
    {
        question: "What is the primary difference between GET and POST requests regarding payloads?",
        options: [
            "GET requests send data in the request body, while POST requests use query strings",
            "GET requests pass parameters via URL/query strings without a standard body, whereas POST requests send data inside the request body",
            "There is no difference",
            "POST requests cannot transmit data"
        ],
        correct: 1,
        explanation: "POST requests transmit data securely in the request body, whereas GET uses URLs and query strings."
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
            <p class="text-secondary mb-4">${quizScore >= 80 ? 'Masterful understanding of POST requests and request bodies!' : 'Good effort! Review the lessons on express.json() and req.body and try again.'}</p>
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
const STORAGE_KEY = "arslan_phase2_day09_progress";

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