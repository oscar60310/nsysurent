import axios from 'axios';

const endPoint = 'http://localhost:8081/api/lab';
/** 取得儀器列表 */
function getEquipmentList() {
  return {
    type: 'GET_EQLIST',
    payload: axios.get('./list.json'),
  };
}
/** 選擇儀器 */
function pickEquipment(name) {
  return {
    type: 'PICK_EQUIPMENT',
    payload: name,
  };
}
/** 選擇時間 */
function pickDate(date) {
  return {
    type: 'PICK_DATE',
    payload: date,
  };
}
/** 取得目前租借狀態 */
function getRentList(eq) {
  return {
    type: 'GET_RENT',
    payload: axios.get(`${endPoint}?ac=check&item=${eq}`),
  };
}


module.exports = {
  getEquipmentList,
  pickEquipment,
  pickDate,
  getRentList,
};
