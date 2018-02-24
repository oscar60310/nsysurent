import axios from 'axios';

const endPoint = 'https://nsysu-dop.appspot.com/v2/api/lab';
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
/** 租借儀器 */
function rentEquipment(date, time) {
  return {
    type: 'RENT',
    payload: { date, time },
  };
}
/** 填寫借用人 */
function inputRender(name) {
  return {
    type: 'INPUT_RENDER',
    payload: name,
  };
}

/** 送出要求 */
const sendRequest = async (item, list, usr) => {
  const toDel = list.filter(x => x.del).map(x => ({ date: x.date, time: x.time }));
  await axios.request({
    method: 'POST',
    url: `${endPoint}?ac=del`,
    data: {
      item, req: toDel,
    },
  });
  const toAdd = list.filter(x => x.now).map(x => ({ date: x.date, time: x.time }));
  await axios.request({
    method: 'POST',
    url: `${endPoint}?ac=rent`,
    data: {
      item, req: toAdd, usr,
    },
  });

  await new Promise(res => setTimeout(res, 500));

  const re = await axios.get(`${endPoint}?ac=check&item=${item}`);
  return re;
};
/** 確定送出 */
function send(item, list, usr) {
  return {
    type: 'SEND_REQ',
    payload: sendRequest(item, list, usr),
  };
}
module.exports = {
  getEquipmentList,
  pickEquipment,
  pickDate,
  getRentList,
  rentEquipment,
  inputRender,
  send,
};
