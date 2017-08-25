
// 只需根据有无input 判断在modal中是否显示。 显示什么样的
const DEPARTMENTINFO = {
  department_list_title1: [
    {title: '编码', value: '', style: {width: '8%'}, apiKey: ''},
    {title: '科室编码', value: '', style: {width: '8%'}, apiKey: 'deptSn', inputType: 'text'},
    {title: '科室名称', value: '', style: {width: '14%'}, apiKey: 'deptName', inputType: 'text'},
    {title: '所属医院', value: '', style: {width: '22%'}, apiKey: 'hospitalId', inputType: 'select'},
    {title: '是否推荐', value: '', style: {width: '10%'}, apiKey: 'hot', inputType: 'checkbox'},
    {title: '是否可挂号', value: '', style: {width: '10%'}, apiKey: 'isAppointment', inputType: 'checkbox'},
    {title: '科室介绍', value: '', style: {width: '36%'}, apiKey: 'description', inputType: 'textarea'},
    {title: '设置一级科室', value: '', style: {width: '10%'}, apiKey: ''},
  ],
  department_list_title2: [
    {title: '编码', value: '', style: {width: '8%'}, apiKey: ''},
    // {title: '图标', value: '', style: {width: '10%'}, apiKey: 'icon'},
    {title: '科室编码', value: '', style: {width: '8%'}, apiKey: 'deptSn', inputType: 'text'},
    {title: '科室名称', value: '', style: {width: '14%'}, apiKey: 'deptName', inputType: 'text'},
    {title: '所属医院', value: '', style: {width: '22%'}, apiKey: 'hospitalId', inputType: 'select'},
    {title: '父级科室', value: '', style: {width: '14%'}, apiKey: 'parentId', inputType: 'select'},
    {title: '是否推荐', value: '', style: {width: '10%'}, apiKey: 'hot', inputType: 'checkbox'},
    {title: '是否可挂号', value: '', style: {width: '10%'}, apiKey: 'isAppointment', inputType: 'checkbox'},
    {title: '科室介绍', value: '', style: {width: '36%'}, apiKey: 'description', inputType: 'textarea'},
    {title: '设置', value: '', style: {width: '10%'}, apiKey: ''},
  ]
}

const BYSY_DEPARTMENTINFO = {
  department_list_title1: [
    {title: '编码', value: '', style: {width: '8%'}, apiKey: ''},
    {title: '科室编码', value: '', style: {width: '8%'}, apiKey: 'deptSn', inputType: 'text'},
    {title: '科室名称', value: '', style: {width: '14%'}, apiKey: 'deptName', inputType: 'text'},
    {title: '所属医院', value: '', style: {width: '22%'}, apiKey: 'hospitalId', inputType: 'select'},
    {title: '特色科室', value: '', style: {width: '10%'}, apiKey: 'hot', inputType: 'checkbox'},
    {title: '设置一级科室', value: '', style: {width: '10%'}, apiKey: ''},
  ],
}

export {
    DEPARTMENTINFO,
    BYSY_DEPARTMENTINFO
}