import theme from './theme'
export function styles () {
  return (
    <style jsx global>
      {`
        p {
          font-size: 14px;
          line-height: 24px;
        }
        dl,
        p,
        h3 {
          margin: 0;
        }
        dd {
          -webkit-margin-start: 0;
        }
        ul {
          padding: 0;
          margin: 0;
        }
         {
          /*theme ---start ----*/
        }
        html {
          font-size: 100px;
        }
        @media (max-width: 370px) {
          html {
            font-size: 90px;
          }
        }
        body {
           {
            /*font-family: Menlo, Monaco, "Lucida Console", "Liberation Mono", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Courier New", monospace, serif;*/
          }
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: ${theme.fontsize};
          background-color: #f2f2f2;
          color: ${theme.fontcolor};
          font-weight: 300;
          margin: 0;
        }
        .flex {
          display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
          display: -moz-box; /* 老版本语法: Firefox (buggy) */
          display: -ms-flexbox; /* 混合版本语法: IE 10 */
          display: -webkit-flex; /* 新版本语法: Chrome 21+ */
          display: flex;
        }
        .lr-flex {
          -webkit-justify-content: center;
          -moz-justify-content: center;
          -ms-justify-content: center;
          justify-content: center;
        }
        .tb-flex {
          -webkit-align-items: center;
          -moz-align-items: center;
          -ms-justify-content: center;
          align-items: center;
        }
        .left {
          float: left;
        }
        .right {
          float: right;
        }
        .clearfix {
          content: '.';
          height: 0;
          display: block;
          visibility: hidden;
          clear: both;
        }
        a {
          text-decoration: none;
        }
        li {
          list-style: none;
        }
        .back-left {
          width: 0.08rem;
          height: 0.08rem;
          border-top: 0.03rem solid #c7c7cc;
          border-left: 0.03rem solid #c7c7cc;
        }
        .sanjiao {
          display: inline-block;
          width: 0;
          height: 0;
          border-left: 0.06rem solid transparent;
          border-right: 0.06rem solid transparent;
          border-top: 0.06rem solid ${theme.maincolor};
        }
        input:-webkit-autofill,
        textarea:-webkit-autofill,
        select:-webkit-autofill {
          background: transparent !important;
        }
        /*textoverflow*/
        .textoverflow1 {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .textoverflow2 {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        /*btn*/
        /*灰色系的按钮*/
        .btnBorder {
          text-align: center;
          color: ${theme.mainfontcolor};
          border: 1px solid ${theme.bordercolor};
          border-radius: 2px;
          background: #fff;
          font-size: ${theme.nfontsize};
          padding: 0.04rem 0.12rem;
        }
        .btnBorderMain {
          color: ${theme.maincolor};
          border: 1px solid ${theme.maincolor};
        }
        .btnBorderDisabled {
          color: ${theme.nfontcolor};
          background: #f2f2f2;
          border: 1px solid ${theme.bordercolor};
        }
        /*填充背景的圆按钮*/
        .btnBG {
          height: 0.42rem;
          line-height: 0.36rem;
          width: 100%;
          font-weight: 300;
           {
            /* border-radius: 1rem; */
          }
          background: #f8f8f8;
          font-size: 0.18rem;
          border: 1px solid #ccc;
          color: ${theme.mainfontcolor};
          padding: 0;
        }
        .btnBGMain {
          background: ${theme.maincolor};
          border: 1px solid ${theme.maincolor};
          color: #fff;
        }
        .btnBGMainDisable {
          background: #7fa4c9;
          border: 1px solid #7fa4c9;
          color: #fff;
        }
        /* 灰色系按钮 */
        .btnBGGray {
          background: #f2f2f2;
          border: 1px solid #f2f2f2;
          color: ${theme.mainfontcolor};
        }
        .btnBGGrayDisable {
          background: #f2f2f2;
          border: 1px solid #f2f2f2;
          color: ${theme.nfontcolor};
        }
        .btnBGLitt {
          width: 0.5rem;
          height: 0.3rem;
          line-height: 0.3rem;
          font-size: 0.14rem;
          text-align: center;
          padding: 0;
        }
        /**
       * list item button
       */
        .btnList {
          background: #87b87f;
          font-size: 0.12rem;
          border: none;
          color: #fff;
          margin: 0 ${theme.midmargin};
          padding: 0.03rem 0.07rem;
        }
        .btnListDelete {
          background: #d15b47;
        }
        .btnListModify {
          background: #9585bf;
        }
        button {
          font-weight: 300;
        }
        button:active {
          background-color: #1b9db7;
          transition: background-color 0.3s;
        }
        button:focus {
          outline: none;
        }

        /**
       * input radio video
       */
        ::-moz-placeholder {
          color: ${theme.nfontcolor};
        }
        ::-webkit-input-placeholder {
          color: ${theme.nfontcolor};
        }
        :-ms-input-placeholder {
          color: ${theme.nfontcolor};
        }
        .radio,
        .checkbox {
          position: relative;
          width: 0.16rem;
          height: 0.16rem;
        }
        .radio label,
        .radio input,
        .radio label:before,
        .checkbox label,
        .checkbox input,
        .checkbox label:before {
          position: absolute;
          top: 0;
          left: 0;
          width: 0.16rem;
          height: 0.16rem;
          background: #f2f2f2;
          margin: 0 !important;
          border-radius: 2px;
        }
        .radio label:before,
        .checkbox label:before {
          content: '';
          background: ${theme.maincolor};
          opacity: 0;
        }
        .radio label:after,
        .checkbox label:after {
          content: '';
          position: absolute;
          width: 0.08rem;
          height: 0.04rem;
          border-left: 0.02rem solid #fff;
          border-bottom: 0.02rem solid #fff;
          transform: rotate(-45deg);
          top: 0.03rem;
          left: 0.03rem;
          opacity: 0;
        }
        .radio input[type='radio']:checked + label:before,
        .checkbox input[type='radio']:checked + label:before,
        .radio input[type='radio']:checked + label:after,
        .checkbox input[type='radio']:checked + label:after,
        .radio input[type='checkbox']:checked + label:before,
        .checkbox input[type='checkbox']:checked + label:before,
        .radio input[type='checkbox']:checked + label:after,
        .checkbox input[type='checkbox']:checked + label:after {
          opacity: 1;
        }

        // 左右推拉checkbox manage_list_item
        .checkboxRow {
          position: relative;
          height: 24px;
          width: 56px;
          display: inline-block;
        }
        .checkboxRow label {
          color: #b4b4b4;
          border: 1px solid #d8d8d8;
          background: #f2f2f2;
          padding-left: 10px;
          padding-right: 0;
          border-radius: 16px;
          line-height: 0.19rem;
          text-align: center;
          width: 0.44rem;
          font-size: 12px;
          position: absolute;
          display: block;
          top: 0;
          left: 0;
        }
        .checkboxRow label:nth-of-type(1) {
          color: #3464ca;
          border: 1px solid #3464ca;
          padding-right: 10px;
          padding-left: 0;
          background: #e4edff;
          opacity: 0;
          z-index: 1;
        }
        .checkboxRow label:nth-of-type(1):after,
        .checkboxRow label:nth-of-type(2):before {
          display: inline-block;
          content: '';
          width: 0.14rem;
          height: 0.14rem;
          background: #d8d8d8;
          border-radius: 100%;
          position: absolute;
          top: 2px;
        }
        .checkboxRow label:nth-of-type(1):after {
          right: 2px;
          background: #3464ca;
        }
        .checkboxRow label:nth-of-type(2):before {
          left: 2px;
        }
        .checkboxRow input[type='checkbox']:checked + label:nth-of-type(2) {
          opacity: 0;
        }
        .checkboxRow input[type='checkbox']:checked + label:nth-of-type(1) {
          opacity: 1;
        }

        /*select*/
        input[type='date'],
        select {
          //去除select右边默认的图标
          appearance: none;
          -moz-appearance: none;
          -webkit-appearance: none;
          -ms-appearance: none;
          background: transparent !important;
        }

        .select {
          background: #fff;
          border: 1px solid ${theme.bordercolor};
          border-radius: 0.16rem;
          min-width: 2rem;
          width: 84%;
          padding: 0 0.1rem 0 0.06rem;
          position: relative;
        }
        .select select {
          //去除select右边默认的图标
          appearance: none;
          -moz-appearance: none;
          -webkit-appearance: none;
          -ms-appearance: none;
          width: 100%;
          height: 0.34rem;
          line-height: 0.34rem;
          border: 0px solid #fff;
          background: transparent;
          color: ${theme.mainfontcolor};
        }
        .select .select-icon {
        }
        .select .select-icon i:nth-of-type(1) {
           {
            /*@include sanjiao(left, bottom, right, #B8C2C7, 0.04rem);*/
          }
          width: 0;
          height: 0;
          border-left: 0.04rem solid transparent;
          border-right: 0.04rem solid transparent;
          border-bottom: 0.04rem solid #b8c2c7;
          display: block;
        }
        .select .select-icon i:nth-of-type(2) {
           {
            /*@include sanjiao(left, top, right, #B8C2C7, 0.04rem);*/
          }
          width: 0;
          height: 0;
          border-left: 0.04rem solid transparent;
          border-right: 0.04rem solid transparent;
          border-top: 0.04rem solid #b8c2c7;
          display: block;
          margin-top: 0.04rem;
        }

        /* shade */
        .shade,
        .shadeWhite {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: rgba(0, 0, 0, 0.5);
        }
        .shadeWhite {
          background: rgba(255, 255, 255, 1);
        }

         {
          /* theme end --- */
        }

        .textInput {
          flex: 3;
          border-bottom: 0px;
          line-height: 30px;
          height: 30px;
          border-radius: 5px;
          margin-right: 15px;
        }
        .blockPrimaryBtn {
          display: block !important;
          background-color: ${theme.maincolor};
          height: 40px;
          text-align: center;
          border-radius: 10px;
          font-size: 16px;
        }

        /**
       * list item
       */
        .listItem {
          padding: 0 15px;
          color: ${theme.mainfontcolor};
          line-height: 0.36rem;
          font-size: ${theme.nfontsize};
          box-sizing: content-box;
        }
        .listItem:nth-of-type(2n + 1) {
          background: #fbfbfb;
        }
        .listItem:hover {
          background: #f7f7f7;
        }

        .disabledDetailInput input,
        .disabledDetailInput,
        .disabledDetailInput textarea {
          border: none;
          min-height: 0.3rem;
        }
      `}
    </style>
  )
}

export default styles
