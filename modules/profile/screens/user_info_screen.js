import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import localforage from 'localforage'
import { queryUser } from '../../../ducks'

// 用户详细信息
class UserInfoScreen extends Component {
  getInpatient (patientId) {
    this.props.queryInpatient(this.props.client, patientId)
  }

  getSelectPatient (patientId) {
    this.props.selectPatient(patientId)
  }

  componentWillMount () {
    this.getCurrentUser()
  }

  async getCurrentUser () {
    let userId = await localforage.getItem('userId')
    await this.props.queryUser(this.props.client, { userId: userId })
  }

  render () {
    if (this.props.error) {
      return <div className='container'>error...</div>
    }
    if (this.props.loading) {
      return <div className='container'>loading...</div>
    }
    return (
      <div className='container'>
        {detailList(this.props.user)}
      </div>
    )
  }
}

const detailList = (user) => {
  const array = [
    { key: '姓名', value: user.name },
    // { key: '证件类型', value: '身份证' },
    { key: '证件号', value: user.certificateNo },
    { key: '性别', value: user.sex === '0' ? '女' : '男' },
    { key: '出生日期', value: user.birthday },
    { key: '手机号', value: user.phone },
    { key: '就诊卡号', value: '' }
  ]
  const length = array.length
  return (
    <div style={styles.list}>
      {
        array.map((item, i) => (
           ListItem(item.key, item.value, i, length)
        ))
      }
    </div>
  )
}

const ListItem = (key, value, i, length) => {
  let style = styles.item
  if (i === length - 1) {
    style = styles.itemLast
    return (
      <div style={style} key={key}>
        <div style={styles.textLeft}>{key}</div>
        <div style={styles.textRight}>{value}<a><span>{value ? '更换' : '添加'}</span></a></div>
      </div>
    )
  }
  return (
    <div style={style} key={key}>
      <div style={styles.textLeft}>{key}</div>
      <div style={styles.textRight}>{value}</div>
    </div>
  )
}

const styles = {
  container: {
    flex: 1
  },
  list: {
    borderTopWidth: 0,
    marginTop: 0,
    marginBottom: 5,
    borderBottomWidth: 0
  },
  item: {
    height: 51,
    flexWrap: 'nowrap',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 1,
    marginLeft: 0
  },
  itemLast: {
    height: 51,
    flexWrap: 'nowrap',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
    marginLeft: 0
  },
  textLeft: {
    float: 'left',
    marginLeft: 10,
    fontSize: 16,
    color: '#505050'
  },
  textRight: {
    float: 'right',
    fontSize: 14,
    marginRight: 10,
    color: '#797979'
  }

}

UserInfoScreen.propTypes = {
  user: PropTypes.object.isRequired
}

function mapStateToProps (state) {
  return {
    user: state.user.data,
    error: state.user.error,
    loading: state.user.loading
  }
}

export default connect(
  mapStateToProps, { queryUser }
)(UserInfoScreen)
