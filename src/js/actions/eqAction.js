import axios from 'axios';
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
  console.log(date)
  return {
    type: 'PICK_DATE',
    payload: date,
  };
}


module.exports = {
  getEquipmentList,
  pickEquipment,
  pickDate,
};
