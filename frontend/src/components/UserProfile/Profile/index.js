import "./styles.css";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProfileField from "../ProfileField";
import { updateProfile } from "../../../actions/profile";
import CuisinesDisplay from "../CuisinesDisplay";
import { toast } from "react-toastify";
import { setAuth } from "../../../redux/slices/auth.slice";
import SaveIcon from "@material-ui/icons/Save";
import { FilledButton } from "../../General/button";

const Profile = ({ onClose }) => {
  const { user, token } = useSelector((state) => state.auth);
  const [editedField, setEditedField] = useState({ ...user });
  const [selectedCuisines, setSelectedCuisines] = useState(user.cuisines);
  const dispatch = useDispatch();

  const commonFields = [
    { label: "First Name", value: "firstName" },
    { label: "Last Name", value: "lastName" },
    { label: "Email", value: "email" },
    { label: "Address", value: "address" },
    { label: "Post code", value: "postcode" },
    !user.isDiner &&
      ({ label: "Restaurant name", value: "restaurantName" },
      { label: "Restaurant address", value: "restaurantAddress" },
      { label: "Restaurant post code", value: "restaurantPostcode" }),
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log([...selectedCuisines]);

    const requestData = {
      user: {
        ...editedField,
        name: editedField.firstName + " " + editedField.lastName,
        cuisines: [...selectedCuisines],
      },
    };

    try {
      console.log("send data to backend", requestData);
      const response = await updateProfile(token, requestData);

      if (response.data) {
        console.log(
          `save user response in redux and local storage the redirect===>`
        );
        console.log("This is the response data: " + response.data);
        window.localStorage.setItem(
          "auth",
          JSON.stringify({ token, user: requestData.user })
        );
        dispatch(setAuth({ token, user: requestData.user }));
        onClose();
        toast("Your profile is updated, awesome wOw");
      }
    } catch (err) {
      console.log("Error detected: " + err);
      if (err.response.status === 400) toast.error(err.response.data);
    }
  };

  const handleChange = (e) => {
    setEditedField({ ...editedField, [e.target.name]: e.target.value });
  };

  return (
    <div className="user-box">
      <div className="user-fields">
        <h1 className="details-header">
          {user.isDiner ? "Diner" : "Eatery"} Details:
          <FilledButton
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
          >
            Save
          </FilledButton>
        </h1>
        {commonFields.map((field) => {
          if (field.value !== "Cuisiness") {
            if (field) {
              return (
                <ProfileField
                  label={field.label}
                  name={field.value}
                  value={editedField[field.value]}
                  handleChange={handleChange}
                />
              );
            }
          }
          return null;
        })}
        <CuisinesDisplay
          cuisines={selectedCuisines}
          setCuisines={setSelectedCuisines}
        />
      </div>
    </div>
  );
};

export default Profile;
