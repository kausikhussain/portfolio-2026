// Theme Toggle Setup
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const themeIcon = themeToggle.querySelector("i");

const savedTheme = localStorage.getItem("portfolio-theme");

// Set initial theme state (Default: Dark Mode if not set)
if (savedTheme === "light") {
  body.classList.remove("dark-mode");
  themeIcon.classList.remove("fa-sun");
  themeIcon.classList.add("fa-moon");
} else {
  body.classList.add("dark-mode");
  themeIcon.classList.remove("fa-moon");
  themeIcon.classList.add("fa-sun");
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("portfolio-theme", "dark");
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  } else {
    localStorage.setItem("portfolio-theme", "light");
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  }
  // Let the particle system know theme changed
  initParticleColor();
});

// Scroll Progress Tracker
const scrollProgress = document.getElementById("scrollProgress");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) {
    scrollProgress.style.width = `${scrollPercent}%`;
  }
});

// Scroll Reveal Animations
const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
  revealElements.forEach((element) => {
    const top = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (top < windowHeight - 80) {
      element.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// 3D Tilt Card Effect
const tiltCards = document.querySelectorAll(".tilt-card");

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  });
});

// Dynamic Localized Mouse Hover Glow Coordinates
const glowCards = document.querySelectorAll(".tilt-card, .stat-card, .info-card, .project-card, .skill-card, .contact-box");

glowCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  });
});

// --- NEW UPGRADE 1: Typewriter Animation ---
const typewriterElement = document.getElementById("typewriter");
const words = ["scalable real-time applications.", "AI-powered systems.", "impactful digital products."];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 80;

function typeAnimation() {
  const currentWord = words[wordIndex];
  
  if (isDeleting) {
    typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = 40; // delete faster
  } else {
    typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
    typingSpeed = 90; // type normal
  }

  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    typingSpeed = 2000; // pause at completion
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    typingSpeed = 500; // pause before next word
  }

  setTimeout(typeAnimation, typingSpeed);
}

if (typewriterElement) {
  setTimeout(typeAnimation, 1000);
}

// --- NEW UPGRADE 2: Skills Category Filter ---
const filterButtons = document.querySelectorAll(".filter-btn");
const skillCards = document.querySelectorAll(".skill-card");
const categoryTitles = document.querySelectorAll(".category-group");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active from all buttons
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.getAttribute("data-filter");

    // Handle Title visibility
    if (category === "all") {
      categoryTitles.forEach((title) => title.classList.remove("hidden"));
    } else {
      categoryTitles.forEach((title) => title.classList.add("hidden"));
    }

    // Handle Card visibility
    skillCards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category");
      if (category === "all" || cardCategory === category) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });

    // Re-trigger scroll reveal for any newly revealed elements
    revealOnScroll();
  });
});

// --- NEW UPGRADE 3: HTML5 Canvas Particle System ---
const canvas = document.getElementById("bg-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

let particles = [];
let maxParticles = 60;
let particleColor = "rgba(0, 229, 255, 0.25)";
let lineColor = "rgba(0, 229, 255, 0.06)";
let mouse = { x: null, y: null, radius: 150 };

function initParticleColor() {
  const isDark = document.body.classList.contains("dark-mode");
  particleColor = isDark ? "rgba(0, 229, 255, 0.25)" : "rgba(0, 119, 255, 0.22)";
  lineColor = isDark ? "rgba(0, 229, 255, 0.08)" : "rgba(0, 119, 255, 0.06)";
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  maxParticles = window.innerWidth < 768 ? 25 : 70; // Fewer particles on mobile for performance
}

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.size = Math.random() * 2 + 1;
  }

  update() {
    // Basic boundaries
    if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
    if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

    // Gentle floating
    this.x += this.vx;
    this.y += this.vy;

    // Interact with mouse (hover effect)
    if (mouse.x !== null && mouse.y !== null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        // Slowly pull particles toward mouse
        const force = (mouse.radius - dist) / mouse.radius;
        this.x += (dx / dist) * force * 0.4;
        this.y += (dy / dist) * force * 0.4;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = particleColor;
    ctx.fill();
  }
}

function createParticles() {
  particles = [];
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      // Adjust link distance based on viewport
      const threshold = window.innerWidth < 768 ? 95 : 135;

      if (dist < threshold) {
        // Draw lines fading based on proximity
        const opacity = (threshold - dist) / threshold * 0.75;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        
        // Color mix transitions
        ctx.strokeStyle = lineColor.replace(/[\d\.]+\)$/, `${opacity * 0.12})`);
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  
  connectParticles();
  requestAnimationFrame(animate);
}

// Initialize the particle system after all classes/functions are declared
if (canvas && ctx) {
  resizeCanvas();
  initParticleColor();
  createParticles();
  animate();

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseout", () => {
    mouse.x = null;
    mouse.y = null;
  });
}

