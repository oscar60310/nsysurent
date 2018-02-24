import React from 'react';
import { connect } from 'react-redux';
import { Dropdown, Form, Input, Button } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import * as eqAction from '../../actions/eqAction';
import './menu.scss';


@connect(store => ({
  eqList: store.equipment.eqList,
  pickEq: store.equipment.pickEq,
  pickDate: store.equipment.pickDate,
  rented: store.equipment.rentList,
  render: store.equipment.render,
  loading: store.equipment.loading,
}))
export default class MenuComponent extends React.Component {
  constructor(props) {
    super(props);
    this.pickEqHandler = this.pickEqHandler.bind(this);
    this.inputRender = this.inputRender.bind(this);
    this.pickDateHandler = this.pickDateHandler.bind(this);
    this.sentReq = this.sentReq.bind(this);
  }
  componentWillMount() {
    this.props.dispatch(eqAction.getEquipmentList());
  }
  pickEqHandler = (event, data) => {
    this.props.dispatch(eqAction.pickEquipment(data.value));
    this.props.dispatch(eqAction.getRentList(data.value));
  }
  inputRender = (event, name) => {
    this.props.dispatch(eqAction.inputRender(name.value));
  }
  sentReq = () => {
    const { render, rented, pickEq } = this.props;
    this.props.dispatch(eqAction.send(pickEq, rented, render));
  }
  pickDateHandler = data => this.props.dispatch(eqAction.pickDate(data));
  render() {
    const eqItems = this.props.eqList.map(eq => ({ key: eq, value: eq, text: eq }));
    return (<div className="menuLayout">
      <div style={{ padding: '20px' }}>
        <div style={{ fontSize: '25px', marginTop: '50px' }}>器材借用</div>
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
          <Form.Field>
            <label>借用人</label>
            <Input onChange={this.inputRender} placeholder="借用人姓名" error={this.props.rented.filter(x => x.now).length > 0 && this.props.render.length === 0} />
          </Form.Field>
        </Form>
        <div style={{ marginTop: '20px' }}>
          新增&nbsp;<span style={{ color: 'red' }}>{this.props.rented.filter(x => x.now).length}</span>
          &nbsp;比資料，
          刪除&nbsp;<span style={{ color: 'red' }}>{this.props.rented.filter(x => x.del).length}</span>
          &nbsp;比資料
        </div>
        <Button
          disabled={
            (this.props.rented.filter(x => x.now).length > 0 && this.props.render.length === 0) ||
            this.props.rented.filter(x => x.now || x.del).length === 0 ||
            this.props.loading > 0}
          style={{ marginTop: '10px' }}
          onClick={this.sentReq}
        >送出</Button>

      </div>
    </div >);
  }
}
