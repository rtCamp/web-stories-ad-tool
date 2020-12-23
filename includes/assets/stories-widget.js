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
(function () {
  var fieldState = window.webStoriesMCEData || {};

  var react = function (event) {
    var currentView = event.target.value;
    var widget = event.target.closest('.widget');
    var state = fieldState.fields[currentView];

    for (var [key, value] of Object.entries(state)) {
      var field = widget.querySelector('.' + key + '.stories-widget-field');
      var fieldWrapper = widget.querySelector('.' + key + '_wrapper');
      if (field && fieldWrapper && 'checkbox' === field.getAttribute('type')) {
        field.checked = false; // Reset the value.
        field.checked = value.show;
        fieldWrapper.style.display = value.readonly ? 'none' : 'block';
      }
    }
  };

  var bindEvent = function () {
    var dropdowns = document.getElementsByClassName(
      'view-type stories-widget-field'
    );

    if (dropdowns.length) {
      for (var i = 0; i < dropdowns.length; i++) {
        dropdowns[i].onchange = react;
      }
    }
  };

  document.onreadystatechange = function () {
    if (document.readyState === 'interactive') {
      bindEvent();
    }
  };
})();
