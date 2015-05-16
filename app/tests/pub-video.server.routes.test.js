'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PubVideo = mongoose.model('PubVideo'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, pubVideo;

/**
 * Pub video routes tests
 */
describe('Pub video CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Pub video
		user.save(function() {
			pubVideo = {
				name: 'Pub video Name'
			};

			done();
		});
	});

	it('should be able to save Pub video instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pub video
				agent.post('/pub-videos')
					.send(pubVideo)
					.expect(200)
					.end(function(pubVideoSaveErr, pubVideoSaveRes) {
						// Handle Pub video save error
						if (pubVideoSaveErr) done(pubVideoSaveErr);

						// Get a list of Pub videos
						agent.get('/pub-videos')
							.end(function(pubVideosGetErr, pubVideosGetRes) {
								// Handle Pub video save error
								if (pubVideosGetErr) done(pubVideosGetErr);

								// Get Pub videos list
								var pubVideos = pubVideosGetRes.body;

								// Set assertions
								(pubVideos[0].user._id).should.equal(userId);
								(pubVideos[0].name).should.match('Pub video Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Pub video instance if not logged in', function(done) {
		agent.post('/pub-videos')
			.send(pubVideo)
			.expect(401)
			.end(function(pubVideoSaveErr, pubVideoSaveRes) {
				// Call the assertion callback
				done(pubVideoSaveErr);
			});
	});

	it('should not be able to save Pub video instance if no name is provided', function(done) {
		// Invalidate name field
		pubVideo.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pub video
				agent.post('/pub-videos')
					.send(pubVideo)
					.expect(400)
					.end(function(pubVideoSaveErr, pubVideoSaveRes) {
						// Set message assertion
						(pubVideoSaveRes.body.message).should.match('Please fill Pub video name');
						
						// Handle Pub video save error
						done(pubVideoSaveErr);
					});
			});
	});

	it('should be able to update Pub video instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pub video
				agent.post('/pub-videos')
					.send(pubVideo)
					.expect(200)
					.end(function(pubVideoSaveErr, pubVideoSaveRes) {
						// Handle Pub video save error
						if (pubVideoSaveErr) done(pubVideoSaveErr);

						// Update Pub video name
						pubVideo.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Pub video
						agent.put('/pub-videos/' + pubVideoSaveRes.body._id)
							.send(pubVideo)
							.expect(200)
							.end(function(pubVideoUpdateErr, pubVideoUpdateRes) {
								// Handle Pub video update error
								if (pubVideoUpdateErr) done(pubVideoUpdateErr);

								// Set assertions
								(pubVideoUpdateRes.body._id).should.equal(pubVideoSaveRes.body._id);
								(pubVideoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Pub videos if not signed in', function(done) {
		// Create new Pub video model instance
		var pubVideoObj = new PubVideo(pubVideo);

		// Save the Pub video
		pubVideoObj.save(function() {
			// Request Pub videos
			request(app).get('/pub-videos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Pub video if not signed in', function(done) {
		// Create new Pub video model instance
		var pubVideoObj = new PubVideo(pubVideo);

		// Save the Pub video
		pubVideoObj.save(function() {
			request(app).get('/pub-videos/' + pubVideoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', pubVideo.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Pub video instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pub video
				agent.post('/pub-videos')
					.send(pubVideo)
					.expect(200)
					.end(function(pubVideoSaveErr, pubVideoSaveRes) {
						// Handle Pub video save error
						if (pubVideoSaveErr) done(pubVideoSaveErr);

						// Delete existing Pub video
						agent.delete('/pub-videos/' + pubVideoSaveRes.body._id)
							.send(pubVideo)
							.expect(200)
							.end(function(pubVideoDeleteErr, pubVideoDeleteRes) {
								// Handle Pub video error error
								if (pubVideoDeleteErr) done(pubVideoDeleteErr);

								// Set assertions
								(pubVideoDeleteRes.body._id).should.equal(pubVideoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Pub video instance if not signed in', function(done) {
		// Set Pub video user 
		pubVideo.user = user;

		// Create new Pub video model instance
		var pubVideoObj = new PubVideo(pubVideo);

		// Save the Pub video
		pubVideoObj.save(function() {
			// Try deleting Pub video
			request(app).delete('/pub-videos/' + pubVideoObj._id)
			.expect(401)
			.end(function(pubVideoDeleteErr, pubVideoDeleteRes) {
				// Set message assertion
				(pubVideoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Pub video error error
				done(pubVideoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PubVideo.remove().exec();
		done();
	});
});