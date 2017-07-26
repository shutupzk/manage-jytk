// addRequireKey 创建的时候，判断是否是必填
// nolistShow 列表页面不显示，但详情页面显示
// inputType 表单类型
// showDelete 是否可删除
// showModify 是否可编辑
const NEWSINFO = {
  news_groups_list_title: [
    {title: '资讯类型', value: '', style: {width: '14%'}, apiKey: 'type', addRequireKey: true, inputType: 'text'},
    {title: '所属医院', value: '', style: {width: '20%'}, apiKey: 'hospitalId', addRequireKey: true, inputType: 'select'},
    {title: '设置', value: '', style: {width: '20%'}, apiKey: '', showDelete: true, showModify: true},
  ],
  news_list_title: [
    {title: '资讯标题', value: '', style: {width: '20%'}, apiKey: 'title', addRequireKey: true, inputType: 'text'},
    {title: '资讯类型', value: '', style: {width: '14%'}, apiKey: 'newsGroupId', addRequireKey: true, inputType: 'select'},
    {title: '资讯摘要', value: '', style: {width: '20%'}, apiKey: 'summary', addRequireKey: true, inputType: 'text'},
    // {title: '发布时间', value: '', style: {width: '14%'}, apiKey: 'time', nolistShow: true, inputType: 'text'},
    {title: '资讯内容', value: '', style: {width: '30%'}, apiKey: 'content', inputType: 'textarea'},
    {title: '资讯图片', value: '', style: {width: '10%'}, apiKey: 'image', inputType: 'image'},
    {title: '设置', value: '', style: {width: '20%'}, apiKey: '', showDelete: true, showModify: true},
  ]
}

export {
    NEWSINFO
}