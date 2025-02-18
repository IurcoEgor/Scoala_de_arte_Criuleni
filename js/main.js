
// Data
var data = new Date();
document.getElementById('an').innerHTML = data.getFullYear();

// Formular

document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('#nume-prenume-elev, #nume-prenume-parinte, #localitate, #nume');

    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            this.value = this.value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        });
    });
});

function checkLength(el) {
    const maxLength = 300;
    const currentLength = el.value.length;
    const charCount = document.getElementById('charCount');
    charCount.textContent = `${currentLength}/${maxLength} caractere`;
    if (currentLength >= maxLength) {
        charCount.style.color = 'red';
    } else {
        charCount.style.color = 'black';
    }
}

// Denumirea paginii

document.addEventListener("DOMContentLoaded", function () {
    const span = document.getElementById("page-name");
    const pageTitles = {
        "index": "Homepage",
        "despre": "Despre Noi",
        "istoricul": "Despre Noi - Istoric",
        "specializari": "Specializări",
        "extracuricul": "Activități",
        "contacte": "Info & Contacte",
        "artmartisor": "Activități - Proiect Educațional Internațional ArtMărțișor"
    };
    const pageTitle = pageTitles[window.location.pathname.split('/').pop().split('.')[0]] || "Pagina Necunoscută";

    if (span) {
        span.textContent = pageTitle;
    }
});

// Accordion

const accordion = document.querySelector(".accordion");
accordion.addEventListener("click", (e) => {
    const activePanel = e.target.closest(".accordion-panel");
    if (!activePanel) return;
    toggleAccordion(activePanel);
})

function toggleAccordion(panelToActivate) {
    const buttons = panelToActivate.parentElement.querySelectorAll('button');
    const contents = panelToActivate.parentElement.querySelectorAll('.accordion-content');

    buttons.forEach((button) => {
        button.setAttribute('aria-expanded', false)
    });

    contents.forEach((contents) => {
        contents.setAttribute('aria-hidden', true)
    });

    panelToActivate.querySelector('button').setAttribute('aria-expanded', true);
    panelToActivate.querySelector('.accordion-content').setAttribute('aria-hidden', false);
}
