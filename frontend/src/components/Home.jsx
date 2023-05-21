import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios'

function Home(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const name = location.state?.name;
  let Name = name.charAt(0).toUpperCase() + name.slice(1);

  const handleLogout = () => {
    console.log(props);
    Axios.get('http://localhost:3001/logout')
      .then((response) => {
        if (response.status === 200) {
          props.setAuthenticated(false); // set authenticated state in App component
          navigate('/', { replace: true });
        }
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className='home'>
      <button className='logout' onClick={handleLogout}>Logout</button>
      <h1 className='welcome'>Welcome back <strong className='curr-user '>{Name}</strong></h1>
      <article>
      I created a simple 2-page website using <strong>Node.js</strong>, <strong>React.js</strong> and an MY-SQL database. 
      The website had a login page and a home page. The login page had email and password fields, 
      and the user was only allowed to log in if they entered the correct details. 
      If the user entered the wrong password 5 times consecutively, 
      they were blocked for 24 hours from the last incorrect attempt. 
      The home page showed the user's email and had a logout button that redirected the user back to the login page. 
      Overall, this project demonstrated my ability to create a functional web application using 
      Node.js, React.js and SQL database, as well as my ability to implement authentication and security features.
      </article>
    </div>

  )
}

export default Home