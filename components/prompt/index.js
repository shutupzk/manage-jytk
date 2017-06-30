function Prompt (props) {
  // const width = window.screen.availHeight
  // const height = window.screen.availWidth
  return (
    <div className={`promptDiv ${props.isShow === true ? 'show' : ''}`}>
      {
        props.children
      }
      <style jsx>{`
        .promptDiv {
          background-color: #888;
          color: #fff;
          padding: 10px;
          z-index: 999;
          position: fixed;
          width:260px;
          position:absolute;
          border-radius: 5px;
          left: 50%;
          top: 50%;
          margin-left:-140px;
          margin-top:-50px;
          display: none;
          text-align: center;
          align-items: center;
        }
        .show {
          display: block !important;
        }
      `}</style>
    </div>
  )
}

export default Prompt
