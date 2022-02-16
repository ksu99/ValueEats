import { React, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Typography, Button, Grid } from "@material-ui/core";
import useStyles from "./style";
import {
  FilledButton,
  OutlinedButton,
} from "../../../components/General/button";
import { HiOutlineTicket } from "react-icons/hi";
import { FaRegStar } from "react-icons/fa";
import Post from "../../../components/FollowingFeed/Post";
import { follow, unfollow, getFollow } from "../../../actions/follow";
import { getRestaurantPost } from "../../../actions/posts";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../../../redux/slices/page.slice";
import { toast } from "react-toastify";
import Rating from "@material-ui/lab/Rating";

const EateryProfile = (props) => {
  const { eateryname } = props.match.params;
  const { eatery } = props.history.location.state;
  const [isFollow, setIsFollow] = useState(false);
  const [postList, setPostsList] = useState([]);
  const classes = useStyles();
  const history = useHistory();
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Send a request to Follow
  const followAction = () => {
    const reqBody = {
      dinerId: user._id,
      ownerId: eatery.owner,
    };
    console.log(reqBody);
    follow(reqBody)
      .then((response) => {
        setIsFollow(true);
        console.log(response);
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          toast.error(err.response.data);
        }
      });
  };

  // Send a request to unFollow
  const unfollowAction = () => {
    const reqBody = {
      dinerId: user._id,
      ownerId: eatery.owner,
    };
    console.log(reqBody);
    unfollow(reqBody)
      .then((response) => {
        setIsFollow(false);
        console.log(response);
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          toast.error(err.response.data);
        }
      });
  };

  // render the Follow or UnFollow
  const followButton = () => {
    if (isFollow) {
      return (
        <OutlinedButton
          variant="contained"
          onClick={unfollowAction}
          className={classes.followButton}
        >
          Unfollow
        </OutlinedButton>
      );
    } else {
      return (
        <FilledButton
          variant="contained"
          onClick={followAction}
          className={classes.followButton}
        >
          Follow
        </FilledButton>
      );
    }
  };

  //Navigate to reviews page
  const reviews = () => {
    if (token !== "") {
      history.push({
        pathname: "/eatery/" + eateryname + "/reviews",
        state: { eatery: eatery },
      });
    } else {
      dispatch(setPage(-1));
      history.push({
        pathname:"/auth/login"
      })
    }
  };

  //Navigate to vouchers page
  const vouchers = () => {
    history.push({
      pathname: "/eatery/" + eateryname + "/vouchers",
      state: { eatery: eatery },
    });
  };

  // Retrieve if the person is currently following the restaurant
  const getFollowingData = async () => {
    try {
      const following = await getFollow(user._id);
      let followingArr = following.data;
      for (let i = 0; i < followingArr.length; i++) {
        if (followingArr[i].eatery.owner === eatery.owner) {
          setIsFollow(true);
        }
      }
      return;
    } catch (error) {
      return error.response;
    }
  };

  // gets al the restaurants posts
  const getPosts = async () => {
    const postData = await getRestaurantPost(eatery.owner);
    setPostsList(postData.data.posts);
  };

  useEffect(() => {
    getFollowingData();
    getPosts();
  }, []);

  return (
    <div className={classes.root}>
      <div>
        <img
          className={classes.banner}
          src={eatery.restaurantPicture}
          alt={eatery.name + "restaurant picture"}
        />
      </div>
      <Grid container>
        <Grid item xs>
          <Grid container>
            <Grid item>
              <Typography className={classes.heading}>{eateryname}</Typography>
              <div style={{ color: "grey", fontSize: 20, display: "flex" }}>
                {eatery.reviewRating && (
                  <>
                    {`${eatery.reviewRating.toFixed(1)}`}
                    <Rating
                      style={{
                        display: "flex",
                        justifySelf: "center",
                        alignSelf: "center",
                      }}
                      value={eatery.reviewRating.toFixed(2)}
                      precision={0.5}
                      readOnly
                    />
                  </>
                )}
              </div>
              <p>Address: {eatery.address}</p>
              <p>Description: {eatery.description}</p>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1}>
          {followButton()}
        </Grid>
      </Grid>

      <div>
        <Button className={classes.button} onClick={reviews}>
          <FaRegStar className={classes.icon} /> Reviews
        </Button>
        <Button className={classes.button} onClick={vouchers}>
          <HiOutlineTicket className={classes.icon} /> Vouchers
        </Button>
      </div>
      <div>
        <Typography style={{ marginTop: 30 }} variant="h4">
          Posts:
        </Typography>
        <div className="feed-post-list">
          {postList.map((post) => {
            return (
              <div className="feed-post-container">
                <Post post={post} user={eatery} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EateryProfile;
