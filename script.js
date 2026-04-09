/* ================= SIDEBAR MENU ================= */
function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("menuOverlay");
    
    if(sidebar.classList.contains("active")) {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
    } else {
        sidebar.classList.add("active");
        overlay.classList.add("active");
    }
}

/* ================= SCROLL REVEAL ANIMATION ================= */
window.addEventListener('scroll', reveal);
function reveal() {
    var reveals = document.querySelectorAll('.reveal');
    for (var i = 0; i < reveals.length; i++) {
        var windowheight = window.innerHeight;
        var revealtop = reveals[i].getBoundingClientRect().top;
        var revealpoint = 150;
        if (revealtop < windowheight - revealpoint) {
            reveals[i].classList.add('active');
        }
    }
}
reveal(); // Trigger once on load

/* ================= AI ASSISTANT LOGIC ================= */
function toggleAI() {
    const window = document.getElementById("aiChatWindow");
    const msgs = document.getElementById("aiMessages");
    if (window.style.display === "flex") {
        window.style.display = "none";
    } else {
        window.style.display = "flex";
        if(msgs.children.length === 0) {
            addAiMessage("bot", "Welcome! I can help you find events, register external teams, or connect with other students.");
        }
    }
}

function sendAiMessage() {
    const input = document.getElementById("aiInput");
    const text = input.value;
    if(!text) return;
    
    addAiMessage("user", text);
    input.value = "";

    setTimeout(() => {
        let response = "Please check the specific pages for more details.";
        if(text.toLowerCase().includes("register")) response = "You can register as an Attendee or External Team on the Register page.";
        if(text.toLowerCase().includes("team")) response = "External teams can propose events to be hosted at partner universities.";
        addAiMessage("bot", response);
    }, 1000);
}

function addAiMessage(sender, text) {
    const msgs = document.getElementById("aiMessages");
    const div = document.createElement("div");
    div.classList.add("ai-msg", sender === "bot" ? "bot-msg" : "user-msg");
    div.innerText = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}

/* ================= STATS COUNTER ================= */
const statsSection = document.querySelector('.stats-section');
const counters = document.querySelectorAll('.stat-number');
let started = false;

if(statsSection) {
    window.addEventListener('scroll', () => {
        const sectionTop = statsSection.getBoundingClientRect().top;
        if(sectionTop < window.innerHeight - 100 && !started) {
            counters.forEach(counter => {
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / 200;
                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target + "+";
                    }
                };
                updateCount();
            });
            started = true;
        }
    });
}

/* ================= AUTH & FORMS ================= */
function handleBiometricLogin() {
    if (!window.PublicKeyCredential) {
        alert("Biometrics not supported on this device.");
        return;
    }
    alert("Scanning FaceID / TouchID...");
    setTimeout(() => {
        alert("Authenticated! Welcome back.");
        window.location.href = "index.html";
    }, 1500);
}

function switchRegTab(type) {
    const attendeeForm = document.getElementById("attendeeForm");
    const hostForm = document.getElementById("hostForm");
    const tabs = document.querySelectorAll(".tab-btn");
    
    if(!attendeeForm) return;

    tabs.forEach(t => t.classList.remove("active"));
    
    if (type === 'attendee') {
        attendeeForm.style.display = "block";
        hostForm.style.display = "none";
        tabs[0].classList.add("active");
    } else {
        attendeeForm.style.display = "none";
        hostForm.style.display = "block";
        tabs[1].classList.add("active");
    }
}

function switchAuth() {
    const login = document.getElementById("loginForm");
    const signup = document.getElementById("signupForm");
    const title = document.getElementById("authTitle");
    
    if(!login) return;

    if (login.style.display === "none") {
        login.style.display = "block";
        signup.style.display = "none";
        title.innerText = "LOGIN";
    } else {
        login.style.display = "none";
        signup.style.display = "block";
        title.innerText = "SIGN UP";
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    alert("Success! We will be in touch shortly.");
    event.target.reset();
}

/* ================= CHAT MOCK ================= */
function sendCommunityMessage(event) {
    event.preventDefault();
    const input = document.getElementById("commInput");
    const feed = document.getElementById("commFeed");
    const text = input.value;
    
    if(!text) return;

    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message");
    msgDiv.innerHTML = `<div class="author">You</div><div class="text">${text}</div>`;
    feed.appendChild(msgDiv);
    input.value = "";
    feed.scrollTop = feed.scrollHeight;
}

/* ================= TICKET SEATS ================= */
if (document.getElementById("seats")) {
    const seatsContainer = document.getElementById("seats");
    const countEl = document.getElementById("count");
    const totalEl = document.getElementById("total");
    const tiers = document.querySelectorAll(".tier");
    let ticketPrice = 800;

    function generateSeats(rows, cols) {
        seatsContainer.innerHTML = "";
        seatsContainer.style.gridTemplateColumns = `repeat(${cols}, auto)`;
        for (let i = 0; i < rows * cols; i++) {
            const seat = document.createElement("div");
            seat.classList.add("seat");
            seat.style.animationDelay = `${i * 10}ms`; // Staggered animation
            if (Math.random() < 0.15) seat.classList.add("booked");
            seat.addEventListener("click", () => {
                if (!seat.classList.contains("booked")) {
                    seat.classList.toggle("selected");
                    updateTotal();
                }
            });
            seatsContainer.appendChild(seat);
        }
        updateTotal();
    }

    function updateTotal() {
        const selectedSeats = document.querySelectorAll(".seat.selected");
        if(countEl) countEl.innerText = selectedSeats.length;
        if(totalEl) totalEl.innerText = selectedSeats.length * ticketPrice;
    }

    tiers.forEach(tier => {
        tier.addEventListener("click", () => {
            tiers.forEach(t => t.classList.remove("active"));
            tier.classList.add("active");
            ticketPrice = +tier.getAttribute("data-price");
            generateSeats(tier.getAttribute("data-rows"), tier.getAttribute("data-cols"));
        });
    });
    generateSeats(6, 6);
}
function updateCartNumber() {
    const cart = JSON.parse(localStorage.getItem('eventOrgCart')) || [];
    const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    const display = document.getElementById('globalCartCount');
    if (display) {
        display.innerText = totalItems;
    }
}

// Initial update on load
window.addEventListener('load', updateCartNumber);
// Sync across tabs/pages
window.addEventListener('storage', updateCartNumber);
