import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";
import { getFirestore, collection, addDoc } from  "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBiVELSaKhuhVZ4KAiq5StcPqhAayzxWlM",
    authDomain: "pets-9df20.firebaseapp.com",
    projectId: "pets-9df20",
    storageBucket: "pets-9df20.appspot.com",
    messagingSenderId: "846509275235",
    appId: "1:846509275235:web:48ce5423100ebb2f22a056",
    measurementId: "G-KY82DTFZ6R"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth();
var db = getFirestore(app);
const form = document.querySelector("#task-form")
const taskContainer = document.querySelector('#tasks-container')

let editStatus = false
let id = ''

const onGetTasks = (callback) => db.collection('perros').onSnapshot(callback);


window.addEventListener('DOMContentLoaded', async (e) => {
    onGetTasks((querySnapShot) => {
      taskContainer.innerHTML = ''
  
      querySnapShot.forEach(doc => {
        const task = doc.data()
        task.id = doc.id
  
        taskContainer.innerHTML += `
          <div class='box'>
            <h3>${task.nombre} </h3>
            <p>Edad: ${task.edad} </p>
            <p>Raza: ${task.raza} </p>
            <p>Género: ${task.genero} </p>
            <p>Descripción: ${task.descripcion} </p>
            <img src="${task.imagen}" alt="Imagen de perro">
            <div class='btn-group'>
              <button class='btn-delete' data-id ="${task.id}" >Delete</button>
              <button class='edit-btn' data-id ="${task.id}" >Edit</button>
            </div>
          </div>  
        `
  
      });
    });
  });
  