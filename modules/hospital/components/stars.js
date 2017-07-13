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
            width: 20px;
            height: 19px;
            background-image: url(/static/icons/collect.png);
            background-size: 20px;
            margin-right: 10px;
          }
          ul li a {
            display: block;
            width: 100%;
            overflow: hidden;
            text-indent: -9999px;
            outline: none;
          }
          ul li.light {
            background-image: url(/static/icons/collected.png);
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
