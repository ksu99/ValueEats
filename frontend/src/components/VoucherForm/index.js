import { React, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, FormControl, GridListTile, GridList } from "@material-ui/core";
import "../VoucherForm/styles.css";
import VoucherField from "./VoucherField";
import fieldLabels from "./fieldLabels";
import {
  createVouchers,
  updateVouchers,
  getAvaliableVouchers,
} from "../../actions/vouchers";
import { resetVoucher } from "../../redux/slices/voucher.slice";
import { toast } from "react-toastify";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SECONDS = ":00.000";

const FieldComponent = (props) => {
  const { fields, cols, width, values, handleChange, date } = props;
  return (
    <GridListTile cols={cols} rows={1} style={{ height: 180, width: width }}>
      <VoucherField
        fields={fields}
        fieldProps={values}
        date={date}
        handleChange={handleChange}
      />
    </GridListTile>
  );
};
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

const prefillVoucherForm = (voucher, setValues) => {
  const voucherTitle = voucher.title;
  const voucherQuantity = voucher.quantity;
  const voucherValue = voucher.discount;
  const startDateTime = new Date(voucher.startDateTime);
  const startDate = formatDate(startDateTime);
  const startTime = startDateTime.toString().substring(16, 21);
  const endDateTime = new Date(voucher.endDateTime);
  const endDate = formatDate(endDateTime);
  const endTime = endDateTime.toString().substring(16, 21);
  const releaseDateTime = new Date(voucher.releaseDateTime);
  const releaseDate = formatDate(releaseDateTime);
  const releaseTime = releaseDateTime.toString().substring(16, 21);
  const description = voucher.description;
  let routineType = "none";
  let occurrences = 1;
  let values = {
    voucherTitle,
    voucherQuantity,
    voucherValue,
    startTime,
    endTime,
    startDate,
    endDate,
    releaseDate,
    releaseTime,
    description,
    occurrences,
    routineType,
  };

  if (voucher.isRecurring) {
    const recurrence = voucher.recurrence[0];

    ["WEEKLY", "MONTHLY"].forEach((type) => {
      if (recurrence.includes(type)) {
        routineType = type.toLowerCase();
        if (type === "WEEKLY")
          routineType = recurrence.includes("INTERVAL=2")
            ? "fortnightly"
            : routineType;
      }
    });

    const indexOfCOUNT = recurrence.indexOf("COUNT");
    const indexOfEQUAL = recurrence.indexOf("=", indexOfCOUNT);
    const indexOfSEMICONLON = recurrence.indexOf(";", indexOfEQUAL);

    occurrences = parseInt(
      recurrence.slice(indexOfEQUAL + 1, indexOfSEMICONLON)
    );
    console.log("occurences ", occurrences);

    values.occurrences = occurrences;
    values.routineType = routineType;
  }

  console.log("voucher in prefill voucher ", voucher);

  setValues(values);
};

