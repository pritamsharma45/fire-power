import React from "react";
import { useForm } from "react-hook-form";
import nodemailer from "nodemailer";
import {  toast } from "react-toastify";

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    try {
      await fetch("/api/sendMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      toast.success(<ThankYouMessage />);
      console.log("Email sent successfully");
    } catch (error) {
      // If there was an error sending the email, show an error message to the user
      console.error(error);
      console.log("Error sending email");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-yellow-100 m-2 p-4 rounded-md border-2 border-solid border-green-400">
      <h2 className="text-2xl font-bold mb-4">Talk with our sales team</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="firstName"
            >
              First Name<span className="text-red-500">*</span>
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="firstName"
              name="firstName"
              {...register("firstName", { required: true })}
            />
            {errors.firstName && (
              <span className="text-red-500">This field is required</span>
            )}
          </div>
          <div className="w-full md:w-1/2 px-2">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="lastName"
            >
              Last Name<span className="text-red-500">*</span>
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="lastName"
              name="lastName"
              {...register("lastName", { required: true })}
            />
            {errors.lastName && (
              <span className="text-red-500">This field is required</span>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
            Email<span className="text-red-500">*</span>
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            id="email"
            name="email"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="phone">
            Phone (optional)
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="tel"
            id="phone"
            name="phone"
            {...register("phone")}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="message"
          >
            How can we help?<span className="text-red-500">*</span>
          </label>
          <textarea
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="message"
            name="message"
            rows="6"
            {...register("message", { required: true })}
          ></textarea>
          {errors.message && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

const ThankYouMessage = () => {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Thank you for contacting us!</h2>
      <p className="mb-4">
        We have received your message and will get back to you as soon as
        possible.
      </p>

      <p>
        Best regards,
        <br />
        The Sales Team
      </p>
    </div>
  );
};
export default ContactForm;
