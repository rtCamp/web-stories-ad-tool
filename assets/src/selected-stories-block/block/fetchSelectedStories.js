/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Placeholder } from '@wordpress/components';
import { BlockIcon } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import LoaderContainer from './components/loaderContainer';

const LoadingPlaceholder = styled(Placeholder)`
  &.is-appender {
    min-height: 0;
    margin-top: 20px;

    &.not-editing {
      /* display: none; */
    }
  }
`;

function FetchSelectedStories({
  icon,
  label,
  selectedStories,
  setSelectedStoriesObject,
  setIsFetchingSelectedStories,
}) {
  let placeholderIcon = <BlockIcon icon={icon} showColors />;

  const fetchStories = async () => {
    try {
      const response = await apiFetch({
        path: addQueryArgs('/web-stories/v1/web-story', {
          _embed: 'author',
          _web_stories_envelope: true,
          context: 'edit',
          include: selectedStories,
        }),
      });
      setSelectedStoriesObject(
        response.body.sort((a, b) => {
          return selectedStories.indexOf(a.id) - selectedStories.indexOf(b.id);
        })
      );
      setIsFetchingSelectedStories(false);
    } catch (error) {
      // Temporarily disabled, show a UI message.
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LoadingPlaceholder
      icon={placeholderIcon}
      label={label}
      className="wp-block-web-stories-embed is-appender not-editing"
      instructions={false}
    >
      <LoaderContainer>
        {__('Fetching selected stories', 'web-stories')}
      </LoaderContainer>
    </LoadingPlaceholder>
  );
}

FetchSelectedStories.propTypes = {
  icon: PropTypes.func,
  label: PropTypes.string,
  selectedStories: PropTypes.array,
  setSelectedStoriesObject: PropTypes.func,
  setIsFetchingSelectedStories: PropTypes.func,
};

export default FetchSelectedStories;
