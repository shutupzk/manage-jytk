import React, { Component, PropTypes } from 'react';
import {theme} from 'components';

export function Modal(props) {
  const {showModalState} = props;
  return (
    <div>
      {
        showModalState ?
          <div className={props.classChild + ' modal'}>
            <p className='shade'></p>
            <section>{props.children}</section>
            <style jsx>{`
              .modal{
                position: fixed;
                top: 10%;
                left: 0;
                right: 0;
                z-index: 100;
              }
              .modal section{
                background: #fff;
                border-radius: $inmargin;
                position: relative;
                z-index: 10;
                width: 80%;
                top: 10%;
                margin: 10% auto 0;
                box-shadow: 0 0 .12rem rgba(0,0,0,0.2);
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
          <button onClick={() => {props.onHide()}}>*</button>
        : ''
      }
      <style jsx global>{`
        .modalheader{
          font-size: .18rem;
          color: ${theme.mainfontcolor};
          text-align: center;
          padding: ${theme.lrmargin};
          position: relative;
        }
        .modalheader button{
          position: absolute;
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
          line-height: .46rem;
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
