// ============================================================
//  Beauty Lab by Elena Spyridaki — static site generator
//  Run:  node build/build.mjs
// ============================================================
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { BASE, BIZ, SERVICES, AREAS, POSTS, MACHINES, BOOKING, OFFERS } from "./data.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = (p, html) => {
  const full = resolve(ROOT, p);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html.trimStart() + "\n");
};

// depth-aware helpers -------------------------------------------------
// pathDepth = number of "../" needed to reach site root
const rel = (depth, p) => "../".repeat(depth) + p;
const abs = (p) => `${BASE}/${p}`;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const attr = (s) => esc(s).replace(/"/g, "&quot;");

// ---- inline line-art icons (hero pillars & misc) ---------------------
// Λεπτή γραμμή, στο ίδιο ύφος με το λογότυπο (κωνική φιάλη με λουλούδι).
const svg = (vb, body) =>
  `<svg class="ico" viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

const ICONS = {
  // Προφίλ προσώπου με λάμψη — αισθητική προσώπου
  face: svg(
    "0 0 34 44",
    `<path d="M19.6 41.5v-5c0-1.2.7-2 1.9-2.3 1.7-.5 2.6-1.6 2.6-3.2v-2.2h1.9c1.2 0 1.8-.9 1.3-1.9l-2.6-5.2c.3-1.4.4-2.7.4-4C25.1 11 20.6 6.4 14.7 6.4S4.3 11 4.3 17.7c0 3.8 1.4 6.7 4 8.6 1.2.9 1.7 1.9 1.7 3.3v11.9"/>
     <path d="m28.6 3.2 1 2.3 2.3 1-2.3 1-1 2.3-1-2.3-2.3-1 2.3-1z"/>`
  ),
  // Σιλουέτα σώματος — θεραπείες σώματος
  body: svg(
    "0 0 34 44",
    `<path d="M11.4 3.5c-2.6 5.1-2.5 9.3.2 12.7 2.8 3.5 2.9 7 .3 10.4-2.4 3.1-3 6.9-1.9 14.4"/>
     <path d="M22.6 3.5c2.6 5.1 2.5 9.3-.2 12.7-2.8 3.5-2.9 7-.3 10.4 2.4 3.1 3 6.9 1.9 14.4"/>`
  ),
  // Φύλλο — διατροφή & ευεξία
  leaf: svg(
    "0 0 34 44",
    `<path d="M8.4 40.5C3.6 24.6 9.4 8.9 30.2 5.6c2.4 20.3-7.4 29.9-20.3 32-1.4.2-2.2 1-3 3"/>
     <path d="M9.6 36.5C13.4 26.6 20 17.9 29.2 11"/>`
  ),
  // Δείκτης τοποθεσίας
  pin: `<svg class="ico-pin" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2.2a7 7 0 0 0-7 7c0 5 7 12.6 7 12.6s7-7.6 7-12.6a7 7 0 0 0-7-7Zm0 9.6a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Z"/></svg>`,
  // Βέλος κύλισης
  arrowDown: `<svg class="ico-arrow" viewBox="0 0 16 34" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M8 2v29M2.5 25.5 8 31.5l5.5-6"/></svg>`,
};

// ---- structured data: the studio (LocalBusiness / BeautySalon) -------
const studioLD = {
  "@type": ["BeautySalon", "HealthAndBeautyBusiness", "LocalBusiness"],
  "@id": `${BASE}/#studio`,
  name: BIZ.name,
  alternateName: BIZ.legalName,
  slogan: BIZ.tagline,
  url: BASE + "/",
  telephone: BIZ.phoneIntl,
  email: BIZ.email,
  image: abs("assets/logo.jpg"),
  logo: abs("assets/logo.jpg"),
  priceRange: "€€",
  currenciesAccepted: "EUR",
  foundingDate: "2008",
  address: {
    "@type": "PostalAddress",
    streetAddress: BIZ.street,
    addressLocality: BIZ.area,
    addressRegion: BIZ.region,
    postalCode: BIZ.postal,
    addressCountry: BIZ.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: BIZ.lat, longitude: BIZ.lng },
  hasMap: `https://www.google.com/maps?q=${encodeURIComponent(BIZ.street + ", " + BIZ.area + " " + BIZ.postal)}`,
  areaServed: ["Σητεία", "Παλαίκαστρο", "Ζάκρος", "Μακρύς Γιαλός", "Ιεράπετρα", "Άγιος Νικόλαος", "Λασίθι", "Κρήτη"],
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Wednesday"], opens: "16:00", closes: "21:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Thursday", "Friday"], opens: "09:15", closes: "17:30" },
  ],
  sameAs: [BIZ.instagram, BIZ.facebook],
  founder: {
    "@type": "Person",
    name: BIZ.doctor,
    alternateName: BIZ.doctorEn,
    jobTitle: BIZ.role,
  },
};

const jsonLd = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;

const breadcrumbLD = (depth, trail) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.name,
    item: t.path ? abs(t.path) : undefined,
  })),
});

const faqLD = (faq) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
});

// ---- <head> ---------------------------------------------------------
function head({ depth, title, desc, canonical, keywords, ld = [], image = "assets/logo.jpg", type = "website", bodyClass = "" }) {
  const r = (p) => rel(depth, p);
  const ldTags = ld.map(jsonLd).join("\n  ");
  return `
<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${attr(desc)}" />
  ${keywords ? `<meta name="keywords" content="${attr(keywords)}" />` : ""}
  <meta name="author" content="${attr(BIZ.legalName)}" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="theme-color" content="#fdfaf7" />
  <link rel="canonical" href="${abs(canonical)}" />

  <meta property="og:site_name" content="${attr(BIZ.name)}" />
  <meta property="og:locale" content="el_GR" />
  <meta property="og:type" content="${type}" />
  <meta property="og:title" content="${attr(title)}" />
  <meta property="og:description" content="${attr(desc)}" />
  <meta property="og:url" content="${abs(canonical)}" />
  <meta property="og:image" content="${abs(image)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${attr(title)}" />
  <meta name="twitter:description" content="${attr(desc)}" />
  <meta name="twitter:image" content="${abs(image)}" />

  <link rel="icon" type="image/png" href="${r("assets/logo.png")}" />
  <link rel="apple-touch-icon" href="${r("assets/logo.png")}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${r("styles.css")}" />
  ${ldTags ? "\n  " + ldTags : ""}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ""}>`;
}

// ---- header ---------------------------------------------------------
function header(depth, active = "") {
  const r = (p) => rel(depth, p);
  const on = (k) => (active === k ? ' aria-current="page"' : "");
  const svcLinks = SERVICES.map(
    (s) => `<li><a href="${r("ypiresies/" + s.slug + ".html")}">${esc(s.nav)}</a></li>`
  ).join("\n            ");
  return `
  <a class="skip-link" href="#main">Μετάβαση στο περιεχόμενο</a>
  <header class="site-header${active === "home" ? " site-header--home" : ""}" id="top">
    <nav class="nav container" aria-label="Κύρια πλοήγηση">
      <a href="${r("index.html")}" class="brand" aria-label="${attr(BIZ.name)}, Αρχική">
        <img src="${r("assets/logo.png")}" alt="${attr(BIZ.legalName)}" class="brand-logo" width="204" height="270" />
      </a>
      <button class="nav-toggle" aria-label="Άνοιγμα μενού" aria-expanded="false"><span></span><span></span><span></span></button>
      <ul class="nav-links">
        <li><a href="${r("index.html")}"${on("home")}>Αρχική</a></li>
        <li><a href="${r("i-elena.html")}"${on("about")}>Η Έλενα</a></li>
        <li class="has-sub">
          <a href="${r("ypiresies/index.html")}"${on("services")}>Υπηρεσίες</a>
          <ul class="sub">
            ${svcLinks}
          </ul>
        </li>
        ${OFFERS.length ? `<li><a href="${r("prosfores.html")}" class="nav-offers"${on("offers")}><span class="nav-offers-word"><span class="nav-offers-text">Προσφορές</span><span class="nav-offers-tag">ΝΕΕΣ</span></span></a></li>` : ""}
        <li><a href="${r("blog/index.html")}"${on("blog")}>Blog</a></li>
        <li><a href="${r("epikoinonia.html")}"${on("contact")}>Επικοινωνία</a></li>
        <li><a href="${r("ratevou.html")}" class="btn btn-nav"${on("booking")}>Ραντεβού Online</a></li>
      </ul>
    </nav>
  </header>`;
}

// ---- breadcrumb visual ---------------------------------------------
function crumbs(depth, trail) {
  const r = (p) => rel(depth, p);
  const items = trail
    .map((t, i) =>
      i === trail.length - 1
        ? `<span aria-current="page">${esc(t.name)}</span>`
        : `<a href="${r(t.rel)}">${esc(t.name)}</a><span class="sep">/</span>`
    )
    .join(" ");
  return `<nav class="crumbs container" aria-label="Breadcrumb">${items}</nav>`;
}

// ---- CTA band -------------------------------------------------------
function ctaBand(depth) {
  const r = (p) => rel(depth, p);
  return `
  <section class="cta-band">
    <div class="container cta-inner">
      <div>
        <p class="eyebrow">Κλείστε το ραντεβού σας</p>
        <h2 class="cta-title">Love your own <em>beauty.</em></h2>
        <p class="cta-sub">Λειτουργούμε κατόπιν ραντεβού. Κλείστε online σε ένα λεπτό ή καλέστε μας.</p>
      </div>
      <div class="cta-actions">
        <a href="${r("ratevou.html")}" class="btn btn-primary">Ραντεβού Online</a>
        <a href="tel:${BIZ.phoneIntl}" class="btn btn-ghost">Καλέστε ${esc(BIZ.phoneDisplay)}</a>
      </div>
    </div>
  </section>`;
}

