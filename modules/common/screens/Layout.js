import Head from './head'
import Navigation from './foot_navigation'
import {styles} from 'components/styles';
// import Header from './header'
// var innerHeight = document.body.clientHeight

const Layout = (props) => {
  console.log('---layout--props', props);
  return (
    <main>
      <Head title={props.title} />
      <div>
        {/*<Header title={props.title} />*/}
        <div style={{overflow: 'auto', marginBottom: '60px'}}> {props.children}</div>
        <Navigation url={props.url} />
      </div>
      {styles()}
    </main>
  )
}

export default Layout
