import React, { useState, useEffect } from "react";
import "./styles.css";
import { useDispatch } from "react-redux";
import { setVoucher } from "../../../redux/slices/voucher.slice";
import Grid from "@material-ui/core/Grid";
import CancelIcon from "@material-ui/icons/Cancel";
import ExpandIcon from "../../../assets/expand.png";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { compareDates, rRuleConfigure, useStyles } from "./helper";
import { deleteVoucher } from "../../../actions/vouchers";
import { toast } from "react-toastify";
import { IconButton } from "@material-ui/core";

const ModalDisplay = (props) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(-1);

  useEffect(() => {
    props?.data.map((voucher) => {
      rRuleConfigure(voucher, props.date).map((v) => {
        if (
          compareDates(v.startDate, props.date) &&
          compareDates(props.date, v.endDate)
        ) {
          setEvents((events) => [...events, v]);
        }
      });
      setLoading(true);
    });
  }, []);

  const { openDrawer, onClose } = props;
  const dispatch = useDispatch();
  const date = props.date.toString().substring(0, 15);
  const classes = useStyles();
  const size = [4, 3, 5];
  const table = ["Time", "Discount", "Qty."];

  const handleDelete = async (_id) => {
    try {
      await deleteVoucher(_id);
      window.location.reload(false);
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error(err.response.data);
      }
    }
  };

  return (
    <>
      {loading && (
        <div className="modal-container">
          <div className="modal-header">
            <div style={{ width: "80%" }}>{date}</div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton
                onClick={onClose}
                style={{
                  marginBottom: 20,
                }}
                color="secondary"
              >
                <HighlightOffIcon size="large" />
              </IconButton>
            </div>
          </div>
          <Grid
            container
            spacing={1}
            className="modal-grid"
            style={{ marginBottom: 10 }}
          >
            {table.map((label, index) => (
              <Grid item xs={size[index]} className="modal-table-labels">
                {label}
              </Grid>
            ))}
          </Grid>
          {events.map((props, index) => {
            const { startDate, endDate, discount, quantity, _id } = props;
            return (
              <>
                <Grid
                  container
                  spacing={1}
                  className="modal-grid"
                  style={{ marginBottom: 10 }}
                  key={index}
                >
                  <Grid item xs={size[0]} className="modal-table-items">
                    {startDate.toLocaleTimeString().substring(0, 5)} -
                    {` ${endDate.toLocaleTimeString().substring(0, 5)}`}
                  </Grid>
                  <Grid item xs={size[1]} className="modal-table-items">
                    {discount}%
                  </Grid>
                  <Grid item xs={size[2]} className="modal-table-items">
                    {quantity}
                    <div className="modal-item-icons">
                      <img
                        src={ExpandIcon}
                        alt="expand"
                        className="modal-expand"
                        onClick={() => {
                          dispatch(setVoucher(props));
                          openDrawer();
                          onClose();
                        }}
                      />

                      <CancelIcon
                        style={{ cursor: "pointer", marginRight: 10 }}
                        onClick={async () => {
                          await handleDelete(_id);
                        }}
                      />
                    </div>
                  </Grid>
                </Grid>
              </>
            );
          })}
          <Fab
            color="primary"
            aria-label="add"
            className={classes.fabGreen}
            onClick={() => {
              onClose();
              openDrawer();
            }}
          >
            <AddIcon />
          </Fab>
        </div>
      )}
    </>
  );
};

export default ModalDisplay;
