import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";
import { getFirestore, collection, addDoc } from  "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";


const onGetTasks = (callback) => db.collection('perros').onSnapshot(callback);


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




const saveTask = (title,description)=>{
	 
	db.collection('tasks').doc().set({	
        title,	
        description
	 })

}

const deleteTask = (id) => db.collection('tasks').doc(id).delete()


 const getTasks = (id) => db.collection('tasks').doc(id).get()

 const UpdateTask = (id,updateTask)=>{
	db.collection('tasks').doc(id).update(updateTask)
 }



// function add tasks
form.addEventListener('submit', async (e) => {
	e.preventDefault();
  
	const nombre = document.getElementById('nombre').value;
	const edad = document.getElementById('edad').value;
	const raza = document.getElementById('raza').value;
	const genero = document.getElementById('genero').value;
	const descripcion = document.getElementById('descripcion').value;
	const imagen = document.getElementById('imagen').files[0];
  
	// Crear una referencia al lugar donde guardaremos la imagen
	var storage = getStorage();
	var storageRef = ref(storage, 'images/' + imagen.name);
  
	// Subir la imagen
	var uploadTask = uploadBytesResumable(storageRef, imagen);
  
	uploadTask.on('state_changed', 
	  (snapshot) => {
		// Observar los cambios en el estado de la subida
		var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		console.log('Upload is ' + progress + '% done');
	  }, 
	  (error) => {
		// Manejar errores
		console.error("Error subiendo archivo: ", error);
	  }, 
	  () => {
		// Subida completada exitosamente, ahora obtenemos la URL de descarga
		getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
		  console.log('File available at', downloadURL);
  
		  // Ahora que tenemos la URL de la imagen, podemos guardarla en Firestore junto con los otros datos
		  try {
			const docRef = await addDoc(collection(db, "perros"), {
			  nombre: nombre,
			  edad: edad,
			  raza: raza,
			  genero: genero,
			  descripcion: descripcion,
			  imagen: downloadURL,
			  usuario: auth.currentUser.uid  // Asegúrate de que el usuario esté conectado
			});
			console.log("Document written with ID: ", docRef.id);
		  } catch (error) {
			console.error("Error adding document: ", error);
		  }
		});
	  }
	);
  });
  
  
