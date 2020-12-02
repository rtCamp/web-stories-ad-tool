import name from "../store/name";

const { Modal, ToggleControl } = wp.components;
const { dispatch } = wp.data;
const { __ } = wp.i18n;

const WebStoriesModal = ( props ) => {
  const { modalOpen, settings } = props;
  const {
    image_options,
    show_author,
    show_date,
    show_category
  } = settings;

  return (
    <>
      { modalOpen && (
        <Modal
          title={ __( 'Web Stories', 'web-stories' ) }>

          <ToggleControl
            label={ __( 'Story Image Options', 'web-stories' ) }
            checked={ image_options }
            onChange={ () => dispatch( name ).setSettings( { ...settings, image_options: !image_options } ) }
          />

          <ToggleControl
            label={ __( 'Show Author', 'web-stories' ) }
            checked={ show_author }
            onChange={ () => dispatch( name ).setSettings( { ...settings, show_author: !show_author } ) }
          />

          <ToggleControl
            label={ __( 'Show Date & Time', 'web-stories' ) }
            checked={ show_author }
            onChange={ () => dispatch( name ).setSettings( { ...settings, show_date: !show_date } ) }
          />

          <ToggleControl
            label={ __( 'Show Category', 'web-stories' ) }
            checked={ show_category }
            onChange={ () => dispatch( name ).setSettings( { ...settings, show_category: !show_category } ) }
          />

        </Modal>
      ) }
    </>
  )
}

export default WebStoriesModal;
