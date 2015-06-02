var DataStore = require('nedb');
window.my_store = new DataStore({filename: 'lol'});
export default window.my_store;