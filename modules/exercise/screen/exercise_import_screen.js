import React, { Component } from 'react'
// import { Router } from '../../../routes'
// import Router from 'next/router'
import { Loading, theme } from '../../../components'
import { queryExercises } from '../../../ducks'
import { connect } from 'react-redux'
import request from 'superagent-bluebird-promise'
class ExerciseImportScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
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
        .post('http://47.92.71.113:9000/upload')
        .attach('files', this.files[0])
        .set('Accept', 'application/json')
        .then(res => {
          if (res.statusCode === 200) {
            console.log('上传成功')
            console.log(res.body)
            this.setState({ loading: false })
          } else {
            console.log('上传失败', res.error)
            this.setState({ loading: false })
          }
        })
        .catch(e => {
          console.log(e)
          console.log('上传失败')
          this.setState({ loading: false })
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
        <input
          disabled={this.state.loading}
          type='file'
          accept='application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          onChange={e => {
            console.log('e ====== ', e.target.value)
            console.log('e ====== ', e.target.files)
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