function VoucherForm(props) {
  const recDay = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
  const { user, token } = useSelector((state) => state.auth);

  const { setDrawer, date, isUpdated } = props;
  const { voucher } = useSelector((state) => state.voucher);

  const dispatch = useDispatch();
  const selectedDate = date.getDate();
  const day = days[date.getDay()];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  let time = date.toString().substring(16, 21);
  let end = new Date(date);
  end.setHours(end.getHours() + 1);
  let lastTime = end.toString().substring(16, 21);
  let rel = new Date(date);
  rel.setHours(rel.getHours() - 1);
  let relTime = rel.toString().substring(16, 21);

  if (time === "00:00") {
    time = "07:00";
    lastTime = "08:00";
    relTime = "06:00";
  }

  const [values, setValues] = useState({
    voucherTitle: "",
    voucherQuantity: 0,
    voucherValue: 0,
    startTime: time,
    endTime: lastTime,
    startDate: formatDate(date),
    endDate: formatDate(date),
    routineType: "none",
    occurrences: 1,
    releaseDate: formatDate(date),
    releaseTime: relTime,
    description: "",
  });

  const constructRRULE = (occurrences, routineType) => {
    // eslint-disable-next-line default-case
    switch (routineType) {
      case "weekly":
        return `RRULE:FREQ=WEEKLY;COUNT=${occurrences};BYDAY=${
          recDay[date.getDay()]
        }`;
      case "fortnightly":
        return `RRULE:FREQ=WEEKLY;COUNT=${occurrences};INTERVAL=2;BYDAY=${
          recDay[date.getDay()]
        }`;
      case "monthly":
        return `RRULE:FREQ=MONTHLY;COUNT=${occurrences}`;
      case "none":
        return "";
    }
  };

  const handleSubmit = async (e) => {
    const startDateTime = values.startDate + "T" + values.startTime + SECONDS;
    const endDateTime = values.endDate + "T" + values.endTime + SECONDS;
    const releaseDateTime =
      values.releaseDate + "T" + values.releaseTime + SECONDS;

    let recurrence = [];

    const reqBody = {
      title: values.voucherTitle,
      description: values.description,
      discount: values.voucherValue,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      createdBy: user._id,
      quantity: values.voucherQuantity,
      isRecurring: values.routineType === "none" ? false : true,
      releaseDateTime: releaseDateTime,
    };

    console.log("reqa body before create or update ", reqBody);

    if (values.routineType !== "none") {
      if (values.occurrences <= 0) {
        toast.error("Occurrences must be greater than 0");
        return;
      }
      recurrence.push(constructRRULE(values.occurrences, values.routineType));
      reqBody["recurrence"] = recurrence;
    }

    if (isUpdated) {
      try {
        await updateVouchers({ ...reqBody, voucherId: props.voucher._id });
        setDrawer(false);
        const availableVouchers = await getAvaliableVouchers(user._id);
        console.log(availableVouchers.data.unreleased);

        props.setVoucher({ ...reqBody, _id: props.voucher._id });
      } catch (err) {
        if (err.response?.status === 400) {
          console.log("Tien updates");
          toast.error(err.response.data);
        }
      }
    } else {
      if (voucher.length === 0) {
        createVouchers(reqBody)
          .then((response) => {
            setDrawer(false);
            window.location.reload();
            console.log(response);
          })
          .catch((err) => {
            if (err.response?.status === 400) {
              toast.error(err.response.data);
            }
          });
      } else {
        console.log("Calvin updates");
        console.log(voucher._id);
        try {
          await updateVouchers({ ...reqBody, voucherId: voucher._id });
          setDrawer(false);
          dispatch(resetVoucher());
          window.location.reload();
        } catch (err) {
          if (err.response?.status === 400) {
            toast.error(err.response.data);
          }
        }
      }
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (props.voucher) {
      prefillVoucherForm(props.voucher, setValues);
    }
    if (voucher.length !== 0) {
      prefillVoucherForm(voucher, setValues);
    }
  }, []);

  return (
    <form className="voucher-form-drawer">
      <h1 className="header-date">
        {selectedDate} {day} <br /> {month} {year}
      </h1>
      <FormControl className="voucher-form-container">
        <GridList spacing={0}>
          {fieldLabels.map((fields) => {
            if (
              fields.label === "Description" ||
              fields.label === "Voucher Title"
            ) {
              return (
                <FieldComponent
                  fields={fields}
                  handleChange={handleChange}
                  values={values}
                  cols={2}
                  width="auto"
                />
              );
            } else if (fields.label === "Voucher title") {
              return (
                <FieldComponent
                  fields={fields}
                  handleChange={handleChange}
                  values={values}
                  cols={2}
                  width={600}
                />
              );
            } else {
              return (
                <FieldComponent
                  fields={fields}
                  handleChange={handleChange}
                  values={values}
                  cols={1}
                  width={300}
                />
              );
            }
          })}
        </GridList>
      </FormControl>
      <Button
        variant="contained"
        className="voucher-form-button"
        onClick={handleSubmit}
      >
        Add
      </Button>
    </form>
  );
}

export default VoucherForm;
