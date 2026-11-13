/* ==========================================================================
   ARSLAN'S PREMIUM BACKEND LEARNING PLATFORM - DAY 01 SCRIPT
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
   3. THREE.JS 3D RUNTIME SERVER VISUALIZER
   ========================================== */
function initThreeJsVisualizer() {
    const container = document.getElementById("threejs-canvas-container");
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 3, 6);
    camera.lookAt(0, 0, 0);

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
    goldLight.position.set(-5, -3, -3);
    scene.add(goldLight);

    // Create 3D Server Node Group
    const serverGroup = new THREE.Group();

    // Central Server Core (Icosahedron representing V8 runtime engine)
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const coreMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        wireframe: true,
        roughness: 0.2,
        metalness: 0.8
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    serverGroup.add(coreMesh);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const innerMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        emissive: 0xfbbf24,
        emissiveIntensity: 0.6,
        roughness: 0.1
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    serverGroup.add(innerMesh);

    // Orbiting Rings representing Event Loop / libuv threads
    const ringGroup = new THREE.Group();
    const ringGeo1 = new THREE.TorusGeometry(2.0, 0.03, 16, 100);
    const ringMat1 = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ringGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.5, 0.03, 16, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.3 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ringGroup.add(ring2);

    serverGroup.add(ringGroup);
    scene.add(serverGroup);

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

        serverGroup.rotation.y += deltaX * 0.008;
        serverGroup.rotation.x += deltaY * 0.008;

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

        serverGroup.rotation.y += deltaX * 0.008;
        serverGroup.rotation.x += deltaY * 0.008;

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
        
        // Idle rotation if not being dragged
        if (!isDragging) {
            serverGroup.rotation.y += 0.005;
            serverGroup.rotation.x += 0.002;
        }

        ringGroup.rotation.z += 0.01;
        renderer.render(scene, camera);
    }
    animate();
}

/* ==========================================
   4. INTERACTIVE QUIZ SYSTEM (15 MCQs)
   ========================================== */
