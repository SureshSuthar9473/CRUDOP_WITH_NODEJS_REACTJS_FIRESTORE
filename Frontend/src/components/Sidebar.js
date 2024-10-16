import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const Role = localStorage.getItem('authRole')

  return (
    <div className="w-1/4 h-screen p-4 text-white bg-blue-900">
      <div className="mb-6">
      <h1 className="text-2xl font-bold">
  {Role === "customer" ? "Customer" : Role === "admin" ? "Admin" : "Dealer"}
</h1>
      </div>
      <nav>
        <ul>
          <li className="mb-4">
            <Link to={'/dashboard'} className="block p-2 bg-blue-700 rounded-md">Dealers</Link>
          </li>
          <li className="mb-4">
            <a href="#" className="block p-2 rounded-md hover:bg-blue-700">Settings</a>
          </li>
          <li className="mb-4">
            <a href="#" className="block p-2 rounded-md hover:bg-blue-700">Users</a>
          </li>
          <li className="mb-4">
            <a href="#" className="block p-2 rounded-md hover:bg-blue-700">Plans</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