// ---- footer ---------------------------------------------------------
function footer(depth) {
  const r = (p) => rel(depth, p);
  const svcCols = SERVICES.map(
    (s) => `<a href="${r("ypiresies/" + s.slug + ".html")}">${esc(s.nav)}</a>`
  ).join("\n          ");
  return `
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <img src="${r("assets/logo.png")}" alt="${attr(BIZ.legalName)}" class="footer-logo" width="204" height="270" />
        <p class="footer-tag">${esc(BIZ.tagline)}</p>
        <p class="footer-addr">
          ${esc(BIZ.street)}, ${esc(BIZ.area)}<br />
          ${esc(BIZ.region)}, Τ.Κ. ${esc(BIZ.postal)}
        </p>
        <div class="footer-social">
          <a href="${BIZ.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a>
          <a href="${BIZ.facebook}" target="_blank" rel="noopener noreferrer" aria-label="Facebook">Facebook</a>
        </div>
      </div>

      <div class="footer-col">
        <h3>Υπηρεσίες</h3>
        <nav aria-label="Υπηρεσίες" class="footer-links">
          ${svcCols}
        </nav>
      </div>

      <div class="footer-col">
        <h3>Εξερεύνηση</h3>
        <nav aria-label="Πλοήγηση" class="footer-links">
          <a href="${r("index.html")}">Αρχική</a>
          <a href="${r("i-elena.html")}">Η Έλενα</a>
          <a href="${r("ypiresies/index.html")}">Όλες οι Υπηρεσίες</a>
          ${OFFERS.length ? `<a href="${r("prosfores.html")}">Προσφορές</a>` : ""}
          <a href="${r("ratevou.html")}">Ραντεβού Online</a>
          <a href="${r("blog/index.html")}">Blog</a>
          <a href="${r("epikoinonia.html")}">Επικοινωνία</a>
        </nav>
      </div>

      <div class="footer-col">
        <h3>Επικοινωνία</h3>
        <nav aria-label="Επικοινωνία" class="footer-links">
          <a href="tel:${BIZ.phoneIntl}">${esc(BIZ.phoneDisplay)}</a>
          <a href="mailto:${BIZ.email}">${esc(BIZ.email)}</a>
        </nav>
        <p class="footer-hours">${BIZ.hoursShort}</p>
      </div>
    </div>

    <div class="footer-bottom">
      <p class="footer-copy">© <span id="year">2026</span> ${esc(BIZ.legalName)}. Με επιφύλαξη παντός δικαιώματος.</p>
      <p class="cb-credit">Made by <a href="https://clinicbrain.gr/?utm_source=client-site&amp;utm_medium=footer&amp;utm_campaign=made-by" target="_blank" rel="noopener noreferrer">CLINICBRAIN</a></p>
    </div>

    <p class="footer-areas">
      Εξυπηρετούμε: ${AREAS.map((a) => `<a href="${r("perioches/" + a.slug + ".html")}">${esc(a.name)}</a>`).join(" <span aria-hidden=\"true\">·</span> ")}
    </p>
  </footer>
  <script src="${r("main.js")}" defer></script>
</body>
</html>`;
}

// ---- offers ---------------------------------------------------------
function offerCard(depth, o) {
  const r = (p) => rel(depth, p);
  return `
          <a class="offer reveal" href="${r("prosfores.html#" + o.slug)}">
            ${o.neo ? '<span class="offer-neo">ΝΕΟ</span>' : ""}
            <span class="offer-icon" aria-hidden="true">${o.icon}</span>
            <h3 class="offer-title">${esc(o.title)}</h3>
            <p class="offer-lead">${esc(o.lead)}</p>
            ${o.price ? `<p class="offer-price">${esc(o.price)}</p>` : ""}
            <span class="offer-more">Μάθετε περισσότερα →</span>
          </a>`;
}

function offersSection(depth) {
  if (!OFFERS.length) return "";
  const r = (p) => rel(depth, p);
  return `
    <section class="offers" id="offers">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">Οι προσφορές μας</p>
          <h2 class="section-title">Συνδυασμοί που <em>δουλεύουν</em> μαζί</h2>
          <p class="section-lead">Δεν είναι τυχαία πακέτα. Είναι θεραπείες που η μία στηρίζει την άλλη, γι' αυτό τις προτείνουμε μαζί.</p>
        </div>
        <div class="offers-grid">${OFFERS.map((o) => offerCard(depth, o)).join("")}
        </div>
        <div class="offers-cta reveal">
          <a href="${r("prosfores.html")}" class="btn btn-ghost">Όλες οι προσφορές →</a>
        </div>
      </div>
    </section>`;
}

// ---- machines -------------------------------------------------------
function machinesSection() {
  const cards = MACHINES.map(
    (m) => `
          <article class="mach reveal">
            <p class="mach-tag">${esc(m.tag)}</p>
            <h3 class="mach-name">${esc(m.name)}</h3>
            <p class="mach-text">${esc(m.text)}</p>
          </article>`
  ).join("");
  return `
    <section class="machines" id="machines">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">Ο εξοπλισμός μας</p>
          <h2 class="section-title">Τα μηχανήματα<br />και <em>γιατί</em> το καθένα</h2>
          <p class="section-lead">Δεν αγοράσαμε μηχανήματα για να τα έχουμε. Κάθε ένα καλύπτει μια συγκεκριμένη ανάγκη που τα υπόλοιπα δεν καλύπτουν σωστά. Γι' αυτό, πριν από κάθε θεραπεία, γίνεται αξιολόγηση και επιλέγεται το κατάλληλο.</p>
        </div>
        <div class="machines-grid">${cards}
        </div>
        <p class="machines-note reveal">Το μηχάνημα από μόνο του δεν κάνει το αποτέλεσμα. Το κάνει η σωστή επιλογή, η σωστή ένταση για το δικό σας δέρμα και η συνέπεια στις συνεδρίες, και αυτά είναι δουλειά του ανθρώπου που το χειρίζεται.</p>
      </div>
    </section>`;
}

// ====================================================================
//  PAGE: HOME
// ====================================================================
function pageHome() {
  const depth = 0;
  const r = (p) => rel(depth, p);
  const svcCards = SERVICES.map(
    (s, i) => `
        <a class="svc reveal" href="${r("ypiresies/" + s.slug + ".html")}">
          <span class="svc-icon" aria-hidden="true">${s.icon}</span>
          <span class="svc-num">${String(i + 1).padStart(2, "0")}</span>
          <h3>${esc(s.h1)}</h3>
          <p>${esc(s.lead)}</p>
          <span class="svc-more">Μάθετε περισσότερα →</span>
        </a>`
  ).join("");

  const ld = [
    { "@context": "https://schema.org", ...studioLD },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: BIZ.name,
      url: BASE + "/",
      inLanguage: "el",
    },
    breadcrumbLD(depth, [{ name: "Αρχική", path: "index.html" }]),
  ];

  return head({
    depth,
    title: "Αισθητικός & Διαιτολόγος Σητεία | Beauty Lab by Elena Spyridaki",
    desc: "Beauty Lab by Elena Spyridaki, ινστιτούτο αισθητικής στη Σητεία από το 2008. Θεραπείες προσώπου & σώματος, αποτρίχωση laser Alexandrite & Diode και διαιτολογική υποστήριξη από πτυχιούχο διαιτολόγο. Κατόπιν ραντεβού.",
    canonical: "index.html",
    keywords: "αισθητικός Σητεία, ινστιτούτο αισθητικής Σητεία, διαιτολόγος Σητεία, αποτρίχωση laser Σητεία, θεραπείες προσώπου Λασίθι, αδυνάτισμα Σητεία, Έλενα Σπυριδάκη",
    ld,
  }) +
    header(depth, "home") +
    `
  <main id="main">
    <section class="hero" id="hero">
      <div class="hero-inner container">
        <img class="hero-logo reveal" src="${r("assets/logo-mark.png")}" alt="${attr(BIZ.legalName)}, Love your own beauty" width="408" height="540" fetchpriority="high" />
        <h1 class="hero-title reveal">Beauty Lab<span class="hero-title-sub">by Elena Spyridaki</span></h1>
        <p class="hero-tagline reveal">Love your own <em>beauty.</em></p>
        <ul class="hero-pillars reveal">
          <li>${ICONS.face}<span>Αισθητική Προσώπου</span></li>
          <li>${ICONS.body}<span>Θεραπείες Σώματος</span></li>
          <li>${ICONS.leaf}<span>Διατροφή &amp; Ευεξία</span></li>
        </ul>
        <p class="hero-lead reveal">Αισθητικός κοσμητολόγος και <em>διαιτολόγος</em> στον ίδιο χώρο, γιατί η ομορφιά χτίζεται και <em>απ' έξω και από μέσα</em>.</p>
        <div class="hero-actions reveal">
          <a href="${r("ratevou.html")}" class="btn btn-primary">Κλείστε Ραντεβού</a>
          <a href="${r("ypiresies/index.html")}" class="btn btn-ghost">Οι Υπηρεσίες μας</a>
        </div>
        <a class="hero-scroll" href="#about" aria-label="Μετάβαση στην επόμενη ενότητα"><span class="hero-mouse" aria-hidden="true"></span>${ICONS.arrowDown}</a>
        <p class="hero-loc">${ICONS.pin}<span>${esc(BIZ.area)}, ${esc(BIZ.region)}</span></p>
      </div>
    </section>

    <div class="strip" aria-hidden="true">
      <div class="strip-track">
        <span>Αισθητική Προσώπου</span><span class="dot">•</span>
        <span>Θεραπείες Σώματος</span><span class="dot">•</span>
        <span>Αποτρίχωση Laser</span><span class="dot">•</span>
        <span>Διαιτολογική Υποστήριξη</span><span class="dot">•</span>
        <span>Αισθητική Προσώπου</span><span class="dot">•</span>
        <span>Θεραπείες Σώματος</span><span class="dot">•</span>
        <span>Αποτρίχωση Laser</span><span class="dot">•</span>
        <span>Διαιτολογική Υποστήριξη</span><span class="dot">•</span>
      </div>
    </div>

    <section class="about" id="about">
      <div class="container about-grid">
        <div class="about-media reveal">
          <img src="${r("assets/institute.jpg")}" alt="Ο χώρος του Beauty Lab by Elena Spyridaki, ινστιτούτο αισθητικής στη Σητεία" width="682" height="387" />
        </div>
        <div class="about-copy">
          <p class="eyebrow reveal">Η Έλενα</p>
          <h2 class="section-title reveal">Έλενα Σπυριδάκη</h2>
          <p class="about-role reveal">Αισθητικός Κοσμητολόγος &amp; Διαιτολόγος</p>
          <p class="reveal">Σπούδασε αισθητική στο City College του Manchester και ολοκλήρωσε τις σπουδές της ως αισθητικός κοσμητολόγος στο ΤΕΙ Αθήνας, το σημερινό Πανεπιστήμιο Δυτικής Αττικής.</p>
          <p class="reveal">Στη συνέχεια σπούδασε διαιτολογία στο ΤΕΙ Κρήτης, το σημερινό ΕΛΜΕΠΑ (2004–2008). Ο συνδυασμός των δύο ειδικοτήτων είναι και η φιλοσοφία του Beauty Lab: η θεραπεία στην καμπίνα και το διατροφικό πλάνο σχεδιάζονται μαζί.</p>
          <p class="reveal">Με εμπειρία ως αισθητικός στο Manchester και στην Αθήνα, διδακτικό έργο στο ΕΠΑΛ Νεάπολης και στο ΙΕΚ Σητείας, διατηρεί το δικό της ινστιτούτο αισθητικής στη Σητεία από το 2008.</p>
          <a href="${r("i-elena.html")}" class="btn btn-ghost reveal">Το πλήρες βιογραφικό →</a>
        </div>
      </div>
    </section>

    <section class="services" id="services">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">Υπηρεσίες</p>
          <h2 class="section-title">Ολοκληρωμένη φροντίδα,<br />από μέσα κι <em>απ' έξω</em></h2>
        </div>
        <div class="services-grid">${svcCards}
        </div>
      </div>
    </section>
` +
    offersSection(depth) +
    machinesSection() +
    `
    <section class="philosophy" id="philosophy">
      <div class="container philosophy-inner reveal">
        <p class="eyebrow">Η Φιλοσοφία μας</p>
        <span class="philosophy-mark" aria-hidden="true">&ldquo;</span>
        <blockquote><em>Elegance is the only beauty that never fades.</em> Είσαι ό,τι τρως. Η ομορφιά χτίζεται και από μέσα.</blockquote>
        <cite class="philosophy-cite">Έλενα Σπυριδάκη · Αισθητικός Κοσμητολόγος &amp; Διαιτολόγος</cite>
      </div>
    </section>
  </main>` +
    ctaBand(depth) +
    footer(depth);
}

