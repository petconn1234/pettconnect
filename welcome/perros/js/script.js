import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";
import { getFirestore, collection, addDoc } from  "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";


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



const onGetTasks =(callback) => db.collection('tasks').onSnapshot(callback)
const deleteTask = (id) => db.collection('tasks').doc(id).delete()

//  get tasks

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
  




// window laod 
window.addEventListener('DOMContentLoaded',async(e)=>{
	
	
	 
	onGetTasks((querySnapShot)=>{

	  taskContainer.innerHTML =''

			 querySnapShot.forEach(doc => {
				 const task = doc.data()

				  task.id = doc.id

				 taskContainer.innerHTML += `
				  <div class='box'>
					  <h3>${task.title} </h3>
					  <p>${task.description} </p>
					  <div class='btn-group'>
						<button class='btn-delete' data-id ="${task.id}" >Delete</button>
						<button class='edit-btn' data-id ="${task.id}" >Edit</button>
					  </div>
				  </div>  
				  `
			  //    delete items
			  const btnDelete = document.querySelectorAll('.btn-delete')

				  btnDelete.forEach((btn)=>{
					  btn.addEventListener('click',async(e)=>{
						  const idTask = e.target.dataset.id
						  =await deleteTask(idTask)
					  swal('Good Job!','Deleted ','success')

					  })
				  })
			  //    Update Data 
			   const btnEdit = document.querySelectorAll('.edit-btn');

				btnEdit.forEach((btn)=>{
					btn.addEventListener('click',async(e)=>{
					  const idTask = e.target.dataset.id
					  const doc = await getTasks(idTask)
					  const task = doc.data()
					  editStatus = true
					  id = idTask
					   
					   form['task-title'].value = task.title
					   form['task-description'].value = task.description
					   form['btn-task-form'].innerHTML = 'Update'


					})

				})

			 });
	})

})
