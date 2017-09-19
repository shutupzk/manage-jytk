import React, { Component } from 'react'
// import { Router } from '../../../routes'
// import Router from 'next/router'
import { Loading, theme, SelectFilterCard } from '../../../components'
import { queryCourses } from '../../../ducks'
import { connect } from 'react-redux'
import { API_SERVER } from '../../../config'
import AlertContainer from 'react-alert'
import Qiniu from 'react-qiniu'

const url = `http://${API_SERVER}/qiniu/fileUploadToken`
import axios from 'axios'
import request from 'superagent-bluebird-promise'

class CourseImportScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      sortWay: null,
      token: ''
    }
    this.type = '02'
    this.alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
  }

  async onUpload (files) {
    this.setState({ loading: true })
    let file = files[0]
    let key = Date.now()
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
        console.log(res)
        if (res.statusCode === 200) {
          // let { key } = res.body
          this.image = 'http://owizeuocr.bkt.clouddn.com/' + key + '?imageView2/1/w/180/h/120'
          this.setState({ loading: false })
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
        this.setState({ loading: false })
        this.msg.show('上传失败', {
          time: 2000,
          type: 'success'
        })
      })
  }

  onDrop (files) {
    this.setState({
      files: files
    })
    console.log('Received files: ', files)
  }

  render () {
    if (this.props.loading) {
      return <Loading showLoading />
    }
    return (
      <div className={'orderRecordsPage'}>
        <AlertContainer ref={a => (this.msg = a)} {...this.alertOptions} />
        <div style={{ width: '60%', marginLeft: '5%' }}>
          <ul>
            <li>
              <span className='left'>标题</span>
              <input style={{ width: '50%', height: '30px' }} onChange={e => {}} defaultValue={''} className='left' type='text' />
              <span className='clearfix' />
            </li>
            <li>
              <span className='left'>类型</span>
              <SelectFilterCard data={[]} status={this.state.status} config={{ selectTitle: '课程类型', valueKey: 'value', titleKey: 'title' }} changeStatus={status => {}} />
              <span className='clearfix' />
            </li>
            <li>
              <span className='left'>热门</span>
              <SelectFilterCard
                data={[{ title: '是', value: true }, { title: '否', value: false }]}
                status={this.state.status}
                config={{ selectTitle: '标记热门', valueKey: 'value', titleKey: 'title' }}
                changeStatus={status => {}}
              />
              <span className='clearfix' />
            </li>
            <li>
              <span className='left'>老师</span>
              <input style={{ width: '50%', height: '30px' }} onChange={e => {}} defaultValue={''} className='left' type='text' />
              <span className='clearfix' />
            </li>
            <li>
              <span className='left'>摘要</span>
              <textarea className='left' onChange={e => {}} defaultValue={''} />
              <span className='clearfix' />
            </li>
            <li>
              <span className='left'>内容</span>
              <textarea className='left' onChange={e => {}} defaultValue={''} />
              <span className='clearfix' />
            </li>
            <li>
              <input
                disabled={this.state.loading}
                type='file'
                accept='video/*,image/*'
                onChange={e => {
                  this.files = e.target.files
                  this.onUpload(e.target.files)
                }}
              />
              {this.image ? <img style={{ width: '150px', margin: 10 }} src={this.image} /> : null}
              <span className='clearfix' />
            </li>
          </ul>
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
        `}</style>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    courses: state.courses.data
  }
}

export default connect(mapStateToProps, { queryCourses })(CourseImportScreen)
