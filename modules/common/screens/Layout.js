import Head from './head'
import Navigation from './foot_navigation'
// import Header from './header'
// var innerHeight = document.body.clientHeight

const Layout = (props) => {
  return (
    <main>
      <Head title={props.title} />
      <div>
        {/*<Header title={props.title} />*/}
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
          margin: 20px 20px;
          {/*padding: 20px;*/}
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
        .textInput {
          flex: 3;
          border-bottom: 0px;
          line-height: 30px;
          height: 30px;
          border-radius: 5px;
          margin-right: 15;
        }
        .blockPrimaryBtn {
          display: block !important;
          background-color: #3CA0FF;
          height: 40px;
          text-align: center;
          border-radius: 10px;
          font-size: 16px;
        }
      `}</style>
    </main>
  )
}

export default Layout
