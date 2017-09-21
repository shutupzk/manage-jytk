import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import { Loading, theme, SelectFilterCard } from '../../../components'
import { API_SERVER } from '../../../config'
import { queryExaminationDifficultys, queryAnswers, queryAnalysiss, updateExercise, createExerciseImages, updateAnswer } from '../../../ducks'
import { connect } from 'react-redux'
import axios from 'axios'
import request from 'superagent-bluebird-promise'
const url = `http://${API_SERVER}/qiniu/fileUploadToken`
import AlertContainer from 'react-alert'
class ExerciseEditScreen extends Component {
  constructor (props) {
    super(props)
    const { exercises, exerciseId } = this.props
    let exerciseImages = []
    let content
    if (exercises && exerciseId && exercises[exerciseId]) {
      const exercise = exercises[exerciseId]
      content = exercise.content
      let images = exercise.exerciseImages || []
      for (let obj of images) {
        exerciseImages.push({ image: obj.image })
      }
    }
    this.state = {
      content,
      answers: {},
      exerciseImages
    }
    this.alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 2000,
      transition: 'scale'
    }
  }

  componentWillMount () {
    const { client, queryAnswers, queryAnalysiss, exerciseId } = this.props
    if (exerciseId) {
      queryAnswers(client, { exerciseId })
      queryAnalysiss(client, { exerciseId })
    }
  }

  componentDidMount () {
    const { exercises, exerciseId } = this.props
    if (!exercises || !exerciseId || !exercises[exerciseId]) {
      Router.push('/exercise')
    }
  }

  async onUpload (files, type, answer) {
    this.setState({ loading: true })
    let file = files[0]
    let filetype = file.type.split('/')[1]
    let key = Date.now() + '.' + filetype
    try {
      const data = await axios.post(url, { key })
      request
        .post('http://upload.qiniu.com')
        .field('key', key)
        .field('token', data.data.token)
        .field('x:filename', file.name)
        .field('x:size', file.size)
        .attach('file', file, file.name)
        .set('Accept', 'application/json')
        .then(res => {
          if (res.statusCode === 200) {
            let image = 'http://owizeuocr.bkt.clouddn.com/' + key
            if (type === 'exercise') {
              let exerciseImages = this.state.exerciseImages || []
              exerciseImages.push({ image })
              this.setState({ loading: false, exerciseImages })
            } else {
              answer = this.state[answer.id] || answer || {}
              let answerImages = answer.answerImages || []
              answerImages.push({ image })
              this.setState({ loading: false, [answer.id]: Object.assign({}, answer, { answerImages }) })
            }
            this.msg.show('文件上传成功', {
              time: 1000,
              type: 'success'
            })
          } else {
            console.log(res)
            this.setState({ loading: false })
            this.msg.show('上传失败')
          }
        })
        .catch(e => {
          console.log(e)
          this.setState({ loading: false })
          this.msg.show('上传失败')
        })
    } catch (e) {
      console.log(e)
    }
  }

  async submit () {
    const { content, answers, exerciseImages } = this.state
    const { exerciseId, client, updateExercise, createExerciseImages, updateAnswer } = this.props
    try {
      if (content) {
        await updateExercise(client, { exerciseId, content })
        this.msg.show('修改成功', {
          time: 1000,
          type: 'success'
        })
      }
      if (exerciseImages) {
        let inputs = []
        for (let obj of exerciseImages) {
          inputs.push({ exerciseId, image: obj.image })
        }
        await createExerciseImages(client, { inputs })
      }
      if (answers) {
        for (let key in answers) {
          const { id, content, isAnswer } = answers[key]
          await updateAnswer(client, { exerciseId, answerId: id, content, isAnswer })
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  renderImageContainer (type, answer) {
    // let exercise = this.getData()
    let images = []
    if (type === 'exercise') {
      images = this.state.exerciseImages || []
    } else {
      images = this.state[answer.id] || answer.answerImages || []
    }
    if (!images || images.length === 0) return null
    return (
      <div style={{ overflow: 'auto' }}>
        {images.map((item, index) => (
          <div key={index} style={{ margin: '5px', width: '120px', float: 'left', position: 'relative', overflow: 'auto' }}>
            <img key={index} style={{ maxWidth: '100px', margin: '10px' }} src={item.image + '?imageView2/1/w/180/h/120'} />
            <button
              onClick={() => {
                let exerciseImages = []
                for (let obj of images) {
                  if (obj.image !== item.image) {
                    exerciseImages.push(obj)
                  }
                }
                this.setState({ exerciseImages })
              }}
              style={{ backgroundColor: 'red', borderWidth: 0, borderRadius: '10px', color: '#FFFFFF', position: 'absolute', top: '0', right: '0' }}
            >
              删除
            </button>
          </div>
        ))}
      </div>
    )
  }

  loadingView () {
    if (this.state.loading) {
      return <Loading showLoading />
    }
    return null
  }

  getAnswers () {
    let keys = ['A', 'B', 'C', 'D', 'E']
    const { answers, exerciseId } = this.props
    let array = []
    let answerKey = ''
    let answerKeys = []
    let answerId
    for (let key in answers) {
      let answer = answers[key]
      if (answer.exerciseId !== exerciseId) continue
      if (answer.isAnswer) {
        answerKey = keys[answer.num - 1]
        answerId = answer.id
      }
      array.push(Object.assign({}, answer, { key: keys[answer.num - 1] }))
      answerKeys.push({ title: keys[answer.num - 1], value: answer.id })
    }
    return { answers: array, answerKey, answerKeys, answerId }
  }

  getAnalysiss () {
    const { analysiss, exerciseId } = this.props
    let array = []
    for (let key in analysiss) {
      let analysis = analysiss[key]
      if (analysis.exerciseId !== exerciseId) continue
      array.push(Object.assign({}, analysis, { key }))
    }
    return array
  }

  getData () {
    const { exercises, exerciseId } = this.props
    return exercises[exerciseId]
  }

  render () {
    const exercise = this.getData()
    if (!exercise) {
      return <div />
    }
    const { answers, answerKeys, answerId } = this.getAnswers()
    return (
      <div>
        <AlertContainer ref={a => (this.msg = a)} {...this.alertOptions} />
        <div style={{ width: '80%', marginLeft: '5%' }}>
          <div style={{ marginBottom: '10px', width: '100%' }}>
            <ul>
              <li>
                <span className='left'>题干</span>
                <textarea
                  className='left'
                  onChange={e => {
                    this.setState({ content: e.target.value })
                  }}
                  defaultValue={exercise.content}
                />
                <span className='clearfix' />
              </li>
              <li>
                <span className='left'>图片</span>
                <input
                  style={{ margin: '5px' }}
                  disabled={this.state.loading}
                  type='file'
                  accept='image/gif,image/jpeg,image/jpg,image/png,image/svg'
                  onChange={e => {
                    this.onUpload(e.target.files, 'exercise')
                  }}
                />
                {this.renderImageContainer('exercise')}
              </li>
            </ul>
          </div>
          <div>
            {answers.map(item => {
              return (
                <ul key={item.id}>
                  <li>
                    <span className='left'> {`${item.key}  、`}</span>
                    <input
                      style={{ width: '50%', height: '30px' }}
                      onChange={e => {
                        let answer = this.state.answers[item.id] || item
                        answer = Object.assign({}, answer, { content: e.target.value })
                        let answers = Object.assign({}, this.state.answers, { [item.id]: answer })
                        this.setState({ answers })
                      }}
                      defaultValue={item.content}
                      className='left'
                      type='text'
                    />
                    <span className='clearfix' />
                  </li>
                  {/* <li>
                  <span className='left'>图片</span>
                  <input
                    disabled={this.state.loading}
                    type='file'
                    accept='image/gif,image/jpeg,image/jpg,image/png,image/svg'
                    onChange={e => {
                      this.onUpload(e.target.files, 'answer', item.id)
                    }}
                  />
                  {this.renderImageContainer('answer', item.id)}
                  <span className='clearfix' />
                </li> */}
                </ul>
              )
            })}
          </div>
          <ul>
            <li>
              <span className='left'>答案</span>
              <SelectFilterCard
                data={answerKeys}
                status={this.state.answerId || answerId}
                config={{ selectTitle: '选择答案', valueKey: 'value', titleKey: 'title' }}
                changeStatus={answerId => {
                  if (answerId !== 'value') {
                    let newAnswers = this.state.answers
                    for (let obj of answers) {
                      let answer = newAnswers[obj.id] || obj
                      let isAnswer = false
                      if (obj.id === answerId) {
                        isAnswer = true
                      }
                      newAnswers[obj.id] = Object.assign({}, answer, { isAnswer })
                    }
                    this.setState({ answers: newAnswers, answerId })
                  }
                }}
              />
              <span className='clearfix' />
            </li>
          </ul>

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
    analysiss: state.analysiss.data
  }
}

export default connect(mapStateToProps, { queryExaminationDifficultys, queryAnswers, queryAnalysiss, updateExercise, createExerciseImages, updateAnswer })(ExerciseEditScreen)
