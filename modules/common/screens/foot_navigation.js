import React, { Component } from 'react'
import Link from 'next/link'
import { theme } from 'components'

export default class Navigation extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const data = this.props.data
    return (
      <ul className='footNavUl'>
        {data &&
          data.map((item, itemKey) => {
            return <div key={itemKey}>{item.childs && item.childs.length > 0 ? levelTowHtml(this, item, itemKey) : levelOneHtml(this, item, itemKey)}</div>
          })}
        <style jsx global>{`
          .footNavUl {
            position: relative;
            z-index: 10;
          }
          .footNavLI {
            line-height: 0.46rem;
            font-size: 0.16rem;
            cursor: pointer;
          }
          .footNavLI.leftLiCur {
            background: #1a3979;
          }
          .footNavLI.leftLiCur .footNavLIA {
            color: #fff !important;
          }
          .footNavChild {
            padding-bottom: 6px;
            background: #2a3788;
          }
          .footNavChildItem {
            line-height: 0.4rem;
            border-top: 1px solid ${theme.bordercolor};
          }
        `}</style>
      </ul>
    )
  }
}

const levelOneHtml = (self, item, itemKey) => {
  const url = self.props.url
  return (
    <li className={url === item.navigateName || (item.navigateNameDetail && url.indexOf(item.navigateNameDetail) > -1) ? 'leftLiCur footNavLI' : 'footNavLI'} key={item.title}>
      <Link href={item.navigateName}>
        <a style={{ color: item.color }} className='flex lr-flex tb-flex footNavLIA'>
          {item.title}
        </a>
      </Link>
    </li>
  )
}

const levelTowHtml = (self, item, itemKey) => {
  const url = self.props.url
  const commanUrl = url.indexOf(item.navigateName) > -1
  return (
    <li className={commanUrl ? 'leftLiCur footNavLI' : 'footNavLI'} key={item.title}>
      <a
        style={{ color: item.color }}
        className='flex lr-flex tb-flex footNavLIA'
        onClick={() => {
          const prev = self.state[itemKey]
          self.setState({
            [itemKey]: !prev
          })
        }}
      >
        {item.title}
        <i
          style={{
            display: 'block',
            marginLeft: '.03rem',
            borderTop: '.02rem solid #fff',
            borderLeft: '.02rem solid #fff',
            width: '.06rem',
            height: '.06rem',
            transform: self.state[itemKey] || commanUrl ? 'rotate(45deg)' : 'rotate(-135deg)'
          }}
        />
      </a>
      <article className='footNavChild' style={{ display: self.state[itemKey] || commanUrl ? 'block' : 'none' }}>
        {item.childs.map((child, childKey) => {
          return (
            <Link href={child.navigateName} key={childKey}>
              <p className='footNavChildItem' style={{ color: url === child.navigateName ? '#fff' : item.color }}>
                {child.title}
              </p>
            </Link>
          )
        })}
      </article>
    </li>
  )
}
