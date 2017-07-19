import Head from './head'
import {styles} from 'components/styles';
// import auth from './auth'
// import Header from './header'
import {HeaderBar, Prompt, FooterBar} from 'components'

export default (props) => (
  <main>
    <Head title={props.title} />
    <div>
      <HeaderBar hideRightCon {...props} />
      <Prompt />
      { props.children }
      <FooterBar />
    </div>
    {styles()}
  </main>
)
