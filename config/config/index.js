import server from 'config/server'
import { initClient, initStore } from 'config/store'
import withData from 'config/withData'

// 医院名称
const HOSPITAL_NAME = '文润检验题库'
const API_SERVER = '47.92.71.113:9000'
// const API_SERVER = 'localhost:9000'
const PORT = '9003' // 前端端口

// 医院信息
const HOSPITALINFO = {
  hospital_short_name: 'beiyisanyuan',
  hospital_loginlogo: '../static/beiyisanyuan/loginLogo.png',
  department_level: 1, // 设置一级可以，用于添加按钮的显示。  如果没有默认是2级科室
  footerbar_background_color: '#36486C',
  headerImg: { imgstyle: { height: '.4rem', margin: '.1rem .1rem 0 .2rem' } },
  contact: [{ title: '网站链接', values: ['http://www.puh3.net.cn/'] }, { title: '联系电话', values: ['010-8226669'] }, { title: '京ICP备05082115号', values: ['京ICP备05082115号'] }]
}

// 主功能
const MAINFUNCTION = [
  {
    title: '题库管理',
    short_name: 'exercise',
    navigateName: '/exercise',
    children: [
      { title: '基础题库列表', navigateName: '/exercise', color: '#5D75A6' },
      { title: '真题题库列表', navigateName: '/exercise/real', color: '#5D75A6' },
      { title: '精品题库列表', navigateName: '/exercise/hot', color: '#5D75A6' },
      { title: '基础题库导入', navigateName: '/exercise/import', color: '#5D75A6' },
      { title: '真题题库导入', navigateName: '/exercise/real/import', color: '#5D75A6' },
      { title: '精品题库导入', navigateName: '/exercise/hot/import', color: '#5D75A6' }
    ]
  },
  {
    title: '课程管理',
    short_name: 'course',
    navigateName: '/course',
    children: [
      { title: '视频课程', navigateName: '/course', color: '#5D75A6' },
      { title: '图文课程', navigateName: '/course/image', color: '#5D75A6' },
      { title: '上传课程', navigateName: '/course/import', color: '#5D75A6' }
    ]
  },
  {
    title: '解析管理',
    short_name: 'analysis',
    navigateName: '/analysis',
    children: [{ title: '解析列表', navigateName: '/analysis', color: '#5D75A6' }]
  },
  {
    title: '用户管理',
    short_name: 'user',
    navigateName: '/user',
    children: [{ title: '用户列表', navigateName: '/user', color: '#5D75A6' }]
  },
  {
    title: '支付管理',
    short_name: 'payment',
    navigateName: '/payment',
    children: [
      { title: '支付列表', navigateName: '/payment', color: '#5D75A6' },
      { title: '年收入列表', navigateName: '/payment/yearlist', color: '#5D75A6' },
      { title: '年收入折线图', navigateName: '/payment/yearecharts', color: '#5D75A6' },
      { title: '月收入列表', navigateName: '/payment/monthlist', color: '#5D75A6' },
      { title: '月收入折线图', navigateName: '/payment/monthecharts', color: '#5D75A6' }
    ]
  }
]

// home 页面
const HOME_PAGE = { url: '/exercise' }

// 主题颜色
const MAINCOLOR = '#2A4680'

export { server, API_SERVER, initClient, initStore, withData, HOSPITAL_NAME, HOME_PAGE, HOSPITALINFO, MAINCOLOR, PORT, MAINFUNCTION }
