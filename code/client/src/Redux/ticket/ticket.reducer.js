import { REMOVE_TNO, ADD_TNO, REMOVE } from "./ticket.types";

export const ticketInitalState = {
  ticketNo: [],
};

export const ticketReducer = (state = ticketInitalState, { type, payload }) => {
  switch (type) {
    case REMOVE_TNO:
      return {
        ...state,
        ticketNo: state.ticketNo.filter(
          (ele) => String(ele).trim() !== String(payload).trim()
        ),
      };

    case ADD_TNO: {
      const exists = state.ticketNo.some((ele) => String(ele) === String(payload));
      return {
        ...state,
        ticketNo: exists ? state.ticketNo : state.ticketNo.concat(payload),
      };
    }

    case REMOVE:
      return {
        ...state,
        ticketNo: [],
      };

    default: {
      return state;
    }
  }
};
