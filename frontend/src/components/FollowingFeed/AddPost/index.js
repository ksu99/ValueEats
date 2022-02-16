import "./styles.css";
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { ClickAwayListener } from "@material-ui/core";
import { writePost, updatePost } from "../../../actions/posts";
import { toast } from "react-toastify";
import { storage } from "../../../firebase";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { FilledButton } from "../../General/button";

const AddPost = ({ userId, fetch, post, toggleAddPost }) => {
  const [content, setContent] = useState(post ? post.content : "");
  const [postImage, setPostImage] = useState(false);
  const [postObject, setPostObject] = useState(post ? post.image : "");

  const closeNewPost = () => {
    toggleAddPost(false);
    setContent("");
  };

  const handleImageChange = (img) => {
    setPostImage(img);
    setPostObject(img === "" ? "" : URL.createObjectURL(img));
  };

  const handleUpdatePost = (image) => {
    console.log("Handling update, image provided: ", image);
    updatePost(post._id, userId, content, image)
      .then((response) => {
        fetch();
        console.log(response);
        closeNewPost();
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          toast.error(err.response.data);
        }
      });
  };

  const handleWritePost = (image) => {
    writePost({ userId, content, image })
      .then((response) => {
        fetch();
        console.log(response);
        closeNewPost();
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          toast.error(err.response.data);
        }
      });
  };

  const imageConversion = (update) => {
    const uploadImage = storage
      .ref(`postMedia/${postImage.name}`)
      .put(postImage);

    uploadImage.on(
      "state_change",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("postMedia")
          .child(postImage.name)
          .getDownloadURL()
          .then((url) => {
            if (update) {
              handleUpdatePost(url);
            } else {
              handleWritePost(url);
            }
          });
      }
    );
  };

  const handleSubmit = () => {
    // Check if there is a newly uploaded image to the post
    if (postImage) {
      // Check if the post is being updated or created
      // i.e. post = true ==> updated, post = false => created
      if (post) {
        imageConversion(true);
      } else {
        imageConversion(false);
      }
    } else {
      if (post) {
        handleUpdatePost(postObject);
      } else {
        handleWritePost(postObject);
      }
    }
  };

  return (
    <ClickAwayListener onClickAway={closeNewPost}>
      <div className="addpost-new">
        <textarea
          className="addpost-field"
          onChange={(e) => setContent(e.target.value)}
          value={content}
        />
        <div className="addpost-buttons">
          <input
            accept="image/*"
            id="icon-button-file"
            type="file"
            style={{ display: "none" }}
            onChange={(e) => handleImageChange(e.target.files[0])}
          />
          <label htmlFor="icon-button-file">
            <Button
              color="primary"
              aria-label="upload picture"
              component="span"
              startIcon={<AttachFileIcon />}
            >
              Add image
            </Button>
          </label>
          <div>
            <FilledButton
              variant="contained"
              color="primary"
              style={{ marginRight: 10 }}
              onClick={closeNewPost}
            >
              Cancel
            </FilledButton>
            <FilledButton
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Submit
            </FilledButton>
          </div>
        </div>
        {postObject !== "" && (
          <div className="addpost-image-container">
            <img alt="img-preview" src={postObject} className="addpost-image" />
            <div className="addpost-remove-image">
              <IconButton
                color="secondary"
                aria-label="remove image"
                style={{ width: "100%", height: "100%" }}
                onClick={() => handleImageChange("")}
              >
                <CancelIcon
                  fontSize="large"
                  style={{ backgroundColor: "white", borderRadius: "50%" }}
                />
              </IconButton>
            </div>
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default AddPost;
