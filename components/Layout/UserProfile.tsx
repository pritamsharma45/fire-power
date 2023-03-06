import React, { useState, useEffect } from "react";

function UserProfile({ userEmail }) {
  // State to hold the form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    street: "",
    city: "",
    zip: "",
  });

  // State to hold whether the user's profile exists or not
  const [profileExists, setProfileExists] = useState(false);

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: Submit the form data to the server to update the user's profile
    console.log(formData);
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
      <div>
        <h2>User Profile</h2>
        <p>First Name: {formData.firstName}</p>
        <p>Last Name: {formData.lastName}</p>
        <p>Address: {formData.address}</p>
        <p>Street: {formData.street}</p>
        <p>City: {formData.city}</p>
        <p>Zip: {formData.zip}</p>
      </div>
    );
  } else {
    // If the user's profile doesn't exist, display the profile form for them to fill in
    return (
      <div>
        <h2>Update Profile</h2>
        <form onSubmit={handleSubmit}>
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Street:
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            City:
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Zip:
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <button type="submit">Update Profile</button>
        </form>
      </div>
    );
  }
}

export default UserProfile;
