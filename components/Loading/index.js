import React, { Component, PropTypes } from 'react';
import {theme} from 'components';

function Loading (props) {
  return (
    <div>
      {
        props.showLoading ?
          <div>
            <div className='loading'>
              <i className='fa fa-spinner fa-spin'></i>
            </div>
          </div> : ''
      }
    </div>
  );
}

Loading.propTypes = {
  showLoading: PropTypes.bool
}

export default Loading
