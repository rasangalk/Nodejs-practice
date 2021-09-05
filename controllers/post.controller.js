const models = require("../models");

function save(req, res) {
	const post = {
		title: req.body.title,
		content: req.body.content,
		imageUrl: req.body.image_url,
		categoryId: req.body.category_id,
		userId: 1,
	};

	models.Post.create(post)
		.then(result => {
			res.status(200).json({
				message: "Post created successfully",
				post: result,
			});
		})
		.catch(error => {
			res.status(200).json({
				message: "Something went wrong",
				error: error,
			});
		});
}

module.exports = { save: save };
