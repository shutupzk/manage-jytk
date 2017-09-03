import React, { Component } from 'react'
// import { Router } from '../../../routes'
// import Router from 'next/router'
import { Loading, theme } from '../../../components'
import { API_SERVER } from '../../../config'
import { queryExercises } from '../../../ducks'
import { connect } from 'react-redux'
import request from 'superagent-bluebird-promise'
import AlertContainer from 'react-alert'
class ExerciseImportScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
    this.alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
  }

  async clickModalOk () {
    const { selectedAppoint, modalType } = this.state
    let error
    if (modalType === 'cancel') {
      error = await this.props.cancelAppointment(this.props.client, { id: selectedAppoint.id })
    }
    this.setState({ showModal: false, selectedAppoint: {} })
    if (error) {
      this.props.showPrompt({ text: error })
      return
    }
    this.queryAppointments()
  }

  getListData () {
    let array = []
    let { exercises } = this.props
    let skip = (this.state.page - 1) * 10
    let count = 0
    for (let key in exercises) {
      let limit = count - skip
      if (limit > -1 && limit < 10) {
        array.push(Object.assign({}, exercises[key], { key, index: count }))
      }
      count++
    }
    return array
  }

  submit () {
    if (!this.files && this.files.length > 0) return
    if (!this.state.loading) {
      this.setState({ loading: true })
      let file = this.files[0]
      console.log(file)
      request
        .post(`http://${API_SERVER}/upload`)
        .attach('files', this.files[0])
        .set('Accept', 'application/json')
        .then(res => {
          if (res.statusCode === 200) {
            console.log(res.text)
            this.setState({ loading: false })
            console.log('bbbbb')
            this.msg.show(res.text, {
              time: 2000,
              type: 'success'
            })
          } else {
            console.log('上传失败', res)
            this.setState({ loading: false })
            this.msg.show('上传失败', {
              time: 2000,
              type: 'success'
            })
          }
        })
        .catch(e => {
          console.log(e)
          this.setState({ loading: false })
          this.msg.show('上传失败', {
            time: 2000,
            type: 'success'
          })
        })
    }
  }

  loadingView () {
    if (this.state.loading) {
      return <Loading showLoading />
    }
    return null
  }

  render () {
    return (
      <div style={{ width: '40%', margin: '0 auto' }}>
        <AlertContainer ref={a => (this.msg = a)} {...this.alertOptions} />
        <input
          disabled={this.state.loading}
          type='file'
          accept='application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          onChange={e => {
            this.files = e.target.files
          }}
        />
        <footer style={{ margin: '30px 0' }}>
          <button disabled={this.state.loading} onClick={() => this.submit(this.props)}>
            上传
          </button>
        </footer>
        {this.loadingView()}
        <style jsx>{`
          .loginPageText {
            background: #fff;
            margin: 0.2rem ${theme.tbmargin} 0;
          }
          .loginPageText section {
            height: 0.46rem;
            line-height: 0.46rem;
            color: ${theme.mainfontcolor};
          }
          .loginPageText input {
            background: transparent;
            border: none;
            line-height: 0.46rem;
            font-size: ${theme.fontsize};
            padding-left: 0.06rem;
            border-radius: 0;
            margin-left: 0.1rem;
            border: 1px solid ${theme.bordercolor};
          }
          .loginPageBtnItem {
            margin: 0.25rem 0 0.1rem;
          }
          button {
            border: 1px solid ${theme.bordercolor};
            background-image: linear-gradient(-180deg, #fefefe, #fbfbfb);
            margin: 0 0.15rem;
            line-height: 0.36rem;
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
    exercises: state.exercises.data
  }
}

export default connect(mapStateToProps, { queryExercises })(ExerciseImportScreen)
