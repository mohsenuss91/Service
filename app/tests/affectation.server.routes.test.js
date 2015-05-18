'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Affectation = mongoose.model('Affectation'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, affectation;

/**
 * Affectation routes tests
 */
describe('Affectation CRUD tests', function() {
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

		// Save a user to the test db and create new Affectation
		user.save(function() {
			affectation = {
				name: 'Affectation Name'
			};

			done();
		});
	});

	it('should be able to save Affectation instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Affectation
				agent.post('/affectations')
					.send(affectation)
					.expect(200)
					.end(function(affectationSaveErr, affectationSaveRes) {
						// Handle Affectation save error
						if (affectationSaveErr) done(affectationSaveErr);

						// Get a list of Affectations
						agent.get('/affectations')
							.end(function(affectationsGetErr, affectationsGetRes) {
								// Handle Affectation save error
								if (affectationsGetErr) done(affectationsGetErr);

								// Get Affectations list
								var affectations = affectationsGetRes.body;

								// Set assertions
								(affectations[0].user._id).should.equal(userId);
								(affectations[0].name).should.match('Affectation Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Affectation instance if not logged in', function(done) {
		agent.post('/affectations')
			.send(affectation)
			.expect(401)
			.end(function(affectationSaveErr, affectationSaveRes) {
				// Call the assertion callback
				done(affectationSaveErr);
			});
	});

	it('should not be able to save Affectation instance if no name is provided', function(done) {
		// Invalidate name field
		affectation.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Affectation
				agent.post('/affectations')
					.send(affectation)
					.expect(400)
					.end(function(affectationSaveErr, affectationSaveRes) {
						// Set message assertion
						(affectationSaveRes.body.message).should.match('Please fill Affectation name');
						
						// Handle Affectation save error
						done(affectationSaveErr);
					});
			});
	});

	it('should be able to update Affectation instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Affectation
				agent.post('/affectations')
					.send(affectation)
					.expect(200)
					.end(function(affectationSaveErr, affectationSaveRes) {
						// Handle Affectation save error
						if (affectationSaveErr) done(affectationSaveErr);

						// Update Affectation name
						affectation.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Affectation
						agent.put('/affectations/' + affectationSaveRes.body._id)
							.send(affectation)
							.expect(200)
							.end(function(affectationUpdateErr, affectationUpdateRes) {
								// Handle Affectation update error
								if (affectationUpdateErr) done(affectationUpdateErr);

								// Set assertions
								(affectationUpdateRes.body._id).should.equal(affectationSaveRes.body._id);
								(affectationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Affectations if not signed in', function(done) {
		// Create new Affectation model instance
		var affectationObj = new Affectation(affectation);

		// Save the Affectation
		affectationObj.save(function() {
			// Request Affectations
			request(app).get('/affectations')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Affectation if not signed in', function(done) {
		// Create new Affectation model instance
		var affectationObj = new Affectation(affectation);

		// Save the Affectation
		affectationObj.save(function() {
			request(app).get('/affectations/' + affectationObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', affectation.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Affectation instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Affectation
				agent.post('/affectations')
					.send(affectation)
					.expect(200)
					.end(function(affectationSaveErr, affectationSaveRes) {
						// Handle Affectation save error
						if (affectationSaveErr) done(affectationSaveErr);

						// Delete existing Affectation
						agent.delete('/affectations/' + affectationSaveRes.body._id)
							.send(affectation)
							.expect(200)
							.end(function(affectationDeleteErr, affectationDeleteRes) {
								// Handle Affectation error error
								if (affectationDeleteErr) done(affectationDeleteErr);

								// Set assertions
								(affectationDeleteRes.body._id).should.equal(affectationSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Affectation instance if not signed in', function(done) {
		// Set Affectation user 
		affectation.user = user;

		// Create new Affectation model instance
		var affectationObj = new Affectation(affectation);

		// Save the Affectation
		affectationObj.save(function() {
			// Try deleting Affectation
			request(app).delete('/affectations/' + affectationObj._id)
			.expect(401)
			.end(function(affectationDeleteErr, affectationDeleteRes) {
				// Set message assertion
				(affectationDeleteRes.body.message).should.match('User is not logged in');

				// Handle Affectation error error
				done(affectationDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Affectation.remove().exec();
		done();
	});
});