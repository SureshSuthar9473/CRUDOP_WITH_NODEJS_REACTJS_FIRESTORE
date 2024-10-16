import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddUser from './components/AddUser';
import EditUser from './components/EditUser'
import { ToastContainer, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const route = createBrowserRouter([
  {path:'/',element:<App/>},
  {path:'/login',element:<Login/>},
  {path:'/dashboard',element:<Dashboard/>},
  {path:'/adduser',element:<AddUser/>},
  {path:'/edituser/:id',element:<EditUser/>},
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<><ToastContainer/>
<RouterProvider router={route}>
  </RouterProvider>
</>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
