import React, { useState, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const UPDATE_PROFILE = gql`
  mutation AddProfile(
    $firstName: String!
    $lastName: String!
    $address: String!
    $street: String!
    $city: String!
    $zip: String!
  ) {
    addProfile(
      firstName: $firstName
      lastName: $lastName
      address: $address
      street: $street
      city: $city
      zip: $zip
    ) {
      city
      street
      lastName
    }
  }
`;

const GET_PROFILE = gql`
  query Query($userId: String!) {
    getProfileByEmail(userId: $userId) {
      id
      firstName
      lastName
      address
      street
      city
      zip
      createdAt
      updatedAt
    }
  }
`;

function UserProfile({ userEmail }) {
  // State to hold the form data
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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
        firstName: profileData.getProfileByEmail.firstName,
        lastName: profileData.getProfileByEmail.lastName,
        address: profileData.getProfileByEmail.address,
        street: profileData.getProfileByEmail.street,
        city: profileData.getProfileByEmail.city,
        zip: profileData.getProfileByEmail.zip,
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
      address: "",
      street: "",
      city: "",
      zip: "",
    });
    // show react toast
  toast.success("Profile updated successfully",{
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
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-2">User Profile</h2>
        <div className="space-y-2">
          <p className="text-gray-500">
            First Name:{" "}
            <span className="font-medium">{formData.firstName}</span>
          </p>
          <p className="text-gray-500">
            Last Name: <span className="font-medium">{formData.lastName}</span>
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
    );
  } else {
    // If the user's profile doesn't exist, display the profile form for them to fill in
    return (
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
    );
  }
}

export default UserProfile;
