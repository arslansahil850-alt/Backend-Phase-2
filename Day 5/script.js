/* ==========================================================================
   ARSLAN'S PREMIUM BACKEND LEARNING PLATFORM - DAY 05 SCRIPT
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
   3. THREE.JS 3D HTTP PACKET VISUALIZER
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

    // Create HTTP Packet Exchange Group
    const httpGroup = new THREE.Group();

    // Central Server Node
    const serverGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const serverMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        roughness: 0.2,
        metalness: 0.8
    });
    const serverMesh = new THREE.Mesh(serverGeo, serverMat);
    httpGroup.add(serverMesh);

    // Orbiting HTTP Request/Response Packets
    const numPackets = 5;
    const radius = 3.0;
    const packetNodes = [];

    for (let i = 0; i < numPackets; i++) {
        const angle = (i / numPackets) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        const packetGeo = new THREE.SphereGeometry(0.35, 32, 32);
        const packetMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            roughness: 0.1,
            metalness: 0.9
        });
        const packetMesh = new THREE.Mesh(packetGeo, packetMat);
        packetMesh.position.set(x, y, 0);
        httpGroup.add(packetMesh);
        packetNodes.push(packetMesh);

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
        httpGroup.add(line);
    }

    scene.add(httpGroup);

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

        httpGroup.rotation.y += deltaX * 0.008;
        httpGroup.rotation.x += deltaY * 0.008;

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

        httpGroup.rotation.y += deltaX * 0.008;
        httpGroup.rotation.x += deltaY * 0.008;

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
            httpGroup.rotation.y += 0.005;
            httpGroup.rotation.x += 0.002;
        }

        serverMesh.rotation.x += 0.01;
        serverMesh.rotation.y += 0.01;

        packetNodes.forEach(node => {
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
        question: "What does HTTP stand for?",
        options: [
            "HyperText Transfer Protocol",
            "High Transfer Text Program",
            "Hyperlink Transmission Test Process",
            "Host Terminal Transfer Protocol"
        ],
        correct: 0,
        explanation: "HTTP stands for HyperText Transfer Protocol, the foundational web protocol."
    },
    {
        question: "Which HTTP method is typically used to request and read data from a server?",
        options: ["POST", "PUT", "GET", "DELETE"],
        correct: 2,
        explanation: "GET requests are designed to retrieve data from a server without modifying state."
    },
    {
        question: "What do HTTP status codes starting with '2xx' signify?",
        options: ["Client Errors", "Successful Responses", "Redirections", "Server Failures"],
        correct: 1,
        explanation: "2xx status codes (like 200 OK or 201 Created) indicate successful request processing."
    },
    {
        question: "Which HTTP status code is returned when a requested resource cannot be found?",
        options: ["200", "301", "404", "500"],
        correct: 2,
        explanation: "404 Not Found is the standard client error code for missing resources."
    },
    {
        question: "What do HTTP status codes in the '5xx' range represent?",
        options: [
            "Internal Server Errors",
            "Successful database queries",
            "Client authentication errors",
            "Cache expiration warnings"
        ],
        correct: 0,
        explanation: "5xx status codes indicate that the server encountered an unexpected internal error while processing a valid request."
    },
    {
        question: "Which HTTP method is standard for creating a new resource on a server?",
        options: ["GET", "POST", "PUT", "PATCH"],
        correct: 1,
        explanation: "POST requests are used to submit data and create new child resources on backend servers."
    },
    {
        question: "What is an idempotent HTTP method?",
        options: [
            "A method that always returns a 500 error",
            "A method where making multiple identical requests produces the exact same server state as a single request",
            "A method that requires admin authorization",
            "A method that deletes the entire database"
        ],
        correct: 1,
        explanation: "Idempotent methods (like GET, PUT, and DELETE) can be called repeatedly without changing the resulting state beyond the initial application."
    },
    {
        question: "Which header specifies the media type of the response body (e.g. `application/json`)?",
        options: ["User-Agent", "Host", "Content-Type", "Authorization"],
        correct: 2,
        explanation: "`Content-Type` informs the consumer whether the payload is JSON, HTML, plain text, etc."
    },
    {
        question: "What does 'stateless' mean in the context of HTTP?",
        options: [
            "Servers store user session data permanently in RAM",
            "Each HTTP request is independent, and the server retains no memory of previous requests from the same client",
            "HTTP only works without JavaScript enabled",
            "Servers cannot connect to databases"
        ],
        correct: 1,
        explanation: "HTTP is stateless by design, treating every request as an independent transaction."
    },
    {
        question: "Which status code represents successful resource creation?",
        options: ["200 OK", "201 Created", "204 No Content", "302 Found"],
        correct: 1,
        explanation: "201 Created is the specific success code returned when a POST request successfully creates a new resource."
    },
    {
        question: "What does a 401 Unauthorized status code indicate?",
        options: [
            "The server is currently offline for maintenance",
            "The client failed to provide valid authentication credentials",
            "The requested file is too large to download",
            "The API endpoint has been permanently deleted"
        ],
        correct: 1,
        explanation: "401 Unauthorized means authentication is required and has failed or not been provided."
    },
    {
        question: "Which HTTP method is used for partial updates to an existing resource?",
        options: ["GET", "PUT", "PATCH", "DELETE"],
        correct: 2,
        explanation: "PATCH is used for partial modifications, whereas PUT typically replaces the entire resource."
    },
    {
        question: "What information does the `User-Agent` header provide?",
        options: [
            "The password of the logged-in user",
            "Details about the client software, browser, and operating system making the request",
            "The IP address of the database server",
            "The exact server uptime in seconds"
        ],
        correct: 1,
        explanation: "`User-Agent` identifies the client application making the HTTP request."
    },
    {
        question: "Why are status codes in the 3xx range used?",
        options: ["For client redirection", "For server crashes", "For successful data retrieval", "For file uploads"],
        correct: 0,
        explanation: "3xx status codes instruct the client that further action is required to complete redirection."
    },
    {
        question: "Is a POST request considered idempotent?",
        options: [
            "Yes, making two identical POST requests has the exact same effect as one",
            "No, making multiple identical POST requests will create multiple duplicate resources on the server",
            "Only when combined with GET",
            "Never in Node.js"
        ],
        correct: 1,
        explanation: "POST is not idempotent because repeating it creates duplicate resource entries."
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
            <p class="text-secondary mb-4">${quizScore >= 80 ? 'Masterful understanding of HTTP fundamentals!' : 'Good effort! Review the lessons on status codes and methods and try again.'}</p>
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
const STORAGE_KEY = "arslan_phase2_day05_progress";

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