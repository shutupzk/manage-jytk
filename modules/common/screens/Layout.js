import Head from './head'
import Navigation from './foot_navigation'
import Header from './header'
// var innerHeight = document.body.clientHeight

const Layout = (props) => (
  <main>
    <Head title={props.title}/>
    <div>
      <Header title={props.title} />
      <div style={{overflow: 'auto'}}> {props.children}</div>
      <Navigation />
    </div>
    <style jsx global>{`
      * {
        font-family: Menlo, Monaco, "Lucida Console", "Liberation Mono", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Courier New", monospace, serif;
      }
      body {
        margin: 0;
        padding: 0px;
      }
      a {
        color: #22BAD9;
      }
      p {
        font-size: 14px;
        line-height: 24px;
      }
      button {
        align-items: center;
        background-color: #22BAD9;
        border: 0;
        color: white;
        display: flex;
        padding: 5px 7px;
      }
      button:active {
        background-color: #1B9DB7;
        transition: background-color .3s
      }
      button:focus {
        outline: none;
      }
      .container {
        margin: 10px;
        padding: 20px;
      }
      .clearfix {
        content: ".";
        height: 0;
        display: block;
        visibility: hidden;
        clear: both
      }
    `}</style>
  </main>
)

export default Layout
