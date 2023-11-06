import React from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localeData from "dayjs/plugin/localeData";
import moment from "moment";
import "./calendar.css";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localeData);

interface CalendarProps {
  event: any[];
}

const formatTime = (timeStr: string) => {
  const regex = /(\d{1,2}h)(\d{1,2})?/;
  const matches = timeStr.match(regex);

  if (matches) {
    const hour = matches[1].replace("h", ":");
    const minute = matches[2] || "00";
    return `${hour}${minute}:00`;
  } else {
    return "00:00:00";
  }
};

const Calendar: React.FC<CalendarProps> = ({ event }) => {
  // const events = [
  //   {
  //     title: "Học phần: MI4060, Lớp: 146171 - Hệ thống và mạng máy tính (D5-103)",
  //     start: "2023-10-18T08:00:00",
  //     end: "2023-10-18T10:00:00"
  //   },
  //   {
  //     title: "Học phần: MI4060, Lớp: 146171 - Hệ thống và mạng máy tính (D5-103)",
  //     start: "2023-10-19T13:00:00",
  //     end: "2023-10-19T15:00:00"
  //   }
  // ];

  return (
    <Fullcalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView={"dayGridMonth"}
      headerToolbar={{
        start: "prev,next",
        center: "title",
        end: "dayGridMonth,timeGridWeek,timeGridDay"
      }}
      height="100vh"
      events={event.map((event) => {
        const dayThi = moment(event.ngay_thi).format("YYYY-MM-DD") + "T";
        const timeParts = event.kip_thi.split("-").map(formatTime);
        const paddedTimeParts = timeParts.map(
          (timePart: { split: (arg0: string) => [any, any, any] }) => {
            const [hour, minute, second] = timePart.split(":");
            const paddedHour = hour.length === 1 ? `0${hour}` : hour;
            return `${paddedHour}:${minute}:${second}`;
          }
        );

        return {
          title: "Coi thi",
          start: dayThi + paddedTimeParts[0],
          end: dayThi + paddedTimeParts[1]
        };
      })}
      locales={[viLocale]}
    />
  );
};

export default Calendar;
