import { app } from "./firebase.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const db = getFirestore(app);

const contactForm = document.querySelector('.contactare');
const registrationForm = document.querySelector('.inscrie');

function getToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

function showToast(message, type = 'success') {
    const container = getToastContainer();

    while (container.children.length >= 4) {
        const oldestToast = container.firstElementChild;
        if (oldestToast.classList.contains('closing')) {
            oldestToast.remove();
        } else {
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

    setTimeout(() => {
        toast.classList.add('closing');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 5000);
}

function validateForm(form) {
    form.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.classList.remove('visible');
    });
    form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));

    if (form.checkValidity()) {
        return true;
    }

    for (const element of form.elements) {
        if (element.willValidate && !element.checkValidity()) {
            element.classList.add('invalid');
            const errorContainer = element.closest('.form-group, .input-container');
            if (errorContainer) {
                const errorMessageElement = errorContainer.querySelector('.error-message');
                if (errorMessageElement) {
                    let message = "Acest câmp este obligatoriu.";
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

            const charCount = document.getElementById('charCount');
            if (charCount) {
                charCount.textContent = '0 / 500';
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

function calculateAge(birthDateString) {
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

const birthDateInput = document.getElementById('data-nasterii-elev');
if (birthDateInput) {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
    birthDateInput.min = minDate.toISOString().split('T')[0];
    birthDateInput.max = maxDate.toISOString().split('T')[0];
}

if (registrationForm) {
    clearErrorOnInput(registrationForm);

    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');
    const progressStep1 = document.getElementById('progress-step-1');
    const progressStep2 = document.getElementById('progress-step-2');

    if (btnNext && btnPrev) {
        btnNext.addEventListener('click', () => {
            let step1Valid = true;
            const fieldsToValidate = step1.querySelectorAll('input, select');

            step1.querySelectorAll('.error-message').forEach(el => {
                el.textContent = '';
                el.classList.remove('visible');
            });
            step1.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));

            fieldsToValidate.forEach(element => {
                if (element.willValidate && !element.checkValidity()) {
                    step1Valid = false;
                    element.classList.add('invalid');
                    const errorContainer = element.closest('.form-group, .input-container');
                    if (errorContainer) {
                        const errorMessageElement = errorContainer.querySelector('.error-message');
                        if (errorMessageElement) {
                            let message = "Acest câmp este obligatoriu.";
                            if (element.validity.patternMismatch) {
                                message = element.title || "Formatul datelor este invalid.";
                            }
                            errorMessageElement.textContent = message;
                            errorMessageElement.classList.add('visible');
                        }
                    }
                }
            });

            if (step1Valid) {
                step1.style.display = 'none';
                step2.style.display = 'block';
                progressStep1.classList.remove('active');
                progressStep2.classList.add('active');
                const formTop = registrationForm.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: formTop, behavior: 'smooth' });
            } else {
                const firstInvalid = step1.querySelector('.invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                    showToast('Vă rugăm să completați corect toate câmpurile de la pasul 1.', 'error');
                }
            }
        });

        btnPrev.addEventListener('click', () => {
            step2.style.display = 'none';
            step1.style.display = 'block';
            progressStep2.classList.remove('active');
            progressStep1.classList.add('active');
            const formTop = registrationForm.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: formTop, behavior: 'smooth' });
        });
    }

    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateForm(registrationForm)) {
            showToast('Vă rugăm să completați corect toate câmpurile.', 'error');
            return;
        }

        if (!document.getElementById('nume-mama').value.trim() && !document.getElementById('nume-tata').value.trim()) {
            showToast('Vă rugăm să completați datele pentru cel puțin un părinte (Mamă sau Tată).', 'error');
            return;
        }

        setButtonLoading(registrationForm, true);

        const birthDateValue = registrationForm['data-nasterii-elev'].value;

        addDoc(collection(db, 'inregistrari'), {
            studentName: registrationForm['nume-prenume-copil'].value,
            studentBirthDate: birthDateValue,
            studentAge: calculateAge(birthDateValue),
            clasaGenerala: registrationForm['clasa-generala'].value,
            limba: registrationForm.limba.value,
            domiciliuElev: registrationForm['domiciliu-copil'].value,
            specialization: registrationForm.specializare.value,
            professor: registrationForm.profesor.value,
            clasaSpecialitate: registrationForm['clasa-specialitate'].value,
            parentMama: {
                nume: registrationForm['nume-mama'].value,
                telefon: registrationForm['telefon-mama'].value,
                domiciliu: registrationForm['domiciliu-mama'].value
            },
            parentTata: {
                nume: registrationForm['nume-tata'].value,
                telefon: registrationForm['telefon-tata'].value,
                domiciliu: registrationForm['domiciliu-tata'].value
            },
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

function initCustomSelect(selectId) {
    const select = document.getElementById(selectId);
    if (!select || select.dataset.customInitialized) return;
    select.dataset.customInitialized = "true";

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select-wrapper';
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);
    select.style.display = 'none';

    const selectedDiv = document.createElement('div');
    selectedDiv.className = 'custom-select-selected';
    wrapper.appendChild(selectedDiv);

    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'custom-select-options select-hide';
    wrapper.appendChild(optionsDiv);

    const refreshUI = () => {
        const isPlaceholder = select.value === "" || (select.options[select.selectedIndex]?.disabled);
        const text = isPlaceholder ? "\u00A0" : (select.options[select.selectedIndex]?.innerHTML || "");

        selectedDiv.innerHTML = `<span class="selected-text">${text}</span><i class="fa-solid fa-chevron-down custom-select-icon"></i>`;

        optionsDiv.innerHTML = '';
        Array.from(select.options).forEach((opt, idx) => {
            if (opt.disabled && opt.value === "") return;

            const optionDiv = document.createElement('div');
            optionDiv.innerHTML = opt.innerHTML;
            optionDiv.className = 'custom-select-option';
            if (select.selectedIndex === idx) optionDiv.classList.add('same-as-selected');

            optionDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                select.selectedIndex = idx;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                select.dispatchEvent(new Event('input', { bubbles: true }));
                closeDropdowns();
            });
            optionsDiv.appendChild(optionDiv);
        });
    };

    select.addEventListener('change', refreshUI);

    const observer = new MutationObserver(refreshUI);
    observer.observe(select, { childList: true });

    refreshUI();

    selectedDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        const wasActive = selectedDiv.classList.contains('select-arrow-active');
        closeDropdowns();
        if (!wasActive) {
            selectedDiv.classList.add('select-arrow-active');
            selectedDiv.closest('.form-group')?.classList.add('is-active');
            optionsDiv.classList.remove('select-hide');
        }
    });
}

