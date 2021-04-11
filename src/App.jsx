import React, {useState, useEffect} from 'react'
import {store} from './firebase'

function App() {
  const [modoedicion, setmodoedicion] = useState(null)
  const [idusuario, setidusuario] = useState('')
  const [nombre, setnombre] = useState('')
  const [phone, setphone] = useState('')
  const [usuarios, setusuario] = useState([])
  const [error, seterror] = useState('')

  const getUsuarios = async()=>{
    const {docs} = await store.collection('agenda').get() //objects destructuring, accede a la propiedad docs de la respuesta 
    const nuevoArray = docs.map(item =>({id:item.id, ...item.data()}))
    setusuario(nuevoArray)
  }
  
  const borrarUsuario = async (id)=>{
    try{
      await store.collection('agenda').doc(id).delete()
      getUsuarios()
    }
    catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    getUsuarios()
  }, [])


  const setusuarios = async (e)=>{
    //capturar evento del formulario
    e.preventDefault()
    if(!nombre.trim()){
      seterror("El campo nombre está vacío")
      return
    }
    if(!phone.trim()){
      seterror("El campo telefono esta vacio")
    }
    const objusuario ={
      nombre:nombre,
      phone:phone
    }
    try{
      const dato = await store.collection('agenda').add(objusuario)
      await getUsuarios()
      alert('Usuario añadido')
      
    }
     catch(e){
      console.log(e)
     }
     setnombre('')
     setphone('')
  }

  const setupdate = async (e)=>{
    e.preventDefault()
    if(!nombre.trim()){
      seterror("El campo nombre está vacío")
      return
    }
    if(!phone.trim()){
      seterror("El campo telefono esta vacio")
    }

    const usuarioActualizado = {
      nombre:nombre,
      phone:phone
    }
    try{
      await store.collection('agenda').doc(idusuario).set(usuarioActualizado)
      getUsuarios()
    }
    catch(e){
      console.log(e)
    }
    setnombre('')
    setphone('')
    setidusuario('')
    setmodoedicion(false)
  }

  const pulsarActualizar = async(id)=>{
    try{
      console.log(id)
      const datos = await store.collection('agenda').doc(id).get()
      const {nombre, phone} = datos.data()
      setnombre(nombre)
      setphone(phone)
      setidusuario(id)
      setmodoedicion(true)

    }
    catch(e){
      console.log(e)
    }
  }


  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h2>Formulario de usuarios</h2>
          <form className="form-group" onSubmit={modoedicion ? setupdate : setusuarios}>
            <input 
            value={nombre}
            onChange={(e)=>{setnombre(e.target.value)}}
            className="form-control"
            placeholder="Introduce el nombre"
            type="text"/>
            <input 
            value={phone}
            onChange={(e)=>{setphone(e.target.value)}}
            className="form-control mt-3"
            placeholder="Introduce el numero"
            type="text"/>
            {
              modoedicion ?
              (  <input 
                className="btn btn-dark btn-block mt-3"
                value="Editar"
                type="submit"/>)
              :
              (  <input 
                className="btn btn-dark btn-block mt-3"
                value="Registrar"
                type="submit"/>)
            }
          

          </form>
          {
            error ? (<div>{error}</div>) : (<span></span>)
          }
        </div>
        <div className="col">
          <h2>Lista de tu agenda</h2>
          <ul className="list-group">
          {
            usuarios.length !== 0 ? 
            (usuarios.map(item => (
              <li key={item.id} className="list-group-item">{item.nombre} --- {item.phone}
                <button onClick={(id)=>{borrarUsuario(item.id)}} className="btn btn-danger float-right">Borrar</button>
                <button onClick={(id)=>{pulsarActualizar(item.id)}} className="btn btn-info float-right mx-3">Actualizar</button>
              </li>
            ))) : 
            (<span>No hay usuarios en tu agenda</span>)
          }
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
