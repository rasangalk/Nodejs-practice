const Validator = require("fastest-validator");
const models = require("../models");

// create a new post
function save(req, res) {
	const post = {
		title: req.body.title,
		content: req.body.content,
		imageUrl: req.body.image_url,
		categoryId: req.body.category_id,
		userId: 1,
	};

	// defining the schema constraints to be a valid post
	const schema = {
		title: { type: "string", optional: "false", max: 500 },
		content: { type: "string", optional: "false", max: 1000 },
		categoryId: { type: "number", optional: "false" },
	};

	// creating an instance from fastest-validator
	const v = new Validator();

	// checking the creating post attributes which the defined schema constraints
	const validationResponse = v.validate(post, schema);

	// validating and displaying errors
	if (validationResponse != true) {
		return res.status(400).json({
			message: "Validation failed",
			error: validationResponse,
		});
	}

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

// return a post with given postId
function show(req, res) {
	const id = req.params.id; // this is the way to save a URL parameter

	models.Post.findByPk(id)
		.then(result => {
			if (result) {
				res.status(200).json(result);
			} else {
				res.status(404).json({
					message: "post not found!",
				});
			}
		})
		.catch(error => {
			res.status(500).json({
				message: "Something went wrong",
			});
		});
}

// return all the posts
function index(req, res) {
	models.Post.findAll()
		.then(result => {
			res.status(200).json(result);
		})
		.catch(error => {
			res.status(500).json({
				message: "Something went wrong",
			});
		});
}

// update a post with given postId and given userId
function update(req, res) {
	const id = req.params.id;
	const userId = 1;

	const updatedPost = {
		title: req.body.title,
		content: req.body.content,
		imageUrl: req.body.image_url,
		categoryId: req.body.category_id,
	};

	// creating an instance from fastest-validator
	const v = new Validator();

	// defining the schema constraints to be a valid post
	const schema = {
		title: { type: "string", optional: "false", max: 500 },
		content: { type: "string", optional: "false", max: 1000 },
		categoryId: { type: "number", optional: "false" },
	};

	// checking the creating post attributes which the defined schema constraints
	const validationResponse = v.validate(updatedPost, schema);

	// validating and displaying errors
	if (validationResponse != true) {
		return res.status(400).json({
			message: "Validation failed",
			error: validationResponse,
		});
	}

	models.Post.update(updatedPost, { where: { id: id, userId: userId } })
		.then(result =>
			res.status(200).json({
				message: "post updated",
				post: updatedPost,
			}),
		)
		.catch(error => {
			res.status(500).json({
				message: "Something went wrong",
			});
		});
}

// delete a post with given userId and postId
function destroy(req, res) {
	const id = req.params.id;
	const userId = 1;

	models.Post.destroy({ where: { id: id, userId: userId } })
		.then(result =>
			res.status(200).json({
				message: "post destroyed",
			}),
		)
		.catch(error => {
			res.status(200).json({
				message: "Something went wrong",
				error: error,
			});
		});
}

module.exports = {
	save: save,
	show: show,
	index: index,
	update: update,
	destroy: destroy,
};
