import React, { Component } from 'react'
// import { Router } from '../../../routes'
// import Router from 'next/router'
import { theme, SelectFilterCard } from '../../../components'
import { queryCourseTypes, updateCourse, querySubjects } from '../../../ducks'
import { connect } from 'react-redux'
import { API_SERVER } from '../../../config'
import AlertContainer from 'react-alert'
import axios from 'axios'
import request from 'superagent-bluebird-promise'
import moment from 'moment'
const url = `http://${API_SERVER}/qiniu/fileUploadToken`

class CourseEditScreen extends Component {
  constructor (props) {
    super(props)
    let type, title, courseTypeId, content, hot, free, url, teacher, abstract, subjectId, articleUrl, image
    const { courses, courseId } = props
    if (courses[courseId]) {
      let course = courses[courseId]
      type = course.type
      title = course.title
      courseTypeId = course.type
      content = course.content
      hot = course.hot
      free = course.free
      url = course.url
      teacher = course.teacher
      abstract = course.abstract
      subjectId = course.subjectId
      articleUrl = course.articleUrl
      if (type === 'image') {
        image = url + '?imageView2/1/w/180/h/120'
      }
      if (type === 'video') {
        image = url + '?vframe/jpg/offset/0'
      }
      if (course.subject) {
        subjectId = course.subject.id
      }
    }
    this.state = {
      showSubject: true,
      type,
      title,
      courseTypeId,
      content,
      hot,
      free,
      url,
      teacher,
      abstract,
      subjectId,
      articleUrl,
      image
    }
    this.type = '02'
    this.alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 2500,
      transition: 'scale'
    }
  }

  componentWillMount () {
    const { client, queryCourseTypes, querySubjects } = this.props
    queryCourseTypes(client)
    querySubjects(client)
  }

  async onUpload (files) {
    this.setState({ loading: true })
    let file = files[0]
    let filetype = file.type.split('/')[1]
    let type = file.type.split('/')[0]
    let key = Date.now() + '.' + filetype
    const data = await axios.post(url, { key })
    console.log('data ======= ', file)
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
          // let { key } = res.body
          let url = 'http://owizeuocr.bkt.clouddn.com/' + key
          let image
          if (type === 'image') {
            image = url + '?imageView2/1/w/180/h/120'
          }
          if (type === 'video') {
            image = url + '?vframe/jpg/offset/0'
          }
          this.setState({ loading: false, type, image, url })
          this.msg.show('文件上传成功', {
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
        this.setState({ loading: false })
        this.msg.show('上传失败', {
          time: 2000,
          type: 'success'
        })
      })
  }

  getCouseTyps () {
    let array = []
    array.push({ title: '图文', value: 'image' })
    array.push({ title: '视频', value: 'video' })
    return array
  }

  getSubjects () {
    const { subjects } = this.props
    let array = []
    for (let key in subjects) {
      array.push({ title: subjects[key].name, value: key })
    }
    return array
  }

  renderVideoContainer () {
    const { type, image, url } = this.state
    if (!type || !image || !url) return null
    if (type === 'video') {
      return (
        <div>
          <img style={{ width: '150px', margin: 10 }} src={image} />
        </div>
      )
    } else {
      return (
        <div>
          <img style={{ width: '150px', margin: 10 }} src={image} />
        </div>
      )
    }
  }

  async submit () {
    const { type, title, courseTypeId, content, hot, free, url, teacher, abstract, subjectId, articleUrl } = this.state
    const { client, updateCourse, courseId } = this.props
    let date = moment().format('YYYY-MM-DD')
    if (!url) {
      return this.msg.show('请选择文件')
    }
    if (!title) {
      return this.msg.show('请填写标题')
    }
    if (!courseTypeId) {
      return this.msg.show('请选择类型')
    }
    if (courseTypeId === 'video' && !subjectId) {
      return this.msg.show('请选择科目')
    }
    if (courseTypeId === 'image' && !articleUrl) {
      return this.msg.show('请输入链接')
    }
    if (type !== courseTypeId) {
      return this.msg.show('文件类型与选择的课程类型不相符')
    }
    if (!content) {
      return this.msg.show('请填写内容')
    }
    let ops = { id: courseId, title, type, content, date, hot, free, url, teacher, abstract }
    if (type === 'video') {
      ops.subjectId = subjectId
    } else {
      ops.articleUrl = articleUrl
    }
    let error = await updateCourse(client, ops)
    if (error) {
      return this.msg.show('修改失败，请重试')
    } else {
      return this.msg.show('修改成功', {
        type: 'success'
      })
    }
  }

  render () {
    return (
      <div className={'orderRecordsPage'}>
        <AlertContainer ref={a => (this.msg = a)} {...this.alertOptions} />
        <div style={{ width: '60%', marginLeft: '5%' }}>
          <ul>
            <li>
              <span className='left'>标题</span>
              <input
                style={{ width: '50%', height: '30px' }}
                onChange={e => {
                  this.setState({ title: e.target.value })
                }}
                defaultValue={this.state.title}
                className='left'
                type='text'
              />
              <span className='clearfix' />
            </li>
            <li>
              <span className='left'>类型</span>
              <SelectFilterCard
                data={this.getCouseTyps()}
                config={{ selectTitle: '课程类型', valueKey: 'value', titleKey: 'title' }}
                changeStatus={status => {
                  if (status !== 'value') {
                    let showSubject = true
                    if (status === 'image') {
                      showSubject = false
                    }
                    this.setState({ courseTypeId: status, showSubject })
                  }
                }}
                status={this.state.type}
              />
              <span className='clearfix' />
            </li>
            {this.state.showSubject ? (
              <li>
                <span className='left'>科目</span>
                <SelectFilterCard
                  data={this.getSubjects()}
                  config={{ selectTitle: '选择科目', valueKey: 'value', titleKey: 'title' }}
                  changeStatus={subjectId => {
                    if (subjectId !== 'value') {
                      this.setState({ subjectId })
                    }
                  }}
                  status={this.state.subjectId}
                />
                <span className='clearfix' />
              </li>
            ) : null}

            {this.state.showSubject ? null : (
              <li>
                <span className='left'>链接</span>
                <input
                  style={{ width: '50%', height: '30px' }}
                  onChange={e => {
                    this.setState({ articleUrl: e.target.value })
                  }}
                  defaultValue={this.state.articleUrl}
                  className='left'
                  type='text'
                />
                <span className='clearfix' />
              </li>
            )}

            <li>
              <span className='left'>推荐</span>
              <SelectFilterCard
                data={[{ title: '是', value: 'true' }, { title: '否', value: 'false' }]}
                config={{ selectTitle: '标记推荐', valueKey: 'value', titleKey: 'title' }}
                changeStatus={status => {
                  if (status !== 'value') {
                    this.setState({ hot: status })
                  }
                }}
                status={this.state.hot}
              />
              <span className='clearfix' />
            </li>
            <li>
              <span className='left'>免费</span>
              <SelectFilterCard
                data={[{ title: '是', value: 'true' }, { title: '否', value: 'false' }]}
                config={{ selectTitle: '标记免费', valueKey: 'value', titleKey: 'title' }}
                changeStatus={status => {
                  if (status !== 'value') {
                    this.setState({ free: status })
                  }
                }}
                status={this.state.free}
              />
              <span className='clearfix' />
            </li>
            <li>
              <span className='left'>老师</span>
              <input
                style={{ width: '50%', height: '30px' }}
                onChange={e => {
                  this.setState({ teacher: e.target.value })
                }}
                defaultValue={this.state.teacher}
                className='left'
                type='text'
              />
              <span className='clearfix' />
            </li>
            <li>
              <span className='left'>摘要</span>
              <textarea
                className='left'
                onChange={e => {
                  this.setState({ abstract: e.target.value })
                }}
                defaultValue={this.state.abstract}
              />
              <span className='clearfix' />
            </li>
            <li>
              <span className='left'>内容</span>
              <textarea
                className='left'
                onChange={e => {
                  this.setState({ content: e.target.value })
                }}
                defaultValue={this.state.content}
              />
              <span className='clearfix' />
            </li>
            <li>
              <input
                disabled={this.state.loading}
                type='file'
                accept='image/gif,image/jpeg,image/jpg,image/png,image/svg,audio/mp4,video/mp4,audio/mpeg, video/mpeg,audio/mpeg,video/mpeg'
                onChange={e => {
                  this.onUpload(e.target.files)
                }}
              />
              {this.renderVideoContainer()}
              <span className='clearfix' />
            </li>
          </ul>
          <footer style={{ margin: '30px 0' }}>
            <button disabled={this.state.loading} onClick={() => this.submit()}>
              提交
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
    coursetypes: state.coursetypes.data,
    courses: state.courses.data,
    courseId: state.courses.selectId,
    subjects: state.subjects.data
  }
}

export default connect(mapStateToProps, { queryCourseTypes, updateCourse, querySubjects })(CourseEditScreen)
