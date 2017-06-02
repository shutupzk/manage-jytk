import React, { Component } from 'react'

class Stars extends Component {
  componentDidMount () {
    var lis = document.getElementById(this.props.scoreType).getElementsByTagName('li')
    var me = this
    for (var i = 1; i <= lis.length; i++) {
      lis[i - 1].index = i
      lis[i - 1].onclick = function () { // 鼠标点击,同时会调用onmouseout,改变tempnum值点亮星星
        fnShow(lis, this.index)
        me.props.getScore(me.props.scoreType, this.index)
      }
    }
  }
  render () {
    return (
      <div>
        <ul id={this.props.scoreType}>
          <li className='light'
          ><a>1</a></li>
          <li className='light'
          ><a>2</a></li>
          <li className='light'
          ><a>3</a></li>
          <li className='light'
          ><a>4</a></li>
          <li className='light'
          ><a>5</a></li>
        </ul>
        <style jsx>{`
          ul {
            padding-left: 0;
            overflow: hidden;
          }
          ul li {
            float: left;
            list-style: none;
            width: 27px;
            height: 27px;
            background: url(/static/icons/stars.gif)
          }
          ul li a {
            display: block;
            width: 100%;
            padding-top: 27px;
            overflow: hidden;
          }
          ul li.light {
            background-position: 0 -29px;
          }
        `}</style>
      </div>
    )
  }
}

function fnShow (lis, num) {
  num = num || 0
  for (var i = 0; i < lis.length; i++) {
    lis[i].className = i < num ? 'light' : ''
  }
}

export default Stars
