
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js"; 
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyCtbEWLgmjrjZA4tTAOMWDUgh7pvurhozI",
  authDomain: "projectbreak2-e3fc1.firebaseapp.com",
  projectId: "projectbreak2-e3fc1",
  storageBucket: "projectbreak2-e3fc1.firebasestorage.app",
  messagingSenderId: "337211065587",
  appId: "1:337211065587:web:027afbafbd6170ef07e386",
  measurementId: "G-YMC9Z38BRG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const mensaje= document.getElementById("mensaje")

const login = async () => {
  event.preventDefault() //evita que recargue la página
  // con esto verificamos el usuario
  try {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const userCredencial = await signInWithEmailAndPassword(auth, email, password)
    const idToken = await userCredencial.user.getIdToken()
    console.log(idToken); 
    const response = await fetch("/login" , {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idToken })
    })
    const data = await response.json();
    console.log(data);  // Para ver qué devuelve el servidor

    if (data.success) {
      window.location.href = "/api/products";  // Redirigir al products
    } else {
      mensaje.textContent = "No se ha podido iniciar sesión. Por favor, inténtalo de nuevo.";
    }

  } catch (error) {
    console.error("Error al intentar iniciar sesión:", error);
    mensaje.textContent = "Hubo un problema al intentar iniciar sesión, por favor intenta de nuevo.";
  }  
}

document.getElementById("loginButton").addEventListener("click", login)

