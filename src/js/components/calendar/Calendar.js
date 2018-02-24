import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import './calendar.scss';

@connect(store => ({
  pickDate: store.equipment.pickDate,
  rendList: store.equipment.rentList,
}))
export default class CalendarComponent extends React.Component {
  componentWillMount() {

  }

  render() {
    const showDays = [];
    const weekString = [];
    for (let i = 0; i < 7; i += 1) {
      const date = moment(this.props.pickDate).add(i, 'days');
      date.locale('zh-tw');
      weekString.push(date.format('YYYY/MM/DD'));
      showDays.push(<div key={i} className="cell" style={{ height: '60px' }}>

        <div className="dayshow" >{date.format('D')}</div>

        <div>{date.format('dddd')}</div>
      </div>);
    }
    const showTimes = [];
    for (let times = 0; times < 24; times += 1) {
      const temp = [<div key="h" className={`cell c-${times % 2} head`} >
        <span>{times} 時 - {times + 1} 時</span>
      </div>];
      for (let week = 0; week < 7; week += 1) {
        const rented = this.props.rendList.find(x => x.date === weekString[week] && x.time === `${times}`);

        temp.push(<div
          key={`${week}-${times}`}
          className={`cell c-${times % 2} ${(rented) ? 'rented' : ''}`}
        >
          {(rented) ? rented.usr : ''}
        </div>);
      }
      showTimes.push(<div key={`${times}`} style={{ display: 'flex' }}>
        {temp}
      </div>);
    }

    return (<div className="calendar">
      <div style={{ display: 'flex', boxShadow: '6px -2px 17px rgba(16, 16, 16, 0.38)', overflowY: 'scroll', background: '#0075d2', color: 'white' }}>
        <div key="h" className="cell" style={{ height: '60px' }} >日期</div>
        {showDays}
      </div>
      <div style={{ height: 'calc(100% - 60px)', overflowY: 'scroll' }}>
        {showTimes}
      </div>
    </div>);
  }
}
