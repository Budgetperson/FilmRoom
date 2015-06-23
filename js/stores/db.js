var DataStore = require('nedb');
window.my_store = new DataStore({filename: 'lol1'});
export default window.my_store;