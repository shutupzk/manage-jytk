import {theme} from 'components'
export function canlendarStyles() {
    return (
      <style jsx global>
        {`
          .headerBar{
            background: #FBFBFB;
            box-shadow: inset 0px -1px 0px 0px ${theme.bordercolor};
            line-height: .58rem;
            color: ${theme.mainfontcolor};
            font-size: ${theme.fontsize};
            position: relative;
            z-index: 100;
          }
          .headerBarRight{
            padding-right: .1rem;
          }
          .headerBarRight li{
            border-bottom: 3px solid #FBFBFB;
            font-size: ${theme.mainfontsize};
            padding: .18rem .2rem .12rem;
            color: ${theme.fontcolor};
            line-height: .24rem;
            cursor: pointer;
          }
          .headerBarRight li.curLi{
            border-bottom: 3px solid ${theme.maincolor};
            color: ${theme.maincolor};
          }
          .headerUser:hover section{
            display: block;
          }
          .headerUser:hover .headerUserBack{
            transform: rotate(180deg)
          }
          .headerUser{
            position: relative;
            padding: 0 .3rem;
          }
          .headerUser div{
            cursor: pointer;
          }
          .headerUser article:nth-of-type(1){
            padding-top: 0;
            padding-right: 0;
          }
          .headerUser svg{
            height: .14rem;
          }
          .headerUser span{
            font-size: .12rem;
            color: ${theme.fontcolor};
            padding: 0 ${theme.midmargin};
          }
          .headerUser section{
            display: none;
            background: #fff;
            border: 1px solid ${theme.nbordercolor};
            box-shadow: 0 1px 2px 0 rgba(0,0,0,0.10);
            border-radius: .04rem;
            position: absolute;
            top: .46rem;
            left: 0;
            width: 100%;
            text-align: center;
            padding: 0;
          }
          .headerUser section article{
            line-height: .36rem;
            color: ${theme.mainfontcolor};
            cursor: pointer;
            display: block;
          }
          .headerUser section article:first-child{
            border-bottom: 1px solid ${theme.nbordercolor};
          }
        `}
      </style>
    )
}
export default canlendarStyles;