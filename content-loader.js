const UI_TEXT = {
  es: {
    menu: "Menú",
    languageLabel: "Seleccionar idioma",
    mission: "Misión",
    vision: "Visión",
    objectives: "Objetivos",
    admissionTitle: "Modalidades de admisión",
    professorsLabel: "Nuestros docentes",
    titulationTitle: "Modalidades de titulación",
    degreeCards: ["Prueba de Suficiencia Académica (PSA)", "Cursos preuniversitarios", "Admisión especial", "Adscripción", "Trabajo dirigido", "Doble titulación, Diplomado", "Tesis", "Proyecto de Grado"],
    downloadRegulation: "Descargar reglamento",
    researchDownload: "Ver resultados",
    researchCards: ["Investigación formal", "Investigación formativa", "Habilidades básicas", "Construcción conceptual", "Metodología", "Producción académica", "Habilidades digitales"],
    interactionCards: ["Prácticas preprofesionales", "Convenios", "Relevancia"],
    labsKicker: "Laboratorios – MyClub",
    labsTitle: "Espacios de producción creativa",
    magazineLabel: "Revista",
    postgraduateProgramsLabel: "Programas de posgrado",
    heroAlt: "Estudiante de Diseño Gráfico trabajando en una tableta gráfica",
  },
  qu: {
    menu: "Akllana",
    languageLabel: "Simita akllay",
    mission: "Ruwayninchik",
    vision: "Qhawariyninchik",
    objectives: "Munasqanchik",
    admissionTitle: "Yaykuna ñankuna",
    professorsLabel: "Yachachiqkuna",
    titulationTitle: "Titulación ñankuna",
    degreeCards: ["PSA", "Universidad ñawpaq cursos", "Sapaq yaykuy", "Adscripción", "Pusarisqa llamk'ay", "Doble titulación, Diplomado", "Tesis", "Proyecto de grado"],
    downloadRegulation: "Reglamento-ta uraykachiy",
    researchDownload: "Resultados nisqata qhaway",
    researchCards: ["Formal yachay mask'ay", "Formativa yachay mask'ay", "Saphichasqa yachaykuna", "Conceptual ruway", "Metodología", "Académico ruray", "Digital yachaykuna"],
    interactionCards: ["Profesión ñawpaq prácticas", "Convenios", "Importancia"],
    labsKicker: "Laboratorios – MyClub",
    labsTitle: "Kamay ruray espacios",
    magazineLabel: "Revista",
    postgraduateProgramsLabel: "Qhipa yachay programas",
    heroAlt: "Diseño Gráfico yachakuq tableta gráficapi llamk'achkan",
  },
  en: {
    menu: "Menu",
    languageLabel: "Select language",
    mission: "Mission",
    vision: "Vision",
    objectives: "Goals",
    admissionTitle: "Admission pathways",
    professorsLabel: "Our professors",
    titulationTitle: "Degree completion options",
    degreeCards: ["Academic Proficiency Test (PSA)", "Pre-university courses", "Special admission", "Internship modality", "Directed work", "Double degree, Diploma", "Thesis", "Degree project"],
    downloadRegulation: "Download regulation",
    researchDownload: "View results",
    researchCards: ["Formal research", "Formative research", "Basic skills", "Conceptual construction", "Methodology", "Academic production", "Digital skills"],
    interactionCards: ["Pre-professional practices", "Agreements", "Relevance"],
    labsKicker: "Laboratories – MyClub",
    labsTitle: "Creative production spaces",
    magazineLabel: "Magazine",
    postgraduateProgramsLabel: "Graduate programs",
    heroAlt: "Graphic Design student working with a graphics tablet",
  },
};

function readSavedLanguage() {
  try {
    return window.localStorage.getItem("dgcv-language");
  } catch {
    return null;
  }
}

function saveLanguage(language) {
  try {
    window.localStorage.setItem("dgcv-language", language);
  } catch {
    // The language switch still works when browser storage is unavailable.
  }
}

let currentLanguage = readSavedLanguage() || "es";
const contentCache = {};

const normalizeKey = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const SOFT_HYPHEN = "\u00ad";
const QUECHUA_DIGRAPHS = new Set(["ch", "ll", "ph", "th", "kh", "qh", "sh"]);
const QUECHUA_VOWELS = /[aeiouáéíóúü]/i;

function quechuaGraphemes(word) {
  const letters = Array.from(word);
  const graphemes = [];

  for (let index = 0; index < letters.length; index += 1) {
    let grapheme = letters[index];
    const pair = `${letters[index]}${letters[index + 1] || ""}`.toLowerCase();

    if (QUECHUA_DIGRAPHS.has(pair)) {
      grapheme += letters[index + 1];
      index += 1;
    }

    if (letters[index + 1] === "'" || letters[index + 1] === "’") {
      grapheme += letters[index + 1];
      index += 1;
    }

    graphemes.push(grapheme);
  }

  return graphemes;
}

