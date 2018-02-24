import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import * as eqAction from '../../actions/eqAction';
import './calendar.scss';

@connect(store => ({
  pickDate: store.equipment.pickDate,
  rendList: store.equipment.rentList,
  pickEq: store.equipment.pickEq,
}))
export default class CalendarComponent extends React.Component {
  constructor() {
    super();
    this.rent = this.rent.bind(this);
  }
  componentWillMount() {

  }
  rent = (date, time) => {
    if (this.props.pickEq) {
      this.props.dispatch(eqAction.rentEquipment(date, time));
    }
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
        let bg = {};
        if (rented) {
          bg = {
            background: '#ff7d73',
            color: 'white',
          };
          if (rented.now) {
            bg.background = 'rgb(0, 150, 136)';
          }
          if (rented.del) {
            bg.background = 'rgb(255, 207, 203)';
          }
        }
        temp.push(<div
          key={`${week}-${times}`}
          className={`cell c-${times % 2} ${(rented) ? 'rented' : ''}`}
          style={bg}
          onClick={() => this.rent(weekString[week], `${times}`)}
          onKeyDown={() => { }}
          role="button"
          tabIndex={0}
        >
          <span style={{ fontSize: '16px' }}>{(rented) ? rented.usr : ''}</span>
          <span style={{
            position: 'absolute',
            top: '0',
            right: '5px',
            fontSize: '10px',
          }}
          >{(rented) ? `${times} - ${times + 1}` : ''}</span>
        </div>);
      }
      showTimes.push(<div key={`${times}`} style={{ display: 'flex' }}>
        {temp}
      </div>);
    }

    return (<div className="calendar">
      <div style={{
        display: 'flex',
        boxShadow: '6px -2px 17px rgba(16, 16, 16, 0.38)',
        overflowY: 'scroll',
        background: '#0075d2',
        color: 'white',
      }}
      >
        <div key="h" className="cell" style={{ height: '60px' }} >日期</div>
        {showDays}
      </div>
      <div style={{ height: 'calc(100% - 60px)', overflowY: 'scroll' }}>
        {showTimes}
      </div>
    </div>);
  }
}
