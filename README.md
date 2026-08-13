# Beauty Lab by Elena Spyridaki — Ιστοσελίδα

Στατική ιστοσελίδα (HTML/CSS/JS, χωρίς framework) για το **Beauty Lab by Elena
Spyridaki** — Αισθητικός Κοσμητολόγος & Διαιτολόγος, Καταπότη 36, Σητεία Λασιθίου.
Παλέτα **χρυσό / λευκό / μαύρο / απαλό ροζ**, με το χρυσό δειγματοληπτημένο από
το λογότυπο (`#b4783c`).

Ίδιο layout, δομή και τεχνικό SEO με το `dental-harmony-website` (Δρ. Μαγκι Δήμου) —
αλλάζουν μόνο τα χρώματα, το περιεχόμενο και τα assets.

## Δομή (34 σελίδες)

```
index.html                     Αρχική
i-elena.html                   Βιογραφικό — Έλενα Σπυριδάκη
epikoinonia.html               Επικοινωνία + χάρτης
ypiresies/index.html           Όλες οι υπηρεσίες (hub)
ypiresies/<υπηρεσία>.html      11 σελίδες υπηρεσιών
perioches/<περιοχή>.html       6 τοπικές σελίδες SEO (Σητεία, Ιεράπετρα, κ.λπ.)
blog/index.html                Blog (hub)
blog/<άρθρο>.html              12 άρθρα (long-tail keywords)
sitemap.xml, robots.txt        Τεχνικό SEO
assets/                        logo.png, logo-mark.png, logo.jpg, institute.jpg
styles.css, main.js            Κοινό στυλ & συμπεριφορά
build/                         Γεννήτρια (data.mjs + build.mjs)
```

### Οι 11 υπηρεσίες

Αδυνάτισμα & Σύσφιξη · Κυτταρίτιδα · Λεμφική Αποσυμφόρηση · Βαθύς Καθαρισμός ·
Ενυδάτωση & Θρέψη · Λεύκανση & Δυσχρωμίες · Peeling & Αντιγήρανση · Μεσοθεραπεία ·
Αποτρίχωση Laser (Alexandrite & Diode) · Ριζική/Ενζυμική/Κερί & Κλωστή ·
Διατροφή & Διαιτολογική Υποστήριξη

## SEO που υλοποιήθηκε

- **Πολλαπλές στοχευμένες σελίδες**: 11 υπηρεσίες + 6 τοπικές + 12 άρθρα, με
  μοναδικά keywords, μοναδικό `<title>` & `meta description` ανά σελίδα
  (επαληθεύτηκε: 34/34 μοναδικοί τίτλοι, όλοι ≤ 68 χαρακτήρες).
- **Structured data (JSON-LD)**: BeautySalon/HealthAndBeautyBusiness/LocalBusiness
  (διεύθυνση, **διπλό ωράριο**, geo, social), BreadcrumbList παντού, Service στις
  υπηρεσίες, FAQPage, BlogPosting, Person, WebSite/ItemList.
- **Open Graph & Twitter cards**, canonical URLs, `lang="el"`, semantic HTML,
  εσωτερική διασύνδεση, alt σε εικόνες, breadcrumbs.
- **sitemap.xml** + **robots.txt** έτοιμα για Google Search Console.
- Mobile-first responsive, γρήγορο (χωρίς βαριά scripts), accessible (skip link,
  aria labels, focus states). Ελέγχθηκε: 0 σπασμένοι σύνδεσμοι, 0 άκυρα JSON-LD.

## Αναγέννηση σελίδων

Όλο το κείμενο/δεδομένα ζουν στο `build/data.mjs`. Μετά από αλλαγή:

```bash
node build/build.mjs
```

Παράγει ξανά όλες τις σελίδες + sitemap + robots. (Το `styles.css` & `main.js`
είναι χειρόγραφα — δεν τα ακουμπά η γεννήτρια.)

## ⚠️ Πριν το live — επιβεβαιώστε/διορθώστε

1. **Domain**: δεν υπάρχει ακόμη. Όλα τα canonical/OG/sitemap URLs χρησιμοποιούν
   προσωρινά `https://beautylab-sitia.gr`. Αλλάξτε το `BASE` στην κορυφή του
   `build/data.mjs` και τρέξτε ξανά τη γεννήτρια.
2. **Email**: χρησιμοποιείται το προσωπικό `elena.spiridaki@gmail.com`. Μόλις
   υπάρχει domain, προτείνεται επαγγελματικό (π.χ. `info@…`) — αλλαγή στο `BIZ.email`.
3. **Social URLs**: το Instagram (`elena_spiridaki_beauty_lab`) προέκυψε από το
   handle που έδωσε η πελάτισσα. Το **Facebook** (`facebook.com/thebeautylab`)
   είναι **εικαζόμενο** — βάλτε το πραγματικό link. Δεν υπάρχει TikTok, οπότε
   αφαιρέθηκε από footer/επικοινωνία/schema.
4. **Συντεταγμένες χάρτη** (`lat`/`lng` στο `data.mjs`): προσεγγιστικές για το
   κέντρο Σητείας. Βάλτε τις ακριβείς για σωστό pin.
5. **Βιογραφικό — έτη σπουδών**: στα στοιχεία του πελάτη οι χρονολογίες για το
   ΤΕΙ Αθήνας ήταν διφορούμενες («97-2000 … 2000-2002»). Γράφτηκε **χωρίς
   χρονολογία** για το ΠΑΔΑ. Ζητήστε επιβεβαίωση και συμπληρώστε.
6. **Μπαλέτο / Βασιλική Ακαδημία**: η πελάτισσα σημείωσε «αυτό ίσως μη το βάλατε»
   — **δεν συμπεριλήφθηκε**. Πείτε μας αν το θέλει τελικά.
7. **Φωτογραφίες**: υπάρχει μόνο φωτογραφία του χώρου (κομμένη από screenshot
   Messenger, `assets/institute.jpg`, 682×387 — χαμηλή ανάλυση). **Ζητήστε
   πορτρέτο της Έλενας + φωτογραφίες θεραπειών/χώρου σε καλή ανάλυση** — θα
   ανεβάσουν αισθητά την ποιότητα της αρχικής και της σελίδας «Η Έλενα».
8. **Λογότυπο**: το `logo.png` παρήχθη με αφαίρεση φόντου από το JPG (354×354).
   Αν υπάρχει το πρωτότυπο σε **vector (AI/SVG/PDF)**, ζητήστε το — θα δίνει
   τέλεια ευκρίνεια στο hero.
9. Μετά το live: υποβολή `sitemap.xml` στο Google Search Console + δημιουργία
   **Google Business Profile** (δεν υπάρχει ακόμη) για τοπικό SEO.

## Τοπική προεπισκόπηση

Ανοίξτε το `index.html` σε browser, ή σερβίρετε τον φάκελο:
`python3 -m http.server` και επισκεφθείτε `http://localhost:8000`.

Συμβουλή: το `#showall` στο URL (π.χ. `index.html#showall`) εμφανίζει αμέσως όλα
τα στοιχεία, παρακάμπτοντας τα reveal-on-scroll animations.

```
Made by CLINICBRAIN — https://clinicbrain.gr/
```
