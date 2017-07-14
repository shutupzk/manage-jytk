import server from './server'
import { initClient, initStore } from './store'
import withData from './withData'

// 医院名称
const HOSPITAL_NAME = '广东省人民医院'
const API_SERVER = '120.92.57.18:9200' // 广东省医


// 一维码格式
const BAR_FORMART = 'CODE128'

const HOME_PAGE = { // 广东省医
  banner: ['/static/icons/banner3'],
  grid_module: [
    {title: '预约挂号', avatar: '../static/guangdong/homeAppoint.png', subTitle: '', navigateName: '/appointment/department_list'},
    {title: '门诊缴费', avatar: '../static/guangdong/homeoutpatient.png', subTitle: '', navigateName: '/outpatient/order_type'},
    {title: '查询报告', avatar: '../static/guangdong/homeReport.png', subTitle: '', navigateName: '/report'},
    {title: '疾病自查', avatar: '../static/guangdong/homeSelf.png', subTitle: '', navigateName: '/diagnosis'},
    {title: '住院跟踪', avatar: '../static/guangdong/homeInhos.png', subTitle: '', navigateName: '/inpatient'}
  ],
  hospital: {
    title: '广东省人民医院', avatar: '/static/icons/homepage_hospitalname.png', subTitle: ['医生介绍/就诊指南/停诊信息'], navigateName: ''
  },
  other_modules: ['最新消息'],
  bottomLabel: [
    {i: 1, title: '首页', avatar: '/static/luzhong/navHomeIcon', url: '/', imgStyle: {width: 24, paddingTop: 4}},
    {i: 2, title: '挂号订单', avatar: '/static/luzhong/navAppointIcon', url: '/appointment/appointment_list', imgStyle: {width: 18, paddingTop: 2}},
    {i: 3, title: '我的', avatar: '/static/luzhong/navProfileIcon', url: '/profile', imgStyle: {width: 20, paddingTop: 4}}
  ]
}

const HOSPITALINFO = {
  hospital_image: '/static/icons/hospital_bg_image.png',
  hospital_loginlogo: '/static/icons/loginlogo.png'
}

const REPORT = { // 广东省医
  needPassword: true,
  reportType: [{text: '检验报告', value: 'lab'}]
}
/**
 * 个人中心功能模块
 */
const PROFILE_FUNCTION_LIST = {
	middleView: [
		{ title: '就诊人管理', icon: 'familyIcon', type: 'simple-line-icon', navigateUrl: 'profile/patient_list' },
		{ title: '我的医生', icon: 'doctors', type: 'simple-line-icon', navigateUrl: 'profile/my_doctors' },
		{ title: '缴费记录', icon: 'depositRecords', type: 'simple-line-icon', navigateUrl: 'profile/deposit_record' },
		// { title: '我的随访', icon: 'pencil-square-o', type: 'font-awesome', navigateUrl: 'ehr' },
		{ title: '满意度评价', icon: 'evaluationIcon', type: 'simple-line-icon', navigateUrl: 'profile/evaluation' }
	],
	bottomView: [
		{ title: '医保卡信息', icon: 'cartecardicon', type: 'simple-line-icon', navigateUrl: 'profile/carte_vital' },
		{ title: '修改密码', icon: 'setpassword', type: 'simple-line-icon', navigateUrl: 'profile/setPassword' },
		{ title: '隐私条款', icon: 'prvite', type: 'simple-line-icon', navigateUrl: 'profile/privacy_terms' },
		{ title: '常见问题', icon: 'question', type: 'simple-line-icon', navigateUrl: 'profile/questions' },
		// { title: '我的报告单', icon: 'doc', type: 'simple-line-icon', navigateUrl: 'favorite_list' },
		{ title: '退出登录', icon: 'logout', type: 'simple-line-icon', navigateUrl: 'logout' }
		// { title: '设置', icon: 'settings', type: 'simple-line-icon', navigateUrl: 'setting' }
	]
}
/**
 * 医院介绍功能模块
 */
const HOSPITAL_FUNCTION_LIST = [
  { title: '医院介绍', avatar: '../static/icons/hospital_hospital.png', subTitle: '医院基本情况简介', navigateName: 'hospital_introduction', width: '16px', params: {} },
  { title: '科室介绍', avatar: '../static/icons/hospital_department.png', subTitle: '科室相关信息', navigateName: 'departments', width: '18px', params: { toScreenKey: 'department_detail' } },
  { title: '医生介绍', avatar: '../static/icons/hospital_doctor.png', subTitle: '医生简介及出诊信息', navigateName: 'departments', width: '22px', params: { toScreenKey: 'doctor_introduce_list' } },
  // { title: '医院新闻', avatar: '../static/icons/hospital_news.png', subTitle: '医院相关最新资讯', navigateName: 'news_list', params: {} },
  { title: '停诊信息', avatar: '../static/icons/hospital_stopvisit.png', subTitle: '医院停诊通知', navigateName: 'clinic_stop', width: '18px', params: {} },
  { title: '健康资讯', avatar: '../static/icons/hospital_news.png', subTitle: '健康新闻快速知', navigateName: 'news_list', width: '24px', params: {} },
  { title: '就诊指南', avatar: '../static/icons/hospital_visit_point.png', subTitle: '挂号/就诊说明', navigateName: 'guide_list', width: '18px', params: {} },
  { title: '楼层分布', avatar: '../static/icons/hospital_in_navigation.png', subTitle: '院内楼层分布情况', navigateName: 'buildings', width: '18px', params: {} },
  { title: '来院导航', avatar: '../static/icons/hospital_out_navigation.png', subTitle: '周边交通及地图导航', navigateName: 'navigation', width: '18px', params: {} },
  { title: '环境赏析', avatar: '../static/icons/hospital_contact.png', subTitle: '环境赏析', navigateName: 'environment', width: '22px', params: {} },
  // { title: '联系我们', avatar: '../static/icons/hospital_contact.png', subTitle: '医院网址/电话/邮箱', navigateName: 'contact', params: {} }
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
  CONTACT,
  HOME_PAGE,
  REPORT,
  HOSPITALINFO,
  PROFILE_FUNCTION_LIST
}
