import React, {Component} from 'react'
import {
  View,
  CalendarList,
  LocaleConfig,
  Modal,
  Icon,
  TouchableOpacity
} from '../../../components'
import moment from 'moment'
class CalendarsList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      modalVisible: false
    }
  }
  startModal () {
    this.setState({
      modalVisible: true
    })
  }
  closeModal () {
    this.setState({
      modalVisible: false
    })
  }
  render () {
    let { onPressDay, current, minDate, maxDate } = this.props
    LocaleConfig.locales['fr'] = {
      monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      dayNames: ['日', '一', '二', '三', '四', '五', '六'],
      dayNamesShort: ['日', '一', '二', '三', '四', '五', '六']
    }
    LocaleConfig.defaultLocale = 'fr'
    return (
      <Modal
        visible={this.state.modalVisible}
        animationType={'slide'}
        transparent={false}>
        <div style={styles.container}>
          <div style={styles.calendarListView}>
            <CalendarList
              ref='CalendarList'
              current={current}
              minDate={minDate}
              maxDate={maxDate}
              onDayPress={(day) => {
                onPressDay(`${day.year}-${day.month < 10 ? 0 + '' + day.month : day.month}-${day.day < 10 ? 0 + '' + day.day + '' : day.day}`)
                this.setState({
                  modalVisible: false
                })
              }}
              pastScrollRange={24}
              futureScrollRange={24} />
          </div>
          <TouchableOpacity
            style={styles.back}
            onClick={() => {
              this.setState({
                modalVisible: false
              })
            }}>
            <Icon size={20} color='#505050' name='arrow-left' type='simple-line-icon' />
          </TouchableOpacity>
        </div>
      </Modal>
    )
  }
}
CalendarsList.defaultProps = {
  onPressDay: () => {},
  current: moment().format('YYYY-MM-DD'),
  minDate: '1900-01-01',
  maxDate: '2099-12-31'
}
const styles = {
  container: {
    flex: 1,
    paddingVertical: 30
  },
  back: {
    top: 30,
    left: 15,
    position: 'absolute'
  },
  calendarListView: {
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    alignItems: 'center'
  }
}
export { CalendarsList }
