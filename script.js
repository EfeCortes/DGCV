const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");

menuButton?.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const hero = document.querySelector(".hero-stage");
const heroBackground = document.querySelector(".hero-background");
const heroCharacter = document.querySelector(".hero-character");
let parallaxFrame = null;
let parallaxActive = false;

function renderParallax() {
  if (!hero || !heroBackground || !heroCharacter) return;

  const rect = hero.getBoundingClientRect();
  const travel = Math.max(0, Math.min(rect.height, -rect.top));
  const characterLift = Math.min(travel * 0.1, rect.height * 0.1);
  heroBackground.style.setProperty("--parallax-bg", `${travel * 0.06}px`);
  heroCharacter.style.setProperty("--parallax-character", `${-characterLift}px`);

  if (parallaxActive) parallaxFrame = requestAnimationFrame(renderParallax);
}

function startParallax() {
  if (parallaxActive) return;
  parallaxActive = true;
  parallaxFrame = requestAnimationFrame(renderParallax);
}

function stopParallax() {
  parallaxActive = false;
  if (parallaxFrame) cancelAnimationFrame(parallaxFrame);
  parallaxFrame = null;
}

if (hero && heroBackground && heroCharacter) {
  const parallaxObserver = new IntersectionObserver(
    ([entry]) => (entry.isIntersecting ? startParallax() : stopParallax()),
    { rootMargin: "20% 0px" }
  );
  parallaxObserver.observe(hero);
  window.addEventListener("resize", renderParallax);
  startParallax();
}

document.querySelector("#year").textContent = new Date().getFullYear();
