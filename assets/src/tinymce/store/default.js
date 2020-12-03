import { isEmpty } from "lodash";

const { orderlist } = window.webStoriesMCEData;

const DEFAULT_STATE = {
  settings: {
    show_author: true,
    show_date: false,
    number: 5,
    columns: 1,
    order: ! isEmpty( orderlist ) ? orderlist[0].value : null,
  },
  modalOpen: false,
  editor: false
}

export default DEFAULT_STATE
