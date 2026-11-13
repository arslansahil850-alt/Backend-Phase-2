/* ==========================================================================
   ARSLAN'S PREMIUM BACKEND LEARNING PLATFORM - DAY 04 SCRIPT
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
   3. THREE.JS 3D FILE SYSTEM & OS VISUALIZER
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

    // Create File System & OS Core Group
    const fsGroup = new THREE.Group();

    // Central Core (Operating System Kernel / Disk)
    const coreGeo = new THREE.OctahedronGeometry(1.2, 0);
    const coreMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        roughness: 0.2,
        metalness: 0.8
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    fsGroup.add(coreMesh);

    // Orbiting File/Path Nodes
    const numNodes = 4;
    const radius = 2.8;
    const fileNodes = [];

    for (let i = 0; i < numNodes; i++) {
        const angle = (i / numNodes) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        const nodeGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
        const nodeMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            roughness: 0.2,
            metalness: 0.8
        });
        const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
        nodeMesh.position.set(x, y, 0);
        fsGroup.add(nodeMesh);
        fileNodes.push(nodeMesh);

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
        fsGroup.add(line);
    }

    scene.add(fsGroup);

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

        fsGroup.rotation.y += deltaX * 0.008;
        fsGroup.rotation.x += deltaY * 0.008;

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

        fsGroup.rotation.y += deltaX * 0.008;
        fsGroup.rotation.x += deltaY * 0.008;

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
            fsGroup.rotation.y += 0.004;
            fsGroup.rotation.z += 0.002;
        }

        coreMesh.rotation.x += 0.01;
        coreMesh.rotation.y += 0.01;

        fileNodes.forEach(node => {
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
        question: "Which core Node.js module is used for interacting with the local file system?",
        options: ["os", "path", "fs", "http"],
        correct: 2,
        explanation: "The `fs` (File System) module provides APIs for interacting with the file system."
    },
    {
        question: "Do you need to run `npm install fs` before requiring the `fs` module?",
        options: [
            "Yes, all modules require external installation",
            "No, `fs` is a built-in core module",
            "Only when deploying to production servers",
            "Only on Windows operating systems"
        ],
        correct: 1,
        explanation: "The `fs` module is built directly into Node.js core and requires zero external installation."
    },
    {
        question: "What is the primary advantage of `require('fs/promises')`?",
        options: [
            "It runs file operations synchronously faster",
            "It exposes promise-based methods allowing clean `async/await` syntax",
            "It compresses files automatically",
            "It bypasses operating system security permissions"
        ],
        correct: 1,
        explanation: "`fs/promises` returns promises for all file operations, enabling modern asynchronous `async/await` handling."
    },
    {
        question: "Which module should you use to handle and resolve file paths safely across different operating systems?",
        options: ["url", "path", "os", "querystring"],
        correct: 1,
        explanation: "The `path` module handles OS-specific path separators (`\` on Windows vs `/` on macOS/Linux)."
    },
    {
        question: "What does `path.join(__dirname, 'public', 'index.html')` return?",
        options: [
            "A URL string pointing to a web server",
            "A normalized absolute path joining directory segments correctly",
            "An HTTP response status code",
            "A buffer containing the file bytes"
        ],
        correct: 1,
        explanation: "`path.join()` normalizes and joins path segments using the correct platform separator."
    },
    {
        question: "Which method in the `os` module returns total system RAM in bytes?",
        options: ["os.freemem()", "os.totalmem()", "os.ram()", "os.memory()"],
        correct: 1,
        explanation: "`os.totalmem()` returns the total amount of system memory in bytes."
    },
    {
        question: "What happens if you execute a synchronous file read method like `fs.readFileSync()` on a massive file?",
        options: [
            "It executes asynchronously in the background",
            "It blocks the single-threaded event loop until the file is fully read",
            "It automatically throws a syntax error",
            "It splits the file into streams"
        ],
        correct: 1,
        explanation: "Synchronous methods block execution entirely until the disk operation completes."
    },
    {
        question: "What does `path.extname('style.css')` return?",
        options: ["style", ".css", "css", "file"],
        correct: 1,
        explanation: "`path.extname()` returns the extension of the path, including the leading dot (`.css`)."
    },
    {
        question: "Which `fs` method creates a new folder/directory programmatically?",
        options: ["fs.createFile()", "fs.mkdir()", "fs.makeDir()", "fs.folder()"],
        correct: 1,
        explanation: "`fs.mkdir()` (or `fs.mkdirSync()`) is used to create directories."
    },
    {
        question: "What does `os.platform()` return on a Windows machine?",
        options: ["linux", "darwin", "win32", "windows"],
        correct: 2,
        explanation: "`os.platform()` returns `'win32'` for Windows operating systems."
    },
    {
        question: "How do you read a file as a readable string instead of raw Buffer bytes?",
        options: [
            "Pass `'utf8'` as the encoding argument to `fs.readFile()`",
            "Use `Buffer.toString()` manually every time",
            "Set `global.encoding = true`",
            "Files are never read as strings in Node"
        ],
        correct: 0,
        explanation: "Passing `'utf8'` as an encoding argument automatically decodes buffer bytes into a string."
    },
    {
        question: "What does `path.basename('/users/arslan/project/index.js')` return?",
        options: ["/users/arslan/project/", "index.js", ".js", "arslan"],
        correct: 1,
        explanation: "`path.basename()` extracts the last portion of a path (the filename)."
    },
    {
        question: "Which core module would you use to check CPU architecture (e.g., `x64` or `arm64`)?",
        options: ["fs", "path", "os", "process"],
        correct: 2,
        explanation: "`os.arch()` returns the operating system CPU architecture."
    },
    {
        question: "What is the purpose of the `{ recursive: true }` option in `fs.mkdir()`?",
        options: [
            "It deletes the folder recursively",
            "It creates parent directories automatically if they do not exist",
            "It runs the creation in an infinite loop",
            "It encrypts the folder contents"
        ],
        correct: 1,
        explanation: "`recursive: true` allows creating nested directories even if intermediate folders are missing."
    },
    {
        question: "Why is hardcoding path strings with forward slashes (`/`) risky in backend development?",
        options: [
            "It causes syntax errors in JavaScript",
            "Windows uses backslashes (`\\`), which can cause path resolution failures across operating systems",
            "Forward slashes are illegal in Node filenames",
            "It violates npm security policies"
        ],
        correct: 1,
        explanation: "Windows uses backslashes (`\\`), making `path.join()` essential for cross-platform compatibility."
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
            <p class="text-secondary mb-4">${quizScore >= 80 ? 'Masterful understanding of core built-in modules!' : 'Good effort! Review the lessons on fs, path, and os and try again.'}</p>
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
const STORAGE_KEY = "arslan_phase2_day04_progress";

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