function closeDropdowns() {
    document.querySelectorAll('.custom-select-selected').forEach(s => {
        s.classList.remove('select-arrow-active');
        if (s.nextElementSibling) s.nextElementSibling.classList.add('select-hide');
    });
    document.querySelectorAll('.form-group.is-active').forEach(fg => fg.classList.remove('is-active'));
}

document.addEventListener('click', closeDropdowns);

initCustomSelect('specializare');
initCustomSelect('profesor');

if (registrationForm) {
    registrationForm.addEventListener('reset', () => {
        setTimeout(() => {
            document.querySelectorAll('.custom-select-wrapper select').forEach(select => {
                select.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }, 10);
    });
}

const setupParentFields = (nameId, telId, domId) => {
    const name = document.getElementById(nameId);
    const tel = document.getElementById(telId);
    const dom = document.getElementById(domId);
    name.addEventListener('input', () => {
        const isRequired = name.value.trim() !== '';
        tel.required = isRequired;
        dom.required = isRequired;
    });
};
setupParentFields('nume-mama', 'telefon-mama', 'domiciliu-mama');
setupParentFields('nume-tata', 'telefon-tata', 'domiciliu-tata');

function setupClasaField(id) {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener('blur', function () {
        let val = this.value.trim().toLowerCase();

        if (/^(i|ii|iii|iv|v|vi|vii|viii|ix)$/.test(val)) {
            this.value = val.toUpperCase();
            return;
        }
    });
}
setupClasaField('clasa-generala');
setupClasaField('clasa-specialitate');
