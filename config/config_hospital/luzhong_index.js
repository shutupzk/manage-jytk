import server from 'config/server'
import { initClient, initStore } from 'config/store'
import withData from 'config/withData'

// 医院名称
const HOSPITAL_NAME = '北大医疗鲁中管理平台'
const API_SERVER = '218.58.137.218:9002' // 山东鲁中
// const API_SERVER = '172.18.96.198:9002'
// const API_SERVER = '127.0.0.1:9002' // 山东鲁中
const PORT = '9003' // 前端端口

// 医院信息
const HOSPITALINFO = {
  hospital_short_name: 'luzhong',
  hospital_image: '../static/luzhong/loginlogo.png',
  department_level: 1, // 设置一级可以，用于添加按钮的显示。  如果没有默认是2级科室
  hospital_loginlogo: '../static/luzhong/loginLogo.png',
  footerbar_background_color: '#36486C',
  contact: [
    { title: '网站链接', values: ['http://www.bdyllzyy.com/'] },
    { title: '联系电话', values: ['0533-7698222']},
    { title: '版权所有 © 北大医疗鲁中医院', values: ['版权所有 © 北大医疗鲁中医院'] }
  ]
}

// 主功能
const MAINFUNCTION = [
  {
    title: '业务管理',
    short_name: 'order',
    navigateName: '/order/appoint_order',
    children: [
      {title: '挂号管理', navigateName: '/order/appoint_order', color: '#5D75A6', navigateNameDetail: 'appoint'},
    ]
  },
  {
    title: '医生管理',
    short_name: 'doctor',
    navigateName: '/doctor/manage_info',
    children: [
      {title: '资料管理', navigateName: '/doctor/manage_info', color: '#5D75A6',},
    ]
  },
  {
    title: '科室管理',
    short_name: 'department',
    navigateName: '/department/department_level1',
    children: [
      {title: '科室管理', navigateName: '/department/department_level1', color: '#5D75A6',},
      // {title: '二级科室管理', navigateName: '/department/department_level2', color: '#5D75A6'},
      {title: '推荐科室管理', navigateName: '/department/department_recommand', color: '#5D75A6'},
      {title: '挂号科室管理', navigateName: '/department/department_isAppoint', color: '#5D75A6'},
    ]
  },
  {
    title: '健康资讯管理',
    short_name: 'news',
    navigateName: '/news',
    children: [
      {title: '类型管理', navigateName: '/news/news_groups', color: '#5D75A6',},
      {title: '资讯管理', navigateName: '/news', color: '#5D75A6',},
    ]
  },
  {
    title: '医院信息管理',
    short_name: 'hospital',
    navigateName: '/hospital',
    children: [
      {title: '医院介绍', navigateName: '/hospital', color: '#5D75A6'},
      // {title: '功能清单', navigateName: '/hospital/hospital_funlist', color: '#5D75A6'},
      {title: '院内导航', navigateName: '/hospital/hospital_navigation', navigateNameDetail: 'navigation', color: '#5D75A6'},
      {title: '就诊指南', navigateName: 'visitGuide', color: '#5D75A6', childs: [
        {title: '指南类型', navigateName: '/hospital/hospital_visitGuide_type',},
        {title: '指南管理', navigateName: '/hospital/hospital_visitGuide',}
      ]}
    ]
  }
]

// home 页面
const HOME_PAGE = {url: '/hospital'}

// 主题颜色
const MAINCOLOR = '#2A4680'

// 订单管理信息
const ORDERINFO = {
  appoint_list_title: [
    {title: '患者名称', value: '', style: {width: '8%'}, apiKey: ''},
    {title: '医院名称', value: '', style: {width: '16%'}, apiKey: ''},
    {title: '医生名称', value: '', style: {width: '8%'}, apiKey: ''},
    {title: '科室名称', value: '', style: {width: '16%'}, apiKey: ''},
    // {title: '预约时间', value: '', style: {width: '16%'}, apiKey: ''},
    {title: '就诊时间', value: '', style: {width: '12%'}, apiKey: ''},
    {title: '状态', value: '', style: {width: '8%'}, apiKey: ''},
    {title: '支付方式', value: '', style: {width: '8%'}, apiKey: ''},
    {title: '支付状态', value: '', style: {width: '6%'}, apiKey: ''},
    {title: '设置', value: '', style: {width: '18%'}, apiKey: ''},
  ],
  appoint_visit_status: [
    {title: '退号待HIS确认', value: '-04'},
    {title: '取消待HIS确认', value: '-02'},
    {title: '挂号等待HIS确认', value: '-01'},
    {title: '挂号失败', value: '00'},
    {title: '待取号', value: '01'},
    {title: '已取消', value: '02'},
    {title: '已取号', value: '03'},
    {title: '已退号', value: '04'},
    {title: '已过期', value: '05'}
  ]
}

const DOCTORINFO = {
  modal_type_title: [
    {title: '基本信息', value: 0},
  ],
  doctor_info_list_title: [
    {title: '编号', value: '', style: {width: '8%'}, apiKey: ''},
    {title: '医生工号', value: '', style: {width: '12%'}, apiKey: 'doctorSn'},
    {title: '姓名', value: '', style: {width: '12%'}, apiKey: 'doctorName'},
    {title: '所属机构', value: '', style: {width: '20%'}, apiKey: ''},
    {title: '专业', value: '', style: {width: '12%'}, apiKey: ''},
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
