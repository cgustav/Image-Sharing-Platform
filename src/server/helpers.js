const moment = require('moment');

const helpers = {};

helpers.DateConversion = timestamp =>{
    //cuanto tiempo ha pasado (en minutos) desde la fecha (timestamp) entregada
return moment(timestamp).startOf('minute').fromNow();

}

module.exports = helpers;
