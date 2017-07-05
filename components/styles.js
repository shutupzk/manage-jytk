
import theme from './theme';
export function styles() {
  return (
    <style jsx global>{`
      p {
        font-size: 14px;
        line-height: 24px;
      }
      dl, p, h3{
        margin: 0;
      }
      dd{
        -webkit-margin-start: 0;
      }
      ul{
        padding: 0; margin: 0;
      }
      {/*theme ---start ----*/}
      html{
        font-size: 100px;
      }
      @media(max-width: 370px){
        html{
          font-size: 90px;
        }
      }
      body{
        {/*font-family: Menlo, Monaco, "Lucida Console", "Liberation Mono", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Courier New", monospace, serif;*/}
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: ${theme.fontsize};
        background-color: #f2f2f2;
        color: ${theme.fontcolor};
        font-weight: 300;
        margin: 0;
      }
      .flex{
        display: -webkit-box;  /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
        display: -moz-box;     /* 老版本语法: Firefox (buggy) */
        display: -ms-flexbox;  /* 混合版本语法: IE 10 */
        display: -webkit-flex; /* 新版本语法: Chrome 21+ */
        display: flex;
      }
      .lr-flex{
        -webkit-justify-content: center;
        -moz-justify-content: center;
        -ms-justify-content: center;
        justify-content: center;
      }
      .tb-flex{
        -webkit-align-items: center;
        -moz-align-items: center;
        -ms-justify-content: center;
        align-items: center;
      }
      .left{
        float: left;
      }
      .right{
        float: right;
      }
      .clearfix {
        content: ".";
        height: 0;
        display: block;
        visibility: hidden;
        clear: both
      }
      a {text-decoration:none}
      li {list-style: none}
      .back-left{
        width: .08rem;
        height: .08rem;
        border-top: .03rem solid #C7C7CC;
        border-left: .03rem solid #C7C7CC;
      }
      .sanjiao{
        display: inline-block;
        width: 0;
        height: 0;
        border-left: .06rem solid transparent;
        border-right: .06rem solid transparent;
        border-top: .06rem solid ${theme.maincolor};
      }
      input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {background: transparent !important;}
      /*textoverflow*/
      .textoverflow1{
        overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;
      }
      .textoverflow2{
        overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;
      }

      /*btn*/
      /*只有边框和线、没有背景的按钮*/
      .btnBorder{
        text-align: center;
        color: ${theme.mainfontcolor};
        border: 1px solid ${theme.bordercolor};
        border-radius: 2px;
        background: #fff;
        font-size: ${theme.nfontsize};
        padding: .04rem 0.12rem;
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
      .btnBG{
        height: .42rem;
        line-height: .36rem;
        width: 100%;
        font-weight: 300;
        border-radius: 1rem;
        background: #f8f8f8;
        font-size: .18rem;
        border: 1px solid #ccc;
        color: ${theme.mainfontcolor};
        padding: 0;
      }
      .btnBGMain{
        background: ${theme.maincolor};
        border: 1px solid ${theme.maincolor};
        color: #fff;
      }
      .btnBGDisable{
        background: ${theme.bordercolor};
        border: 1px solid ${theme.bordercolor};
        color: #fff;
      }
      .btnBGLitt{
        width: .5rem;
        height: .3rem;
        line-height: .3rem;
        font-size: .14rem;
        text-align: center;
      }
      /*全屏宽的按钮*/
      /*灰色 不可点*/
      .fullWidthFixed{
        width: 100%;
        position: fixed;
        bottom: 0;
        z-index: 100;
      }
      .fullWidthBtn{
        border: 0px solid #fff;
        height: .46rem;
        line-height: .46rem;
        background: ${theme.nfontcolor};
        color: #fff;
        font-size: .16rem;
        text-align: center;
        letter-spacing: -0.21px;
        padding: 0;
      }
      /*可点 主色调*/
      .fullWidthBtnMain{
        background: ${theme.maincolor};
      }
      /*白色背景 可点*/
      .fullWidthBtnBackWhite{
        background: #fbfbfb;
        color: #E45252;
      }
      button{
        font-weight: 300;
      }
      button:active {
        background-color: #1B9DB7;
        transition: background-color .3s
      }
      button:focus {
        outline: none;
      }

      /*select*/
      input[type=date], select{
        //去除select右边默认的图标
        appearance:none;
        -moz-appearance:none;
        -webkit-appearance:none;
        -ms-appearance:none;
        background: transparent !important;
      }

      .select{
        background: #fff;
        border: 1px solid ${theme.bordercolor};
        border-radius: .16rem;
        min-width: 2rem;
        width: 84%;
        padding: 0 0.1rem 0 .06rem;
        position: relative;
      }
      .select select{
        //去除select右边默认的图标
        appearance:none;
        -moz-appearance:none;
        -webkit-appearance:none;
        -ms-appearance:none;
        width: 100%;
        height: .28rem;
        line-height: .28rem;
        border: 0px solid #fff;
        background: transparent;
      }
      .select .select-icon{
        position: absolute;
        top: .08rem;
        right: .1rem;
      }
      .select .select-icon i:nth-of-type(1) {
        {/*@include sanjiao(left, bottom, right, #B8C2C7, 0.04rem);*/}
        display: block;
      }
      .select .select-icon i:nth-of-type(2) {
        {/*@include sanjiao(left, top, right, #B8C2C7, 0.04rem);*/}
        display: block;
        margin-top: .04rem;
      }

      /* shade */
      .shade, .shadeWhite{
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0,0,0,.5);
      }
      .shadeWhite{
        background: rgba(255,255,255,1);
      }

      {/* theme end --- */}

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
    `}
    </style>
  )
}

export default styles;