// --- NEW UPGRADE 4: Video Hover Autoplay Handler ---
const videosList = document.querySelectorAll(".project-video");

videosList.forEach((video) => {
  const card = video.closest(".project-card, .featured-project");
  
  // Set up automatic first-frame preview for videos without poster images
  if (video && !video.getAttribute("poster")) {
    const setFirstFrame = () => {
      try {
        if (video.currentTime === 0) {
          video.currentTime = 0.1;
        }
      } catch (e) {
        console.warn("Could not preview first frame:", e);
      }
    };

    if (video.readyState >= 1) {
      setFirstFrame();
    } else {
      video.addEventListener("loadedmetadata", setFirstFrame, { once: true });
    }
  }

  if (card) {
    let playPromise = null;
    const badge = card.querySelector(".video-badge");

    card.addEventListener("mouseenter", () => {
      // Safely reset currentTime to start of video only if metadata is ready
      if (video.readyState >= 1) {
        try {
          video.currentTime = 0;
        } catch (e) {
          console.warn("Could not reset video playback time:", e);
        }
      }
      
      // Track play Promise to avoid interrupting it mid-execution
      playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            card.classList.add("video-playing");
            if (badge) {
              badge.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Playing`;
            }
          })
          .catch((err) => {
            console.log("Auto-play blocked or failed:", err);
          });
      }
    });

    card.addEventListener("mouseleave", () => {
      const stopVideo = () => {
        video.pause();
        card.classList.remove("video-playing");
        if (badge) {
          badge.innerHTML = `<i class="fa-solid fa-play"></i> Hover to Preview`;
        }
        
        // Reset to first frame (or 0.1 for posterless) for next preview
        if (video.readyState >= 1) {
          try {
            video.currentTime = video.getAttribute("poster") ? 0 : 0.1;
          } catch (e) {
            console.warn("Could not reset video playback time:", e);
          }
        }
      };

      if (playPromise !== undefined && playPromise !== null) {
        playPromise
          .then(() => {
            stopVideo();
          })
          .catch(() => {
            // Still pause if the play request failed or was aborted
            stopVideo();
          });
      } else {
        stopVideo();
      }
    });

    // Toggle play/pause on clicking the video container
    const videoContainer = video.parentElement;
    if (videoContainer) {
      videoContainer.style.cursor = "pointer";
      videoContainer.addEventListener("click", (e) => {
        // Ignore clicks if clicking inside a link
        if (e.target.tagName === 'A') return;
        
        if (video.paused) {
          if (video.readyState >= 1) {
            try {
              video.currentTime = 0;
            } catch (err) {}
          }
          playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                card.classList.add("video-playing");
                if (badge) {
                  badge.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Playing`;
                }
              })
              .catch((err) => {
                console.log("Play failed on click:", err);
              });
          }
        } else {
          video.pause();
          card.classList.remove("video-playing");
          if (badge) {
            badge.innerHTML = `<i class="fa-solid fa-play"></i> Hover to Preview`;
          }
        }
      });
    }
  }
});

// --- NEW UPGRADE 5: Custom Trailing Cyber Cursor ---
const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");

if (cursorDot && cursorRing) {
  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;
  
  // Track mouse coordinates
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Fade in on first movement
    cursorDot.style.opacity = "1";
    cursorRing.style.opacity = "1";
    
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Smooth animation loop for the trailing ring (lag inertia)
  function animateCursor() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  
  // Start trailing loop
  animateCursor();

  // Hover states for interactive items
  const interactiveItems = document.querySelectorAll("a, button, .project-card, .featured-project, .skill-card, .timeline-content, .filter-btn, .proj-filter-btn");
  
  interactiveItems.forEach(item => {
    item.addEventListener("mouseenter", () => {
      cursorRing.style.width = "48px";
      cursorRing.style.height = "48px";
      cursorRing.style.borderColor = "var(--accent)";
      cursorRing.style.backgroundColor = "rgba(0, 229, 255, 0.05)";
      cursorDot.style.transform = "translate(-50%, -50%) scale(1.5)";
    });
    
    item.addEventListener("mouseleave", () => {
      cursorRing.style.width = "32px";
      cursorRing.style.height = "32px";
      cursorRing.style.borderColor = "var(--accent2)";
      cursorRing.style.backgroundColor = "transparent";
      cursorDot.style.transform = "translate(-50%, -50%) scale(1)";
    });
  });
}

// --- NEW UPGRADE 6: Projects Grid Category Filter ---
const projFilterButtons = document.querySelectorAll(".proj-filter-btn");
const projectCards = document.querySelectorAll(".project-filter-card");

if (projFilterButtons.length > 0 && projectCards.length > 0) {
  projFilterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active state
      projFilterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const cardCategories = card.getAttribute("data-category") || "";
        if (category === "all" || cardCategories.includes(category)) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });

      // Re-trigger scroll reveal transitions
      revealOnScroll();
    });
  });
}
