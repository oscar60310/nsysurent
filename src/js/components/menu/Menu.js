import React from 'react';
import { connect } from 'react-redux';
import { Dropdown, Form } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import * as eqAction from '../../actions/eqAction';
import './menu.scss';


@connect(store => ({
  eqList: store.equipment.eqList,
  pickEq: store.equipment.pickEq,
  pickDate: store.equipment.pickDate,
}))
export default class MenuComponent extends React.Component {
  constructor(props) {
    super(props);
    this.pickEqHandler = this.pickEqHandler.bind(this);
  }
  componentWillMount() {
    this.props.dispatch(eqAction.getEquipmentList());
  }
  pickEqHandler = (event, data) => {
    this.props.dispatch(eqAction.pickEquipment(data.value));
    this.props.dispatch(eqAction.getRentList(data.value));
  }
  pickDateHandler = data => this.props.dispatch(eqAction.pickDate(data));
  render() {
    const eqItems = this.props.eqList.map(eq => ({ key: eq, value: eq, text: eq }));
    return (<div className="menuLayout">
      <div style={{ padding: '20px' }}>
        <div style={{ fontSize: '25px' }}>器材借用</div>
        <div style={{ color: '#5f5f5f', fontSize: '18px', marginTop: '10px' }}>液晶光電實驗室器材借用</div>

        <Form style={{ marginTop: '30px' }}>
          <Form.Field>
            <label>儀器</label>
            <Dropdown onChange={this.pickEqHandler} value={this.props.pickEq} placeholder="選擇儀器" fluid search selection options={eqItems} />
          </Form.Field>
          <Form.Field>
            <label>時間</label>
            <DatePicker style={{ width: '100%' }} selected={this.props.pickDate} onChange={this.pickDateHandler} />
          </Form.Field>
        </Form>
      </div>
    </div>);
  }
}