// ====================================================================
//  PAGE: ABOUT
// ====================================================================
function pageAbout() {
  const depth = 0;
  const r = (p) => rel(depth, p);
  const trail = [
    { name: "Αρχική", rel: "index.html", path: "index.html" },
    { name: "Η Έλενα", rel: "i-elena.html", path: "i-elena.html" },
  ];
  const ld = [
    breadcrumbLD(depth, trail),
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: BIZ.doctor,
      alternateName: BIZ.doctorEn,
      jobTitle: BIZ.role,
      image: abs("assets/institute.jpg"),
      url: abs("i-elena.html"),
      alumniOf: [
        "City College Manchester",
        "ΤΕΙ Αθήνας, Πανεπιστήμιο Δυτικής Αττικής (ΠΑΔΑ)",
        "ΤΕΙ Κρήτης, Ελληνικό Μεσογειακό Πανεπιστήμιο (ΕΛΜΕΠΑ)",
      ],
      worksFor: { "@id": `${BASE}/#studio` },
      sameAs: [BIZ.instagram, BIZ.facebook],
    },
  ];
  return head({
    depth,
    title: "Έλενα Σπυριδάκη, Αισθητικός Κοσμητολόγος & Διαιτολόγος | Beauty Lab",
    desc: "Γνωρίστε την Έλενα Σπυριδάκη: σπουδές αισθητικής στο Manchester και στο ΤΕΙ Αθήνας (ΠΑΔΑ), διαιτολογία στο ΕΛΜΕΠΑ, διδακτικό έργο και δικό της ινστιτούτο αισθητικής στη Σητεία από το 2008.",
    canonical: "i-elena.html",
    keywords: "Έλενα Σπυριδάκη, αισθητικός κοσμητολόγος Σητεία, διαιτολόγος Σητεία, βιογραφικό αισθητικού, Beauty Lab Σητεία",
    image: "assets/institute.jpg",
    ld,
    type: "profile",
  }) +
    header(depth, "about") +
    crumbs(depth, trail) +
    `
  <main id="main">
    <section class="about about-page">
      <div class="container about-grid">
        <div class="about-media reveal">
          <img src="${r("assets/institute.jpg")}" alt="Ο χώρος του Beauty Lab στη Σητεία" width="682" height="387" />
        </div>
        <div class="about-copy">
          <p class="eyebrow reveal">Η Έλενα</p>
          <h1 class="section-title reveal">Έλενα Σπυριδάκη</h1>
          <p class="about-role reveal">Αισθητικός Κοσμητολόγος &amp; Διαιτολόγος</p>
          <p class="reveal">Η διαδρομή της ξεκίνησε στην Αγγλία, με σπουδές αισθητικής στο City College του Manchester και παράλληλη εκπαίδευση στη φυσική αγωγή στο University of Salford.</p>
          <p class="reveal">Ολοκλήρωσε τις σπουδές της ως αισθητικός κοσμητολόγος στο ΤΕΙ Αθήνας, το σημερινό Πανεπιστήμιο Δυτικής Αττικής (ΠΑΔΑ). Στη συνέχεια σπούδασε διαιτολογία στο ΤΕΙ Κρήτης, το σημερινό Ελληνικό Μεσογειακό Πανεπιστήμιο (ΕΛΜΕΠΑ), από το 2004 έως το 2008.</p>
          <p class="reveal">Εργάστηκε ως αισθητικός στο Manchester το 1998 και στην Αθήνα από το 2001 έως το 2003, αποκτώντας εμπειρία σε διαφορετικά περιβάλλοντα και σχολές σκέψης.</p>
          <p class="reveal">Παράλληλα με την κλινική πράξη, δίδαξε στο ΕΠΑΛ Νεάπολης (2003–2004) και στο ΙΕΚ Σητείας (2007–2008 και 2013–2014), μεταφέροντας την εμπειρία της σε νέους επαγγελματίες του χώρου.</p>
          <p class="reveal">Από το 2008 διατηρεί το δικό της ινστιτούτο αισθητικής στη Σητεία. Ο διπλός τίτλος, αισθητικός και διαιτολόγος, της επιτρέπει να αντιμετωπίζει κάθε περίπτωση συνολικά: η θεραπεία και η διατροφή σχεδιάζονται μαζί, με κοινό στόχο και ρεαλιστικές προσδοκίες.</p>
        </div>
      </div>
    </section>

    <section class="creds">
      <div class="container">
        <div class="creds-grid">
          <div class="cred reveal"><span class="cred-k">City College Manchester</span><span class="cred-v">Σπουδές Αισθητικής, Αγγλία</span></div>
          <div class="cred reveal"><span class="cred-k">ΤΕΙ Αθήνας, ΠΑΔΑ</span><span class="cred-v">Αισθητικός Κοσμητολόγος</span></div>
          <div class="cred reveal"><span class="cred-k">ΤΕΙ Κρήτης, ΕΛΜΕΠΑ</span><span class="cred-v">Διαιτολογία, 2004–2008</span></div>
          <div class="cred reveal"><span class="cred-k">University of Salford</span><span class="cred-v">Εκπαίδευση στη φυσική αγωγή</span></div>
          <div class="cred reveal"><span class="cred-k">Διδακτικό έργο</span><span class="cred-v">ΕΠΑΛ Νεάπολης &amp; ΙΕΚ Σητείας</span></div>
          <div class="cred reveal"><span class="cred-k">Από το 2008</span><span class="cred-v">Δικό της ινστιτούτο αισθητικής στη Σητεία</span></div>
        </div>
      </div>
    </section>

    <section class="philosophy">
      <div class="container philosophy-inner reveal">
        <p class="eyebrow">Η Φιλοσοφία μας</p>
        <span class="philosophy-mark" aria-hidden="true">&ldquo;</span>
        <blockquote><em>Elegance is the only beauty that never fades.</em> Είσαι ό,τι τρως. Η ομορφιά χτίζεται και από μέσα.</blockquote>
        <cite class="philosophy-cite">Έλενα Σπυριδάκη · Beauty Lab, Σητεία</cite>
      </div>
    </section>
  </main>` +
    ctaBand(depth) +
    footer(depth);
}

// ====================================================================
//  PAGE: SERVICES HUB
// ====================================================================
function pageServicesHub() {
  const depth = 1;
  const r = (p) => rel(depth, p);
  const trail = [
    { name: "Αρχική", rel: "index.html", path: "index.html" },
    { name: "Υπηρεσίες", rel: "ypiresies/index.html", path: "ypiresies/index.html" },
  ];
  const cards = SERVICES.map(
    (s, i) => `
        <a class="svc reveal" href="${r("ypiresies/" + s.slug + ".html")}">
          <span class="svc-icon" aria-hidden="true">${s.icon}</span>
          <span class="svc-num">${String(i + 1).padStart(2, "0")}</span>
          <h2>${esc(s.h1)}</h2>
          <p>${esc(s.lead)}</p>
          <span class="svc-more">Μάθετε περισσότερα →</span>
        </a>`
  ).join("");
  const ld = [
    breadcrumbLD(depth, trail),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: SERVICES.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: s.h1,
        url: abs("ypiresies/" + s.slug + ".html"),
      })),
    },
  ];
  return head({
    depth,
    title: "Υπηρεσίες Αισθητικής & Διατροφής | Beauty Lab, Σητεία",
    desc: "Όλες οι υπηρεσίες του Beauty Lab στη Σητεία: αδυνάτισμα & σύσφιξη, κυτταρίτιδα, λεμφική αποσυμφόρηση, βαθύς καθαρισμός, peeling, μεσοθεραπεία, αποτρίχωση laser και διαιτολογική υποστήριξη.",
    canonical: "ypiresies/index.html",
    keywords: "υπηρεσίες αισθητικής Σητεία, θεραπείες προσώπου, θεραπείες σώματος, αποτρίχωση laser, διαιτολόγος Λασίθι",
    ld,
  }) +
    header(depth, "services") +
    crumbs(depth, trail) +
    `
  <main id="main">
    <section class="page-hero">
      <div class="container">
        <p class="eyebrow reveal">Υπηρεσίες</p>
        <h1 class="page-title reveal">Φροντίδα προσώπου, σώματος &amp; διατροφής</h1>
        <p class="page-lead reveal">Από τον βαθύ καθαρισμό και την αντιγήρανση μέχρι το αδυνάτισμα, την αποτρίχωση laser και το εξατομικευμένο διατροφικό πλάνο, όλα σε έναν χώρο, με κοινό σχεδιασμό.</p>
      </div>
    </section>
    <section class="services services--hub">
      <div class="container">
        <div class="services-grid">${cards}
        </div>
      </div>
    </section>
` +
    machinesSection() +
    `
  </main>` +
    ctaBand(depth) +
    footer(depth);
}

