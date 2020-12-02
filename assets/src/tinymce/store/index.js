import * as actions from './actions';
import name from './name';
import reducer from './reducers';
import * as selectors from './selectors';

const { registerStore } = wp.data;

const WebStoryMCEStore = registerStore(
  name,
  {
    actions: actions,
    reducer: reducer,
    selectors: selectors
  }
);

export default WebStoryMCEStore;
