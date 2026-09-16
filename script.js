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

const professors = [
  { image: "assets/professors/lic-daniela-pacheco.jpg", name: "Mgr. Daniela Pacheco", degree: "Modalidad de graduación proyecto de grado (Grupo D1)" },
  { image: "assets/professors/lic-francisco-cortes.jpg", name: "MSc Francisco Cortés", degree: "Taller de diseño IV (Bloque A)" },
  { image: "assets/professors/lic-pablo-fajardo.jpg", name: "MSc Pablo Fajardo", degree: "Teoría y comunicación II" },
  { image: "assets/professors/arq-alex-hinojosa.jpg", name: "Arq. Alex Hinojosa", degree: "Geometría descriptiva (Bloque A y C)" },
  { image: "assets/professors/arq-marcelo-leoni.jpg", name: "Arq. Marcelo Leoni", degree: "Teoría y comunicación I (Bloque B)" },
  { image: "assets/professors/lic-patricia-saba.jpg", name: "Mgr. Patricia Saba", degree: "Expresión oral y escrita (Bloque A)" },
  { image: "assets/professors/arq-moises-anturiano.jpg", name: "Esp. Moisés Anturiano", degree: "Dibujo I (Bloque C)" },
  { image: "assets/professors/arq-diego-echevers.jpg", name: "Mgr. Diego Echevers", degree: "Teoría y metodología I (Bloque B)" },
  { image: "assets/professors/lic-carlos-paravicini.jpg", name: "Mgr. Carlos Paravicini", degree: "Modalidad de graduación proyecto de grado (Grupo C1)" },
  { image: "assets/professors/arq-alejandra-olivares.jpg", name: "Arq. Alejandra Olivares", degree: "Computación básica (Bloque A y B)" },
  { image: "assets/professors/arq-jaime-alzerreca.jpg", name: "Mgr. Jaime Alzérreca", degree: "Taller de diseño III (Bloque B)" },
  { image: "assets/professors/lic-orlando-arratia.jpg", name: "Mgr. Orlando Arratia", degree: "Teoría y metodología III" },
  { image: "assets/professors/arq-marco-macias.jpg", name: "Mgr. Marco Macías", degree: "Historia II (Bloque A)" },
  { image: "assets/professors/arq-patricia-dueri.jpg", name: "Esp. Patricia Dueri", degree: "Historia II (Bloque B)" },
  { image: "assets/professors/arq-freddy-jaldin.jpg", name: "Mgr. Freddy Jaldín", degree: "Dibujo I (Bloque B)" },
  { image: "assets/professors/lic-diego-ferreyra.jpg", name: "Esp. Diego Ferreyra", degree: "Taller de diseño I (Bloque C)" },
  { image: "assets/professors/arq-vladimir-aguilar.jpg", name: "Arq. Vladimir Aguilar", degree: "Teoría y manejo de color (Bloque A)" },
  { image: "assets/professors/arq-marcia-vargas.jpg", name: "Esp. Marcia Vargas", degree: "Teoría I (Bloque C)" },
  { image: "assets/professors/lic-juancarlos-soto.jpg", name: "Mgr. Juan Carlos Soto", degree: "Fotografía (Bloque A)" },
  { image: "assets/professors/arq-gonzalo-crespo.jpg", name: "Arq. Gonzalo Crespo", degree: "Geometría descriptiva (Bloque B)" },
  { image: "assets/professors/dr-milton-coca.jpg", name: "Dr. Milton Coca", degree: "Publicidad y marketing" },
  { image: "assets/professors/arq-micael-guzman.jpg", name: "Mgr. Micael Guzmán", degree: "Gráfica computacional I (Bloque B)" },
  { image: "assets/professors/arq-freddy-surriabre.jpg", name: "Arq. Freddy Surriabre", degree: "Historia I (Bloque B)" },
  { image: "assets/professors/lic-willy-rocabado.jpg", name: "Mgr. Willy Rocabado", degree: "Expresión oral y escrita (Bloque C)" },
  { image: "assets/professors/arq-miguel-flores.jpg", name: "Esp. Miguel Flores", degree: "Teoría y metodología I (Bloque A)" },
  { image: "assets/professors/arq-jorge-camacho.jpg", name: "Mgr. Jorge Camacho", degree: "Diseño y medio ambiente" },
  { image: "assets/professors/arq-andres-lanza.jpg", name: "Esp. Andrés Lanza", degree: "Taller de diseño IV (Bloque B)" },
  { image: "assets/professors/lic-gonzalo-tellez.jpg", name: "Mgr. Gonzalo Téllez", degree: "Tecnología para el diseño I (Bloque A)" },
  { image: "assets/professors/arq-sonia-jimenez.jpg", name: "Arq. Sonia Jiménez", degree: "Historia I (Bloque C)" },
  { image: "assets/professors/arq-edwin-magne.jpg", name: "Arq. Edwin Magne", degree: "Taller de diseño II (Bloque B)" },
  { image: "assets/professors/lic-ramiro-iglesias.jpg", name: "Dr. Ramiro Iglesias", degree: "Psicología del mensaje visual" },
  { image: "assets/professors/arq-paul-pineda.jpg", name: "Arq. Paul Pineda", degree: "Computación básica (Bloque C)" },
  { image: "assets/professors/arq-javier-tapia.jpg", name: "Mgr. Javier Tapia", degree: "Taller de diseño I (Bloque A)" },
  { image: "assets/professors/arq-fernando-zerain.jpg", name: "Esp. Fernando Zerain", degree: "Fotografía (Bloque B)" },
  { image: "assets/professors/lic-marcela-aguilar-.jpg", name: "Mgr. Marcela Aguilar", degree: "Expresión oral y escrita (Bloque B)" },
  { image: "assets/professors/arq-juancarlos-prudencio.jpg", name: "Arq. Juan Carlos Prudencio", degree: "Tecnología para el diseño I (Bloque B)" },
  { image: "assets/professors/arq-cesar-estrada.jpg", name: "Arq. Cesar Estrada", degree: "Teoría y comunicación I (Bloque A)" },
  { image: "assets/professors/arq-william-camacho.jpg", name: "Arq. William Camacho", degree: "Dibujo I (Bloque A)" },
  { image: "assets/professors/lic-german-torrez.jpg", name: "Lic. Germán Torrez", degree: "Teoría I (Bloque B)" },
  { image: "assets/professors/arq-jaime-valdivia.jpg", name: "Arq. Jaime Valdivia", degree: "Teoría I (Bloque A)" },
  { image: "assets/professors/arq-joseluis-almaraz.jpg", name: "Arq. José Luis Almaraz", degree: "Gráfica computacional I (Bloque A)" },
  { image: "assets/professors/arq-marcelo-merbas.jpg", name: "Esp. Marcelo Herbas", degree: "Historia I (Bloque A)" },
];

