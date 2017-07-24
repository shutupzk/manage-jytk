
const HOSPITALINFO = {
  hospitalInfo_list_title: [
    {title: '医院logo', value: '', style: {width: '25%'}, apiKey: 'logo', nolistShow: true, type: 'image'},
    {title: '医院名称', value: '', style: {width: '20%'}, apiKey: 'hospitalName', type: 'input'},
    {title: '医院编码', value: '', style: {width: '20%'}, apiKey: 'hospitalCode', type: 'input'},
    {title: '联系电话', value: '', style: {width: '20%'}, apiKey: 'phone', type: 'input'},
    {title: '所在地址', value: '', style: {width: '10%'}, apiKey: 'address', type: 'input'},
    {title: '医院介绍', value: '', style: {width: '10%'}, apiKey: 'description', nolistShow: true, type: 'textarea'},
    {title: '设置', value: '', style: {width: '15%'}, apiKey: ''},
  ],
  hospitalFun_list_title: [
    {title: '名称', value: '', style: {width: '33.3%'}, apiKey: 'funName'},
    {title: '必须功能', value: '', style: {width: '20%'}, apiKey: 'isFun'},
    {title: '编码', value: '', style: {width: '20%'}, apiKey: 'funCode'},
    // {title: '发布时间', value: '', style: {width: '10%'}, apiKey: 'time'},
    // {title: '资讯内容', value: '', style: {width: '10%'}, apiKey: 'content', nolistShow: true},
    // {title: '资讯图片', value: '', style: {width: '10%'}, apiKey: 'image', nolistShow: true},
    // {title: '设置', value: '', style: {width: '10%'}, apiKey: ''},
  ],
  hospitalNav_list_title: [
    {title: '所属医院', value: '', style: {width: '30%'}, apiKey: 'guideName'},
    {title: '楼宇名称', value: '', style: {width: '50%'}, apiKey: 'guideType'},
    // {title: '设置', value: '', style: {width: '10%'}, apiKey: ''},
  ],
  hospitalGuide_list_title: [
    {title: '指南编号', value: '', style: {width: '12%'}, apiKey: 'code', type: 'input'},
    {title: '指南名称', value: '', style: {width: '20%'}, apiKey: 'title', type: 'input'},
    {title: '指南类型', value: '', style: {width: '20%'}, apiKey: 'visitNoticeGroupId', type: 'select'},
    // {title: '所属医院', value: '', style: {width: '20%'}, apiKey: 'hospital'},
    {title: '指南内容', value: '', style: {width: '40%'}, apiKey: 'content', type: 'textarea'},
    {title: '资讯图片', value: '', style: {width: '10%'}, apiKey: 'image', type: 'image', nolistShow: true,},
    {title: '设置', value: '', style: {width: '10%'}, apiKey: ''},
  ]
}

export {
    HOSPITALINFO
}