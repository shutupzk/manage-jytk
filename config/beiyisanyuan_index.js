import server from './server'
import { initClient, initStore } from './store'
import withData from './withData'

// 医院名称
const HOSPITAL_NAME = '北医三院管理平台'
const API_SERVER = '120.92.57.18:9198' // 山东鲁中
// const API_SERVER = '172.18.96.198:9002'
// const API_SERVER = '127.0.0.1:9002' // 山东鲁中
const PORT = '9003' // 前端端口

// 医院信息
const HOSPITALINFO = {
  hospital_short_name: 'beiyisanyuan',
  hospital_image: '../static/luzhong/loginlogo.png',
  hospital_loginlogo: '../static/beiyisanyuan/loginLogo.png',
  footerbar_background_color: '#36486C',
  contact: [
    { title: '网站链接', values: ['http://www.pkuih.edu.cn/'] },
    { title: '联系电话', values: ['010-00000000']},
    { title: '京ICP备14005009号', values: ['京ICP备14005009号'] }
  ]
}

// 主功能
const MAINFUNCTION = [
  {
    title: '订单管理',
    short_name: 'order',
    navigateName: '/order',
    children: [
      {title: '订单管理', navigateName: '/order', color: '#5D75A6',},
      {title: '交易管理', navigateName: '', color: '#5D75A6'},
      {title: '服务记录', navigateName: '', color: '#5D75A6'},
    ]
  },
  {
    title: '医生管理',
    short_name: 'doctor',
    navigateName: '/doctor/manage_schedule',
    children: [
      {title: '排班管理', navigateName: '/doctor/manage_schedule', color: '#5D75A6',},
      {title: '费用管理', navigateName: '/doctor/manage_fee', color: '#5D75A6'},
      {title: '全部排版', navigateName: '/doctor/manage_all_schedule', color: '#5D75A6'},
    ]
  },
  {
    title: '科室管理',
    short_name: 'department',
    navigateName: '/department/department_level1',
    children: [
      {title: '一级科室管理', navigateName: '/department/department_level1', color: '#5D75A6',},
      {title: '二级科室管理', navigateName: '/department/department_level2', color: '#5D75A6'},
      {title: '推荐科室管理', navigateName: '/department/department_recommand', color: '#5D75A6'},
      {title: '挂号科室管理', navigateName: '/department/department_isAppoint', color: '#5D75A6'},
    ]
  },
  {
    title: '健康资讯管理',
    short_name: 'news',
    navigateName: '/news',
    children: [
      {title: '资讯管理', navigateName: '/news', color: '#5D75A6',},
    ]
  },
  {
    title: '医院信息管理',
    short_name: 'hospital',
    navigateName: '/hospital',
    children: [
      {title: '医院介绍', navigateName: '/hospital', color: '#5D75A6'},
      {title: '功能清单', navigateName: '/hospital/hospital_funlist', color: '#5D75A6'},
      {title: '院内导航', navigateName: '/hospital/hospital_navigation', navigateNameDetail: '/hospital/hospital_navigation_detail', color: '#5D75A6'},
      {title: '就诊指南', navigateName: '/hospital/hospital_visitGuide', color: '#5D75A6'}
    ]
  }
]

// home 页面
const HOME_PAGE = {url: '/order'}

// 主题颜色
const MAINCOLOR = '#2A4680'

// order type<option value="7">全部订单类型</option>
            // <option value="1">待支付</option>
            // <option value="2">待退款</option>
            // <option value="3">待执行</option>
            // <option value="4">执行中</option>
            // <option value="5">已完成</option>
            // <option value="6">已关闭</option>
            // 01：待支付，02：已取消，03：待执行，04：执行中，{05：已过期，06：退款申请}待退款，07：已完成，08：已退款
const ORDERTYPE = [
   {title: '待支付', value: '01'},
   {title: '已取消', value: '02'},
   {title: '待执行', value: '03'},
   {title: '执行中', value: '04'},
   {title: '已过期', value: '05'},
   {title: '退款申请', value: '06'},
   {title: '已完成', value: '07'},
   {title: '已退款', value: '08'}
]

const ORDERINFO = {
  order_list_title: [
    {title: '产品服务', value: '', style: {width: '30%'}, apiKey: ''},
    {title: '单价(元)', value: '', style: {width: '10%'}, apiKey: ''},
    {title: '数量', value: '', style: {width: '10%'}, apiKey: ''},
    {title: '买家信息', value: '', style: {width: '14%'}, apiKey: ''},
    {title: '订单状态', value: '', style: {width: '16%', textAlign: 'center'}, apiKey: ''},
    {title: '支付信息(元)', value: '', style: {width: '20%', textAlign: 'center'}, apiKey: ''},
  ]
}

const DOCTORINFO = {
  modal_type_title: [
    {title: '基本信息', value: 0},
    {title: '服务设置', value: 1},
  ],
  schedule_list_title: [
    {title: '编号', value: '', style: {width: '8%'}, apiKey: ''},
    {title: '医生工号', value: '', style: {width: '12%'}, apiKey: ''},
    {title: '姓名', value: '', style: {width: '12%'}, apiKey: ''},
    {title: '所属机构', value: '', style: {width: '20%'}, apiKey: ''},
    {title: '专业', value: '', style: {width: '12%'}, apiKey: ''},
    {title: '亚专业', value: '', style: {width: '12%'}, apiKey: ''},
    {title: '服务开通状态', value: '', style: {width: '14%'}, apiKey: ''},
    {title: '设置', value: '', style: {width: '8%', textAlign: 'center'}, apiKey: ''},
  ],
  fee_list_title: [
    {title: '编号', value: '', style: {width: '8%'}, apiKey: ''},
    {title: '医生工号', value: '', style: {width: '12%'}, apiKey: ''},
    {title: '姓名', value: '', style: {width: '10%'}, apiKey: ''},
    {title: '所属机构', value: '', style: {width: '16%'}, apiKey: ''},
    {title: '专业', value: '', style: {width: '10%'}, apiKey: ''},
    {title: '亚专业', value: '', style: {width: '10%'}, apiKey: ''},
    {title: '用药咨询', value: '', style: {width: '8%', textAlign: 'center'}, apiKey: ''},
    {title: '图文问诊', value: '', style: {width: '8%', textAlign: 'center'}, apiKey: ''},
    {title: '视频问诊', value: '', style: {width: '8%', textAlign: 'center'}, apiKey: ''},
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
  ORDERTYPE,
  ORDERINFO,
  DOCTORINFO
}
