import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import swal from 'sweetalert2'

import { updatePatient } from '../../../ducks'

/**
 * 绑定医保卡
 */
class BindCardScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  // 提交
  async submit () {
    const patientId = this.props.patientId || this.url.query.patientId
    const carteVital = this.state.carteVital
    if (!carteVital) {
      return swal({text: '请输入医保卡'})
    }
    this.setState({animating: true})
    const error = await this.props.updatePatient(this.props.client, { patientId, carteVital })
    if (error) return swal('', error)
    this.props.url.back()
  }
  render () {
    if (this.props.error) {
      return (
        <div>error...</div>
      )
    }
    if (this.props.loading) {
      return (
        <div>loading...</div>
      )
    }
    return (<div className='container' style={styles.container}>
      <div style={styles.div}>
        <div style={styles.item} key={'carteVital'}>
          <span style={styles.textLeft}>医保卡</span>
          <input placeholder={'输入医保卡'} style={{float: 'right', width: '72%', marginRight: 15}} className='textInput'
            onChange={(e) => this.setState({ carteVital: e.target.value })} />
        </div>
      </div>
      <button title='确定' onClick={() => this.submit()} style={{display: 'block', width: '100%', borderRadius: '10px', height: 40}}>确定</button>
      {/* <Popup ref={popup => { this.popup = popup }} /> */}
    </div>)
  }
}

const styles = {
  container: {
    flex: 1
  },
  list: {
    borderTopWidth: 0,
    marginTop: 10,
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
    borderBottomColor: '#E6E6E6',
    borderBottomWidth: 1
  },
  textLeft: {
    flex: 1,
    fontSize: 16,
    color: '#505050',
    marginLeft: 15
  },
  TextInput: {
    flex: 3,
    borderBottomWidth: 0,
    marginRight: 15
  },
  buttonStyle: {
    marginTop: 35
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  }
}

function mapStateToProps (state) {
  return {
    token: state.user.data.token,
    userId: state.user.data.id,
    patientId: state.patients.selectId,
    loading: state.patients.loading,
    error: state.patients.error
  }
}

export default connect(mapStateToProps, { updatePatient })(BindCardScreen)
