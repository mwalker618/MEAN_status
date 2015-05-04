'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Cat Schema
 */
var CatSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Cat name',
		trim: true
	},
	adopted: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	breed: {
		type: String,
		default: '',

		trim: true
	},
	gender: {
		type: String,
		default: '',
	}
});

mongoose.model('Cat', CatSchema);