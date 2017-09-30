import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import { theme, SelectFilterCard, FilterCard } from '../../../components'
// import { API_SERVER } from '../../../config'
import { queryMemberCharges, queryUserDetial, giveUserMember, giveUserScore } from '../../../ducks'
import { connect } from 'react-redux'
// import axios from 'axios'
// import request from 'superagent-bluebird-promise'
// const url = `http://${API_SERVER}/qiniu/fileUploadToken`
import AlertContainer from 'react-alert'
class UserEditScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 2000,
      transition: 'scale'
    }
  }

  componentWillMount () {
    const { client, queryMemberCharges, queryUserDetial, userId } = this.props
    queryMemberCharges(client)
    queryUserDetial(client, { id: userId })
  }

  componentDidMount () {
    const { users, userId } = this.props
    if (!users || !userId || !users[userId]) {
      Router.push('/user')
    }
  }

  getData () {
    const { users, userId } = this.props
    return users[userId]
  }

  getMemberCharges () {
    const { membercharges } = this.props
    let array = []
    for (let key in membercharges) {
      const { member, price, months } = membercharges[key]
      if (!member) continue
      array.push({ title: `${member.name}     ${price}元/${months}月`, value: key })
    }
    return array
  }

  async giveUserMember () {
    const { memberChargeId } = this.state
    if (!memberChargeId) {
      return this.msg.show('请选择会员类型')
    }
    const { client, giveUserMember, queryUserDetial, userId } = this.props
    let error = await giveUserMember(client, { userId, memberChargeId })
    if (error) {
      return this.msg.show('赠送会员失败')
    }
    queryUserDetial(client, { id: userId })
    this.setState({ memberChargeId: null })
    this.msg.show('赠送成功', {
      time: 1000,
      type: 'success'
    })
  }

  async giveUserScore () {
    const { score } = this.state
    if (!score) {
      return this.msg.show('请输入积分')
    }
    const { client, giveUserScore, queryUserDetial, userId } = this.props
    let error = await giveUserScore(client, { userId, score })
    if (error) {
      return this.msg.show('赠送积分失败')
    }
    queryUserDetial(client, { id: userId })
    this.setState({ score: null })
    this.msg.show('赠送成功', {
      time: 1000,
      type: 'success'
    })
  }

  render () {
    const user = this.getData()
    if (!user) {
      return <div />
    }
    return (
      <div>
        <AlertContainer ref={a => (this.msg = a)} {...this.alertOptions} />
        <div>
          <div style={{ marginBottom: '10px', width: '100%' }}>
            <p style={{ backgroundColor: '#f2f2f2', padding: 10, fontSize: 20 }}>会员</p>
            <ul style={{ marginLeft: '10px' }}>
              <li>
                <span className='left'>
                  当前等级：<span style={{ color: 'red' }}>{user.member ? user.member.name : '无'}</span>
                </span>
                <span className='clearfix' />
              </li>
              <li>
                <FilterCard>
                  <span className='left' style={{ marginTop: '7px', marginRight: '5px' }}>
                    赠送会员
                  </span>
                  <SelectFilterCard
                    data={this.getMemberCharges()}
                    status={this.state.memberChargeId}
                    config={{ selectTitle: '选择会员类型', valueKey: 'value', titleKey: 'title' }}
                    changeStatus={memberChargeId => {
                      this.setState({ memberChargeId })
                    }}
                  />
                  <button disabled={this.state.loading} onClick={() => this.giveUserMember()}>
                    赠送
                  </button>
                </FilterCard>
              </li>
            </ul>
            <p style={{ backgroundColor: '#f2f2f2', padding: 10, fontSize: 20, marginTop: '10px' }}>积分</p>
            <ul style={{ marginLeft: '10px' }}>
              <li>
                <span className='left'>
                  当前积分：<span style={{ color: 'red' }}>{user.score || '无'}</span>
                </span>
                <span className='clearfix' />
              </li>
              <li>
                <FilterCard>
                  <span className='left' style={{ marginTop: '7px', marginRight: '5px' }}>
                    赠送积分
                  </span>
                  <input
                    ref={a => (this.scoreInput = a)}
                    style={{ width: '145px', height: '32px', fontSize: 16 }}
                    onChange={e => {
                      this.setState({ score: e.target.value })
                    }}
                    defaultValue={0}
                    className='left'
                    type='number'
                    value={this.state.score}
                  />
                  <button disabled={this.state.loading} onClick={() => this.giveUserScore()}>
                    赠送
                  </button>
                </FilterCard>
              </li>
            </ul>
          </div>

          {/* <footer style={{ margin: '30px 0' }}>
            <button disabled={this.state.loading} onClick={() => this.submit()}>
              保存
            </button>
          </footer> */}
        </div>
        <style jsx>{`
          ul {
            padding: 0 0.1rem;
          }
          li {
            color: ${theme.mainfontcolor};
            font-size: 12px;
            line-height: 22px;
            padding-bottom: ${theme.tbmargin};
          }
          li input,
          li textarea {
            margin-left: ${theme.midmargin};
            background: #f2f2f2;
            line-height: 20px;
            border: 1px solid ${theme.nbordercolor};
            text-indent: 6px;
            border-radius: 2px;
          }
          li textarea {
            width: 80%;
            min-height: 0.5rem;
          }
          span {
            font-size: 15px;
          }
          button {
            border: 1px solid ${theme.bordercolor};
            background-image: linear-gradient(-180deg, #fefefe, #fbfbfb);
            margin: 0 0.15rem;
            line-height: 0.36rem;
            border-radius: 0.05rem;
            padding: 0 0.3rem;
            font-size: 0.16rem;
          }
        `}</style>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    users: state.users.data,
    membercharges: state.membercharges.data,
    userId: state.users.selectId
  }
}

export default connect(mapStateToProps, { queryMemberCharges, queryUserDetial, giveUserMember, giveUserScore })(UserEditScreen)
