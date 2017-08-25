const tableTh = [
	{title: '', width: '20px', height: '44px', value: 0},
	{title: '一', width: '44px', value: 1},
	{title: '二', width: '44px', value: 2},
	{title: '三', width: '44px', value: 3},
	{title: '四', width: '44px', value: 4},
	{title: '五', width: '44px', value: 5},
	{title: '六', width: '44px', value: 6},
	{title: '日', width: '44px', value: 7}
]
const apTh = [{title: '上', value: 'a'}, {title: '下', value: 'p'}, {title: '晚', value: 'n'}]

const serviceCon = [
	{title: '专家图文问诊', priceApiKey: 'imageAndTextPrice', openApiKey: 'imageAndTextOpen', servicetotalApiKey: 'serviceTotal'},
	{title: '快速问诊', priceApiKey: 'quikePrice', openApiKey: 'quikeOpen', servicetotalApiKey: 'serviceTotal'},
	// {title: '视频问诊', priceApiKey: 'videoPrice', openApiKey: 'videoOpen'}
]
const doctorInfo = [
	{title: '姓名', apiKey: 'doctorName', inputType: 'other'},
	{title: '头像', apiKey: 'avatar', inputType: 'image'},
	{title: '性别', apiKey: 'sex', inputType: 'other'},
	{title: '职称', apiKey: 'title', inputType: 'other'},
	{title: '专业', apiKey: 'department', inputType: 'other'},
	{title: '工号', apiKey: 'doctorSn', inputType: 'other'},
	{title: '工作年限', apiKey: 'workingYears', inputType: 'number'},
	{title: '联系方式', apiKey: 'phone', inputType: 'text'},
	{title: '专业特长', apiKey: 'major', inputType: 'textarea'},
	{title: '获奖情况', apiKey: 'prizes', inputType: 'textarea'},
	{title: '工作经历', apiKey: 'workExperience', inputType: 'textarea'},
	{title: '是否热门', apiKey: 'hot', inputType: 'checkbox'},
	{title: '是否推荐', apiKey: 'recommend', inputType: 'checkbox'},
	{title: '是否可挂号', apiKey: 'isAppointment', inputType: 'checkbox'},
	{title: '权重', apiKey: 'weight', inputType: 'number'},
	{title: '个人简介', apiKey: 'description', inputType: 'textarea'}
]

export {
    tableTh,
    apTh,
    serviceCon,
    doctorInfo
}