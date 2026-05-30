# Școala de Arte Criuleni - Website Oficial

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

Acest proiect reprezintă website-ul oficial pentru **Instituția Publică Școala de Arte din Criuleni**. A fost dezvoltat cu scopul de a oferi o platformă modernă, informativă și accesibilă pentru elevi, părinți și comunitate.

Site-ul a fost realizat de echipa **TehnicART** în cadrul competiției *"Tekwill Junior Ambassadors"*, organizată de proiectul "Tekwill în Fiecare Școală" și nu reflectă neapărat opinia proiectului.

## 🚀 Demo Live

Vizitați site-ul publicat aici: **[Scoala_de_arte_Criuleni.github.io](https://iurcoegor.github.io/Scoala_de_arte_Criuleni/)**

## ✨ Caracteristici Cheie

- **Design Responsive și Modern:** Interfață complet adaptabilă pentru desktop, tablete și dispozitive mobile, construită cu Flexbox și Grid Layout.
- **Navigare Intuitivă:**
  - Meniu complex pe desktop cu dropdown-uri pentru acces rapid la secțiuni.
  - Meniu modern, animat, în partea de jos a ecranului pentru o experiență optimă pe mobil.
- **Conținut Dinamic și Centralizat:**
  - **Secțiune de Activități:** Evenimentele sunt încărcate dintr-un fișier central (`js/events-data.js`), cu paginare automată și animații la afișare.
  - **Listă Profesori:** Datele despre cadrele didactice sunt generate dinamic din `js/profesori.js`, facilitând actualizările.
  - **Noutăți pe Homepage:** Ultimele 3 evenimente sunt sortate și afișate automat pe pagina principală.
- **Componente Interactive Avansate:**
  - **Calendar de Evenimente:** Widget interactiv pe pagina de activități care marchează zilele cu evenimente, afișează tooltip-uri și permite navigarea rapidă către eveniment.
  - **Carusel pentru Parteneri:** Carusel custom cu autoplay, controale manuale, indicatori (dots) și adaptare a numărului de elemente vizibile în funcție de rezoluție.
  - **Acordeon Animat:** Prezentare elegantă și interactivă a specializărilor.
  - **Buton "Scroll to Top"** și alte micro-interacțiuni pentru o experiență de utilizare fluidă.
- **Integrare Backend cu Firebase:**
  - **Pagină de Eroare 404:** O pagină personalizată și prietenoasă pentru link-uri invalide, care îmbunătățește experiența utilizatorului.
  - **Formulare Funcționale:** Formular de contact și de înscriere cu validare avansată client-side.
  - **Colectare de Date:** Datele din formulare sunt trimise și stocate în siguranță în **Firestore Database**.
  - **Notificări Toast:** Feedback vizual pentru utilizator la trimiterea cu succes sau în caz de eroare a unui formular.
- **Optimizări și Accesibilitate:** Utilizare corectă a tag-urilor semantice HTML5, atribute `alt` pentru imagini și atribute `aria` pentru componentele interactive, asigurând o experiență mai bună pentru toți utilizatorii.

## 🛠️ Tehnologii Utilizate

- **Frontend:**
  - HTML5 (Semantic)
  - CSS3 (Flexbox, Grid, Animații, Media Queries)
  - JavaScript (ES6+)
- **Backend & Stocare Date:**
  - Google Firebase (Firestore Database)
- **Utilitare & Biblioteci:**
  - Google Fonts
  - Font Awesome

## 📂 Structura Proiectului

```
/
├── 404.html                  # Pagina de eroare
├── index.html                # Pagina principală
├── README.md                 # Acest fișier
├── css/
│   ├── home-activitati.css   # Stiluri pentru pagina index și activități
│   ├── pages-content.css     # Stiluri pentru celelalte pagini
│   └── style.css             # Fișierul principal de stiluri  
├── js/
│   ├── main.js               # Script principal (navigație, carusel, etc.)
│   ├── events-data.js        # Baza de date a evenimentelor
│   ├── events-loader.js      # Logica pentru încărcarea și paginarea evenimentelor
│   ├── profesori.js          # Datele și logica pentru afișarea profesorilor
│   ├── calendar.js           # Logica pentru widget-ul de calendar
│   ├── forms.js              # Logica pentru validarea și trimiterea formularelor
│   └── firebase.js           # Configurația Firebase
├── pages/
│   ├── despre.html           # Informații generale despre instituție
│   ├── specializari.html     # Detalii despre disciplinele și cursurile oferite
│   ├── activitati.html       # Calendarul și galeria evenimentelor școlare
│   └── contacte.html         # Formular de contact și date de localizare
├── link-pages/               
│   ├── profesori.html        # Pagina dedicată cadrelor didactice
│   ├── istoric.html          # Pagina cu istoricul instituției
│   └── ...                   # Pagini individuale pentru fiecare știre/eveniment
├── images/                   
│   ├── accordion/            # Imagini utilizate în secțiunea de specializări
│   │   └── ...
│   ├── news-img/             # Imagini pentru secțiunea de noutăți
│   │   └── ...
│   └── ...                   # Toate resursele grafice (logo, fundaluri, imagini)
└── resources/                # Documente (ex: PDF-uri)
    └── ...
```

## 👨‍💻 Autori

- **Iurco Egor** - Dezvoltare Frontend & Backend (Firebase)
- **Loghin Victor** - Design & Conținut

Echipa **TehnicART**

## 🙏 Mulțumiri

Mulțumiri speciale proiectului **"Tekwill în Fiecare Școală"** pentru oportunitatea de a participa la competiția "Tekwill Junior Ambassadors" și pentru susținerea educației digitale în Moldova.
