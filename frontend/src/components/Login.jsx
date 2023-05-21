import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import validation from '../LogValidation'
import Axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

function Login(props) {
  const[values, setValues] = useState({
    email:'',
    password:''
  })
  const[errors,setErrors] = useState({})
  const navigate = useNavigate();

  const handleInput = (event)=>{
    setValues(prev =>({...prev, [event.target.name] : [event.target.value]}))
  }

  Axios.defaults.withCredentials = true   
  const handleSubmit = (event)=>{
    event.preventDefault();
    setErrors(validation(values));
    if(errors.email==="" && errors.password===""){
      // console.log(values.email[0]);
      Axios.post('http://localhost:3001/login',{
        email : values.email[0],
        password : values.password[0]
      }).then(response=>{
        if(response.data==="Not_Registered"){
          toast.error('Not Registered!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
          }else if(response.data==="Blocked"){
            toast.error('Blocked !', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              });

        }else if(response.data!=="Failure" && response.data!=="Error"){
          // onChange(response.data)
          console.log(response.data);
          const { name, email } = response.data;
          props.setAuthenticated(true);
          navigate('/home', { state: { name } });

        }else{
          toast.error('Wrong Credentials!', {
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
    // const notify = () => toast("Wow so easy!");

  return (
    <div className='main'>
        <form action="" onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className='input-div'>
                <label htmlFor="email"> Email : </label>
                <input className={`email ${errors.email && 'error'}`} name='email' onChange={handleInput} type="email" placeholder='Enter email...'/>
                {errors.email && <span>{errors.email}</span>}
            </div>
            <div className='input-div'>
                <label htmlFor="password">Password : </label>
                <input className={`password ${errors.password && 'error'}`} name='password' onChange={handleInput} type="password" placeholder='Enter password...'/>
                {errors.password && <span>{errors.password}</span>}
            </div>
            <button type='submit'>Login</button>
            <Link to="/register"><button className='new-acc'>Create Account</button></Link>
            <ToastContainer />
        </form>
    </div>
  )
}

export default Login