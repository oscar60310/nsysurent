import React from 'react';
import MenuComponent from './menu/Menu';
import CalendarComponent from './calendar/Calendar';

export default class Layout extends React.Component {
  componentWillMount() {

  }
  render() {
    return (<div>
      <CalendarComponent />
      <MenuComponent />
    </div>);
  }
}
