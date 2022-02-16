import React from "react";
import UploadPicture from "../UploadPicture";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Select from "react-select";
import categoryList from "../../assets/categories";

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(1),
    width: "100%",
  },

  formLabel: {
    marginBottom: theme.spacing(2),
  },

  cardRoot: {
    maxWidth: "100%",
  },

  cardMedia: {
    maxWidth: "80%",
    margin: "auto",
  },

  buttonColor: {
    background: "#4AC415",
    color: "white",
  },
}));

function EateryRegisterForm(props) {
  const classes = useStyles();
  const {
    values,
    handleChange,
    handleMenuChange,
    handleRestaurantPictureChange,
    cuisines,
    setCuisines,
    menuPreview,
    restaurantPicturePreview,
  } = props;

  const {
    restaurantName,
    restaurantAddress,
    restaurantPostcode,
    restaurantDescription,
  } = values;

  console.log(menuPreview);
  console.log(restaurantPicturePreview);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            size="small"
            variant="outlined"
            required
            fullWidth
            name="restaurantName"
            label="Restaurant Name"
            id="restaurantName"
            value={restaurantName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Restaurant Address"
            name="restaurantAddress"
            autoComplete="restaurantAddress"
            value={restaurantAddress}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Postcode"
            name="restaurantPostcode"
            autoComplete="restaurantPostcode"
            value={restaurantPostcode}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Description"
            name="restaurantDescription"
            autoComplete="restaurantDescription"
            value={restaurantDescription}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl className={classes.formControl}>
            <Select
              defaultValue={cuisines}
              onChange={setCuisines}
              options={categoryList}
              placeholder="Select your offered cuisines and categories"
              noOptionsMessage={() => "Can not find your cuisines :("}
              isMulti
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <UploadPicture
            imageType={"menu"}
            imagePreview={menuPreview}
            handleImageChange={handleMenuChange}
          />
        </Grid>
        <Grid item xs={6}>
          <UploadPicture
            imageType={"restaurant picture"}
            imagePreview={restaurantPicturePreview}
            handleImageChange={handleRestaurantPictureChange}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default EateryRegisterForm;
