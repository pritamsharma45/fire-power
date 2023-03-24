import React, { useState, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const UPDATE_PROFILE = gql`
  mutation Mutation(
    $firstName: String!
    $lastName: String!
    $email: String!
    $dobDay: Int!
    $dobMonth: Int!
    $address: String!
    $street: String!
    $city: String!
    $zip: String!
  ) {
    addProfile(
      firstName: $firstName
      lastName: $lastName
      email: $email
      dob_day: $dobDay
      dob_month: $dobMonth
      address: $address
      street: $street
      city: $city
      zip: $zip
    ) {
      address
      city
      createdAt
      dob_day
      dob_month
      firstName
      id
      lastName
      street
      updatedAt
      zip
    }
  }
`;
const GET_PROFILE = gql`
query Query($userId: String!) {
  getProfileByUserId(userId: $userId) {
    id
    firstName
    lastName
    email
    dob_day
    dob_month
    address
    street
    city
    zip
    createdAt
    updatedAt
  }
}
`;
function UserProfile() {
  // State to hold the form data
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob_day: null,
    dob_month: null,
    address: "",
    street: "",
    city: "",
    zip: "",
  });

  // Fetch the user's profile from the server
  const {
    data: profileData,
    loading: profileLoading,
    error: profileError,
  } = useQuery(GET_PROFILE, {
    variables: { userId: session?.user?.id },
  });

  // Update the form data with the user's profile data
  useEffect(() => {
    if (profileData) {
      setFormData((prevState) => ({
        ...prevState,
        firstName: profileData.getProfileByUserId.firstName,
        lastName: profileData.getProfileByUserId.lastName,
        email: profileData.getProfileByUserId.email,
        dob_day: profileData.getProfileByUserId.dob_day,
        dob_month: profileData.getProfileByUserId.dob_month,
        address: profileData.getProfileByUserId.address,
        street: profileData.getProfileByUserId.street,
        city: profileData.getProfileByUserId.city,
        zip: profileData.getProfileByUserId.zip,
      }));
    }
  }, [profileData]);

  const [updateProfile, { data, loading, error }] = useMutation(UPDATE_PROFILE);

  // State to hold whether the user's profile exists or not
  const [profileExists, setProfileExists] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(formData);
    await updateProfile({
      variables: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        dobDay: Number(formData.dob_day),
        dobMonth: Number(formData.dob_month),
        address: formData.address,
        street: formData.street,
        city: formData.city,
        zip: formData.zip,
      },
    });
    //  reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      dob_day: "",
      dob_month: "",
      address: "",
      street: "",
      city: "",
      zip: "",
    });
    // show react toast
    toast.success("Profile updated successfully", {
      autoClose: 1000,
    });
  };

  // Function to handle form input changes
  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Effect to check if the user's profile exists
  useEffect(() => {
    // TODO: Check if the user's profile exists on the server
    // If it does, set the profileExists state to true and populate the form data with the profile information
    // If it doesn't, set the profileExists state to false
    setProfileExists(false);
  }, []);

  if (profileExists) {
    // If the user's profile exists, display the profile data in read-only form
    return (
      <div className="container mx-auto max-w-5xl my-5 px-5">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-2">User Profile</h2>
          <div className="space-y-2">
            <p className="text-gray-500">
              First Name:{" "}
              <span className="font-medium">{formData.firstName}</span>
            </p>
            <p className="text-gray-500">
              Last Name:{" "}
              <span className="font-medium">{formData.lastName}</span>
            </p>
            <p className="text-gray-500">
              Email: <span className="font-medium">{formData.email}</span>
            </p>
            <p className="text-gray-500">
              Date of Birth:{" "}
              <span className="font-medium">{formData.dob_day}</span>|{" "}
              <span className="font-medium">{formData.dob_month}</span>
            </p>
            <p className="text-gray-500">
              Address: <span className="font-medium">{formData.address}</span>
            </p>
            <p className="text-gray-500">
              Street: <span className="font-medium">{formData.street}</span>
            </p>
            <p className="text-gray-500">
              City: <span className="font-medium">{formData.city}</span>
            </p>
            <p className="text-gray-500">
              Zip: <span className="font-medium">{formData.zip}</span>
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    // If the user's profile doesn't exist, display the profile form for them to fill in
    return (
      <div className="container mx-auto max-w-5xl my-5 px-5">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label htmlFor="firstName" className="text-gray-500">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="lastName" className="text-gray-500">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="email" className="text-gray-500">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="dob" className="text-gray-500">
                Date of Birth (DD/MM)
              </label>
              <div id="dob">
                <input
                  type="number"
                  id="dob_day"
                  name="dob_day"
                  value={formData.dob_day}
                  onChange={handleInputChange}
                  className="border-gray-300 w-16 rounded-md p-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                /
                <input
                  type="number"
                  id="dob_month"
                  name="dob_month"
                  value={formData.dob_month}
                  onChange={handleInputChange}
                  className="border-gray-300 w-16 rounded-md p-2 ml-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <label htmlFor="address" className="text-gray-500">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="street" className="text-gray-500">
                Street
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className="border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label htmlFor="city" className="text-gray-500">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="zip" className="text-gray-500">
                Zip
              </label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                className="border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    );
  }
}
export default UserProfile;
