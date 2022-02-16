import "./styles.css";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import EateryAvaliableVoucher from "../../../components/Vouchers/EateryAvaliable";
import EateryBookedVoucher from "../../../components/Vouchers/EateryBooked";
import {
  getBookedVouchers,
  getAvaliableVouchers,
} from "../../../actions/vouchers";
import {
  VoucherTabs,
  VoucherTab,
} from "../../../components/Vouchers/Tabs/style";
import { withRouter } from "react-router";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const EateryVouchers = (props) => {
  const { user } = useSelector((state) => state.auth);
  const [value, setValue] = useState(0);
  const [bookedVouchers, setBookedVouchers] = useState([]);
  const [avaliableVouchers, setAvaliableVouchers] = useState([]);
  const [unreleasedVouchers, setUnreleasedVouchers] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getAvaliableData = async () => {
    if (props !== undefined) {
      if (props.history.location.state !== undefined) {
        const { tabNumber } = props.history.location.state;
        setValue(tabNumber);
      }
    }
    try {
      const avaliable = await getAvaliableVouchers(user._id);
      let released = avaliable.data.released;
      let releasedValid = [];
      for (let i = 0; i < released.length; i++) {
        let endDate = new Date(released[i].endDateTime);
        let nowDate = new Date();

        if (endDate > nowDate) {
          releasedValid.push(released[i]);
        }
      }
      setAvaliableVouchers(releasedValid);
      setUnreleasedVouchers(avaliable.data.unreleased);
      return;
    } catch (error) {
      return error.response;
    }
  };

  const getBookedData = async () => {
    try {
      const booked = await getBookedVouchers(user._id);
      let bookedArr = booked.data.codes;
      let bookedList = [];
      for (let i = bookedArr.length - 1; i > 0; i--) {
        let endDate = new Date(bookedArr[i].endDateTime);
        let nowDate = new Date();

        if (!bookedArr[i].redeemed && endDate > nowDate) {
          bookedList.push(bookedArr[i]);
        }
      }
      setBookedVouchers(bookedList);
      return;
    } catch (error) {
      return error.response;
    }
  };

  useEffect(() => {
    getAvaliableData();
    getBookedData();
  }, []);

  return (
    <div className="voucher-box">
      <div className="eatery-voucher-box">
        <div className="eatery-voucher-container">
          <div className="tab-container-booking">
            <VoucherTabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <VoucherTab
                label="Available"
                style={{ border: "1px solid grey" }}
              />
              <VoucherTab label="Booked" style={{ border: "1px solid grey" }} />
            </VoucherTabs>
          </div>
          <TabPanel className="voucher-box" value={value} index={0}>
            {avaliableVouchers.length === 0 && <>Create some vouchers !</>}
            {avaliableVouchers.map((voucher) => (
              <div>
                <EateryAvaliableVoucher voucher={voucher} />
              </div>
            ))}
            {unreleasedVouchers.map((voucher) => (
              <div>
                <EateryAvaliableVoucher voucher={voucher} />
              </div>
            ))}
          </TabPanel>
          <TabPanel className="voucher-box" value={value} index={1}>
            {bookedVouchers.length === 0 && <>No booked vouchers</>}
            {bookedVouchers.map((voucher) => (
              <div>
                <EateryBookedVoucher voucher={voucher} />
              </div>
            ))}
          </TabPanel>
        </div>
      </div>
    </div>
  );
};

export default withRouter(EateryVouchers);
