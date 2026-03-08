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
    
    // Limitare la maxim 3 toast-uri: eliminăm pe cel mai vechi dacă există deja 3
    while (container.children.length >= 4) {
        const oldestToast = container.firstElementChild;
        // Dacă toast-ul este deja în curs de închidere, îl eliminăm imediat pentru a face loc
        if (oldestToast.classList.contains('closing')) {
            oldestToast.remove();
        } else {
            // Altfel, declanșăm animația de închidere și ieșim din buclă (considerăm locul eliberat vizual)
            oldestToast.classList.add('closing');
            oldestToast.addEventListener('animationend', () => oldestToast.remove());
            break;
        }
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    
    toast.innerHTML = `
        <i class="fa-solid ${iconClass}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);

    // Eliminare automată după 5 secunde
    setTimeout(() => {
        toast.classList.add('closing');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 5000);
}

// Funcție helper pentru validarea formularelor
function validateForm(form) {
    // Șterge erorile vechi
    form.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.classList.remove('visible');
    });
    form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));

    if (form.checkValidity()) {
        return true;
    }

    // Afișează erori noi
    for (const element of form.elements) {
        if (element.willValidate && !element.checkValidity()) {
            element.classList.add('invalid');
            const errorContainer = element.closest('.form-group, .input-container');
            if (errorContainer) {
                const errorMessageElement = errorContainer.querySelector('.error-message');
                if (errorMessageElement) {
                    let message = "Acest câmp este obligatoriu."; // Mesaj implicit
                    if (element.validity.patternMismatch) {
                        message = element.title || "Formatul datelor este invalid.";
                    } else if (element.validity.typeMismatch && element.type === 'email') {
                        message = "Introduceți o adresă de e-mail validă.";
                    } else if (element.validity.rangeUnderflow || element.validity.rangeOverflow) {
                        message = `Valoarea trebuie să fie între ${element.min} și ${element.max}.`;
                    }
                    
                    errorMessageElement.textContent = message;
                    errorMessageElement.classList.add('visible');
                }
            }
        }
    }
    
    const firstInvalid = form.querySelector('.invalid');
    if (firstInvalid) {
        firstInvalid.focus();
    }

    return false;
}

// Funcție pentru a curăța eroarea la introducerea datelor
function clearErrorOnInput(form) {
    form.addEventListener('input', (e) => {
        const element = e.target;
        if (element.willValidate && element.checkValidity()) {
            element.classList.remove('invalid');
            const errorContainer = element.closest('.form-group, .input-container');
            const errorMessageElement = errorContainer?.querySelector('.error-message');
            if (errorMessageElement) {
                errorMessageElement.classList.remove('visible');
            }
        }
    });
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
    clearErrorOnInput(contactForm);
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateForm(contactForm)) {
            showToast('Vă rugăm să corectați erorile din formular.', 'error');
            return;
        }

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
            
            // Resetare contor caractere
            const charCount = document.getElementById('charCount');
            if (charCount) {
                charCount.textContent = '0 / 300';
                charCount.classList.remove('limit-reached');
            }
        }).catch(error => {
            console.error("Error adding document: ", error);
            showToast('A apărut o eroare. Încearcă din nou.', 'error');
        }).finally(() => {
            setButtonLoading(contactForm, false);
        });
    });
}

if (registrationForm) {
    clearErrorOnInput(registrationForm);
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateForm(registrationForm)) {
            showToast('Vă rugăm să completați corect toate câmpurile.', 'error');
            return;
        }

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
