import "./styles.css";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import DinerRedeemed from "../../../components/Vouchers/DinerRedeemed";
import DinerBooked from "../../../components/Vouchers/DinerBooked";
import { getBookedVouchers } from "../../../actions/vouchers";
import {
  VoucherTabs,
  VoucherTab,
} from "../../../components/Vouchers/Tabs/style";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <>{children}</>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const DinerVouchers = () => {
  const { user } = useSelector((state) => state.auth);
  const [value, setValue] = useState(0);
  const [bookedVouchers, setBookedVouchers] = useState([]);
  const [pastVouchers, setPastVouchers] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getData = async () => {
    try {
      const results = await getBookedVouchers(user._id);
      let voucherArr = results.data.codes;
      let pastArr = [];
      let bookArr = [];
      for (let i = 0; i < voucherArr.length; i++) {
        let end = new Date(voucherArr[i].endDateTime);
        if (voucherArr[i].redeemed === true || end < Date.now()) {
          pastArr.push(voucherArr[i]);
        } else {
          bookArr.push(voucherArr[i]);
        }
      }
      setBookedVouchers(bookArr);
      setPastVouchers(pastArr);
      return;
    } catch (error) {
      return error.response;
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="eatery-voucher-box">
      <div className="eatery-voucher-container">
        <div className="tab-container-booking">
          <VoucherTabs
            value={value}
            onChange={handleChange}
          >
            <VoucherTab
              label="Current Booking"
              style={{ border: "1px solid grey" }}
            />
            <VoucherTab
              label="Past Booking"
              style={{ border: "1px solid grey" }}
            />
          </VoucherTabs>
        </div>
        <TabPanel className="voucher-box" value={value} index={0}>
          {bookedVouchers.length === 0 && <>No booked vouchers</>}
          {bookedVouchers.map((bookedVouchers) => (
            <div>
              <DinerBooked voucher={bookedVouchers} />
            </div>
          ))}
        </TabPanel>
        <TabPanel className="voucher-box" value={value} index={1}>
          {pastVouchers.length === 0 && <>No past bookings</>}
          {pastVouchers.map((voucher) => (
            <div>
              <DinerRedeemed voucher={voucher} />
            </div>
          ))}
        </TabPanel>
      </div>
    </div>
  );
};
export default DinerVouchers;
