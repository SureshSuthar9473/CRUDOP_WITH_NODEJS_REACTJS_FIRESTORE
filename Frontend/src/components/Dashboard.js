import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const navigate = useNavigate()
    const Role = localStorage.getItem('authRole')
  const token = localStorage.getItem("authToken");
    const id = localStorage.getItem('id')
    const [Data, setData] = useState([])
    
    const fetchUsersByRole = async () => {
      try {
        if (Role === "dealer") {
          const { data } = await axios.get(`http://localhost:8080/customers/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
          });
          console.log("Data from dealer:", data);
          setData(data);
        } else if (Role === "admin") {
          const { data } = await axios.get('http://localhost:8080/',{
            headers:{
                Authorization:`Bearer ${token}`
            }
          });
          console.log("Data from admin:", data);
          setData(data);
        }
      } catch (err) {
        if(err.response.data.message==="No customers found for this dealer"){
          setData([])
        }
        console.error("Error fetching data:", err);
      }
    };
    

const handleDeleteFunction = async (id, user) => {
  try {
    const url = `http://localhost:8080/delete-${user === "admin" ? "dealer" : "customer"}/${id}`;
    const response = await axios.get(url,{
      headers:{
          Authorization:`Bearer ${token}`
      }
    }).then((res)=>{fetchUsersByRole() 
      toast.success(`${res.data}`)
    })
    console.log("resFromDeleteUser", response);
  } catch (err) {
    console.log(err);
  }
};

  const handleDelete =async(id)=>{
    const confirmationMessage = "Are You Sure Want To Delete";
  
  const isConfirmed = window.confirm(confirmationMessage);
   
  let resultMessage;
  if (isConfirmed) {
   handleDeleteFunction(id,Role)
  } else {
    resultMessage = "You canceled!";
  }

  console.log(resultMessage);
  }

useEffect(() => {
  if(!token){
    navigate('/login')
    }
  fetchUsersByRole()
}, [])
 const  handleLogout = async()=>{
  localStorage.clear()
  toast.success('Logout Succesfully')
     navigate('/login')
 }


 console.log('data::::::',Data);
 
  return (
    <div className="flex">
      <Sidebar />

      <div className="w-3/4 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">{Role==='customer'?"Customer":Role==='admin'?"Admin":"Dealers"}</h2>
          <div className="flex space-x-4">
  <button
    className="px-4 py-2 text-white bg-blue-500 rounded-md"
    onClick={handleLogout}
  >
    Logout
  </button>
{Role === "customer"?
  null:<Link
  className="px-4 py-2 text-white bg-blue-500 rounded-md"
  to={'/adduser'}
>
  {Role === "admin" ? 'Add Dealer' : "Add Customer"}
</Link>}
</div>
        </div>
      {Role==="customer"?  
      null
        :<div className="space-y-4">
       {Data.length === 0 ? (
  <h2 className="text-center text-gray-500">No Users Created</h2>
) : (
  Data.map((data, index) => (
    <div key={index} className="flex items-center justify-between p-4 mb-2 bg-gray-100 rounded-md">
      <span>{data.name}</span><span><img src={data?.image} className='w-10 h-10 rounded-s'/></span>
      <div className="flex space-x-2">
        <button className="px-4 py-2 text-white bg-blue-500 rounded-md">
          Subscriptions
        </button>
        <Link
          className="px-4 py-2 text-white bg-gray-500 rounded-md"
          to={`/edituser/${data.id}`}
        >
          Edit
        </Link>
        <button
          className="px-4 py-2 text-white bg-red-500 rounded-md"
          onClick={() => handleDelete(data.id)}
        >
          Delete
        </button>
      </div>
    </div>
  ))
)}

      </div>} 
      </div>
    </div>
  );
};

export default Dashboard;
