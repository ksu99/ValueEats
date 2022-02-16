import { React, useState, useEffect } from "react";
import "./styles.css";
import { useSelector, useDispatch } from "react-redux";
import { getVouchers } from "../../actions/vouchers";
import { Paper, Button, Modal, Drawer } from "@material-ui/core";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  DayView,
  WeekView,
  MonthView,
  Appointments,
  AppointmentTooltip,
} from "@devexpress/dx-react-scheduler-material-ui";
import CalendarHeader from "./CalendarHeader";
import VoucherForm from "../VoucherForm";
import ModalDisplay from "./ModalDisplay";
import { resetVoucher } from "../../redux/slices/voucher.slice";

function useSingleAndDoubleClick(
  actionSimpleClick,
  actionDoubleClick,
  delay = 200
) {
  const [click, setClick] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (click === 1) actionSimpleClick(true);
      setClick(0);
    }, delay);

    if (click >= 2) actionDoubleClick(true);

    return () => clearTimeout(timer);
  }, [click]);

  return () => setClick((prev) => prev + 1);
}

const Calendar = () => {
  const { user } = useSelector((state) => state.auth);
  const [voucherData, setVoucherData] = useState([]);
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [viewType, setViewType] = useState("Month");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const click = useSingleAndDoubleClick(setModal, setDrawer);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetch = async () => {
      let { _id } = user;
      const response = await getVouchers(_id);
      if (response.data) {
        response.data.voucherEvents.map((vouchers) => {
          const { startDateTime, endDateTime, title, recurrence } = vouchers;
          const start_date = new Date(startDateTime);
          const end_date = new Date(endDateTime);
          setVoucherData((voucherData) => [
            ...voucherData,
            {
              title: title,
              startDate: start_date,
              endDate: end_date,
              rRule: recurrence[0],
              ...vouchers,
            },
          ]);
        });
      }
    };
    fetch();
    setLoading(true);
  }, []);

  const handleChange = (index) => {
    let date = new Date(currentDate);
    switch (viewType) {
      case "Day":
        date.setDate(currentDate.getDate() + index);
        break;
      case "Week":
        date.setDate(currentDate.getDate() + 7 * index);
        break;
      case "Month":
        date.setMonth(currentDate.getMonth() + index);
        break;
    }
    setCurrentDate(date);
  };

  const handleDrawerClose = () => {
    setDrawer(false);
    dispatch(resetVoucher());
  };

  const MonthCell = (props) => {
    return (
      <Button className="month-button" onClick={click}>
        <MonthView.TimeTableCell
          {...props}
          className="month-cell"
          onClick={() => setSelectedDate(props.startDate)}
        />
      </Button>
    );
  };

  const WeekCell = (props) => {
    return (
      <Button className="week-button" onClick={click}>
        <WeekView.TimeTableCell
          {...props}
          className="week-cell"
          onClick={() => {
            setSelectedDate(props.startDate);
          }}
        />
      </Button>
    );
  };

  const DayCell = (props) => {
    return (
      <Button className="day-button" onClick={click}>
        <DayView.TimeTableCell
          {...props}
          className="day-cell"
          onClick={() => {
            setSelectedDate(props.startDate);
          }}
        />
      </Button>
    );
  };

  return (
    <>
      {loading && (
        <div className="calendar-container">
          <CalendarHeader
            currentDate={currentDate}
            handleChange={handleChange}
            viewType={viewType}
            setViewType={setViewType}
          />
          <Paper>
            <Scheduler data={voucherData}>
              <ViewState currentDate={currentDate} currentViewName={viewType} />
              <DayView />
              <WeekView />
              <DayView
                startDayHour={6}
                endDayHour={22}
                cellDuration={60}
                timeTableCellComponent={DayCell}
              />
              <WeekView
                startDayHour={6}
                endDayHour={22}
                cellDuration={60}
                timeTableCellComponent={WeekCell}
              />
              <MonthView timeTableCellComponent={MonthCell} />
              <Appointments />
              <AppointmentTooltip />
            </Scheduler>
          </Paper>
          <Modal
            open={modal}
            anchor="left"
            className="voucher-appointment"
            onClose={() => {
              setModal(false);
            }}
          >
            <ModalDisplay
              date={selectedDate}
              data={voucherData}
              openDrawer={() => setDrawer(true)}
              onClose={() => setModal(false)}
            />
          </Modal>
          <Drawer
            open={drawer}
            anchor="right"
            onClose={() => {
              handleDrawerClose();
            }}
          >
            <VoucherForm date={selectedDate} setDrawer={setDrawer} />
          </Drawer>
        </div>
      )}
    </>
  );
};

export default Calendar;
