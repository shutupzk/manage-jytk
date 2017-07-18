import React, { Component, PropTypes } from 'react'
import {theme} from 'components'
import InfiniteCalendar from 'react-infinite-calendar';
import canlendarStyles from './canlendar_style';
import moment from 'moment'

function CalendarCard (props) {

	const maxDate = props.maxDate || moment().add(-1, 'days').format('YYYY-MM-DD');
  return (
    <div>
			<InfiniteCalendar
				minDate={new Date(props.minDate)}
				maxDate={new Date(maxDate)}
				selected={new Date(props.date)}
				displayOptions={{
					showHeader: false
				}}
				theme={{
					weekdayColor: theme.maincolor,
					selectionColor: theme.maincolor,
				}}
				locale={{
					locale: require('date-fns/locale/zh_cn'),
					headerFormat: 'dddd, D MMM',
					weekdays: ["周日","周一","周二","周三","周四","周五","周六"],
					todayLabel: {
						long: '回到今天',
						short: '今天'
					}
				}}
				width="100%"
				onSelect={(date) => {
					props.changeCalendar(date)
				}} />
				{canlendarStyles()}
    </div>
  )
}

CalendarCard.propTypes = {
  showLoading: PropTypes.bool
}

export default CalendarCard
