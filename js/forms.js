import { app } from "./firebase.js"; 
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const db = getFirestore(app);

const contactForm = document.querySelector('.contactare');
const registrationForm = document.querySelector('.inscrie');

// Funcție pentru crearea containerului de notificări dacă nu există
function getToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

// Funcție pentru afișarea notificărilor (Toast)
function showToast(message, type = 'success') {
    const container = getToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    
    toast.innerHTML = `
        <i class="fa-solid ${iconClass}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);

    // Eliminare automată după 4 secunde
    setTimeout(() => {
        toast.classList.add('closing');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 4000);
}

// Funcție helper pentru gestionarea stării butonului
function setButtonLoading(form, isLoading) {
    const btn = form.querySelector('button[type="submit"], input[type="submit"]');
    if (!btn) return;

    if (isLoading) {
        btn.dataset.originalText = btn.innerText || btn.value;
        btn.disabled = true;
        if (btn.tagName === 'INPUT') {
            btn.value = 'Se trimite...';
        } else {
            btn.innerText = 'Se trimite...';
        }
        btn.style.opacity = '0.7';
        btn.style.cursor = 'not-allowed';
    } else {
        btn.disabled = false;
        if (btn.tagName === 'INPUT') {
            btn.value = btn.dataset.originalText;
        } else {
            btn.innerText = btn.dataset.originalText;
        }
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    }
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        setButtonLoading(contactForm, true);

        addDoc(collection(db, 'contact'), {
            Nume: contactForm.name.value,
            Email: contactForm.email.value,
            Telefon: contactForm.phone.value,
            Mesajul: contactForm.message.value,
            Data: new Date().toISOString()
        }).then(() => {
            showToast('Mesajul a fost trimis cu succes!', 'success');
            contactForm.reset();
        }).catch(error => {
            console.error("Error adding document: ", error);
            showToast('A apărut o eroare. Încearcă din nou.', 'error');
        }).finally(() => {
            setButtonLoading(contactForm, false);
        });
    });
}

if (registrationForm) {
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        setButtonLoading(registrationForm, true);

        addDoc(collection(db, 'inregistrari'), {
            studentName: registrationForm['nume-prenume-elev'].value,
            studentAge: registrationForm['varsta-elev'].value,
            studentGender: registrationForm['gen-elev'].value,
            parentName: registrationForm['nume-prenume-parinte'].value,
            city: registrationForm.localitate.value,
            email: registrationForm.email.value,
            phone: registrationForm.telefon.value,
            specialization: registrationForm.specializare.value,
            timestamp: new Date().toISOString()
        }).then(() => {
            showToast('Înregistrarea a fost trimisă cu succes!', 'success');
            registrationForm.reset();
        }).catch(error => {
            console.error("Error adding document: ", error);
            showToast('Eroare la înregistrare. Încearcă din nou.', 'error');
        }).finally(() => {
            setButtonLoading(registrationForm, false);
        });
    });
}
