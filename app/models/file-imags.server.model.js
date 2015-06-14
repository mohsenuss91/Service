'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * FileImags Schema
 */
var FileImagsSchema = new Schema({}, {strict: false});

mongoose.model('FileImags', FileImagsSchema, "fs.files");

