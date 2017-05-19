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
          {/*font-family: Menlo, Monaco, "Lucida Console", "Liberation Mono", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Courier New", monospace, serif;*/}
        }
        body {
          margin: 0;
          padding: 0px;
        }
        a {
          color: #22BAD9;
        }

        {/*lvyinlei ---start*/}
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
          font-size: .15rem;
          background-color: #f2f2f2;
          color: #797979;
          font-weight: 300;
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
        {/*lvyinlei ---end*/}

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
