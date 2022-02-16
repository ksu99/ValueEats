import React from "react";
import Grid from "@material-ui/core/Grid";
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
}));

function DinerRegisterForm(props) {
  const classes = useStyles();
  const { cuisines, setCuisines } = props;

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl className={classes.formControl}>
            <Select
              size="small"
              defaultValue={cuisines}
              onChange={setCuisines}
              options={categoryList}
              placeholder="Select your favourite cuisines and categories"
              noOptionsMessage={() => "Can not find your cuisines :("}
              isMulti
            />
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
}

export default DinerRegisterForm;
