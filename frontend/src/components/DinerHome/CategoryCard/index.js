import { React } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";
import "./styles.css";

const CategoryCard = (props) => {
  const { category, handleClick, isCuisine } = props;
  return (
    <>
      <Card className="category-card">
        <CardActionArea
          onClick={() => {
            handleClick(category.label, isCuisine);
          }}
        >
          <CardMedia
            className="category-media"
            component="image"
            image={category.src}
          />
          <CardContent className="category-content">
            <Typography
              gutterBottom
              variant="h4"
              className="category-name"
              style={{ fontSize: "4vh" }}
            >
              {category.label}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
};

export default CategoryCard;
