let store = {};

function saveData(key, data) {
  store[key] = data;
}

function getData(key) {
  return store[key];
}
module.exports = { saveData, getData };
