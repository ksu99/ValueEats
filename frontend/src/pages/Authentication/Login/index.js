import React, { useState } from "react";
import { toast } from "react-toastify";
import { login } from "../../../actions/auth";
import { useDispatch } from "react-redux";
import { setAuth } from "../../../redux/slices/auth.slice";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { FilledButton } from "../../../components/General/button";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#4AC415",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    background: "#4AC415",
  },
}));

const Login = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const classes = useStyles();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("send data to backend", { email, password });
      const response = await login({ email, password });

      if (response.data) {
        console.log(
          `save user response in redux and local storage the redirect===>`
        );
        console.log(response.data);
        window.localStorage.setItem("auth", JSON.stringify(response.data));
        dispatch(setAuth(response.data));
        history.push("/");
      }
    } catch (err) {
      if (err.response?.status === 400) toast.error(err.response.data);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
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
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <FilledButton
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
              onClick={handleSubmit}
              disabled={!email || !password}
            >
              Sign In
            </FilledButton>
            <Grid container justify="flex-end">
              <Grid item>
                <Link to="/auth/register" variant="body2">
                  Dont have account? Sign up
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </>
  );
};

export default Login;
