import React from 'react';

import MenuComponent from './menu/Menu';
import CalendarComponent from './calendar/Calendar';


export default class Layout extends React.Component {
  componentWillMount() {

  }
  render() {
    return (<div style={{ height: '100%', width: '100%', fontFamily: '微軟正黑體' }}>
      <div style={{ height: '100%', width: '100%', display: 'flex' }}>
        <CalendarComponent />
        <MenuComponent />
      </div>
    </div>);
  }
}
