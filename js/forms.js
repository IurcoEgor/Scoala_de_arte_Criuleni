
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDkLId9RhXjPqL3tb6mX1ZC3BXhfeUkCk0",
  authDomain: "scoala-de-arte-criuleni.firebaseapp.com",
  projectId: "scoala-de-arte-criuleni",
  storageBucket: "scoala-de-arte-criuleni.firebasestorage.app",
  messagingSenderId: "55607629161",
  appId: "1:55607629161:web:b981b3f0d293fa251c19f8",
  measurementId: "G-243PZJ5L6Y"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const contactForm = document.querySelector('.contactare');
const registrationForm = document.querySelector('.inscrie');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    addDoc(collection(db, 'contact'), {
      name: contactForm.name.value,
      email: contactForm.email.value,
      phone: contactForm.phone.value,
      message: contactForm.message.value,
    }).then(() => {
      alert('Mesajul a fost trimis cu succes!');
      contactForm.reset();
    }).catch(error => {
      console.error("Error adding document: ", error);
      alert('A apărut o eroare. Vă rugăm să încercați din nou.');
    });
  });
}

if (registrationForm) {
  registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    addDoc(collection(db, 'inregistrari'), {
      studentName: registrationForm['nume-prenume-elev'].value,
      studentAge: registrationForm['varsta-elev'].value,
      studentGender: registrationForm['gen-elev'].value,
      parentName: registrationForm['nume-prenume-parinte'].value,
      city: registrationForm.localitate.value,
      email: registrationForm.email.value,
      phone: registrationForm.telefon.value,
      specialization: registrationForm.specializare.value,
    }).then(() => {
      alert('Înregistrarea a fost trimisă cu succes!');
      registrationForm.reset();
    }).catch(error => {
      console.error("Error adding document: ", error);
      alert('A apărut o eroare la înregistrare. Vă rugăm să încercați din nou.');
    });
  });
}
