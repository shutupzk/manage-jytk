import Link from 'next/link'
import {HOME_PAGE, MAINFUNCTION} from 'config'
import {theme} from 'components'
import Navigation from './foot_navigation'

const ConLayout = (props) => {
  const url = (props.url && props.url.pathname) || '/';
  console.log('---ConLayout url', props.url && props.url.pathname);
	const conList = MAINFUNCTION.filter((item) => url.indexOf(item.short_name) > -1)
	// const screenHeight = document && document.documentElement.clientHeight;
	// const appConHeight = screenHeight - 58;
  return (
    <div className={'appContent'} style={{ background: '#fff'}}>
      <div className={'appContentLeft left'}>
        <Navigation url={url} data={conList[0] && conList[0].children} />
      </div>
      <div className={'right appContentRight'}>
        <div className={'appConRightCon'}>
					{props.children}
        </div>
      </div>
			<div className='clearfix'></div>
			<style jsx>{`
				.appContentLeft{
					background: ${theme.maincolor};
					width: 12%;
					color: #fff;
					text-align: center;
					height: 100%;
				}
				.appContentLeft:after{
					content: '';
					display: block;
					height: 500px;
					background: ${theme.maincolor};
				}
				.appContentRight{
					width: 88%;
				}
				.appConRightCon{
					padding: .14rem;
				}
			`}</style>
    </div>
  )
}

export default ConLayout
