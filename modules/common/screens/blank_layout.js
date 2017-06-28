import Head from './head'
// import auth from './auth'
// import Header from './header'

export default (props) => (
  <main>
    <Head title={props.title} />
    <div>
      {/*<Header title={props.title} />*/}
      { props.children }
    </div>
    <style jsx global>{`
      * {
        font-family: Menlo, Monaco, "Lucida Console", "Liberation Mono", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Courier New", monospace, serif;
      }
      body{
        {/*font-family: Menlo, Monaco, "Lucida Console", "Liberation Mono", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Courier New", monospace, serif;*/}
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: .15rem;
        background-color: #f2f2f2;
        color: #797979;
        font-weight: 300;
        margin:0
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
        {/*display: flex;*/}
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
      select {
        -webkit-appearance:none;
        appearance:none;
        border:none;
        padding:0px 10px;
        display:block;
        width:100%;
        -webkit-box-sizing:border-box;
        box-sizing:border-box;
        background-color: #FFFFFF;
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
        margin-right: 15px;
      }
      .blockPrimaryBtn {
        {/*width: 90%;*/}
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
