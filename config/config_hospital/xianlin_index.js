import server from 'config/server'
import { initClient, initStore } from 'config/store'
import withData from 'config/withData'

// 医院名称
const HOSPITAL_NAME = '泰康仙林管理平台'
const API_SERVER = '120.92.57.18:9199'
// const API_SERVER = '120.92.57.18:9198'
const PORT = '9003' // 前端端口

// 医院信息
const HOSPITALINFO = {
  hospital_short_name: 'xianlin',
  hospital_image: '../static/xianlin/loginlogo.png',
  department_level: 1, // 设置一级可以，用于添加按钮的显示。  如果没有默认是2级科室
  hospital_loginlogo: '../static/xianlin/loginlogo.png',
  footerbar_background_color: '#36486C',
  headerImg: {imgstyle: {height: '.4rem', margin: '.1rem .1rem 0 .2rem'}}, // 配置headerbar logo大小 可以不写
  contact: [
    { title: '网站链接', values: ['http://www.xlglyy.com/'] },
    { title: '联系电话', values: ['40060-95525']},
    { title: '苏ICP备16015282号', values: ['苏ICP备16015282号'] }
  ]
}

/**
 * 主功能
 * title: 展示在header上的文字  short_name：根据此字段，判断header哪个高亮   navigateName：决定了header上的文字，点击跳哪个链接
 * children 左侧菜单
 * childer[0].navigateNameDetail：用于此功能下所有页面（list、detail等page），处于高亮
 * children[0].childs: 用于左侧2级菜单   此时children[0].navigateName指的是，childs里navigateName的缩写。   用于高亮效果
 */
const MAINFUNCTION = [
  {
    title: '业务管理',
    short_name: 'order',
    navigateName: '/order/appoint_order',
    children: [
      {title: '挂号管理', navigateName: '/order/appoint_order', color: '#5D75A6', navigateNameDetail: 'appoint'}
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
      {title: '推荐科室管理', navigateName: '/department/department_recommand', color: '#5D75A6'},
    ]
  },
  {
    title: '资讯管理',
    short_name: 'news',
    navigateName: '/news',
    children: [
      {title: '类型管理', navigateName: '/news/news_groups', color: '#5D75A6',},
      {title: '资讯管理', navigateName: '/news', color: '#5D75A6',}
    ]
  },
  {
    title: '医院信息管理',
    short_name: 'hospital',
    navigateName: '/hospital',
    children: [
      {title: '医院介绍', navigateName: '/hospital', color: '#5D75A6'},
      {title: '院内导航', navigateName: '/hospital/hospital_navigation', navigateNameDetail: 'navigation', color: '#5D75A6'},
      {title: '就诊指南', navigateName: 'visitGuide', color: '#5D75A6', childs: [
        {title: '指南类型', navigateName: '/hospital/hospital_visitGuide_type',},
        {title: '指南管理', navigateName: '/hospital/hospital_visitGuide',}
      ]}
    ]
  }
]

// home页面  登录成功，默认进入的页面
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
    {title: '状态', value: '', style: {width: '12%'}, apiKey: ''},
    {title: '支付方式', value: '', style: {width: '6%'}, apiKey: ''},
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
    {title: '服务设置', value: 1},
  ],
  doctor_info_list_title: [
    {title: '编号', value: '', style: {width: '8%'}, apiKey: ''},
    {title: '医生工号', value: '', style: {width: '12%'}, apiKey: 'doctorSn'},
    {title: '姓名', value: '', style: {width: '12%'}, apiKey: 'doctorName'},
    {title: '所属机构', value: '', style: {width: '20%'}, apiKey: ''},
    {title: '专业', value: '', style: {width: '12%'}, apiKey: ''},
    {title: '设置', value: '', style: {width: '8%', textAlign: 'center'}, apiKey: ''},
  ],
  fee_list_title: [
    {title: '编号', value: '', style: {width: '8%'}, apiKey: ''},
    {title: '医生工号', value: '', style: {width: '12%'}, apiKey: ''},
    {title: '姓名', value: '', style: {width: '10%'}, apiKey: ''},
    {title: '所属机构', value: '', style: {width: '16%'}, apiKey: ''},
    {title: '专业', value: '', style: {width: '10%'}, apiKey: ''},
    {title: '亚专业', value: '', style: {width: '10%'}, apiKey: ''},
    {title: '图文问诊', value: '', style: {width: '8%', textAlign: 'center'}, apiKey: ''},
    {title: '快速问诊', value: '', style: {width: '8%', textAlign: 'center'}, apiKey: ''},
    {title: '视频问诊', value: '', style: {width: '8%', textAlign: 'center'}, apiKey: ''},
    {title: '设置', value: '', style: {width: '8%', textAlign: 'center'}, apiKey: ''},
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
