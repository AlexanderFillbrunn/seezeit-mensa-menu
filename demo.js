const { loadData } = require('./mensa');

loadData('ravensburg').then(d => console.log(d));
