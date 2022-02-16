import styled from "styled-components";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

export const ReviewContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 70%;
  max-width: 70%;
  height: ${({ viewMore }) => (viewMore ? "" : "200px")};
  margin: 0 5%;
`;

export const StyledFavouriteBorderIcon = styled(FavoriteBorderIcon)`
  &:hover {
    color: red;
  }
`;

export const StyledFavouriteIcon = styled(FavoriteIcon)`
  color: red;
`;
