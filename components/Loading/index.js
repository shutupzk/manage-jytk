import React, { Component, PropTypes } from 'react';
import theme from '../theme.js';

function Loading (props) {
  return (
    <div>
      {
        props.showLoading ?
          <div>
            <div className='loading'>
              <svg width="70" height="60" viewBox="0 0 57 57" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
                <g fill="none" fillRule="evenodd">
                  <g transform="translate(1 1)" strokeWidth="2">
                    <circle cx="5" cy="50" r="5">
                      <animate attributeName="cy"
                          begin="0s" dur="2.2s"
                          values="50;5;50;50"
                          calcMode="linear"
                          repeatCount="indefinite" />
                      <animate attributeName="cx"
                          begin="0s" dur="2.2s"
                          values="5;27;49;5"
                          calcMode="linear"
                          repeatCount="indefinite" />
                    </circle>
                    <circle cx="27" cy="5" r="5">
                      <animate attributeName="cy"
                          begin="0s" dur="2.2s"
                          from="5" to="5"
                          values="5;50;50;5"
                          calcMode="linear"
                          repeatCount="indefinite" />
                      <animate attributeName="cx"
                          begin="0s" dur="2.2s"
                          from="27" to="27"
                          values="27;49;5;27"
                          calcMode="linear"
                          repeatCount="indefinite" />
                    </circle>
                    <circle cx="49" cy="50" r="5">
                      <animate attributeName="cy"
                          begin="0s" dur="2.2s"
                          values="50;50;5;50"
                          calcMode="linear"
                          repeatCount="indefinite" />
                      <animate attributeName="cx"
                          from="49" to="49"
                          begin="0s" dur="2.2s"
                          values="49;5;27;49"
                          calcMode="linear"
                          repeatCount="indefinite" />
                    </circle>
                  </g>
                </g>
            </svg>
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
                background: ${theme.maincolor};
                border-radius: 7px;
                z-index: 100;
              }
            `}</style>
          </div> : ''
      }
    </div>
  );
}

Loading.propTypes = {
  showLoading: PropTypes.bool
}

export default Loading
