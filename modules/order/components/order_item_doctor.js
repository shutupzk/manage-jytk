import React, { Component } from 'react'
import {theme} from 'components'
import {ORDERTYPE} from 'config'

export default class OrderItemDoctor extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  render () {
		const data = this.props.data || {}
		const hospitalName = data.doctor&& data.doctor.departmentHasDoctors && data.doctor.departmentHasDoctors[0] && data.doctor.departmentHasDoctors[0].department && data.doctor.departmentHasDoctors[0].department.hospital && data.doctor.departmentHasDoctors[0].department.hospital.hospitalName
		const type = [
			{title: '普通挂号', value: '010101'},
			{title: '专家挂号', value: '010201'},
			{title: '专家问诊', value: '020101'},
			{title: '快速问诊', value: '020102'},
			{title: '复诊', value: '020103'},
			{title: '视频', value: '020201'}
		]
		const curType = type.filter((item) => item.value === data.type) || []
    return (
			<li className={'left orderCon1'}>
				<img className="left" src={data.docPic} style={{display: data.docPic ? 'block' : 'none'}} />
				<dl className="left">
					<dt>{data.doctor && data.doctor.doctorName || '医生'}</dt>
					<dd>{hospitalName || '无'}</dd>
					<dd>{curType[0] && curType[0].title}</dd>
				</dl>
				<style jsx>{`
					.orderCon1{
						font-size: 12px;
						width: 30%
					}
					img{
						width: 46px;
						height: 46px;
						margin-top: 6px;
						margin-right: 6px;
					}
					dt{
						font-weight: bold;
						color: #505050;
						font-size: 14px;
						margin-bottom: 3px;
					}
				`}</style>
			</li>
    )
  }
}