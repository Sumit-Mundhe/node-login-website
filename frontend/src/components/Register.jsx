import React,{useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import validation from '../RegValidation'
import Axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const[values, setValues] = useState({
    name:'',
    email:'',
    password:''
  })
  const[errors,setErrors] = useState({})
  const navigate = useNavigate();

  const handleInput = (event)=>{
    setValues(prev =>({...prev, [event.target.name] : event.target.value}))
  }

  const handleSubmit = (event)=>{
    event.preventDefault();
    setErrors(validation(values));
    if(errors.name==="" && errors.email==="" && errors.password===""){
      Axios.post('http://localhost:3001/register',{
        name : values.name,
        email : values.email,
        password : values.password
        }).then(response=>{
          if(response.data==="Already_Existed"){
            toast.error('Already Registered!', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              });
          }
          else if(response.data==="Success"){
            navigate('/');
          }else{
            toast.error('No records found!', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              });
            // alert("No record existed!")
          }
        })
        .catch(error=>console.log(error));
    }
    }

  return (
    <div className='main'>
        <form action="" onSubmit={handleSubmit}>
            <h1>Register</h1>
            <div className='input-div'>
                <label htmlFor="name">Name : </label>
                <input className={`name ${errors.name && 'error'}`} name='name' onChange={handleInput} type="text" placeholder='Enter name...'/>
                {errors.name && <span>{errors.name}</span>}
            </div>
            <div className='input-div'>
                <label htmlFor="email">Email : </label>
                <input className={`email ${errors.email && 'error'}`} name='email' onChange={handleInput} type="email" placeholder='Enter email...'/>
                {errors.email && <span>{errors.email}</span>}
            </div>
            <div className='input-div'>
                <label htmlFor="password">Password : </label>
                <input className={`password ${errors.password && 'error'}`} name='password' onChange={handleInput} type="password" placeholder='Enter password...'/>
                {errors.password && <span>{errors.password}</span>}
            </div>
            <button>Register</button>
            <h4>Already have an account?<Link className='login-link' to="/">Login</Link></h4>
            <ToastContainer />
        </form>
    </div>
  )
}

export default Register