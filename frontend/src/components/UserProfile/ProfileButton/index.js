import { React } from "react";
import { Container } from "./styles";

const ProfileButton = (props) => {
  const { label, icon, page, setPage, selected } = props;
  return (
    <Container onClick={() => setPage(page)} selected={selected}>
      {icon}
      {label}
    </Container>
  );
};

export default ProfileButton;