// ====================================================================
//  PAGE: SERVICE DETAIL
// ====================================================================
function pageService(s, idx) {
  const depth = 1;
  const r = (p) => rel(depth, p);
  const trail = [
    { name: "Αρχική", rel: "index.html", path: "index.html" },
    { name: "Υπηρεσίες", rel: "ypiresies/index.html", path: "ypiresies/index.html" },
    { name: s.nav, rel: "ypiresies/" + s.slug + ".html", path: "ypiresies/" + s.slug + ".html" },
  ];
  const related = SERVICES.filter((x) => x.slug !== s.slug).slice(0, 4);
  const ld = [
    breadcrumbLD(depth, trail),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.h1,
      description: s.desc,
      url: abs("ypiresies/" + s.slug + ".html"),
      serviceType: s.nav,
      areaServed: AREAS.map((a) => a.name),
      provider: { "@id": `${BASE}/#studio` },
    },
    faqLD(s.faq),
  ];
  return head({
    depth,
    title: s.title,
    desc: s.desc,
    canonical: "ypiresies/" + s.slug + ".html",
    keywords: s.keywords,
    ld,
    type: "article",
  }) +
    header(depth, "services") +
    crumbs(depth, trail) +
    `
  <main id="main">
    <section class="page-hero page-hero--svc">
      <div class="container">
        <span class="svc-hero-icon" aria-hidden="true">${s.icon}</span>
        <p class="eyebrow reveal">Υπηρεσία ${String(idx + 1).padStart(2, "0")}</p>
        <h1 class="page-title reveal">${esc(s.h1)}</h1>
        <p class="page-lead reveal">${esc(s.lead)}</p>
        <div class="hero-actions reveal"><a href="${r("ratevou.html")}" class="btn btn-primary">Κλείστε Ραντεβού</a></div>
      </div>
    </section>

    <section class="svc-detail">
      <div class="container svc-detail-grid">
        <article class="svc-body">
          ${s.body.map((p) => `<p class="reveal">${esc(p)}</p>`).join("\n          ")}

          <h2 class="reveal">Τι περιλαμβάνει</h2>
          <ul class="ticks">
            ${s.includes.map((i) => `<li class="reveal">${esc(i)}</li>`).join("\n            ")}
          </ul>

          <h2 class="reveal">Συχνές ερωτήσεις</h2>
          <div class="faq">
            ${s.faq
              .map(
                ([q, a]) => `<details class="faq-item reveal"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`
              )
              .join("\n            ")}
          </div>
        </article>

        <aside class="svc-aside">
          <div class="aside-card reveal">
            <h3>Κλείστε ραντεβού</h3>
            <p>Λειτουργούμε κατόπιν ραντεβού. Η διάρκεια κυμαίνεται από 15 λεπτά έως 2 ώρες 15 λεπτά, ανάλογα με τη θεραπεία.</p>
            <a href="${r("ratevou.html")}" class="btn btn-primary btn-block">Ραντεβού Online</a>
            <a href="tel:${BIZ.phoneIntl}" class="btn btn-ghost btn-block">${esc(BIZ.phoneDisplay)}</a>
            <p class="aside-meta">${esc(BIZ.street)}, ${esc(BIZ.area)}<br />Τ.Κ. ${esc(BIZ.postal)}</p>
          </div>
          <div class="aside-card reveal">
            <h3>Άλλες υπηρεσίες</h3>
            <nav class="aside-links">
              ${related.map((x) => `<a href="${r("ypiresies/" + x.slug + ".html")}">${esc(x.nav)} →</a>`).join("\n              ")}
            </nav>
          </div>
        </aside>
      </div>
    </section>
  </main>` +
    ctaBand(depth) +
    footer(depth);
}

// ====================================================================
//  PAGE: AREA DETAIL
//  Τοπικές σελίδες προσγείωσης (local SEO). Δεν υπάρχουν στο μενού —
//  μόνο μία διακριτική γραμμή στο footer και το sitemap τις καθιστούν
//  προσβάσιμες/ανιχνεύσιμες.
// ====================================================================
function pageArea(a) {
  const depth = 1;
  const r = (p) => rel(depth, p);
  const trail = [
    { name: "Αρχική", rel: "index.html", path: "index.html" },
    { name: a.name, rel: "perioches/" + a.slug + ".html", path: "perioches/" + a.slug + ".html" },
  ];
  const localFaq = [
    [`Πού βρίσκεται το ινστιτούτο;`, `Το Beauty Lab βρίσκεται στην ${BIZ.street}, ${BIZ.area}, Τ.Κ. ${BIZ.postal}, με εύκολη πρόσβαση από ${a.name}.`],
    [`Πώς κλείνω ραντεβού;`, `Καλέστε στο ${BIZ.phoneDisplay} ή στείλτε email στο ${BIZ.email}. Λειτουργούμε κατόπιν ραντεβού, ${BIZ.hours}.`],
    [`Ποιες υπηρεσίες προσφέρετε;`, `Θεραπείες προσώπου (βαθύς καθαρισμός, ενυδάτωση, λεύκανση, peeling, μεσοθεραπεία), θεραπείες σώματος (αδυνάτισμα, σύσφιξη, κυτταρίτιδα, λεμφική αποσυμφόρηση), αποτρίχωση με laser Alexandrite & Diode, ριζική και ενζυμική αποτρίχωση, καθώς και διαιτολογική υποστήριξη από πτυχιούχο διαιτολόγο.`],
    [`Πόσο διαρκεί ένα ραντεβού;`, `Ανάλογα με τη θεραπεία, από 15 λεπτά έως 2 ώρες 15 λεπτά. Θα σας ενημερώσουμε για την ακριβή διάρκεια όταν κλείνετε το ραντεβού.`],
  ];
  const ld = [
    breadcrumbLD(depth, trail),
    { "@context": "https://schema.org", ...studioLD, areaServed: a.name },
    faqLD(localFaq),
  ];
  return head({
    depth,
    title: a.title,
    desc: a.desc,
    canonical: "perioches/" + a.slug + ".html",
    keywords: a.keywords,
    ld,
  }) +
    header(depth) +
    crumbs(depth, trail) +
    `
  <main id="main">
    <section class="page-hero">
      <div class="container">
        <p class="eyebrow reveal">Περιοχή εξυπηρέτησης</p>
        <h1 class="page-title reveal">${esc(a.h1)}</h1>
        <p class="page-lead reveal">${esc(a.blurb)}</p>
        <div class="hero-actions reveal">
          <a href="${r("ratevou.html")}" class="btn btn-primary">Κλείστε Ραντεβού</a>
          <a href="tel:${BIZ.phoneIntl}" class="btn btn-ghost">Καλέστε ${esc(BIZ.phoneDisplay)}</a>
        </div>
      </div>
    </section>

    <section class="svc-detail">
      <div class="container svc-detail-grid">
        <article class="svc-body">
          <h2 class="reveal">Οι υπηρεσίες μας για ${esc(a.name)}</h2>
          <ul class="ticks two-col">
            ${SERVICES.map((s) => `<li class="reveal"><a href="${r("ypiresies/" + s.slug + ".html")}">${esc(s.h1)}</a></li>`).join("\n            ")}
          </ul>
          <h2 class="reveal">Συχνές ερωτήσεις</h2>
          <div class="faq">
            ${localFaq.map(([q, ans]) => `<details class="faq-item reveal"><summary>${esc(q)}</summary><p>${esc(ans)}</p></details>`).join("\n            ")}
          </div>
        </article>
        <aside class="svc-aside">
          <div class="aside-card reveal">
            <h3>Στοιχεία επικοινωνίας</h3>
            <p class="aside-meta">${esc(BIZ.street)}, ${esc(BIZ.area)}<br />Τ.Κ. ${esc(BIZ.postal)}</p>
            <a href="tel:${BIZ.phoneIntl}" class="btn btn-primary btn-block">${esc(BIZ.phoneDisplay)}</a>
            <a href="mailto:${BIZ.email}" class="btn btn-ghost btn-block">Email</a>
            <p class="aside-meta">${esc(BIZ.hours)}</p>
          </div>
        </aside>
      </div>
    </section>
  </main>` +
    ctaBand(depth) +
    footer(depth);
}

// ====================================================================
//  PAGE: BLOG HUB
// ====================================================================
function pageBlogHub() {
  const depth = 1;
  const r = (p) => rel(depth, p);
  const trail = [
    { name: "Αρχική", rel: "index.html", path: "index.html" },
    { name: "Blog", rel: "blog/index.html", path: "blog/index.html" },
  ];
  const posts = [...POSTS].sort((x, y) => (x.date < y.date ? 1 : -1));
  const cards = posts.map(
    (p) => `
        <a class="post-card reveal" href="${r("blog/" + p.slug + ".html")}">
          <span class="post-cat">${esc(p.cat)}</span>
          <h2>${esc(p.title)}</h2>
          <p>${esc(p.excerpt)}</p>
          <time datetime="${p.date}">${fmtDate(p.date)}</time>
        </a>`
  ).join("");
  const ld = [
    breadcrumbLD(depth, trail),
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: BIZ.name + " | Blog",
      url: abs("blog/index.html"),
      inLanguage: "el",
    },
  ];
  return head({
    depth,
    title: "Blog: Αισθητική, Περιποίηση & Διατροφή | Beauty Lab Σητεία",
    desc: "Οδηγοί και απαντήσεις για την περιποίηση προσώπου και σώματος, την αποτρίχωση laser και τη διατροφή, από την Έλενα Σπυριδάκη, αισθητικό κοσμητολόγο και διαιτολόγο.",
    canonical: "blog/index.html",
    keywords: "blog αισθητικής, περιποίηση προσώπου, συμβουλές δέρματος, διατροφή και ομορφιά, αποτρίχωση laser συμβουλές",
    ld,
  }) +
    header(depth, "blog") +
    crumbs(depth, trail) +
    `
  <main id="main">
    <section class="page-hero">
      <div class="container">
        <p class="eyebrow reveal">Blog</p>
        <h1 class="page-title reveal">Ενημέρωση για την ομορφιά σου</h1>
        <p class="page-lead reveal">Χρήσιμοι οδηγοί και ειλικρινείς απαντήσεις σε όσα ρωτάτε πιο συχνά, από την Έλενα Σπυριδάκη.</p>
      </div>
    </section>
    <section class="posts">
      <div class="container">
        <div class="posts-grid">${cards}
        </div>
      </div>
    </section>
  </main>` +
    ctaBand(depth) +
    footer(depth);
}

