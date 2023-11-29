import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-analytics.js";
import { getAuth,   createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBiVELSaKhuhVZ4KAiq5StcPqhAayzxWlM",
  authDomain: "pets-9df20.firebaseapp.com",
  projectId: "pets-9df20",
  storageBucket: "pets-9df20.appspot.com",
  messagingSenderId: "846509275235",
  appId: "1:846509275235:web:48ce5423100ebb2f22a056",
  measurementId: "G-KY82DTFZ6R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

export class ManageAccount {
  register(email, password, displayName) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        return updateProfile(userCredential.user, {
          displayName: displayName
        });
      })
      .then((_) => {
        window.location.href = "login.html";
        // Mostrar alerta de registro exitoso
        alert("Registro exitoso. Serás redirigido a la página de inicio de sesión.");
      })
      .catch((error) => {
        console.error(error.message);
        // Mostrar alerta de error de registro
        alert("Error al registrar: " + error.message);
      });
  }

  authenticate(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((_) => {
        window.location.href = "../welcome/index.html";
        // Mostrar alerta de inicio de sesión exitoso
        alert("Has iniciado sesión correctamente. Serás redirigido a la página principal.");
      })
      .catch((error) => {
        console.error(error.message);
                // Mostrar alerta de error de inicio de sesión
                alert("Error al iniciar sesión: " + error.message);
      });
  }

  signOut() {
    signOut(auth)
      .then((_) => {
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  userLog() {
    var a;
    const auth = getAuth();
    var li = document.getElementById("miElemento");
    
    var li2 = document.getElementById("logout");
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            li.innerHTML = `<ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
            <a class="getstarted" > bienvenido ${user.displayName}</a>
            </li>`;

            li2.innerHTML = `
          
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
              <li class="nav-item">
        <a class="getstarted" href="#" style="background-color: red; color: white; padding: 10px 20px; text-decoration: none;" onclick="logout()">Cerrar sesión</a>
    </li>`;

            a = user.displayName;

            
        } else {
            li.innerHTML = '<a class="getstarted" href="../login/login.html">Inicia sesion</a>';
            console.error("no fue");
        }

        return(user.email);
    });
  }

}

