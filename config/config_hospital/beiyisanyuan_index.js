import server from 'config/server'
import { initClient, initStore } from 'config/store'
import withData from 'config/withData'

// 医院名称
const HOSPITAL_NAME = '北医三院管理平台'
// const API_SERVER = '120.92.57.18:9198'
const API_SERVER = 'api.bysy.uthealth.com.cn'
// const API_SERVER = '192.168.20.108:9000'
// const API_SERVER = 'localhost:9000'
const PORT = '9003' // 前端端口

// 医院信息
const HOSPITALINFO = {
  hospital_short_name: 'beiyisanyuan',
  hospital_loginlogo: '../static/beiyisanyuan/loginLogo.png',
  department_level: 1, // 设置一级可以，用于添加按钮的显示。  如果没有默认是2级科室
  footerbar_background_color: '#36486C',
  headerImg: {imgstyle: {height: '.4rem', margin: '.1rem .1rem 0 .2rem'}},
  contact: [
    { title: '网站链接', values: ['http://www.puh3.net.cn/'] },
    { title: '联系电话', values: ['010-8226669']},
    { title: '京ICP备05082115号', values: ['京ICP备05082115号'] }
  ]
}

// 主功能
const MAINFUNCTION = [
  {
    title: '订单管理',
    short_name: 'order',
    navigateName: '/order',
    children: [
      {title: '订单管理', navigateName: '/order', color: '#5D75A6', navigateNameDetail: 'order'}
    ]
  },
  {
    title: '内容管理',
    short_name: 'article',
    navigateName: '/article',
    children: [
      {title: '内容管理', navigateName: '/article', navigateNameDetail: 'article', color: '#5D75A6',}
    ]
  },
  {
    title: '医生管理',
    short_name: 'doctor',
    navigateName: '/doctor/manage_schedule',
    children: [
      {title: '业务开通', navigateName: '/doctor/manage_schedule', color: '#5D75A6',},
      {title: '排班结果', navigateName: '/doctor/manage_all_schedule', color: '#5D75A6'},
    ]
  },
  {
    title: '科室管理',
    short_name: 'department',
    navigateName: '/department/department_level1',
    children: [
      {title: '科室管理', navigateName: '/department/department_level1', color: '#5D75A6',},
      {title: '推荐科室管理', navigateName: '/department/department_recommand', color: '#5D75A6'},
      {title: '挂号科室管理', navigateName: '/department/department_isAppoint', color: '#5D75A6'},
    ]
  },
  {
    title: '用户管理',
    short_name: 'profile',
    navigateName: '/profile/update_password',
    children: [
      {title: '修改密码', navigateName: '/profile/update_password', color: '#5D75A6',}
    ]
  }
]

// home 页面
const HOME_PAGE = {url: '/order'}

// 主题颜色
const MAINCOLOR = '#2A4680'

// 订单管理信息
const ORDERINFO = {
  order_list_title: [
    {title: '产品服务', value: '', style: {width: '30%'}, apiKey: ''},
    {title: '单价(元)', value: '', style: {width: '10%'}, apiKey: ''},
    {title: '数量', value: '', style: {width: '10%'}, apiKey: ''},
    {title: '买家信息', value: '', style: {width: '14%'}, apiKey: ''},
    {title: '订单状态', value: '', style: {width: '16%', textAlign: 'center'}, apiKey: ''},
    {title: '支付信息(元)', value: '', style: {width: '20%', textAlign: 'center'}, apiKey: ''},
  ],
  order_type:  [
    {title: '待支付', value: '01'},
    {title: '已取消', value: '02'},
    {title: '已支付', value: '03'},
    {title: '执行中', value: '04'},
    {title: '已过期', value: '05'},
    {title: '退款申请', value: '06'},
    {title: '已完成', value: '07'},
    {title: '已退款', value: '08'},
    {title: '待执行订单已退款', value: '09'},
    {title: '后台退款', value: '10'}
    // #01：待支付，02：已取消，03：待执行，04：执行中，05：已过期未退款，
    // 06：待执行退款申请，07：已完成，08：过期已退款，09:待执行订单已退款，10：后台退款,
  ]
}

const DOCTORINFO = {
  modal_type_title: [
    {title: '基本信息', value: 0},
    {title: '服务设置', value: 1, section: [
      {title: '专家图文问诊', priceApiKey: 'imageAndTextPrice', openApiKey: 'imageAndTextOpen'},
      {title: '快速问诊', priceApiKey: 'quikePrice', openApiKey: 'quikeOpen'},
      {title: '视频问诊', priceApiKey: 'videoPrice', openApiKey: 'videoOpen'}
    ]}, // 根据modal_type_title 是否有第2个数组， 决定是否有图文问诊
  ],
  doctor_info_list_title: [
    {title: '编号', value: '', style: {width: '8%'}, apiKey: ''},
    {title: '医生工号', value: '', style: {width: '12%'}, apiKey: 'doctorSn'},
    {title: '姓名', value: '', style: {width: '10%'}, apiKey: 'doctorName'},
    {title: '所属机构', value: '', style: {width: '16%'}, apiKey: ''},
    {title: '专业', value: '', style: {width: '10%'}, apiKey: ''},
    {title: '互联网诊疗', value: '', style: {width: '16%', textAlign: 'center'}, apiKey: 'showInternet'},
    {title: '服务开通状态', value: '', style: {width: '16%', textAlign: 'center'}, apiKey: ''},
    {title: '设置', value: '', style: {width: '8%', textAlign: 'center'}, apiKey: ''},
  ]
}

export {
  server,
  API_SERVER,
  initClient,
  initStore,
  withData,
  HOSPITAL_NAME,
  HOME_PAGE,
  HOSPITALINFO,
  MAINCOLOR,
  PORT,
  MAINFUNCTION,
  ORDERINFO,
  DOCTORINFO
}
