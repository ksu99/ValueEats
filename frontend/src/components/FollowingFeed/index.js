import { React, useEffect, useState } from "react";
import { Paper } from "@material-ui/core";
import Post from "./Post";
import { getPostFromFollowers, getRestaurantPost } from "../../actions/posts";
import "./styles.css";
import { useSelector } from "react-redux";
import AddPost from "./AddPost";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

const FollowingFeed = () => {
  const { user } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [addPost, toggleAddPost] = useState(false);

  const fetch = async () => {
    const response = await (user.isDiner
      ? getPostFromFollowers(user._id)
      : getRestaurantPost(user._id));
    if (response.data) {
      if (user.isDiner) {
        setPosts(response.data);
      } else {
        setPosts(response.data.posts.reverse());
      }
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="feed-container">
      <div className="feed-header">Following Feed:</div>
      {!user.isDiner && (
        <>
          <div className="addpost-container">
            <AddCircleOutlineIcon
              style={{ fontSize: 40, cursor: "pointer", paddingRight: 10 }}
              onClick={() => toggleAddPost(!addPost)}
            />
            Add a post
          </div>
          {addPost && (
            <AddPost
              userId={user._id}
              fetch={fetch}
              toggleAddPost={toggleAddPost}
            />
          )}
        </>
      )}
      {posts.length === 0 ? (
        <div>Currently no posts on your feed.</div>
      ) : (
        <div className="feed-content">
          <div className="feed-post-container">
            <div className="feed-post-list">
              {posts.map((post, index) => {
                return (
                  <div className="feed-post-container" key={index}>
                    {user.isDiner ? (
                      <Post
                        post={post.post}
                        user={post.restaurant}
                        fetch={fetch}
                      />
                    ) : (
                      <Post post={post} user={user} fetch={fetch} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowingFeed;
