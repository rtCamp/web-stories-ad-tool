import { isEmpty } from "lodash";
import name from "../store/name";
import { isCircleView } from "../utils";
import TinyMCEToggle from "./controls/Toggle";

const {
  Modal,
  RangeControl,
  SelectControl,
  Button
} = wp.components;

const { dispatch, select } = wp.data;
const { __ } = wp.i18n;

const WebStoriesModal = ( props ) => {
  const { modalOpen, settings, prepareShortCode } = props;
  const {
    author,
    date,
    title,
    number,
    columns,
    order,
    view
  } = settings;

  console.log(settings);

  return (
    <>
      { modalOpen && (
        <Modal
          onRequestClose={ () => {
            dispatch( name ).toggleModal( false );
          }}
          closeButtonLabel={ __( 'Close', 'web-stories' ) }
          title={ __( 'Web Stories', 'web-stories' ) }
          className={ "component_web_stories_mce_model" }
        >

          { ! isEmpty( view ) && <SelectControl
            label={ __( 'Select View Type', 'web-stories' ) }
            value={ view }
            options={ window.webStoriesMCEData.views }
            onChange={ ( view ) => dispatch( name ).setCurrentView( view ) }
          />}

          <TinyMCEToggle
            field={ 'title' }
            fieldObj={ title }
          />

          <TinyMCEToggle
            field={ 'author' }
            fieldObj={ author }
          />

          <TinyMCEToggle
            field={ 'date' }
            fieldObj={ date }
          />

          <RangeControl
            label={ __( 'Number of Stories', 'web-stories' ) }
            value={ number }
            min={ 1 }
            max={ 20 }
            onChange={ ( items ) => dispatch( name ).setSettings( { ...settings, number: parseInt( items, 10 ) } ) }
          />

          {!isCircleView() && <RangeControl
            label={__('Number of Columns', 'web-stories')}
            value={columns}
            min={1}
            max={4}
            onChange={(cols) => dispatch(name).setSettings({...settings, columns: parseInt(cols, 10)})}
          />
          }

          { ! isEmpty( order ) && <SelectControl
            label={ __( 'Select Order', 'web-stories' ) }
            value={ order }
            options={ window.webStoriesMCEData.orderlist }
            onChange={ ( order ) => dispatch( name ).setSettings( { ...settings, order: order } ) }
          />}

          <div
            style={ { padding: "20px 0" } }
            className={ 'alignright' }>
            <Button
              isPrimary
              onClick={ () => {
                const editorInstance = select(name).getEditor();

                if ( editorInstance ) {
                  const shortcode = prepareShortCode();
                  editorInstance.insertContent(shortcode);
                }

                dispatch( name ).toggleModal( false );
            }}
            >
              { __( 'Okay', 'web-stories' ) }
            </Button>
            <Button
              onClick={ () => dispatch( name ).toggleModal( false ) }
            >
              { __( 'Cancel', 'web-stories' ) }
            </Button>
          </div>

        </Modal>
      ) }
    </>
  )
}

export default WebStoriesModal;
