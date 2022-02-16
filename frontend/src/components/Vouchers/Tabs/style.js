import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

export const VoucherTabs = withStyles({
  root: {
    width: "100%",
  },
  indicator: {
    display: "none",
  },
})(Tabs);

export const VoucherTab = withStyles((theme) => ({
  root: {
    position: "relative",
    display: "block",
    borderRadius: "10px",
    textAlign: "center",
    transition: "all .5s",
    padding: "15px 20px",
    color: "#555555",
    height: "auto",
    opacity: "1",
    marginRight: "5px",
    float: "none",
    "& + button": {
      marginRight: "5px",
    },
    "&$selected": {
      "&, &:hover": {
        color: "#FFFFFF",
        backgroundColor: "#05BC0D",
        boxShadow: "0 7px 10px -5px rgba(76, 175, 80, 0.4)",
      },
    },
  },
  selected: {},
  wrapper: {
    lineHeight: "24px",
    textTransform: "uppercase",
    fontSize: "15px",
    position: "relative",
    display: "block",
    color: "inherit",
    fontWeight: 700,
  },
}))((props) => <Tab disableRipple {...props} />);

export const useStyles = makeStyles((theme) => ({
  padding: {
    padding: theme.spacing(3),
  },
  demo1: {
    backgroundColor: theme.palette.background.paper,
  },
}));
