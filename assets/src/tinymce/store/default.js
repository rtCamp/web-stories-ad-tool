import { isEmpty, forEach } from "lodash";

const { orderlist, views } = window.webStoriesMCEData;

let DEFAULT_STATE = {
  settings: {},
  modalOpen: false,
  editor: false,
  currentView: isEmpty( views ) ? 'grid' : views[0].value,
}

forEach( views, ( value ) => {
  const { value: viewValue } = value;

  const {
    title,
    author,
    date
  } = window.webStoriesMCEData.fields[viewValue];

  DEFAULT_STATE["settings"][viewValue] = {
    title: title,
    author: author,
    date: date,
    image_align: false,
    number: 5,
    columns: 1,
    view: viewValue,
    order: isEmpty( orderlist ) ? 'latest' : orderlist[0].value,
  }
});

export default DEFAULT_STATE
