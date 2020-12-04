import { isEmpty } from "lodash";

const { orderlist, views } = window.webStoriesMCEData;

let DEFAULT_STATE = {
  settings: {
    title: false,
    author: false,
    date: false,
    number: 5,
    columns: 1
  },
  modalOpen: false,
  editor: false
}

if ( ! isEmpty( orderlist ) ) {
  DEFAULT_STATE.settings['order'] = orderlist[0].value;
}

if ( ! isEmpty( views ) ) {
  DEFAULT_STATE.settings['view'] = views[0].value;
}

export default DEFAULT_STATE
