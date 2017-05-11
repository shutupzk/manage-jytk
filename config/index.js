import server from './server'
import { API_SERVER, initClient, initStore } from './store'
import withData from './withData'

// 医院名称
const HOSPITAL_NAME = '你猜我是哪家医院'

// 一维码格式
const BAR_FORMART = 'CODE128'

/**
 * 医院介绍功能模块
 */
const HOSPITAL_FUNCTION_LIST = [
  { title: '医院介绍', avatar: '../static/icons/hospital_hospital.png', subTitle: '医院基本情况简介', navigateName: 'hospital_introduction', params: {} },
  { title: '医院新闻', avatar: '../static/icons/hospital_news.png', subTitle: '医院相关最新资讯', navigateName: 'news_list', params: {} },
  { title: '科室介绍', avatar: '../static/icons/hospital_department.png', subTitle: '科室相关信息', navigateName: 'departments', params: { toScreenKey: 'department_detail' } },
  { title: '医生介绍', avatar: '../static/icons/hospital_doctor.png', subTitle: '医生简介及出诊信息', navigateName: 'doctors', params: { toScreenKey: 'doctor_introduce_list' } },
  { title: '医院导航', avatar: '../static/icons/hospital_out_navigation.png', subTitle: '医院地址/交通路线/地图导航/院内导航', navigateName: '', params: {} },
  { title: '停诊信息', avatar: '../static/icons/hospital_stopvisit.png', subTitle: '医院停诊通知', navigateName: 'hospital_stopvisit', params: {} },
  { title: '就诊指南', avatar: '../static/icons/hospital_visit_point.png', subTitle: '挂号/就诊说明', navigateName: 'guide_list', params: {} },
  { title: '楼层分布', avatar: '../static/icons/hospital_in_navigation.png', subTitle: '眼内楼层分布情况', navigateName: '', params: {} },
  // { title: '环境赏析', avatar: '../static/icons/arrow_up.png', subTitle: '了解医院环境', navigateName: '', params: {} },
  { title: '联系我们', avatar: '../static/icons/hospital_contact.png', subTitle: '医院网址/电话/邮箱', navigateName: 'contact', params: {} }
]

// 联系方式
const CONTACT = [
  { title: '网站链接', values: ['http://www.pkuih.edu.cn/'] },
  { title: '联系电话', values: ['总机电话: 010-3755555', '客服电话: 010-3755555', '医疗共同体: 010-3755555'] },
  { title: '电子邮箱', values: ['pr@pkuih.edu.cn'] }
]

export {
  server,
  API_SERVER,
  initClient,
  initStore,
  withData,
  HOSPITAL_NAME,
  BAR_FORMART,
  HOSPITAL_FUNCTION_LIST,
  CONTACT
}
