import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    justifyContent: "center",
    display: "flex",
  },
  row: {
    marginTop: "2vh",
    display: "flex",
    width: "90%",
  },
  column: {
    flex: "60%",
    minWidth: "650px",
  },
  column2: {
    flex: "40%",
  },
  menu: {
    width: "100%",
  },
  name: {
    fontSize: "80px",
    fontWeight: "700",
    margin: "0",
  },
  title: {
    paddingBottom: "30px",
  },
  font: {
    fontWeight: 600,
    fontFamily: "Roboto , sans-serif",
  },
  voucherHeader: {
    fontSize: "40px",
    color: "#05BC0D",
  },

  reviews: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
    lineHeight: "20px",
    fontSize: "18px",
  },
}));

export { useStyles };
