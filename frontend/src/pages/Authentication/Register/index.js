import React, { useState } from 'react';
import DinerRegisterForm from '../../../components/DinerRegisterForm';
import EateryRegisterForm from '../../../components/EateryRegisterForm';
import CommonRegisterForm from '../../../components/CommonRegisterForm';
import { register } from '../../../actions/auth';
import { storage } from '../../../firebase';
import { toast } from 'react-toastify';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: '#4AC415',
  },
  form: {
    width: '90%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    background: '#4AC415',
  },
  lockIcon: {
    backgroundColor: '#4AC415',
  },
}));

const Register = ({ history }) => {
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    postcode: '',
    customerType: 'diner',
    profilePicture: '',
    menu: '',
    restaurantName: '',
    restaurantAddress: '',
    restaurantPostcode: '',
    restaurantDescription: '',
    restaurantPicture: '',
  });
  const [cuisines, setCuisines] = useState(null);
  const [menuPreview, setMenuPreview] = useState('');
  const [profilePicturePreview, setprofilePicturePreview] = useState('');
  const [restaurantPicturePreview, setRestaurantPicturePreview] = useState('');
  const [isSubmitted, setSubmitted] = useState(false);

  const classes = useStyles();

  const {
    firstName,
    lastName,
    email,
    password,
    address,
    postcode,
    customerType,
    profilePicture,
    menu,
    restaurantName,
    restaurantAddress,
    restaurantPostcode,
    restaurantDescription,
    restaurantPicture,
  } = values;

  const handleMenuChange = (e) => {
    setMenuPreview(URL.createObjectURL(e.target.files[0]));
    setValues({ ...values, menu: e.target.files[0] });
  };

  const handleProfilePictureChange = (e) => {
    setprofilePicturePreview(URL.createObjectURL(e.target.files[0]));
    setValues({ ...values, profilePicture: e.target.files[0] });
  };

  const handleRestaurantPictureChange = (e) => {
    setRestaurantPicturePreview(URL.createObjectURL(e.target.files[0]));
    setValues({ ...values, restaurantPicture: e.target.files[0] });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleRequest = (userData) => {
    register(userData)
      .then((response) => {
        console.log(response);
        history.push('/auth/login');
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          toast.error(err.response.data);
          setSubmitted(false);
        }
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    const userData = {
      firstName,
      lastName,
      email,
      password,
      postcode,
      address,
    };

    userData.cuisines = cuisines.map((cuisine) => cuisine.value);


    const uploadMenuAndRestaurantPicture = () => {
      if (customerType === 'diner') {
        userData.isDiner = true;
        handleRequest(userData);
      } else {
        userData.isDiner = false;
        userData.restaurantName = restaurantName;
        userData.restaurantAddress = restaurantAddress;
        userData.restaurantPostcode = restaurantPostcode;
        userData.restaurantDescription = restaurantDescription;
        const uploadRestaurantMenu = storage.ref(`menus/${menu.name}`).put(menu);
        uploadRestaurantMenu.on(
          'state_change',
          (_) => { },
          (error) => { console.log(error) },
          () => {
            storage.ref('menus').child(menu.name).getDownloadURL().then((menuURL) => {
              userData.menu = menuURL;
              const uploadRestaurantPicture = storage.ref(`restaurantPictures/${restaurantPicture.name}`).put(restaurantPicture);
              uploadRestaurantPicture.on(
                'state_change',
                (_) => { },
                (error) => { console.log(error) },
                () => {
                  storage.ref('restaurantPictures').child(restaurantPicture.name).getDownloadURL().then((restaurantPictureURL) => {
                    userData.restaurantPicture = restaurantPictureURL;
                    handleRequest(userData);
                  })
                }
              )
            })
          }
        )
      }
    }

    if (profilePicture !== '') {
      const uploadProfilePicture = storage.ref(`profilePictures/${profilePicture.name}`).put(profilePicture);
      uploadProfilePicture.on(
        'state_changed',
        (_) => { },
        (error) => {
          console.log(error);
        },
        () => {
          storage.ref('profilePictures').child(profilePicture.name).getDownloadURL().then((profilePictureURL) => {
            userData.profilePicture = profilePictureURL;
            uploadMenuAndRestaurantPicture();
          })
        }
      );
    } else {
      uploadMenuAndRestaurantPicture();
    }
  };

  return (
    <>
      <Container component="main" maxWidth="s">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon className={classes.lockIcon} />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={10}>
              <Grid item xs={6}>
                <CommonRegisterForm
                  values={values}
                  handleChange={handleChange}
                  handleProfilePictureChange={handleProfilePictureChange}
                  profilePicturePreview={profilePicturePreview}
                />
              </Grid>
              <Grid item xs={6}>
                {customerType === 'diner' && (
                  <DinerRegisterForm
                    cuisine={cuisines}
                    setCuisines={setCuisines}
                  />
                )}
                {customerType === 'eatery' && (
                  <EateryRegisterForm
                    values={values}
                    handleChange={handleChange}
                    cuisines={cuisines}
                    setCuisines={setCuisines}
                    handleMenuChange={handleMenuChange}
                    menuPreview={menuPreview}
                    restaurantPicturePreview={restaurantPicturePreview}
                    handleRestaurantPictureChange={
                      handleRestaurantPictureChange
                    }
                  />
                )}
              </Grid>
              <Grid container>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={handleSubmit}
                    disabled={
                      !email ||
                      !password ||
                      !firstName ||
                      !lastName ||
                      !cuisines ||
                      (customerType === 'eatery'
                        && (!menu
                          || !restaurantPicture
                          || !restaurantAddress
                          || !restaurantDescription
                          || !restaurantName
                          || !restaurantPostcode)
                      ) ||
                      isSubmitted
                    }
                  >
                    Sign Up
                  </Button>
                </Grid>
                <Grid item>
                  <Link to="/auth/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </>
  );
};

export default Register;
