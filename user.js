var mongoose  = require.('mongoose');
var Schema  = mongoose.Schema;


module.exports = mongoose.('User',new Schema({
	name : String,
	password : String,
	admin : Boolean;

}));

