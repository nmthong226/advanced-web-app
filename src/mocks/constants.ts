import moment from "moment";
import { EventItem } from "../types/type";

export enum AppointmentStatusCode {
  Pending = "P",
  CheckedIn = "CI",
}

export const EVENT_STATUS_COLORS = {
  P: "#bee2fa",
  CI: "#c7edca",
};

export const EVENTS: EventItem[] = [
  {
    start: moment("2025-01-05T09:00:00").toDate(),
    end: moment("2025-01-05T10:00:00").toDate(),
    data: {
      appointment: {
        id: 1,
        status: "P",
        location: "New York",
        resource: "Dr Alex",
        address: "Building 5\nStreet 44\nNear Express Highway\nNew York",
      },
    },
    isDraggable: true,
    resourceId: 1,
  },
  {
    start: moment("2025-01-05T10:30:00").toDate(),
    end: moment("2025-01-05T11:00:00").toDate(),
    data: {
      appointment: {
        id: 2,
        status: "CI",
        location: "Washington",
        resource: "Dr David",
        address: "Block 1\nSStreet 32\nLong Island\nNew York",
      },
    },
    isDraggable: true,
    isResizable: true,
    resourceId: 2,
  },
];

export const events = [
  {}
]