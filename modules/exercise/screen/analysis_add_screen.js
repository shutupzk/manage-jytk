import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import { Loading, theme } from '../../../components'
import { createAnalysis } from '../../../ducks'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'
class AnalysisAddScreen extends Component {
  constructor (props) {
    super(props)
    let content
    this.state = {
      content
    }
    this.alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 2000,
      transition: 'scale'
    }
  }

  componentDidMount () {
    const { exercises, exerciseId } = this.props
    if (!exercises || !exerciseId || !exercises[exerciseId]) {
      Router.push('/exercise')
    }
  }

  async submit () {
    const { content } = this.state
    const { client, createAnalysis, exerciseId } = this.props
    try {
      if (content) {
        await createAnalysis(client, { exerciseId, content })
        this.msg.show('修改成功', {
          time: 1000,
          type: 'success'
        })
        Router.back()
      }
    } catch (e) {
      console.log(e)
    }
  }

  loadingView () {
    if (this.state.loading) {
      return <Loading showLoading />
    }
    return null
  }

  getData () {
    const { analysiss, analysisId } = this.props
    return analysiss[analysisId]
  }

  render () {
    return (
      <div>
        <AlertContainer ref={a => (this.msg = a)} {...this.alertOptions} />
        <div style={{ width: '80%', marginLeft: '5%' }}>
          <div style={{ marginBottom: '10px', width: '100%' }}>
            <ul>
              <li>
                <textarea
                  className='left'
                  onChange={e => {
                    this.setState({ content: e.target.value })
                  }}
                />
                <span className='clearfix' />
              </li>
            </ul>
          </div>

          <footer style={{ margin: '30px 0' }}>
            <button disabled={this.state.loading} onClick={() => this.submit()}>
              保存
            </button>
          </footer>
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
    exercises: state.exercises.data,
    exerciseId: state.exercises.selectId,
    answers: state.answers.data,
    analysiss: state.analysiss.data,
    analysisId: state.analysiss.selectId
  }
}

export default connect(mapStateToProps, { createAnalysis })(AnalysisAddScreen)
