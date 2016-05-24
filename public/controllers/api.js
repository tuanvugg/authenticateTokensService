var image = require('../models/image.js');


exports.post = function(req, res) {
	console.log(req.body);
    newImage = new image(
    	{
    		link : req.body.link,
    		rank : req.body.rank,
    		category : req.body.category,
    		color : req.body.color,
    		tag : req.body.tag
    	}
    	);
    newImage.save();
}

exports.list = function(req, res) {
  image.find({},function(err, image) {
    res.send(image);
  });
}