function hyphenateQuechuaWord(word, minimumLength = 12) {
  if (word.length < minimumLength || word.includes("@") || /\d/.test(word)) return word;

  const graphemes = quechuaGraphemes(word);
  const vowelPositions = graphemes
    .map((grapheme, index) => (QUECHUA_VOWELS.test(grapheme) ? index : -1))
    .filter((index) => index >= 0);

  if (vowelPositions.length < 4) return word;

  const breakBefore = new Set();

  for (let index = 0; index < vowelPositions.length - 1; index += 1) {
    const currentVowel = vowelPositions[index];
    const nextVowel = vowelPositions[index + 1];
    const consonants = nextVowel - currentVowel - 1;

    if (consonants === 1) breakBefore.add(currentVowel + 1);
    if (consonants > 1) breakBefore.add(nextVowel - 1);
  }

  return graphemes
    .map((grapheme, index) => `${breakBefore.has(index) ? SOFT_HYPHEN : ""}${grapheme}`)
    .join("");
}

function applyQuechuaWordBreaks(language) {
  const root = document.querySelector("body");
  if (!root) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.parentElement?.closest("script, style")) textNodes.push(node);
  }

  textNodes.forEach((node) => {
    const cleanText = node.nodeValue.replaceAll(SOFT_HYPHEN, "");
    if (node.parentElement?.closest("h1, h2, h3")) {
      node.nodeValue = cleanText;
      return;
    }
    const minimumLength = 12;
    node.nodeValue = language === "qu"
      ? cleanText.replace(
          /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ'’]+/g,
          (word) => hyphenateQuechuaWord(word, minimumLength)
        )
      : cleanText;
  });
}

function parseMarkdown(markdown) {
  const sections = {};
  markdown.split(/^##\s+/m).slice(1).forEach((block) => {
    const [heading, ...body] = block.split("\n");
    sections[normalizeKey(heading.trim())] = body.join("\n").trim();
  });
  return sections;
}

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
}

function formatText(value, styled = false) {
  let output = escapeHtml(value || "").replace(/\s{2}\n/g, "<br>").replace(/\n/g, " ");
  if (styled) output = output.replace(/\[acento\](.*?)\[\/acento\]/gi, '<span class="word-accent">$1</span>').replace(/\[contorno\](.*?)\[\/contorno\]/gi, '<span class="word-outline">$1</span>');
  return output;
}

const listItems = (value) => (value || "").split("\n").map((line) => line.replace(/^\s*-\s*/, "").trim()).filter(Boolean);
const setText = (selector, value) => { const element = document.querySelector(selector); if (element) element.textContent = value ?? ""; };
const setHtml = (selector, value, styled = false) => { const element = document.querySelector(selector); if (element) element.innerHTML = value == null ? "" : formatText(value, styled); };
const splitOptions = (value) => (value || "").split(/;|\n/).map((item) => item.replace(/^\s*-\s*/, "").trim()).filter(Boolean);
const setMultilineText = (selector, value) => {
  const element = document.querySelector(selector);
  if (!element) return;
  element.innerHTML = (value || "").split("\n").map((line) => escapeHtml(line.trim())).filter(Boolean).join("<br>");
};

function applyGeneral(c) {
  const nav = listItems(c.navegacion);
  document.querySelectorAll(".main-nav a").forEach((link, index) => { if (nav[index]) link.textContent = nav[index]; });
  setMultilineText(".footer-name", c["nombre-institucional"]);
  setText(".footer-location", c["ubicacion-breve"]);
  const location = document.querySelector(".footer-location");
  if (location) location.href = "https://maps.app.goo.gl/VewLRrCqxAZ5EoaA8";
  setText(".footer-email", c.correo);
  setText(".footer-status", c["estado-del-sitio"]);
  const email = document.querySelector(".footer-email");
  if (email && c.correo) email.href = `mailto:${c.correo}`;
}

function applyInicio(c) {
  setHtml(".purpose-hero-title", c.titular, true);
  setText(".mission", c.mision); setText(".vision", c.vision); setText(".objectives", c.objetivos);
}

function applySection(name, c, fields) {
  setHtml(`#${name} .section-heading h1, #${name} .section-heading h2, #${name} > div > h2`, c.titular);
  setText(`#${name} .section-kicker`, c.etiqueta);
  setText(`#${name} .section-intro`, c.introduccion);
  fields.forEach((field) => setText(`#${name} [data-field="${field}"]`, c[field]));
}

