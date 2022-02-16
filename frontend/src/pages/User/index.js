import "./styles.css";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Reviews from "../../components/Reviews";
import DinerVouchers from "./DinerVouchers";
import EateryVouchers from "./EateryVouchers";
import Profile from "../../components/UserProfile/Profile";
import ProfileNavigation from "../../components/UserProfile/ProfileNavigation";
import Following from "../../components/UserProfile/Following";
import { FilledButton } from "../../components/General/button";
import CreateIcon from "@material-ui/icons/Create";
import Modal from "@material-ui/core/Modal";
import { setPage } from "../../redux/slices/page.slice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [page, setSection] = useState(0);
  const [edit, toggleEdit] = useState(false);
  const avatar = user.profilePicture;

  useEffect(() => {
    dispatch(setPage(-1));
  }, []);

  if (token === "") {
    return <div>Get away!</div>;
  }

  const renderContainer = () => {
    switch (page) {
      case 0:
        if (user.isDiner) {
          return <DinerVouchers />;
        }
        return <EateryVouchers />;
      case 1:
        return <Reviews profile />;
      case 2:
        return <Following />;
      default:
        return <div />;
    }
  };

  return (
    <div className="user-profile">
      <div className="profile-sidebar">
        <div className="profile-edit">
          <FilledButton
            variant="contained"
            color="primary"
            startIcon={<CreateIcon />}
            onClick={() => toggleEdit(!edit)}
          >
            Edit
          </FilledButton>
        </div>
        <img className="profile-avatar" alt="avatar" src={avatar} />
        <div className="profile-name">
          {user.firstName + " " + user.lastName}
        </div>
        <div className="profile-nametag">
          ({user.isDiner ? "Diner" : "Eatery"})
        </div>
        <ProfileNavigation
          page={page}
          setPage={setSection}
          diner={user.isDiner}
        />
      </div>
      <div className="profile-container">{renderContainer()}</div>
      <Modal open={edit} onClose={() => toggleEdit(false)}>
        <Profile onClose={() => toggleEdit(false)} />
      </Modal>
    </div>
  );
};

export default UserProfile;
