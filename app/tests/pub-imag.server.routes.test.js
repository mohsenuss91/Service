'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PubImag = mongoose.model('PubImag'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, pubImag;

/**
 * Pub imag routes tests
 */
describe('Pub imag CRUD tests', function() {
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

		// Save a user to the test db and create new Pub imag
		user.save(function() {
			pubImag = {
				name: 'Pub imag Name'
			};

			done();
		});
	});

	it('should be able to save Pub imag instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pub imag
				agent.post('/pub-imags')
					.send(pubImag)
					.expect(200)
					.end(function(pubImagSaveErr, pubImagSaveRes) {
						// Handle Pub imag save error
						if (pubImagSaveErr) done(pubImagSaveErr);

						// Get a list of Pub imags
						agent.get('/pub-imags')
							.end(function(pubImagsGetErr, pubImagsGetRes) {
								// Handle Pub imag save error
								if (pubImagsGetErr) done(pubImagsGetErr);

								// Get Pub imags list
								var pubImags = pubImagsGetRes.body;

								// Set assertions
								(pubImags[0].user._id).should.equal(userId);
								(pubImags[0].name).should.match('Pub imag Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Pub imag instance if not logged in', function(done) {
		agent.post('/pub-imags')
			.send(pubImag)
			.expect(401)
			.end(function(pubImagSaveErr, pubImagSaveRes) {
				// Call the assertion callback
				done(pubImagSaveErr);
			});
	});

	it('should not be able to save Pub imag instance if no name is provided', function(done) {
		// Invalidate name field
		pubImag.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pub imag
				agent.post('/pub-imags')
					.send(pubImag)
					.expect(400)
					.end(function(pubImagSaveErr, pubImagSaveRes) {
						// Set message assertion
						(pubImagSaveRes.body.message).should.match('Please fill Pub imag name');
						
						// Handle Pub imag save error
						done(pubImagSaveErr);
					});
			});
	});

	it('should be able to update Pub imag instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pub imag
				agent.post('/pub-imags')
					.send(pubImag)
					.expect(200)
					.end(function(pubImagSaveErr, pubImagSaveRes) {
						// Handle Pub imag save error
						if (pubImagSaveErr) done(pubImagSaveErr);

						// Update Pub imag name
						pubImag.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Pub imag
						agent.put('/pub-imags/' + pubImagSaveRes.body._id)
							.send(pubImag)
							.expect(200)
							.end(function(pubImagUpdateErr, pubImagUpdateRes) {
								// Handle Pub imag update error
								if (pubImagUpdateErr) done(pubImagUpdateErr);

								// Set assertions
								(pubImagUpdateRes.body._id).should.equal(pubImagSaveRes.body._id);
								(pubImagUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Pub imags if not signed in', function(done) {
		// Create new Pub imag model instance
		var pubImagObj = new PubImag(pubImag);

		// Save the Pub imag
		pubImagObj.save(function() {
			// Request Pub imags
			request(app).get('/pub-imags')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Pub imag if not signed in', function(done) {
		// Create new Pub imag model instance
		var pubImagObj = new PubImag(pubImag);

		// Save the Pub imag
		pubImagObj.save(function() {
			request(app).get('/pub-imags/' + pubImagObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', pubImag.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Pub imag instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pub imag
				agent.post('/pub-imags')
					.send(pubImag)
					.expect(200)
					.end(function(pubImagSaveErr, pubImagSaveRes) {
						// Handle Pub imag save error
						if (pubImagSaveErr) done(pubImagSaveErr);

						// Delete existing Pub imag
						agent.delete('/pub-imags/' + pubImagSaveRes.body._id)
							.send(pubImag)
							.expect(200)
							.end(function(pubImagDeleteErr, pubImagDeleteRes) {
								// Handle Pub imag error error
								if (pubImagDeleteErr) done(pubImagDeleteErr);

								// Set assertions
								(pubImagDeleteRes.body._id).should.equal(pubImagSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Pub imag instance if not signed in', function(done) {
		// Set Pub imag user 
		pubImag.user = user;

		// Create new Pub imag model instance
		var pubImagObj = new PubImag(pubImag);

		// Save the Pub imag
		pubImagObj.save(function() {
			// Try deleting Pub imag
			request(app).delete('/pub-imags/' + pubImagObj._id)
			.expect(401)
			.end(function(pubImagDeleteErr, pubImagDeleteRes) {
				// Set message assertion
				(pubImagDeleteRes.body.message).should.match('User is not logged in');

				// Handle Pub imag error error
				done(pubImagDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PubImag.remove().exec();
		done();
	});
});