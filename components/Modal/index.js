import React, { Component, PropTypes } from 'react';
import {theme} from 'components';

export function Modal(props) {
  const {showModalState} = props;
  return (
    <div>
      {
        showModalState ?
          <div className={props.classChild + ' modal'} style={props.style}>
            {/* <p className='shade'></p> */}
            <section style={props.sectionStyle}>{props.children}</section>
            <style jsx>{`
              .modal{
                position: fixed;
                top: 10%;
                left: 0;
                right: 0;
                z-index: 100;
              }
              .modal section{
                /* Rectangle 11 Copy 2: */
                background: #FFFFFF;
                border: 1px solid #E6E6E6;
                box-shadow: 0px 3px 7px 0px rgba(0,0,0,0.10);
                border-radius: 8px;
                position: relative;
                z-index: 10;
                width: 60%;
                top: 0;
                margin: 0 auto 0;
              }
            `}</style>
          </div>
        : ''
      }
    </div>
  );
}

/**
  * modal header
  */
export function ModalHeader(props) {
  const {showCloseBtn} = props;
  return (
    <header className={props.classChild + ' modalheader'}>
      {props.children}
      {
        showCloseBtn ?
          <article onClick={() => {props.onHide()}}></article>
        : ''
      }
      <style jsx global>{`
        .modalheader{
          font-size: .18rem;
          color: ${theme.mainfontcolor};
          text-align: center;
          padding: ${theme.lrmargin} ${theme.lrmargin} 0 ${theme.lrmargin};
          position: relative;
        }
        .modalheader article{
          position: absolute;
          background: url('/static/icons/closeIcon.png');
          width: .16rem;
          height: .16rem;
          cursor: pointer;
          background-size: 16px;
          right: ${theme.lrmargin}; top: ${theme.lrmargin};
        }
        {/*须知类弹窗提示 modalheader modalheaderTip*/}
        .modalheaderTip{
          background: #F2F9FF;
        }
      `}</style>
    </header>
  );
}

/**
  * modal footer
  */
export function ModalFooter(props) {
  return (
    <footer className={props.classChild + ' flex modalFooter'}>
      {props.children}
      <style jsx global>{`
        .modalFooter{
          border-top: 1px solid ${theme.bordercolor};
          color: #4A4A4A;
          font-size: .18rem;
        }
        .modalBtn{
          height: .45rem;
          line-height: .45rem;
          padding: 0;
          margin: 0;
          border: none;
          background: transparent;
          width: 50%;
          font-size: ${theme.fontsize};
          color: ${theme.fontcolor};
        }
         {/*按钮右侧一条边框 modalBtn modalBtnBorder*/}
        .modalBtnBorder{
          border-right: 1px solid ${theme.bordercolor};
        }
        {/*背景为主色调按钮 modalBtn modalMainBtn*/}
        .modalMainBtn {
          background: ${theme.maincolor};
          color: #fff;
        }
        {/*只有一个按钮 modalBtn、modalOnlyBtn*/}
        .modalOnlyBtn{
          width: 100%;
          color: #fff;
          background: ${theme.maincolor};
        }
      `}</style>
    </footer>
  );
}

/**
  * modal filterTimeResult
  */
export function FilterTimeResult(props) {
  return (
    <div>
      {
        !props.startDate && !props.endDate ?
          ''
        : <p className='filterTimeResult'>当前搜索：{props.startDate} 至 {props.endDate}</p>
      }
      <style jsx>{`
        .filterTimeResult{
          color: ${theme.fontcolor};
          font-size: ${theme.nfontsize};
          padding: .06rem ${theme.lrmargin};
        }
      `}</style>
    </div>
  )
}
