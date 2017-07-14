
import {theme} from '/components';
export function home_styles() {
  return (
    <style jsx global>{`
			.nav{
				display: -webkit-box;
				text-align: center;
				height: 210px;
			}
			.nav h3{
				color: #505050;
				font-size: .16rem;
				font-weight: normal;
			}
			.nav p{
				color: #b4b4b4;
				font-size: .12rem;
				margin: 0;
			}

			.navLeft{
				width: 1.3rem;
				padding-top: .44rem;
			}
			.hosapmIcon{
				width: .72rem;
				height: .64rem;
				display:block;
				margin: .18rem auto 0;
			}

			.navRight{
				-webkit-box-flex: 0.5;
				border-left: 1px solid #d8d8d8;
			}
			.navRight article{
				height: 1.04rem;
			}
			.navRight h3{
			}
			.navRight svg{
				display:block;
				margin: .25rem auto 0;
			}
			.patientPayIcon{
				width: .38rem;
				height: .3rem;
			}
			.selfExamineIcon{
				width: .32rem;
				height: .32rem;
			}
			.reportIcon{
				width: .3rem;
				height: .3rem;
			}
			.inHosIcon{
				width: .32rem;
				height: .32rem;
			}
			.hospitalCenter{
				padding: 0;
				display: -webkit-box;
				height: 1rem;
				position: relative;
				background: #fff;
				padding-right: .15rem;
			}
			.hospitalCenter .hosbgimg{
				height: .7rem;
				{/*position: absolute;
				top: 0;
				left: 0;*/}
				padding: .15rem;
			}
			.hospitalCenter section{
				-webkit-box-flex: 1;
				{/*padding-left: .15rem;*/}
				color: #797979;
			}
			.hospitalCenter section p{
				line-height: 20px;
				font-size: .13rem;
			}
			.hospitalCenter article{
				display: block;
				transform: rotate(135deg);
			}
			.consultList dl{
				padding: .1rem .15rem;
				height: .2rem;
				line-height: .2rem;
				color: #505050;
				text-indent: 6px;
			}
			.consultListheader{
				padding: .1rem .15rem;
				height: .2rem;
				line-height: .2rem;
				color: #505050;
				text-indent: 6px;
			}
			.consultListheader dt{
				font-weight: 500;
			}
			.consultList dl dt:after{
				content: '';
				display: block;
				float: left;
				width: .04rem;
				height: .2rem;
				background: #257BDE;
				border-radius: .03rem;
			}
			.consultListheader dt:after{
				content: '';
				display: block;
				float: left;
				width: .04rem;
				height: .2rem;
				background: #257BDE;
				border-radius: .03rem;
			}
			.consultList dl dd {
				color: #b4b4b4;
				font-size: .13rem;
			}
			.consultListheader dd{
				color: #b4b4b4;
				font-size: .13rem;
			}
			.consultList dl dd article{
				width: .06rem;
				height: .06rem;
				border-top: .02rem solid #C7C7CC;
				border-left: .02rem solid #C7C7CC;
				transform: rotate(135deg);
				margin-top: .06rem;
			}
			.consultListheader dd article{
				width: .06rem;
				height: .06rem;
				border-top: .02rem solid #C7C7CC;
				border-left: .02rem solid #C7C7CC;
				transform: rotate(135deg);
				margin-top: .06rem;
			}
			.consultListitem{
				-webkit-box-flex: 1;
			}
    `}
    </style>
  )
}

export default home_styles;