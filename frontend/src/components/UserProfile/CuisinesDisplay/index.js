import React from "react";
import "./styles.css";
import Button from "@material-ui/core/Button";
import categoryList from "../../../assets/categories";

const CuisinesDisplay = (props) => {
  const { cuisines, setCuisines } = props;

  return (
    <>
      <div style={{ marginTop: 50 }} />
      <div style={{ fontSize: 18, color: "grey", fontWeight: 600 }}>
        Preferred Cuisines:
      </div>
      <div>
        {cuisines.length === 0 && "You have no selected cuisines!"}
        {cuisines.map((type) => {
          return (
            <Button
              style={{ margin: 5 }}
              variant="contained"
              color="primary"
              onClick={() => {
                setCuisines(cuisines.filter((cuisine) => cuisine !== type));
              }}
            >
              {type}
            </Button>
          );
        })}
      </div>
      <div
        style={{
          fontSize: 18,
          color: "grey",
          fontWeight: 600,
          marginTop: 10,
        }}
      >
        Other Cuisines Types:
      </div>
      <div>
        {categoryList.map((type) => {
          if (!cuisines.includes(type.value)) {
            return (
              <Button
                style={{ margin: 5 }}
                variant="contained"
                onClick={() => setCuisines([...cuisines, type.value])}
              >
                {type.label}
              </Button>
            );
          }
          return null;
        })}
      </div>
    </>
  );
};

export default CuisinesDisplay;
