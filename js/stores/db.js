var DataStore = require('nedb');
window.my_store = new DataStore({filename: 'yash'});
export default window.my_store;