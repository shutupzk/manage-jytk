import Head from './head'
import ConLayout from './con_layout'
import {styles} from 'components/styles';
// import Header from './header'
// var innerHeight = document.body.clientHeight
import {HeaderBar, Prompt, FooterBar} from 'components'

const Layout = (props) => {
  return (
    <main>
      <Head title={props.title} />
      <div>
        <HeaderBar {...props}  />
        <Prompt />
        <div style={{overflow: 'auto'}}>
        <ConLayout {...props} /></div>
        <FooterBar notLoginPage />
      </div>
      {styles()}
    </main>
  )
}

export default Layout