const professorsTrack = document.querySelector(".professors-track");
if (professorsTrack) {
  const cards = professors.map((professor) => {
    return `
      <article class="professor-card">
        <img src="${encodeURI(professor.image)}" alt="${professor.name}" loading="lazy" />
        <span><strong>${professor.name}</strong></span>
      </article>
    `;
  });
  professorsTrack.innerHTML = cards.join("");

  const carousel = professorsTrack.closest(".professors-carousel");
  const controls = document.querySelectorAll("[data-professor-direction]");
  const state = { index: 0, startX: 0, pointerId: null };

  function visibleProfessorCount() {
    const width = window.innerWidth;
    if (width <= 560) return 1;
    if (width <= 780) return 2;
    if (width <= 1100) return 3;
    return 4;
  }

  function maxProfessorIndex() {
    return Math.max(0, professors.length - visibleProfessorCount());
  }

  function updateProfessorCarousel() {
    const card = professorsTrack.querySelector(".professor-card");
    if (!card) return;

    state.index = Math.max(0, Math.min(state.index, maxProfessorIndex()));
    const gap = parseFloat(getComputedStyle(professorsTrack).gap) || 0;
    const step = card.getBoundingClientRect().width + gap;
    professorsTrack.style.transform = `translate3d(${-state.index * step}px, 0, 0)`;
  }

  function moveProfessors(direction) {
    const maxIndex = maxProfessorIndex();
    state.index += direction * visibleProfessorCount();
    if (state.index > maxIndex) state.index = 0;
    if (state.index < 0) state.index = maxIndex;
    updateProfessorCarousel();
  }

  controls.forEach((button) => {
    button.addEventListener("click", () => moveProfessors(Number(button.dataset.professorDirection)));
  });

  carousel?.addEventListener("pointerdown", (event) => {
    state.startX = event.clientX;
    state.pointerId = event.pointerId;
    carousel.setPointerCapture(event.pointerId);
  });

  carousel?.addEventListener("pointerup", (event) => {
    if (state.pointerId !== event.pointerId) return;
    const distance = event.clientX - state.startX;
    if (Math.abs(distance) > 45) moveProfessors(distance < 0 ? 1 : -1);
    state.pointerId = null;
  });

  carousel?.addEventListener("pointercancel", () => {
    state.pointerId = null;
  });

  window.addEventListener("resize", updateProfessorCarousel);
  updateProfessorCarousel();
}

