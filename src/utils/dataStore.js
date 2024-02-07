/* 
This components acts as a in-memory data store. It is used to save data that needs to be shared between different test case*/
let store = {};

function saveData(key, data) {
  store[key] = data;
}

function getData(key) {
  return store[key];
}
module.exports = { saveData, getData };
