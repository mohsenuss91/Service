'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Emploie = mongoose.model('Emploie'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, emploie;

/**
 * Emploie routes tests
 */
describe('Emploie CRUD tests', function() {
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

		// Save a user to the test db and create new Emploie
		user.save(function() {
			emploie = {
				name: 'Emploie Name'
			};

			done();
		});
	});

	it('should be able to save Emploie instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Emploie
				agent.post('/emploies')
					.send(emploie)
					.expect(200)
					.end(function(emploieSaveErr, emploieSaveRes) {
						// Handle Emploie save error
						if (emploieSaveErr) done(emploieSaveErr);

						// Get a list of Emploies
						agent.get('/emploies')
							.end(function(emploiesGetErr, emploiesGetRes) {
								// Handle Emploie save error
								if (emploiesGetErr) done(emploiesGetErr);

								// Get Emploies list
								var emploies = emploiesGetRes.body;

								// Set assertions
								(emploies[0].user._id).should.equal(userId);
								(emploies[0].name).should.match('Emploie Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Emploie instance if not logged in', function(done) {
		agent.post('/emploies')
			.send(emploie)
			.expect(401)
			.end(function(emploieSaveErr, emploieSaveRes) {
				// Call the assertion callback
				done(emploieSaveErr);
			});
	});

	it('should not be able to save Emploie instance if no name is provided', function(done) {
		// Invalidate name field
		emploie.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Emploie
				agent.post('/emploies')
					.send(emploie)
					.expect(400)
					.end(function(emploieSaveErr, emploieSaveRes) {
						// Set message assertion
						(emploieSaveRes.body.message).should.match('Please fill Emploie name');
						
						// Handle Emploie save error
						done(emploieSaveErr);
					});
			});
	});

	it('should be able to update Emploie instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Emploie
				agent.post('/emploies')
					.send(emploie)
					.expect(200)
					.end(function(emploieSaveErr, emploieSaveRes) {
						// Handle Emploie save error
						if (emploieSaveErr) done(emploieSaveErr);

						// Update Emploie name
						emploie.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Emploie
						agent.put('/emploies/' + emploieSaveRes.body._id)
							.send(emploie)
							.expect(200)
							.end(function(emploieUpdateErr, emploieUpdateRes) {
								// Handle Emploie update error
								if (emploieUpdateErr) done(emploieUpdateErr);

								// Set assertions
								(emploieUpdateRes.body._id).should.equal(emploieSaveRes.body._id);
								(emploieUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Emploies if not signed in', function(done) {
		// Create new Emploie model instance
		var emploieObj = new Emploie(emploie);

		// Save the Emploie
		emploieObj.save(function() {
			// Request Emploies
			request(app).get('/emploies')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Emploie if not signed in', function(done) {
		// Create new Emploie model instance
		var emploieObj = new Emploie(emploie);

		// Save the Emploie
		emploieObj.save(function() {
			request(app).get('/emploies/' + emploieObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', emploie.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Emploie instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Emploie
				agent.post('/emploies')
					.send(emploie)
					.expect(200)
					.end(function(emploieSaveErr, emploieSaveRes) {
						// Handle Emploie save error
						if (emploieSaveErr) done(emploieSaveErr);

						// Delete existing Emploie
						agent.delete('/emploies/' + emploieSaveRes.body._id)
							.send(emploie)
							.expect(200)
							.end(function(emploieDeleteErr, emploieDeleteRes) {
								// Handle Emploie error error
								if (emploieDeleteErr) done(emploieDeleteErr);

								// Set assertions
								(emploieDeleteRes.body._id).should.equal(emploieSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Emploie instance if not signed in', function(done) {
		// Set Emploie user 
		emploie.user = user;

		// Create new Emploie model instance
		var emploieObj = new Emploie(emploie);

		// Save the Emploie
		emploieObj.save(function() {
			// Try deleting Emploie
			request(app).delete('/emploies/' + emploieObj._id)
			.expect(401)
			.end(function(emploieDeleteErr, emploieDeleteRes) {
				// Set message assertion
				(emploieDeleteRes.body.message).should.match('User is not logged in');

				// Handle Emploie error error
				done(emploieDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Emploie.remove().exec();
		done();
	});
});