const quizData = [
    {
        question: "What is Node.js primarily classified as?",
        options: [
            "A compiled backend programming language written in C++",
            "A JavaScript runtime environment built on Chrome's V8 engine",
            "A frontend browser framework competing with React",
            "An SQL database management system"
        ],
        correct: 1,
        explanation: "Node.js is an open-source JavaScript runtime environment that executes JS code outside a web browser."
    },
    {
        question: "Which C++ engine powers the execution of JavaScript in Node.js?",
        options: ["SpiderMonkey", "Chakra", "V8 Engine", "JavaScriptCore"],
        correct: 2,
        explanation: "Node.js is built directly on Google Chrome's high-performance V8 C++ JavaScript engine."
    },
    {
        question: "What library provides Node.js with its asynchronous, non-blocking I/O event loop?",
        options: ["libuv", "jQuery", "Axios", "Express"],
        correct: 0,
        explanation: "libuv is a multi-platform C library that handles asynchronous file system and network operations in Node.js."
    },
    {
        question: "In Node.js backend scripts, what is the top-level global object instead of `window`?",
        options: ["document", "global", "navigator", "parent"],
        correct: 1,
        explanation: "Because Node.js does not run in a browser DOM environment, the global object is `global` (or `globalThis`)."
    },
    {
        question: "What does the `__dirname` global variable return?",
        options: [
            "The filename of the executing script",
            "The absolute path of the directory containing the current script",
            "The root directory of the operating system",
            "The URL of the incoming HTTP request"
        ],
        correct: 1,
        explanation: "`__dirname` evaluates to the absolute directory path where the current file resides."
    },
    {
        question: "Which object in Node.js provides information about and control over the current Node process?",
        options: ["system", "process", "os", "kernel"],
        correct: 1,
        explanation: "The `process` object is a global that provides info about runtime environment, arguments (`process.argv`), memory usage, and exit triggers."
    },
    {
        question: "How does Node.js handle concurrent incoming connections efficiently with a single thread?",
        options: [
            "By creating a new operating system thread for every connection",
            "By blocking execution until each task finishes sequentially",
            "By using non-blocking asynchronous I/O and offloading tasks to libuv",
            "By utilizing multiple CPU cores automatically for every request"
        ],
        correct: 2,
        explanation: "Node uses an event-driven, non-blocking model, offloading heavy I/O tasks to system threads and handling callbacks asynchronously."
    },
    {
        question: "What does `process.argv` contain?",
        options: [
            "Environment variables and secrets",
            "Command-line arguments passed when launching the Node script",
            "Array of active server connections",
            "Memory heap allocation metrics"
        ],
        correct: 1,
        explanation: "`process.argv` is an array containing command-line arguments passed when the Node process was launched."
    },
    {
        question: "Which method is used to immediately terminate a running Node.js process?",
        options: ["process.stop()", "process.exit()", "process.killAll()", "node.terminate()"],
        correct: 1,
        explanation: "`process.exit([code])` instructs Node to abort the current process immediately."
    },
    {
        question: "What is the primary advantage of asynchronous non-blocking code in servers?",
        options: [
            "It makes code execute faster synchronously line by line",
            "It prevents the server from freezing while waiting for disk or network I/O",
            "It eliminates the need for any databases",
            "It reduces JavaScript syntax complexity"
        ],
        correct: 1,
        explanation: "Non-blocking I/O ensures the event loop remains free to process other incoming requests while waiting for file or database responses."
    },
    {
        question: "Which global property gives the absolute file path of the currently executing file?",
        options: ["__filename", "__filepath", "process.file", "__dirname"],
        correct: 0,
        explanation: "`__filename` gives the absolute path of the current module file."
    },
    {
        question: "Who created Node.js in 2009?",
        options: ["Brendan Eich", "Ryan Dahl", "Linus Torvalds", "Dan Abramov"],
        correct: 1,
        explanation: "Ryan Dahl originally created Node.js in 2009, combining Chrome's V8 engine with event-driven architecture."
    },
    {
        question: "What does `process.memoryUsage()` return?",
        options: [
            "Total RAM installed on the computer hardware",
            "An object detailing RSS, heap total, and heap used memory metrics",
            "Disk space remaining on the hard drive",
            "Browser cache size"
        ],
        correct: 1,
        explanation: "`process.memoryUsage()` returns memory allocation metrics in bytes for the Node process."
    },
    {
        question: "Which of the following is NOT a native global in Node.js?",
        options: ["console", "setTimeout", "window", "process"],
        correct: 2,
        explanation: "`window` belongs to browser environments and does not exist in backend Node.js."
    },
    {
        question: "What is the output priority order between `process.nextTick()` and `setTimeout(..., 0)`?",
        options: [
            "`setTimeout` runs before `process.nextTick`",
            "`process.nextTick` runs in the microtask queue before macrotask timers",
            "They always execute at random unpredictable intervals",
            "Both execute synchronously before console.log"
        ],
        correct: 1,
        explanation: "`process.nextTick()` queues callbacks in the microtask queue, executing before macrotask timers like `setTimeout`."
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
    if (userAnswers[currentQuizIndex] !== null) return; // Already answered
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

// Map global click handlers for quiz navigation buttons
window.prevQuestion = window.prevQuizQuestion;
window.nextQuestion = window.nextQuizQuestion;

function showQuizResults() {
    const quizBody = document.getElementById("quiz-body");
    const quizFooter = document.querySelector(".quiz-footer");
    
    quizBody.innerHTML = `
        <div class="text-center p-4">
            <h3 class="text-gradient mb-3">Quiz Completed! 🎉</h3>
            <p class="mb-2">Your Final Score: <strong>${quizScore} / 100</strong></p>
            <p class="text-secondary mb-4">${quizScore >= 80 ? 'Outstanding mastery of Node.js fundamentals!' : 'Good effort! Review the lessons and try again to improve your score.'}</p>
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
const STORAGE_KEY = "arslan_phase2_day01_progress";

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