import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import './menu.scss';

export default class MenuComponent extends React.Component {
  componentWillMount() {

  }
  render() {
    return (<div className="menu">
      <div style={{ padding: '20px' }}>
        <div>器材借用</div>
        <FlatButton
          label="Label before"
          labelPosition="before"
        />
      </div>
    </div>);
  }
}