function applyLicenciatura(c) {
  applySection("licenciatura", c, ["formacion", "admision-psa", "admision-preuniversitario", "admision-especial", "requisitos", "docentes", "adscripcion", "trabajo-dirigido", "diplomado", "tesis", "proyecto-de-grado"]);
  const requirements = document.querySelector('[data-field="requisitos"]');
  if (requirements) {
    const requirementText = (c.requisitos || "").replace(/^[^:]+:\s*/, "").replace(/\.$/, "");
    requirements.innerHTML = requirementText
      .split(/;|\n|,\s*/)
      .map((item) => item.replace(/^\s*-\s*/, "").trim())
      .filter(Boolean)
      .map((item) => `<span>${escapeHtml(item)}</span>`)
      .join("");
  }
}

function applyContacto(c) {
  setHtml(".contact-title", c.titular);
  setText(".contact-description", c.descripcion);
  setText(".contact-phone", c.numero);
  const phoneLink = document.querySelector(".contact-phone");
  if (phoneLink && c.numero) {
    const digits = c.numero.replace(/[^\d]/g, "");
    phoneLink.href = `https://wa.me/${digits}`;
  }
  setText(".footer-email", c.correo);
}

function applyInterface(language) {
  const text = UI_TEXT[language];
  document.documentElement.lang = language;
  setText(".menu-label", text.menu);
  setText(".mission-title", text.mission);
  setText(".vision-title", text.vision);
  setText(".objectives-title", text.objectives);
  setText(".professors-label", text.professorsLabel);
  setText("#laboratorios .section-kicker", text.labsKicker);
  setText("#laboratorios .section-heading h1", text.labsTitle);
  setText(".magazine-dropdown summary", text.magazineLabel);
  setText(".postgraduate-programs h3", text.postgraduateProgramsLabel);

  document.querySelector(".language-switcher")?.setAttribute("aria-label", text.languageLabel);
  document.querySelector("#inicio .parallax-characters")?.setAttribute("alt", text.heroAlt);
  setText(".admission-title", text.admissionTitle);
  setText(".titulation-title", text.titulationTitle);
  setText(".research-download-label", text.researchDownload);
  document.querySelectorAll(".download-button").forEach((button) => {
    button.textContent = text.downloadRegulation;
  });

  document.querySelectorAll("#licenciatura .content-card h3").forEach((heading, index) => {
    if (text.degreeCards[index]) heading.textContent = text.degreeCards[index];
  });
  document.querySelectorAll("#investigacion .feature-card h3").forEach((heading, index) => {
    if (text.researchCards[index]) heading.textContent = text.researchCards[index];
  });
  document.querySelectorAll("#interaccion .interaction-card h3").forEach((heading, index) => {
    if (text.interactionCards[index]) heading.textContent = text.interactionCards[index];
  });

  document.querySelectorAll("[data-language]").forEach((button) => {
    const active = button.dataset.language === language;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

async function loadContent(language = currentLanguage) {
  try {
    document.body.classList.add("language-loading");
    let c = contentCache[language];

    if (!c) {
      const source = window.DGCV_CONTENT?.[language];
      if (!source) throw new Error(`Contenido no disponible: ${language}`);
      const entries = Object.entries(source).map(([name, markdown]) => [
        name,
        parseMarkdown(markdown),
      ]);
      c = Object.fromEntries(entries);
      contentCache[language] = c;
    }

    applyGeneral(c.general); applyInicio(c.inicio); applyLicenciatura(c.licenciatura);
    applySection("investigacion", c.investigacion, ["investigacion-formal", "investigacion-formativa", "habilidades-basicas", "construccion-conceptual", "metodologia", "produccion-academica", "habilidades-digitales"]);
    applySection("interaccion", c.interaccion, ["practicas-preprofesionales", "convenios", "relevancia-practicas"]);
    ["laboratorios-myclub", "relevancia-laboratorio"].forEach((field) => setText(`#laboratorios [data-field="${field}"]`, c.interaccion[field]));
    applySection("posgrado", c.posgrado, ["descripcion", "requisitos-licenciatura", "requisitos-titulacion", "programas", "oferta-de-diplomados"]);
    setHtml("#posgrado h2", c.posgrado.titular);
    const postgraduatePrograms = document.querySelector(".postgraduate-programs ul");
    if (postgraduatePrograms) {
      postgraduatePrograms.innerHTML = splitOptions(c.posgrado.programas).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    }
    setText("#posgrado .status-text", c.posgrado.estado);
    const postgraduateEmail = document.querySelector(".postgraduate-email");
    if (postgraduateEmail && c.posgrado["correo-posgrado"]) postgraduateEmail.href = `mailto:${c.posgrado["correo-posgrado"]}`;
    applyContacto(c.contacto);
    applyInterface(language);
    applyQuechuaWordBreaks(language);
    currentLanguage = language;
    saveLanguage(language);
  } catch (error) {
    console.error("No se pudo cargar el contenido Markdown:", error);
  } finally {
    document.body.classList.remove("language-loading");
  }
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-language]");
  if (!button) return;
  event.preventDefault();
  loadContent(button.dataset.language);
});

loadContent();
