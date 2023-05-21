import React,{useState,useEffect} from 'react'
import Login from './Login'
import Register from './Register'
import Home from './Home'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Axios from 'axios'

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    Axios.get('http://localhost:3001/api/user', { withCredentials: true })
      .then(response => {
        if (response.status === 200) {
          setAuthenticated(true);
          // setUser(response.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  
  return (
    <BrowserRouter>
      <Routes >
        <Route path='/' element={authenticated ? <Home setAuthenticated={setAuthenticated} /> : <Login setAuthenticated={setAuthenticated} />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/home' element={authenticated ? <Home setAuthenticated={setAuthenticated} /> : <Login setAuthenticated={setAuthenticated} />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App