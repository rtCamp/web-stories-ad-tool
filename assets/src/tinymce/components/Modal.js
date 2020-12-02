import name from "../store/name";

const {
  Modal,
  ToggleControl,
  RangeControl,
  SelectControl,
  Button
} = wp.components;

const { dispatch } = wp.data;
const { __ } = wp.i18n;

const WebStoriesModal = ( props ) => {
  const { modalOpen, settings } = props;
  const {
    image_options,
    show_author,
    show_date,
    number,
    columns,
    order
  } = settings;

  return (
    <>
      { modalOpen && (
        <Modal
          onRequestClose={ () => {
            dispatch( name ).toggleModal( false );
          }}
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
            checked={ show_date }
            onChange={ () => dispatch( name ).setSettings( { ...settings, show_date: !show_date } ) }
          />

          <RangeControl
            label={ __( 'Number of Stories', 'web-stories' ) }
            value={ number }
            min={ 1 }
            max={ 20 }
            onChange={ ( items ) => dispatch( name ).setSettings( { ...settings, number: parseInt( items, 10 ) } ) }
          />

          <RangeControl
            label={ __( 'Number of Columns', 'web-stories' ) }
            value={ columns }
            min={ 1 }
            max={ 4 }
            onChange={ ( cols ) => dispatch( name ).setSettings( { ...settings, columns: parseInt( cols, 10 ) } ) }
          />

          <SelectControl
            label={ __( 'Select Order', 'web-stories' ) }
            value={ order }
            options={ window.webStoriesMCEData }
            onChange={ ( order ) => dispatch( name ).setSettings( { ...settings, order: order } ) }
          />

          <div className={ 'alignright' }>
            <Button
              isPrimary
              onClick={ () => {
                console.log( 'Insert shortcode here....' );
                editor.insertContent('[stories number=10]');
                dispatch( name ).toggleModal( false );
            }}
            >
              { __( 'Okay', 'web-stories' ) }
            </Button>
            <Button>{ __( 'Cancel', 'web-stories' ) }</Button>
          </div>

        </Modal>
      ) }
    </>
  )
}

export default WebStoriesModal;