// ====================================================================
//  PAGE: BLOG POST
// ====================================================================
function pagePost(p) {
  const depth = 1;
  const r = (pp) => rel(depth, pp);
  const trail = [
    { name: "Αρχική", rel: "index.html", path: "index.html" },
    { name: "Blog", rel: "blog/index.html", path: "blog/index.html" },
    { name: p.title, rel: "blog/" + p.slug + ".html", path: "blog/" + p.slug + ".html" },
  ];
  const relatedSvc = SERVICES.find((s) => s.slug === p.related);
  const others = POSTS.filter((x) => x.slug !== p.slug).slice(0, 3);
  const ld = [
    breadcrumbLD(depth, trail),
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: p.title,
      description: p.desc,
      datePublished: p.date,
      dateModified: p.date,
      inLanguage: "el",
      image: abs("assets/logo.jpg"),
      mainEntityOfPage: abs("blog/" + p.slug + ".html"),
      author: { "@type": "Person", name: BIZ.doctor },
      publisher: { "@id": `${BASE}/#studio` },
    },
    faqLD(p.faq),
  ];
  // [τίτλος, κείμενο, λίστα?] — ο τρίτος όρος είναι προαιρετικά bullets
  const bodyHtml = p.body
    .map(([h, t, list]) => {
      const head = h ? `<h2 class="reveal">${esc(h)}</h2>\n          ` : "";
      const para = h ? `<p class="reveal">${esc(t)}</p>` : `<p class="reveal lead-p">${esc(t)}</p>`;
      const items = list
        ? `\n          <ul class="ticks">\n            ${list.map((i) => `<li class="reveal">${esc(i)}</li>`).join("\n            ")}\n          </ul>`
        : "";
      return head + para + items;
    })
    .join("\n          ");
  return head({
    depth,
    title: p.metaTitle,
    desc: p.desc,
    canonical: "blog/" + p.slug + ".html",
    keywords: p.keywords,
    ld,
    type: "article",
  }) +
    header(depth, "blog") +
    crumbs(depth, trail) +
    `
  <main id="main">
    <article class="article">
      <header class="article-head">
        <div class="container article-head-inner">
          <span class="post-cat reveal">${esc(p.cat)}</span>
          <h1 class="page-title reveal">${esc(p.title)}</h1>
          <p class="article-meta reveal"><time datetime="${p.date}">${fmtDate(p.date)}</time> · ${esc(BIZ.doctor)}</p>
        </div>
      </header>
      <div class="container article-body">
        <div class="article-copy">
          ${bodyHtml}

          <h2 class="reveal">Συχνές ερωτήσεις</h2>
          <div class="faq">
            ${p.faq.map(([q, a]) => `<details class="faq-item reveal"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("\n            ")}
          </div>

          ${relatedSvc ? `<div class="article-cta reveal">
            <p>Σχετική υπηρεσία: <a href="${r("ypiresies/" + relatedSvc.slug + ".html")}"><strong>${esc(relatedSvc.h1)}</strong></a>. Κλείστε ραντεβού στο <a href="tel:${BIZ.phoneIntl}">${esc(BIZ.phoneDisplay)}</a>.</p>
          </div>` : ""}

          <p class="article-disclaimer">Το παρόν άρθρο έχει ενημερωτικό χαρακτήρα και δεν υποκαθιστά την εξατομικευμένη συμβουλή. Για τη δική σας περίπτωση, απευθυνθείτε σε επαγγελματία και, όπου χρειάζεται, στον θεράποντα ιατρό σας.</p>
        </div>
        <aside class="article-aside">
          <div class="aside-card reveal">
            <h3>Διαβάστε επίσης</h3>
            <nav class="aside-links">
              ${others.map((o) => `<a href="${r("blog/" + o.slug + ".html")}">${esc(o.title)} →</a>`).join("\n              ")}
            </nav>
          </div>
        </aside>
      </div>
    </article>
  </main>` +
    ctaBand(depth) +
    footer(depth);
}

// ====================================================================
//  PAGE: CONTACT
// ====================================================================
function pageContact() {
  const depth = 0;
  const r = (p) => rel(depth, p);
  const trail = [
    { name: "Αρχική", rel: "index.html", path: "index.html" },
    { name: "Επικοινωνία", rel: "epikoinonia.html", path: "epikoinonia.html" },
  ];
  const ld = [breadcrumbLD(depth, trail), { "@context": "https://schema.org", ...studioLD }];
  return head({
    depth,
    title: "Επικοινωνία & Ραντεβού | Beauty Lab by Elena Spyridaki, Σητεία",
    desc: `Επικοινωνήστε με το Beauty Lab. ${BIZ.street}, ${BIZ.area} ${BIZ.postal}, Λασίθι. Τηλ. ${BIZ.phoneDisplay}, ${BIZ.email}. Λειτουργία κατόπιν ραντεβού.`,
    canonical: "epikoinonia.html",
    keywords: "επικοινωνία αισθητικός Σητεία, ραντεβού ινστιτούτο αισθητικής Σητεία, τηλέφωνο Beauty Lab, Καταπότη 36 Σητεία",
    ld,
  }) +
    header(depth, "contact") +
    crumbs(depth, trail) +
    `
  <main id="main">
    <section class="contact" id="contact">
      <div class="container contact-grid">
        <div class="contact-copy">
          <p class="eyebrow reveal">Επικοινωνία</p>
          <h1 class="section-title reveal">Κλείστε το ραντεβού σας</h1>
          <p class="contact-note reveal">Το ινστιτούτο λειτουργεί <strong>κατόπιν ραντεβού</strong>. Μπορείτε να κλείσετε <a href="${r("ratevou.html")}"><strong>online σε ένα λεπτό</strong></a> ή να μας πάρετε τηλέφωνο, ιδίως αν δεν είστε σίγουρη ποια θεραπεία χρειάζεστε.</p>
          <ul class="contact-list">
            <li class="reveal"><span class="contact-label">Ωράριο</span><span class="contact-value">Δευτέρα &amp; Τετάρτη: 16:00 – 21:30<br />Τρίτη, Πέμπτη &amp; Παρασκευή: 09:15 – 17:30<br /><em>κατόπιν ραντεβού</em></span></li>
            <li class="reveal"><span class="contact-label">Διεύθυνση</span><span class="contact-value">${esc(BIZ.street)}, ${esc(BIZ.area)}<br />${esc(BIZ.region)}, Τ.Κ. ${esc(BIZ.postal)}</span></li>
            <li class="reveal"><span class="contact-label">Τηλέφωνο</span><span class="contact-value"><a href="tel:${BIZ.phoneIntl}">${esc(BIZ.phoneDisplay)}</a></span></li>
            <li class="reveal"><span class="contact-label">Email</span><span class="contact-value"><a href="mailto:${BIZ.email}">${esc(BIZ.email)}</a></span></li>
            <li class="reveal"><span class="contact-label">Social</span><span class="contact-value"><a href="${BIZ.instagram}" target="_blank" rel="noopener noreferrer">Instagram</a> · <a href="${BIZ.facebook}" target="_blank" rel="noopener noreferrer">Facebook</a><br /><em>${esc(BIZ.social)}</em></span></li>
          </ul>
          <div class="contact-actions reveal">
            <a href="${r("ratevou.html")}" class="btn btn-primary">Ραντεβού Online</a>
            <a href="tel:${BIZ.phoneIntl}" class="btn btn-ghost">Καλέστε μας</a>
          </div>
        </div>
        <div class="contact-map reveal">
          <iframe title="Χάρτης: ${attr(BIZ.street + ", " + BIZ.area)}" src="https://www.google.com/maps?q=${encodeURIComponent(BIZ.street + ", " + BIZ.area + " " + BIZ.postal)}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
        </div>
      </div>
    </section>
  </main>` +
    footer(depth);
}

// ====================================================================
//  PAGE: ΠΡΟΣΦΟΡΕΣ
// ====================================================================
function pageOffers() {
  const depth = 0;
  const r = (p) => rel(depth, p);
  const trail = [
    { name: "Αρχική", rel: "index.html", path: "index.html" },
    { name: "Προσφορές", rel: "prosfores.html", path: "prosfores.html" },
  ];
  const ld = [
    breadcrumbLD(depth, trail),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Προσφορές | Beauty Lab by Elena Spyridaki",
      itemListElement: OFFERS.map((o, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: o.title,
        url: abs("prosfores.html") + "#" + o.slug,
      })),
    },
  ];

  const blocks = OFFERS.map(
    (o) => `
      <article class="offer-full reveal" id="${o.slug}">
        <span class="offer-beam" aria-hidden="true"></span>
        <span class="offer-scan" aria-hidden="true"></span>
        <div class="offer-shell">
        <div class="offer-full-head">
          <span class="offer-icon" aria-hidden="true">${o.icon}</span>
          <div>
            <h2 class="offer-full-title">${esc(o.title)}${o.neo ? ' <span class="offer-neo offer-neo--inline">ΝΕΟ</span>' : ""}</h2>
            <p class="offer-full-lead">${esc(o.lead)}</p>
          </div>
        </div>
        <div class="offer-full-body">
          <div class="offer-full-copy">
            ${o.body.map((p) => `<p>${esc(p)}</p>`).join("\n            ")}
          </div>
          <div class="offer-full-side">
            <h3>Τι περιλαμβάνει</h3>
            <ul class="ticks">
              ${o.includes.map((x) => `<li>${esc(x)}</li>`).join("\n              ")}
            </ul>
            ${o.price ? `<p class="offer-full-price">${esc(o.price)}</p>` : `<p class="offer-full-ask">Τηλεφωνήστε μας για την τιμή. Εξαρτάται από τις περιοχές και τον αριθμό συνεδριών.</p>`}
            ${o.validity ? `<p class="offer-full-valid">${esc(o.validity)}</p>` : ""}
            <div class="offer-full-actions">
              <a href="${r("ratevou.html")}" class="btn btn-primary btn-block">Κλείστε Ραντεβού</a>
              <a href="tel:${BIZ.phoneIntl}" class="btn btn-ghost btn-block">${esc(BIZ.phoneDisplay)}</a>
            </div>
          </div>
        </div>
        </div>
      </article>`
  ).join("");

  return head({
    depth,
    bodyClass: "page-offers",
    title: "Προσφορές & Πακέτα | Beauty Lab by Elena Spyridaki, Σητεία",
    desc: "Οι τρέχουσες προσφορές και τα πακέτα του Beauty Lab στη Σητεία: laser σώματος, καθαρισμός & ενυδάτωση προσώπου, πρόγραμμα σώματος με διατροφή, ετοιμασία για γάμο.",
    canonical: "prosfores.html",
    keywords: "προσφορές αισθητικής Σητεία, πακέτα laser Σητεία, προσφορά καθαρισμός προσώπου, πακέτο αδυνατίσματος Λασίθι, Beauty Lab προσφορές",
    ld,
  }) +
    header(depth, "offers") +
    crumbs(depth, trail) +
    `
  <main id="main">
    <section class="page-hero page-hero--tight">
      <div class="container">
        <p class="eyebrow reveal">Οι προσφορές μας</p>
        <h1 class="page-title reveal">Προσφορές &amp; πακέτα</h1>
        <p class="page-lead reveal">Θεραπείες που η μία στηρίζει την άλλη, σε πακέτο με σταθερή τιμή. Ρωτήστε μας τι ταιριάζει στη δική σας περίπτωση. Δεν χρειάζεστε πάντα το μεγαλύτερο πακέτο.</p>
      </div>
    </section>

    <section class="offers-page">
      <div class="container offers-list">${blocks}
      </div>
    </section>
  </main>` +
    ctaBand(depth) +
    footer(depth);
}

// ====================================================================
//  PAGE: ONLINE ΡΑΝΤΕΒΟΥ
// ====================================================================
function pageBooking() {
  const depth = 0;
  const r = (p) => rel(depth, p);
  const trail = [
    { name: "Αρχική", rel: "index.html", path: "index.html" },
    { name: "Ραντεβού Online", rel: "ratevou.html", path: "ratevou.html" },
  ];
  const ld = [
    breadcrumbLD(depth, trail),
    {
      "@context": "https://schema.org",
      "@type": "ReserveAction",
      name: "Κλείστε ραντεβού online στο Beauty Lab",
      target: {
        "@type": "EntryPoint",
        urlTemplate: abs("ratevou.html"),
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      provider: { "@id": `${BASE}/#studio` },
    },
  ];

  return head({
    depth,
    title: "Ραντεβού Online | Beauty Lab by Elena Spyridaki, Σητεία",
    desc: "Κλείστε online το ραντεβού σας στο Beauty Lab στη Σητεία. Επιλέξτε θεραπεία, ημέρα και ώρα. Βλέπετε αμέσως τις πραγματικά διαθέσιμες ώρες.",
    canonical: "ratevou.html",
    keywords: "ραντεβού online αισθητικός Σητεία, κλείσιμο ραντεβού Beauty Lab, ραντεβού laser Σητεία, ινστιτούτο αισθητικής Σητεία",
    ld,
  }) +
    header(depth, "booking") +
    crumbs(depth, trail) +
    `
  <main id="main">
    <section class="page-hero page-hero--tight">
      <div class="container">
        <p class="eyebrow reveal">Ραντεβού Online</p>
        <h1 class="page-title reveal">Κλείστε το ραντεβού σας</h1>
        <p class="page-lead reveal">Διαλέξτε θεραπεία, ημέρα και ώρα. Οι ώρες που βλέπετε είναι οι πραγματικά ελεύθερες και ενημερώνονται απευθείας από το ημερολόγιο του ινστιτούτου.</p>
      </div>
    </section>

    <section class="booking">
      <div class="container booking-grid">
        <div class="bk" id="bk" data-availability="${attr(BOOKING.availabilityUrl)}" data-booking="${attr(BOOKING.bookingUrl)}">
          <ol class="bk-steps" id="bkSteps" aria-label="Βήματα κράτησης">
            <li data-step="1"><button type="button" data-goto="1" disabled><span>1</span> Θεραπεία</button></li>
            <li data-step="2"><button type="button" data-goto="2" disabled><span>2</span> Ημέρα &amp; ώρα</button></li>
            <li data-step="3"><button type="button" data-goto="3" disabled><span>3</span> Στοιχεία</button></li>
          </ol>

          <div class="bk-stage" id="bkStage" aria-live="polite">
            <p class="bk-loading">Φόρτωση θεραπειών…</p>
          </div>
        </div>

        <aside class="bk-aside">
          <div class="bk-card reveal">
            <h2>Προτιμάτε τηλέφωνο;</h2>
            <p>Ευχαρίστως, ιδίως αν δεν είστε σίγουρη ποια θεραπεία χρειάζεστε ή θέλετε να συνδυάσετε περισσότερες από μία.</p>
            <a href="tel:${BIZ.phoneIntl}" class="btn btn-primary">${esc(BIZ.phoneDisplay)}</a>
          </div>
          <div class="bk-card reveal">
            <h2>Ωράριο</h2>
            <p class="bk-hours">Δευτέρα &amp; Τετάρτη<br /><strong>16:00 – 21:30</strong></p>
            <p class="bk-hours">Τρίτη, Πέμπτη &amp; Παρασκευή<br /><strong>09:15 – 17:30</strong></p>
            <p class="bk-fine">Σάββατο &amp; Κυριακή κλειστά.</p>
          </div>
          <div class="bk-card reveal">
            <h2>Καλό είναι να ξέρετε</h2>
            <ul class="bk-list">
              <li>Τα online ραντεβού κλείνονται τουλάχιστον <strong>3 ώρες</strong> νωρίτερα.</li>
              <li>Για <strong>laser σε πόδια ή μπικίνι</strong>, αν δεν έχετε ξυριστεί, η θεραπεία θέλει 15 λεπτά παραπάνω και θα σας ρωτήσουμε.</li>
              <li>Για αλλαγή ή ακύρωση, ένα τηλεφώνημα <strong>μία ημέρα νωρίτερα</strong> είναι αρκετό, ώστε να προλάβει να δοθεί η ώρα σε κάποιο άλλο άτομο.</li>
              <li>Σε ακύρωση της τελευταίας στιγμής, <strong>μία ώρα πριν ή λιγότερο</strong>, η ώρα δύσκολα καλύπτεται. Σε αυτή την περίπτωση προστίθεται μια μικρή συμβολική χρέωση στο επόμενο ραντεβού σας. Ευχαριστούμε για την κατανόηση.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  </main>

  <script>
  (function () {
    var root = document.getElementById('bk');
    var stage = document.getElementById('bkStage');
    var stepsEl = document.getElementById('bkSteps');
    if (!root || !stage) return;

    var AVAIL_URL = root.getAttribute('data-availability');
    var BOOK_URL = root.getAttribute('data-booking');
    var PHONE = '${BIZ.phoneDisplay}';

    var MONTHS = ['Ιανουάριος','Φεβρουάριος','Μάρτιος','Απρίλιος','Μάιος','Ιούνιος','Ιούλιος','Αύγουστος','Σεπτέμβριος','Οκτώβριος','Νοέμβριος','Δεκέμβριος'];
    var DOW = ['Δε','Τρ','Τε','Πε','Πα','Σα','Κυ'];

    var state = {
      catalog: null, service: null, prep: true,
      year: 0, month: 0, days: null, duration: 0,
      day: null, slot: null, step: 1, loading: false,
      openGroup: -1
    };

    function esc(s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function ymd(y, m, d) { return y + '-' + pad(m) + '-' + pad(d); }
    // Δευτέρα = 0, ώστε η εβδομάδα να ξεκινά σωστά για Ελλάδα.
    function dowMon(y, m, d) { return (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7; }
    function daysInMonth(y, m) { return new Date(Date.UTC(y, m, 0)).getUTCDate(); }

    function setStep(n) {
      state.step = n;
      var items = stepsEl.querySelectorAll('li');
      for (var i = 0; i < items.length; i++) {
        var s = Number(items[i].getAttribute('data-step'));
        items[i].className = s < n ? 'is-done' : (s === n ? 'is-active' : '');
        // Τα ολοκληρωμένα βήματα γίνονται κλικαρίσιμα, για να γυρίζει κανείς πίσω.
        items[i].querySelector('button').disabled = s >= n;
      }
      stepsEl.hidden = n > 3;
    }

    // Το βελάκι επιστροφής μπαίνει πάνω-πάνω σε κάθε οθόνη μετά την πρώτη.
    function backBtn(label) {
      return '<button type="button" class="bk-back" id="bkBack">' +
             '<span class="bk-back-i" aria-hidden="true">←</span>' +
             '<span>' + esc(label) + '</span></button>';
    }

    function fail(msg, back, backLabel) {
      stage.innerHTML =
        (back ? backBtn(backLabel || 'Πίσω') : '') +
        '<div class="bk-error"><p>' + esc(msg) + '</p>' +
        '<p class="bk-fine">Μπορείτε πάντα να μας καλέσετε στο <a href="tel:+30${BIZ.phoneIntl.replace(/\D/g, "").slice(2)}">' + esc(PHONE) + '</a>.</p></div>';
      if (back) stage.querySelector('#bkBack').addEventListener('click', back);
    }

    function api(url) {
      return fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } })
        .then(function (res) { return res.json().then(function (j) { return { ok: res.ok, body: j }; }); });
    }

    // ---------- Βήμα 1: θεραπεία ----------
    function loadCatalog() {
      stage.innerHTML = '<p class="bk-loading">Φόρτωση θεραπειών…</p>';
      api(AVAIL_URL + '?action=services').then(function (r) {
        if (!r.ok || !r.body || !r.body.groups) { fail('Δεν μπορέσαμε να φορτώσουμε τις θεραπείες.'); return; }
        state.catalog = r.body;
        renderServices();
      }).catch(function () {
        fail('Δεν υπάρχει σύνδεση με το σύστημα κρατήσεων αυτή τη στιγμή.');
      });
    }

    function renderServices() {
      setStep(1);
      var g = state.catalog.groups;
      var h = '<h2 class="bk-title">Ποια θεραπεία θα θέλατε;</h2>' +
              '<p class="bk-sub">Διαλέξτε κατηγορία και μετά τη θεραπεία.</p>' +
              '<div class="bk-acc">';
      for (var i = 0; i < g.length; i++) {
        var open = state.openGroup === i;
        h += '<div class="bk-accgroup' + (open ? ' is-open' : '') + '">' +
             '<button type="button" class="bk-bar" data-g="' + i + '"' +
             ' aria-expanded="' + (open ? 'true' : 'false') + '">' +
             '<span class="bk-bar-name">' + esc(g[i].name) + '</span>' +
             '<span class="bk-bar-count">' + g[i].services.length + '</span>' +
             '<span class="bk-caret" aria-hidden="true"></span>' +
             '</button><div class="bk-panel"' + (open ? '' : ' hidden') + '>';
        for (var j = 0; j < g[i].services.length; j++) {
          var s = g[i].services[j];
          h += '<button type="button" class="bk-item" data-code="' + esc(s.code) + '">' +
               '<span class="bk-item-name">' + esc(s.name) +
               '<small class="bk-item-who">' + esc(whoLabel(s.staff)) + '</small></span>' +
               '<span class="bk-item-min">' + s.minutes + " λεπτά</span>" +
               '<span class="bk-item-go" aria-hidden="true">→</span></button>';
        }
        h += '</div></div>';
      }
      h += '</div>';
      stage.innerHTML = h;

      var bars = stage.querySelectorAll('.bk-bar');
      for (var b = 0; b < bars.length; b++) {
        bars[b].addEventListener('click', function () {
          var idx = Number(this.getAttribute('data-g'));
          state.openGroup = state.openGroup === idx ? -1 : idx;
          renderServices();
          if (state.openGroup === idx) {
            var el = stage.querySelectorAll('.bk-bar')[idx];
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        });
      }
      var items = stage.querySelectorAll('.bk-item');
      for (var k = 0; k < items.length; k++) {
        items[k].addEventListener('click', function () {
          pickService(this.getAttribute('data-code'));
        });
      }
    }

    // Ποια αισθητικός κάνει την υπηρεσία. Η σειρά είναι σειρά προτεραιότητας,
    // οπότε στο laser εμφανίζεται πρώτη η Κατερίνα.
    function whoLabel(staff) {
      if (!staff || !staff.length) { return ''; }
      if (staff.length === 1) { return 'με την ' + staff[0]; }
      return staff.join(' ή ');
    }

    function findService(code) {
      var g = state.catalog.groups;
      for (var i = 0; i < g.length; i++) {
        for (var j = 0; j < g[i].services.length; j++) {
          if (g[i].services[j].code === code) {
            var s = g[i].services[j];
            return { code: s.code, name: s.name, minutes: s.minutes,
                     prepExtra: s.prepExtra, group: g[i].name,
                     staff: s.staff || [] };
          }
        }
      }
      return null;
    }

    function pickService(code) {
      state.service = findService(code);
      state.prep = true;
      state.day = null;
      state.slot = null;
      if (!state.service) return;
      if (state.service.prepExtra > 0) { renderPrep(); }
      else { openCalendar(); }
    }

    // ---------- Βήμα 1β: προετοιμασία ----------
    function renderPrep() {
      var s = state.service;
      stage.innerHTML =
        backBtn('Άλλη θεραπεία') +
        '<h2 class="bk-title">' + esc(s.name) + '</h2>' +
        '<p class="bk-sub">Έχετε ξυρίσει την περιοχή πριν έρθετε;</p>' +
        '<div class="bk-choice">' +
        '<button type="button" class="bk-opt" data-prep="1"><strong>Ναι</strong>' +
        '<span>' + s.minutes + " λεπτά</span></button>" +
        '<button type="button" class="bk-opt" data-prep="0"><strong>Όχι ακόμη</strong>' +
        '<span>' + (s.minutes + s.prepExtra) + " λεπτά</span></button>" +
        '</div>' +
        '<p class="bk-fine">Το ξύρισμα γίνεται στο ινστιτούτο αν χρειαστεί, απλώς θέλει λίγο παραπάνω χρόνο, γι\\'  αυτό το κρατάμε στο ραντεβού.</p>';

      stage.querySelector('#bkBack').addEventListener('click', renderServices);
      var opts = stage.querySelectorAll('.bk-opt');
      for (var i = 0; i < opts.length; i++) {
        opts[i].addEventListener('click', function () {
          state.prep = this.getAttribute('data-prep') === '1';
          openCalendar();
        });
      }
    }

    // ---------- Βήμα 2: ημερολόγιο ----------
    function openCalendar() {
      var now = new Date();
      state.year = now.getFullYear();
      state.month = now.getMonth() + 1;
      loadMonth();
    }

    function loadMonth() {
      setStep(2);
      state.loading = true;
      renderCalendar();
      var last = daysInMonth(state.year, state.month);
      var url = AVAIL_URL + '?action=availability' +
        '&service=' + encodeURIComponent(state.service.code) +
        '&prep=' + (state.prep ? '1' : '0') +
        '&from=' + ymd(state.year, state.month, 1) +
        '&to=' + ymd(state.year, state.month, last);
      api(url).then(function (r) {
        state.loading = false;
        if (!r.ok || !r.body || r.body.ok === false) {
          fail((r.body && r.body.message) || 'Δεν μπορέσαμε να δούμε τις διαθέσιμες ώρες.',
               renderServices, 'Άλλη θεραπεία');
          return;
        }
        state.duration = r.body.durationMinutes;
        var map = {};
        for (var i = 0; i < r.body.days.length; i++) { map[r.body.days[i].date] = r.body.days[i]; }
        state.days = map;
        renderCalendar();
      }).catch(function () {
        state.loading = false;
        fail('Δεν υπάρχει σύνδεση με το σύστημα κρατήσεων αυτή τη στιγμή.',
             renderServices, 'Άλλη θεραπεία');
      });
    }

    function monthOffset() {
      var now = new Date();
      return (state.year - now.getFullYear()) * 12 + (state.month - (now.getMonth() + 1));
    }

    function renderCalendar() {
      var s = state.service;
      var mins = state.duration || (s.minutes + (state.prep ? 0 : s.prepExtra));
      var off = monthOffset();

      var h = backBtn('Άλλη θεραπεία') +
        '<h2 class="bk-title">' + esc(s.name) + '</h2>' +
        '<p class="bk-sub">' + esc(s.group) + ' · ' + mins + ' λεπτά' +
        (s.prepExtra > 0 ? ' · ' + (state.prep ? 'με προετοιμασία' : 'χωρίς προετοιμασία') : '') +
        ' <button type="button" class="bk-link" id="bkEdit">αλλαγή</button></p>' +
        '<div class="bk-cal">' +
        '<div class="bk-cal-head">' +
        '<button type="button" class="bk-nav" id="bkPrev"' + (off <= 0 ? ' disabled' : '') + ' aria-label="Προηγούμενος μήνας">‹</button>' +
        '<span class="bk-month">' + MONTHS[state.month - 1] + ' ' + state.year + '</span>' +
        '<button type="button" class="bk-nav" id="bkNext"' + (off >= 2 ? ' disabled' : '') + ' aria-label="Επόμενος μήνας">›</button>' +
        '</div><div class="bk-dow">';
      for (var d = 0; d < 7; d++) { h += '<span>' + DOW[d] + '</span>'; }
      h += '</div><div class="bk-grid">';

      var lead = dowMon(state.year, state.month, 1);
      for (var b = 0; b < lead; b++) { h += '<span class="bk-cell bk-cell--empty"></span>'; }

      var last = daysInMonth(state.year, state.month);
      for (var day = 1; day <= last; day++) {
        var key = ymd(state.year, state.month, day);
        var info = state.days ? state.days[key] : null;
        var free = info && !info.closed && info.slots.length > 0;
        var cls = 'bk-cell' + (free ? ' is-free' : ' is-off') +
          (state.day === key ? ' is-sel' : '');
        h += free
          ? '<button type="button" class="' + cls + '" data-date="' + key + '">' + day +
            '<i class="bk-dot" aria-hidden="true"></i></button>'
          : '<span class="' + cls + '">' + day + '</span>';
      }
      h += '</div>';
      if (state.loading) { h += '<p class="bk-loading">Έλεγχος διαθεσιμότητας…</p>'; }
      h += '</div><div class="bk-slots" id="bkSlots"></div>';

      stage.innerHTML = h;
      stage.querySelector('#bkBack').addEventListener('click', renderServices);
      stage.querySelector('#bkEdit').addEventListener('click', function () {
        pickService(state.service.code);
      });
      var prev = stage.querySelector('#bkPrev');
      var next = stage.querySelector('#bkNext');
      if (prev) prev.addEventListener('click', function () { shiftMonth(-1); });
      if (next) next.addEventListener('click', function () { shiftMonth(1); });

      var cells = stage.querySelectorAll('.bk-cell[data-date]');
      for (var c = 0; c < cells.length; c++) {
        cells[c].addEventListener('click', function () {
          state.day = this.getAttribute('data-date');
          renderCalendar();
          renderSlots();
          var sl = document.getElementById('bkSlots');
          if (sl) sl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      }
      if (state.day) renderSlots();
    }

    function shiftMonth(dir) {
      state.month += dir;
      if (state.month > 12) { state.month = 1; state.year++; }
      if (state.month < 1) { state.month = 12; state.year--; }
      state.day = null;
      state.days = null;
      loadMonth();
    }

    function renderSlots() {
      var el = document.getElementById('bkSlots');
      if (!el || !state.day) return;
      var info = state.days[state.day];
      if (!info || !info.slots.length) { el.innerHTML = ''; return; }
      var parts = state.day.split('-');
      var h = '<h3 class="bk-slots-title">' + DOW[dowMon(+parts[0], +parts[1], +parts[2])] +
        ' ' + (+parts[2]) + ' ' + MONTHS[+parts[1] - 1] + '</h3><div class="bk-times">';
      var showWho = (state.service.staff || []).length > 1;
      for (var i = 0; i < info.slots.length; i++) {
        var sl = info.slots[i];
        h += '<button type="button" class="bk-time" data-i="' + i + '">' +
             esc(sl.label) +
             (showWho && sl.staffName ? '<small>' + esc(sl.staffName) + '</small>' : '') +
             '</button>';
      }
      h += '</div>';
      el.innerHTML = h;
      var ts = el.querySelectorAll('.bk-time');
      for (var k = 0; k < ts.length; k++) {
        ts[k].addEventListener('click', function () {
          state.slot = info.slots[Number(this.getAttribute('data-i'))];
          renderForm();
        });
      }
    }

    // Επιστροφή στο ημερολόγιο χωρίς νέα κλήση, αν οι μέρες είναι ήδη φορτωμένες.
    function backToCalendar() {
      state.slot = null;
      if (!state.service) { renderServices(); return; }
      if (!state.days) { loadMonth(); return; }
      setStep(2);
      renderCalendar();
    }

    // ---------- Βήμα 3: στοιχεία ----------
    function renderForm() {
      setStep(3);
      var parts = state.day.split('-');
      var when = (+parts[2]) + ' ' + MONTHS[+parts[1] - 1] + ' ' + parts[0] + ', ' + state.slot.label;
      stage.innerHTML =
        backBtn('Άλλη ημέρα ή ώρα') +
        '<h2 class="bk-title">Τα στοιχεία σας</h2>' +
        '<div class="bk-summary">' +
        '<p><strong>' + esc(state.service.name) + '</strong></p>' +
        '<p>' + esc(when) + ' · ' + state.duration + ' λεπτά</p>' +
        '<p class="bk-fine">Με την ' + esc(state.slot.staffName) + '</p>' +
        '</div>' +
        '<form class="bk-form" id="bkForm" novalidate>' +
        '<label>Ονοματεπώνυμο<input type="text" name="name" required autocomplete="name" /></label>' +
        '<label>Κινητό τηλέφωνο<input type="tel" name="phone" required autocomplete="tel" inputmode="tel" placeholder="69…" /></label>' +
        '<label>Email<input type="email" name="email" required autocomplete="email" /></label>' +
        '<label>Σημείωση <span class="bk-opt-tag">προαιρετικό</span><textarea name="notes" rows="3"></textarea></label>' +
        '<p class="bk-err" id="bkErr" hidden></p>' +
        '<button type="submit" class="btn btn-primary bk-submit">Επιβεβαίωση ραντεβού</button>' +
        '<p class="bk-fine">Στο email σας στέλνουμε την επιβεβαίωση και την υπενθύμιση της προηγούμενης ημέρας.</p>' +
        '</form>';

      stage.querySelector('#bkBack').addEventListener('click', backToCalendar);
      stage.querySelector('#bkForm').addEventListener('submit', submitBooking);
    }

    function submitBooking(e) {
      e.preventDefault();
      var form = e.target;
      var errEl = document.getElementById('bkErr');
      var btn = form.querySelector('.bk-submit');
      // Προσοχή: το form.name είναι το attribute της φόρμας, όχι το πεδίο.
      var val = function (n) {
        var el = form.elements[n];
        return el ? String(el.value).trim() : '';
      };
      var name = val('name');
      var phone = val('phone');
      var email = val('email');

      function showErr(m) {
        errEl.textContent = m; errEl.hidden = false;
        btn.disabled = false; btn.textContent = 'Επιβεβαίωση ραντεβού';
      }
      errEl.hidden = true;
      if (name.length < 3) { showErr('Συμπληρώστε το ονοματεπώνυμό σας.'); return; }
      if (phone.replace(/[^0-9]/g, '').length < 10) { showErr('Συμπληρώστε ένα έγκυρο τηλέφωνο.'); return; }
      if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(email)) {
        showErr('Συμπληρώστε το email σας, εκεί στέλνουμε την επιβεβαίωση και την υπενθύμιση.');
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Καταχώρηση…';

      fetch(BOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'book',
          service: state.service.code,
          prep: state.prep,
          start: state.slot.start,
          staff: state.slot.staff,
          name: name,
          phone: phone,
          email: email,
          notes: val('notes')
        })
      })
        .then(function (res) { return res.json().then(function (j) { return { ok: res.ok, body: j }; }); })
        .then(function (r) {
          if (r.ok && r.body && r.body.ok) { renderDone(r.body); return; }
          var m = (r.body && r.body.message) || 'Κάτι πήγε στραβά. Δοκιμάστε ξανά ή καλέστε μας.';
          showErr(m);
          if (r.body && r.body.error === 'slot_taken') {
            state.days = null;
            setTimeout(function () { loadMonth(); }, 1800);
          }
        })
        .catch(function () {
          showErr('Δεν υπάρχει σύνδεση. Δοκιμάστε ξανά ή καλέστε μας στο ' + PHONE + '.');
        });
    }

    // ---------- Βήμα 4: επιβεβαίωση ----------
    function renderDone(res) {
      setStep(4);
      stage.innerHTML =
        '<div class="bk-done">' +
        '<span class="bk-check" aria-hidden="true">✓</span>' +
        '<h2 class="bk-title">Το ραντεβού σας κλείστηκε</h2>' +
        '<p class="bk-done-when">' + esc(res.startLabel) + '</p>' +
        '<p>' + esc(res.service.name) + ' · ' + res.durationMinutes + ' λεπτά · με την ' + esc(res.staffName) + '</p>' +
        '<p class="bk-fine">Καταπότη 36, Σητεία.' +
        (res.client && res.client.email
          ? ' Στείλαμε email επιβεβαίωσης και θα λάβετε υπενθύμιση την προηγούμενη ημέρα.'
          : '') + '</p>' +
        '<div class="bk-done-actions">' +
        '<a href="${r("index.html")}" class="btn btn-ghost">Επιστροφή στην αρχική</a>' +
        '<button type="button" class="btn btn-ghost" id="bkAgain">Νέο ραντεβού</button>' +
        '</div></div>';
      var again = document.getElementById('bkAgain');
      if (again) again.addEventListener('click', function () {
        state.service = null; state.day = null; state.slot = null; state.days = null;
        renderServices();
      });
    }

    // Κλικ πάνω στα ολοκληρωμένα βήματα της μπάρας, δεύτερος τρόπος επιστροφής.
    var navs = stepsEl.querySelectorAll('button[data-goto]');
    for (var n = 0; n < navs.length; n++) {
      navs[n].addEventListener('click', function () {
        var to = Number(this.getAttribute('data-goto'));
        if (to === 1) { renderServices(); }
        else if (to === 2) { backToCalendar(); }
      });
    }

    setStep(1);
    loadCatalog();
  })();
  </script>` +
    footer(depth);
}

