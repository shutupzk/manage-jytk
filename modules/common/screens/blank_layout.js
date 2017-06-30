import Head from './head'
import {styles} from 'components/styles';
// import auth from './auth'
// import Header from './header'

export default (props) => (
  <main>
    <Head title={props.title} />
    <div>
      {/*<Header title={props.title} />*/}
      { props.children }
    </div>
    {styles()}
  </main>
)
