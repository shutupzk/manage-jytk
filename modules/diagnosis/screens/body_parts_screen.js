import React, {Component } from 'react'
import {connect} from 'react-redux'
import Router from 'next/router'

import { Loading, theme, ErrCard } from 'components'

class BodyPartsScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      parentPartId: '1'
    }
  }
  getParts (parts) {
    let json = {}
    for(let part of parts) {
      json[part.id] = part
    }
    return json
  }
  render () {
    if (this.props.loading) {
      return (
        <Loading />
      )
    }
    if (this.props.error) {
      return (
        <ErrCard />
      )
    }
    const bodyparts = [
      {
        id: '1',
        name: '头部',
        level: 0,
        childParts: [
          {
            id: '11',
            name: '鼻',
            levle: 1
          },
          {
            id: '12',
            name: '耳',
            levle: 1
          },
          {
            id: '13',
            name: '眼',
            levle: 1
          },
          {
            id: '14',
            name: '口',
            levle: 1
          },
          {
            id: '15',
            name: '面部',
            levle: 1
          },
          {
            id: '16',
            name: '脑',
            levle: 1
          }
        ]
      },
      {
        id: '2',
        name: '颈部',
        level: 0,
        childParts: [
          {
            id: '21',
            name: '颈椎',
            levle: 1
          },
          {
            id: '22',
            name: '咽喉',
            levle: 1
          },
          {
            id: '23',
            name: '淋巴',
            levle: 1
          }
        ]
      },
      {
        id: '3',
        name: '背部',
        level: 0,
        childParts: [
          {
            id: '31',
            name: '脊椎',
            levle: 1
          }
        ]
      },
      {
        id: '4',
        name: '上肢',
        level: 0,
        childParts: [
          {
            id: '41',
            name: '手臂',
            levle: 1
          },
          {
            id: '42',
            name: '胸部',
            levle: 1
          },
          {
            id: '43',
            name: '腹部',
            levle: 1
          }
        ]
      },
      {
        id: '5',
        name: '腰部',
        level: 0,
        childParts: [
          {
            id: '51',
            name: '腰椎',
            levle: 1
          },
          {
            id: '52',
            name: '腰肌',
            levle: 1
          }
        ]
      },
      {
        id: '6',
        name: '盆骨',
        level: 0,
        childParts: [
          {
            id: '61',
            name: '盆骨',
            levle: 1
          }
        ]
      },
      {
        id: '7',
        name: '下肢',
        level: 0,
        childParts: [
          {
            id: '71',
            name: '膝盖',
            levle: 1
          },
          {
            id: '72',
            name: '小腿',
            levle: 1
          },
          {
            id: '73',
            name: '脚腕',
            levle: 1
          },
          {
            id: '74',
            name: '脚趾',
            levle: 1
          }
        ]
      },
      {
        id: '8',
        name: '其他',
        level: 0,
        childParts: [
          {
            id: '81',
            name: '臀部',
            levle: 1
          },
          {
            id: '82',
            name: '瘦身',
            levle: 1
          }
        ]
      }
    ]
    const bodypartsO = this.getParts(bodyparts)
    return (
      <div>
        <div style={{display: '-webkit-box'}}>
          <ul id='tab_nav' className={'tab_nav'}>
            {
              bodyparts.length > 0 ? bodyparts.map((part) => {
                return (
                  <li className={this.state.parentPartId === part.id ? 'flex tb-flex lr-flex active' : 'flex lr-flex tb-flex'} key={part.id} onClick={() => {
                    this.setState({parentPartId: part.id})
                  }}>
                    {this.state.parentPartId === part.id ? <i className='sanjiao'></i> : ''}<span>{part.name}</span>
                  </li>
                )
              }) : ''
            }
          </ul>
          <div id='tab_content' className='tab_content'>
            <ul id={`tab_${this.state.parentPartId}`} style={{overflow: 'hidden'}}>
              {
                bodypartsO[this.state.parentPartId].childParts.map((childPart) => {
                  return (
                    <li key={childPart.id} onClick={() => { Router.push('/diagnosis/symptoms') }}>{childPart.name}</li>
                  )
                })
              }
            </ul>
          </div>
        </div>
        <style jsx global>{`
          .tab_nav {
            min-width: 1rem;
          }
          .tab_nav li {
            border-bottom: 1px solid #EEE;
            line-height: .4rem;
            width: 100%;
            text-align: center;
            color: ${theme.fontcolor};
            position: relative;
          }
          .tab_nav li i.sanjiao{
            transform: rotate(-90deg);
            border-top: .06rem solid #fff;
            position: absolute;
            left: 10px;
          }
          .tab_nav li.active {
            background-color: #FFF;
            color: ${theme.maincolor};
          }
          .tab_nav li.active i.sanjiao {
            border-top: .06rem solid ${theme.maincolor};
          }
          .tab_content{
            -webkit-box-flex: 1;
            background-color: #FFF;
          }
          .tab_content li {
            border-bottom: 1px solid #eee;
            line-height: .4rem;
            padding: 0px 15px;
            width: 100%;
            color: ${theme.fontcolor};
            position: relative;
          }
        `}</style>
      </div>
    )
  }
}

export default connect()(BodyPartsScreen)