// ---- utils ----------------------------------------------------------
function fmtDate(iso) {
  const months = ["Ιανουαρίου","Φεβρουαρίου","Μαρτίου","Απριλίου","Μαΐου","Ιουνίου","Ιουλίου","Αυγούστου","Σεπτεμβρίου","Οκτωβρίου","Νοεμβρίου","Δεκεμβρίου"];
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${months[m - 1]} ${y}`;
}

// ====================================================================
//  SITEMAP + ROBOTS
// ====================================================================
function buildSitemap() {
  const urls = [
    { loc: "index.html", pr: "1.0", cf: "weekly" },
    { loc: "i-elena.html", pr: "0.8", cf: "monthly" },
    { loc: "ypiresies/index.html", pr: "0.9", cf: "monthly" },
    ...SERVICES.map((s) => ({ loc: "ypiresies/" + s.slug + ".html", pr: "0.9", cf: "monthly" })),
    ...AREAS.map((a) => ({ loc: "perioches/" + a.slug + ".html", pr: "0.7", cf: "monthly" })),
    { loc: "blog/index.html", pr: "0.7", cf: "weekly" },
    ...POSTS.map((p) => ({ loc: "blog/" + p.slug + ".html", pr: "0.6", cf: "monthly", lm: p.date })),
    { loc: "epikoinonia.html", pr: "0.8", cf: "yearly" },
    { loc: "ratevou.html", pr: "0.9", cf: "monthly" },
    ...(OFFERS.length ? [{ loc: "prosfores.html", pr: "0.9", cf: "weekly" }] : []),
  ];
  const today = new Date().toISOString().slice(0, 10);
  const body = urls
    .map(
      (u) =>
        `  <url><loc>${abs(u.loc)}</loc><lastmod>${u.lm || today}</lastmod><changefreq>${u.cf}</changefreq><priority>${u.pr}</priority></url>`
    )
    .join("\n");
  const ns = "http://www.sitemaps.org/schemas/sitemap/0.9";
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="${ns}">\n${body}\n</urlset>\n`;
}

function buildRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`;
}

// ====================================================================
//  RUN
// ====================================================================
let n = 0;
const write = (p, html) => { out(p, html); n++; };

write("index.html", pageHome());
write("i-elena.html", pageAbout());
write("epikoinonia.html", pageContact());
write("ratevou.html", pageBooking());
if (OFFERS.length) write("prosfores.html", pageOffers());
write("ypiresies/index.html", pageServicesHub());
SERVICES.forEach((s, i) => write("ypiresies/" + s.slug + ".html", pageService(s, i)));
AREAS.forEach((a) => write("perioches/" + a.slug + ".html", pageArea(a)));
write("blog/index.html", pageBlogHub());
POSTS.forEach((p) => write("blog/" + p.slug + ".html", pagePost(p)));
out("sitemap.xml", buildSitemap());
out("robots.txt", buildRobots());

console.log(`✓ Generated ${n} HTML pages + sitemap.xml + robots.txt`);
