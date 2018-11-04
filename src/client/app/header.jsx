import React from 'react'
import { Route, Redirect } from 'react-router'
import { AuthConsumer } from './context.jsx'
import { Link } from 'react-router-dom'
import {Sidebar} from './sidebar.jsx';
import {TopBar} from './topbar.jsx';
//<button onClick={login}>login</button>
export default () => (
  <header>
  <AuthConsumer>
     {({ isAuth, login, logout }) => (
       <div>
         {isAuth ? (
           <ul>
             <Link  className="btn btn-primary" to="/userprofile">
               Dashboard
             </Link>
             <button  className="btn btn-primary" onClick={logout}>
              Logout
             </button>
           </ul>
         ) : (
           <button className="btn btn-primary" onClick={login}>Login</button>
         )}
       </div>
     )}
   </AuthConsumer>
    </header>
)
