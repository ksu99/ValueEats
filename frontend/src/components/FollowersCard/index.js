import { React } from "react";
import useStyles from "./styles";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Paper, Avatar, Grid, Link } from "@material-ui/core";

//Cards used in the Followers/Following Page for Diners and Eatery
const FollowersCard = (props) => {
  let history = useHistory();
  const classes = useStyles();
  const { user } = useSelector((state) => state.auth);
  const { follower } = props;
  let picture = "";
  let name = "";

  // Sets the picture and name of the card
  if (user.isDiner) {
    picture = follower.eatery.restaurantPicture;
    name = follower.eatery.name;
  } else {
    picture = follower.profilePicture;
    name = follower.firstName + " " + follower.lastName;
  }

  //Directs to eatery's profilie page
  const handleClickProfile = () => {
    let eatery = follower.eatery;
    history.push({
      pathname: `/eatery/${eatery.name.toLowerCase()}/profile`,
      state: { eatery: follower.eatery },
    });
  };

  return (
    <Paper className={classes.root} elevation={3}>
      <Grid container spacing={2}>
        <Grid item>
          <Avatar src={picture} className={classes.avatar} />
        </Grid>
        <Grid className={classes.name} item xs>
          {user.isDiner ? (
            <Link
              style={{
                cursor: "pointer",
                color: "green",
              }}
              onClick={handleClickProfile}
            >
              {name}
            </Link>
          ) : (
            <>{name}</>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FollowersCard;
