import React, { Component, PropTypes } from 'react'
import theme from '../theme.js'

function Loading (props) {
  return (
    <div>
      {
        props.showLoading ?
          <div>
            <div className='loading'>
              <img src='/static/icons/loading.gif' width='100' />
            </div>
          </div> : ''
      }
    </div>
  )
}

Loading.propTypes = {
  showLoading: PropTypes.bool
}

export default Loading

