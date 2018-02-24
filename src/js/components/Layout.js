import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import MenuComponent from './menu/Menu';
import CalendarComponent from './calendar/Calendar';


export default class Layout extends React.Component {
  componentWillMount() {

  }
  render() {
    return (<div style={{ height: '100%', width: '100%' }}>
      <MuiThemeProvider>
        <div style={{ height: '100%', width: '100%', display: 'flex' }}>
          <CalendarComponent />
          <MenuComponent />
        </div>
      </MuiThemeProvider>
    </div>);
  }
}
