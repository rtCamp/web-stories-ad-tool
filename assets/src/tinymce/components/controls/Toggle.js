import { dispatch, select } from "@wordpress/data";
import { ToggleControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import name from "../../store/name";

const TinyMCEToggle = ( { fieldObj, field } ) => {
  let settingsObj = select(name).getSettings();
  const currentView = select(name).getCurrentView();
  const { show, readonly: isReadonly, label } = fieldObj;

  return (
    <>
      <ToggleControl
        label={ ! isReadonly ? label : label + __( ' (Readonly)', 'web-stories' ) }
        checked={ show }
        onChange={() => {
          settingsObj[currentView][field] = { ...fieldObj, show: !show };
          dispatch( name ).setSettings( settingsObj );
        }}
        readonly={ isReadonly }
      />
    </>
  );
}

export default TinyMCEToggle;
