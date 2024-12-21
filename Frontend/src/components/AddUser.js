import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddEditCustomer = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const Role = localStorage.getItem("authRole");
  const id = localStorage.getItem('id');
  
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);
  
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "UserName must be at least 3 characters long")
      .required("UserName is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
      image:Yup.string().required("UserImage is required")
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      image:"",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      addUser(id, values, Role);
      console.log("Customer Saved", values);
    },
  });

  const addUser = async (id, values, Role) => {
    try {
      const url = `https://multi-role-auth-mern-be.vercel.app/new-${Role === "admin" ? "dealer" : "customer"}/${Role === "dealer" ? id : ''}`;
      
      const res = await axios.post(url, values, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      // Success response
      toast.success(`${res.data.msg}`);
      navigate('/dashboard');
      
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(`${error.response.data.msg}`);
      } else {
        toast.error('An error occurred while adding the user');
      }
      console.error("Error adding user:", error);
    }
  };
  

  const handleCancel = () => {
    // toast.warn("Cancel Adding");
      formik.resetForm();
      navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="w-3/4 p-8">
        <h1 className="mb-6 text-2xl font-bold">
          {Role === "dealer" ? "Dealer -> Customers -> Add Customer" : "Admin -> Dealer -> Add Dealer"}
        </h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                className={`w-full p-2 border ${formik.touched.name && formik.errors.name ? 'border-red-500' : ''}`}
                placeholder="UserName"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="mt-1 text-sm text-red-500">{formik.errors.name}</div>
              ) : null}
            </div> 
            <div>
              <input
                type="email"
                name="email"
                className={`w-full p-2 border ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                placeholder="user1@gmail.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="mt-1 text-sm text-red-500">{formik.errors.email}</div>
              ) : null}
            </div>
            <div>
              <input
                type="text"
                name="image"
                className={`w-full p-2 border ${formik.touched.image && formik.errors.image ? 'border-red-500' : ''}`}
                placeholder="UserImage"
                value={formik.values.image}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.image && formik.errors.image ? (
                <div className="mt-1 text-sm text-red-500">{formik.errors.image}</div>
              ) : null}
            </div>
           {formik.values.image? <div>
              <img src={formik.values.image} className="h-20"/>
            </div>:null}
          </div>
          <div className="flex mt-6 space-x-4">
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-900 rounded"
              disabled={formik.isSubmitting || !formik.isValid}
            >
              Save
            </button>
            <button
              type="button"
              className="px-6 py-2 text-black bg-gray-300 rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditCustomer;
