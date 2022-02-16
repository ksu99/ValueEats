import React from "react";
import ProfileButton from "../ProfileButton";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ReceiptIcon from "@material-ui/icons/Receipt";
import StarOutlineIcon from "@material-ui/icons/StarOutline";

const ProfileNavigation = (props) => {
  const { page, setPage, diner } = props;
  const styles = {
    fontSize: 40,
    marginRight: 15,
  };
  const navs = [
    { label: "Vouchers", icon: <ReceiptIcon style={styles} /> },
    {
      label: "Reviews",
      icon: <StarOutlineIcon style={styles} />,
    },
    {
      label: diner ? "Following" : "Followers",
      icon: <FavoriteBorderIcon style={styles} />,
    },
  ];

  return navs.map((nav, index) => (
    <ProfileButton
      label={nav.label}
      icon={nav.icon}
      page={index}
      setPage={setPage}
      selected={page === index}
    />
  ));
};

export default ProfileNavigation;
