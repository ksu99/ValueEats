import { React, useState } from "react";
import FollowersCard from "../../FollowersCard";
import { getFollow } from "../../../actions/follow";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Following = () => {
  const [followList, setFollowsList] = useState([]);
  const { user } = useSelector((state) => state.auth);

  // Call API to get list of followers or people they are following
  // the response is different for a diner vs an eatery
  const getData = async () => {
    const response = await getFollow(user._id);
    const followData = response.data;
    let followArr = [];
    if (user.isDiner) {
      for (let i = 0; i < followData.length; i++) {
        if (user.isDiner) {
          let followInfo = new Object();
          followInfo.eatery = followData[i].eatery;
          followArr.push(followInfo);
        }
      }
    } else {
      followArr = followData.followersArray;
    }
    setFollowsList(followArr);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="follow-list">
      {followList.map((follower) => {
        return <FollowersCard follower={follower} />;
      })}
    </div>
  );
};

export default Following;
