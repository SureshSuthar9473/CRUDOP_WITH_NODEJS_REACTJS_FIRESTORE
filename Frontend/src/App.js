import { Link, useNavigate } from 'react-router-dom';
import './App.css';
import { useEffect } from 'react';

function App() {
const navigate = useNavigate()
const token=  localStorage.getItem('authToken')
useEffect(() => {
if(!token){
navigate('/login')
}else {
  navigate('/dashboard')
}
}, [])

  return (
    <div className="App">
     <Link to={'/login'}>Login</Link>
    </div>
  );
}

export default App;