const parallaxScenes = Array.from(document.querySelectorAll(".scroll-scene")).map((scene) => ({
  scene,
  stage: scene.querySelector(".parallax-stage"),
  background: scene.querySelector(".parallax-bg"),
  characters: scene.querySelector(".parallax-characters"),
  content: scene.querySelector(".scroll-content"),
}));
let parallaxFrame = null;
const requestParallaxFrame = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 16));

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function progressBetween(progress, start, end) {
  return clamp((progress - start) / (end - start));
}

function renderParallax() {
  parallaxScenes.forEach(({ scene, stage, background, characters, content }) => {
    if (!stage || !background || !characters || !content) return;

    const rect = scene.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
    const isContact = scene.classList.contains("footer-heading");
    const growsForwardOnly = scene.classList.contains("hero") || scene.classList.contains("theme-titulation");
    const contentOverflow = Math.max(0, content.scrollHeight - viewportHeight);
    const contentScrollSegment = isContact ? 1 : 0.20;
    const overflowTravel = contentOverflow > 0 && !isContact ? contentOverflow / contentScrollSegment : 0;
    const minimumSceneHeight = viewportHeight * (isContact ? 1.55 : 2.05);
    const neededSceneHeight = isContact
      ? viewportHeight * 1.55
      : viewportHeight * 2.0 + overflowTravel;
    scene.style.minHeight = `${Math.max(minimumSceneHeight, neededSceneHeight).toFixed(0)}px`;

    const travel = Math.max(1, rect.height - viewportHeight);
    const progress = clamp(-rect.top / travel);
    const growthProgress = progressBetween(progress, isContact ? 0.08 : 0.12, isContact ? 0.28 : 0.32);
    const imageFadeProgress = progressBetween(progress, isContact ? 0.28 : 0.34, isContact ? 0.48 : 0.52);
    const contentProgress = progressBetween(progress, isContact ? 0.38 : 0.44, isContact ? 0.56 : 0.60);
    const contentScrollProgress = isContact ? 0 : progressBetween(progress, 0.76, 0.96);
    const characterScale = 1 + growthProgress * 0.3;
    const baseCharacterY = viewportHeight * (isContact ? 0.025 : 0.04);
    const characterY = growsForwardOnly
      ? 0
      : baseCharacterY + growthProgress * viewportHeight * (isContact ? 0.035 : 0.055);
    const contentY = -contentOverflow * contentScrollProgress;

    scene.style.setProperty("--image-opacity", (1 - imageFadeProgress).toFixed(4));
    scene.style.setProperty("--content-opacity", contentProgress.toFixed(4));
    scene.style.setProperty("--character-scale", characterScale.toFixed(4));
    scene.style.setProperty("--character-y", `${characterY.toFixed(2)}px`);
    scene.style.setProperty("--content-y", `${contentY.toFixed(2)}px`);
  });
}

function scheduleParallaxRender() {
  if (parallaxFrame) return;
  parallaxFrame = requestParallaxFrame(() => {
    parallaxFrame = null;
    renderParallax();
  });
}

if (parallaxScenes.length) {
  renderParallax();
  window.addEventListener("scroll", scheduleParallaxRender, { passive: true });
  window.addEventListener("resize", scheduleParallaxRender);
  window.addEventListener("load", renderParallax);
}

document.querySelector("#year").textContent = new Date().getFullYear();
