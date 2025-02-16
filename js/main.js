// Data
var data = new Date();
document.getElementById('an').innerHTML = data.getFullYear();

//  Meniu mobil
const hamburgerMenu = document.querySelector('.hamburger-menu');
if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('show');
    });
}

// Formular

document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('#nume-elev, #prenume-elev, #nume-parinte, #prenume-parinte, #localitate');

    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1).toLowerCase();
        });
    });
});

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
