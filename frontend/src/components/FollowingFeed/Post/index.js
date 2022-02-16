import { React, useState } from "react";
import "./styles.css";
import { Card, CardMedia, Link } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { useSelector, useDispatch } from "react-redux";
import { setPage } from "../../../redux/slices/page.slice.js";
import { deletePost } from "../../../actions/posts";
import { toast } from "react-toastify";
import AddPost from "../AddPost";

const Post = (props) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { post, user, fetch } = props;
  let history = useHistory();
  const { image, _id, content, updatedAt } = post;
  const [edit, toggleEdit] = useState(false);

  const handleClickProfile = () => {
    dispatch(setPage(0));
    history.push({
      pathname: `/eatery/${user.restaurantName || user.name}/profile`,
      state: { eatery: { ...user, restaurantName: user.name } },
    });
  };

  const PostMedia = () => {
    if (image !== "") {
      return <img className="post-media-picture" src={image} />;
    } else {
      return <></>;
    }
  };
  const handleEditPost = () => {
    console.log("Helli\n");
    toggleEdit(!edit);
  };

  const handleDeletePost = () => {
    deletePost(_id, user._id)
      .then((response) => {
        console.log(response);
        fetch();
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          toast.error(err.response.data);
        }
      });
  };

  return edit ? (
    <AddPost
      userId={user._id}
      fetch={fetch}
      post={post}
      toggleAddPost={toggleEdit}
    />
  ) : (
    <Card className="post-container" elevation={10}>
      <div className="post-content-container">
        <div className="post-profile-content">
          <CardMedia
            className="post-profile-picture"
            component="button"
            image={user.restaurantPicture}
            onClick={handleClickProfile}
          />
          <Link
            style={{
              cursor: "pointer",
              color: "green",
            }}
            className="post-header"
            onClick={handleClickProfile}
          >
            {user.restaurantName || user.name}
          </Link>
        </div>
        <div className="post-internal-container">
          <div className="post-details-field-container">
            <div className="post-details-field">{content}</div>
          </div>
          <PostMedia />
          {auth.user._id === user._id && (
            <div className="post-buttons">
              <EditIcon
                style={{
                  margin: "0 10px",
                  cursor: "pointer",
                  color: "DarkSlateGray",
                }}
                className="eatery-post-icon"
                onClick={handleEditPost}
              />
              <DeleteIcon
                className="eatery-post-icon"
                style={{ cursor: "pointer", color: "FireBrick" }}
                onClick={handleDeletePost}
              />
            </div>
          )}
          <div className="post-date">
            {("0" + new Date(updatedAt).getDate()).slice(-2) +
              "-" +
              ("0" + (new Date(updatedAt).getMonth() + 1)).slice(-2) +
              "-" +
              new Date(updatedAt).getFullYear() +
              " " +
              ("0" + new Date(updatedAt).getHours()).slice(-2) +
              ":" +
              ("0" + new Date(updatedAt).getMinutes()).slice(-2)}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Post;
