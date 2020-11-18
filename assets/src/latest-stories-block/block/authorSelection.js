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
// eslint-disable-next-line import/no-extraneous-dependencies
import { debounce, isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { useState, useRef } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Autocomplete from './autocomplete';

/**
 * Module Constants
 */
const USERS_LIST_QUERY = {
  per_page: -1,
};

const AuthorSelection = ({ authors, setAttributes }) => {
  const [authorsList, setAuthorsList] = useState([]);

  const getAuthorSuggestions = () => {
    if (undefined !== authorsList && authorsList.length > 0) {
      return authorsList.reduce(
        (accumulator, author) => ({
          ...accumulator,
          [author.name]: {
            id: author.id,
            value: author.name,
          },
        }),
        {}
      );
    }
    return [];
  };

  const getAuthorNames = (authorsObj = []) => {
    if (isEmpty(authorsObj)) {
      authorsObj = getAuthorSuggestions();
    }

    if (isEmpty(authorsObj)) {
      return [];
    }

    return Object.keys(authorsObj);
  };

  const selectAuthors = (tokens) => {
    const authorSuggestions = getAuthorSuggestions();

    const hasNoSuggestion = tokens.some(
      (token) => typeof token === 'string' && !authorSuggestions[token]
    );

    if (hasNoSuggestion) {
      return;
    }

    const allAuthors = tokens.map((token) => {
      return 'string' === typeof token ? authorSuggestions[token] : token;
    });

    setAttributes({ authors: allAuthors });
  };

  const isStillMounted = useRef();

  const onAuthorChange = (searchQuery) => {
    isStillMounted.current = true;

    if (searchQuery) {
      USERS_LIST_QUERY.search = searchQuery;
    }

    apiFetch({
      path: addQueryArgs('/wp/v2/users', USERS_LIST_QUERY),
    })
      .then((data) => {
        if (isStillMounted.current) {
          setAuthorsList(data);
        }
      })
      .catch(() => {
        if (isStillMounted.current) {
          setAuthorsList([]);
        }
      });

    return () => {
      isStillMounted.current = false;
    };
  };

  const debouncedOnAuthorChange = debounce(onAuthorChange, 500);

  return (
    <Autocomplete
      label={__('Authors', 'web-stories')}
      value={authors}
      options={getAuthorNames()}
      onChange={(value) => selectAuthors(value)}
      onInputChange={(value) => debouncedOnAuthorChange(value)}
    />
  );
};

AuthorSelection.propTypes = {
  authors: PropTypes.array.isRequired,
  setAttributes: PropTypes.func.isRequired,
};

export default AuthorSelection;
