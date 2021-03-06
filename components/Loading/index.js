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
            <style jsx>{`
              .loading {
                position: absolute;
                width: 80px;
                height: 80px;
                top: 200px;
                left: 50%;
                font-size: 27px;
                color: #337ab7;
                text-align: center;
                line-height: 77px;
                margin: 0 auto;
                margin-left: -45px;
                {/*background: ${theme.maincolor};*/}
                background: transparent;
                border-radius: 7px;
                z-index: 110;
              }
            `}</style>
          </div> : ''
      }
    </div>
  )
}

Loading.propTypes = {
  showLoading: PropTypes.bool
}

export default Loading
