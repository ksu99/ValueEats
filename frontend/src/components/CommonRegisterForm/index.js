import React from "react";
import UploadPicture from "../UploadPicture";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";

function CommonRegisterForm(props) {
  const {
    values,
    handleChange,
    handleProfilePictureChange,
    profilePicturePreview,
  } = props;
  const GreenRadio = withStyles({
    root: {
      color: "#4AC415",
      "&$checked": {
        color: "#4AC415",
      },
    },
    checked: {},
  })((props) => <Radio color="default" {...props} />);
  const {
    firstName,
    lastName,
    email,
    password,
    address,
    postcode,
    customerType,
  } = values;
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            autoComplete="fname"
            name="firstName"
            variant="outlined"
            required
            fullWidth
            id="firstName"
            label="First Name"
            value={firstName}
            onChange={handleChange}
            autoFocus
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="lname"
            value={lastName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="address"
            label="Address"
            name="address"
            autoComplete="address"
            value={address}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="postcode"
            label="Post Code"
            name="postcode"
            autoComplete="pcode"
            value={postcode}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl component="fieldset">
            <FormLabel component="legend">You are:</FormLabel>
            <RadioGroup
              row
              aria-label="customer-type"
              name="customerType"
              value={customerType}
              onChange={handleChange}
            >
              <FormControlLabel
                value="diner"
                control={<GreenRadio />}
                label="Diner"
              />
              <FormControlLabel
                value="eatery"
                control={<GreenRadio />}
                label="Eatery"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <UploadPicture
            imageType={"profile picture"}
            imagePreview={profilePicturePreview}
            handleImageChange={handleProfilePictureChange}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default CommonRegisterForm;
