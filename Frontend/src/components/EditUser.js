import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddEditCustomer = () => {
  const params = useParams();
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const Role = localStorage.getItem("authRole");
  const id = params.id;

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      image: ""
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "UserName should be at least 3 characters")
        .required("UserName is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      try {
        if (Role === "admin") {
          await userUpdateFunction(id, "dealer", values);
        } else {
          await userUpdateFunction(id, "customer", values);
        }
        console.log("Customer Saved", values);
      } catch (error) {
        toast.error("Failed to save customer details.");
        console.error("Error saving customer details:", error);
      }
    },
  });

  const fetchUserFunction = async (id, user) => {
    try {
      const { data } = await axios.get(`https://multi-role-auth-mern-be.vercel.app/${user}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Data from userDetails', data);
      formik.setValues({
        name: data.name || "",
        email: data.email || "",
        image: data.image || "",
      });
    } catch (error) {
      toast.error("Error fetching user details.");
      console.error("Error fetching user details:", error);
    }
  }

  const userDetails = async () => {
    if (Role === "admin") {
      fetchUserFunction(id, "dealer");
    } else {
      fetchUserFunction(id, "customer");
    }
  };

  useEffect(() => {
    if (id) {
      userDetails();
    }
    if (!token) {
      navigate('/login');
    }
  }, []);

  const userUpdateFunction = async (id, user, values) => {
    try {
      const response = await axios.post(
        `https://multi-role-auth-mern-be.vercel.app/update-${user}/${id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast.success(response.data.msg);
  
      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        toast.error(error.response.data.msg);
      } else {
        toast.error("Error updating user.");
      }
      console.error("Error updating user:", error);
    }
  };
  

  const handleCancel = () => {
    // toast.warn("Cancel Editing");
      formik.resetForm();
      navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="w-3/4 p-8">
        <h1 className="mb-6 text-2xl font-bold">
          {Role === "dealer"
            ? "Dealer -> Customers -> Edit Customer"
            : "Admin -> Dealer -> Edit Dealer"}
        </h1>

        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                className={`w-full p-2 border ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="UserName"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500">{formik.errors.name}</div>
              )}
            </div>
            <div>
              <input
                type="email"
                className={`w-full p-2 border ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="user@gmail.com"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500">{formik.errors.email}</div>
              )}
            </div>
            <div>
              <input
                type="text"
                className={`w-full p-2 border ${
                  formik.touched.image && formik.errors.image
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="UserImage"
                name="image"
                value={formik.values.image}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.image && formik.errors.image && (
                <div className="text-red-500">{formik.errors.image}</div>
              )}
            </div>
            {formik.values.image? <div>
              <img src={formik.values.image} className="h-20"/>
            </div>:null}
          </div>

          <div className="flex mt-6 space-x-4">
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-900 rounded"
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
