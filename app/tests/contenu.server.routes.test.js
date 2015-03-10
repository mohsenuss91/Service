'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Contenu = mongoose.model('Contenu'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, contenu;

/**
 * Contenu routes tests
 */
describe('Contenu CRUD tests', function() {
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

		// Save a user to the test db and create new Contenu
		user.save(function() {
			contenu = {
				name: 'Contenu Name'
			};

			done();
		});
	});

	it('should be able to save Contenu instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Contenu
				agent.post('/contenus')
					.send(contenu)
					.expect(200)
					.end(function(contenuSaveErr, contenuSaveRes) {
						// Handle Contenu save error
						if (contenuSaveErr) done(contenuSaveErr);

						// Get a list of Contenus
						agent.get('/contenus')
							.end(function(contenusGetErr, contenusGetRes) {
								// Handle Contenu save error
								if (contenusGetErr) done(contenusGetErr);

								// Get Contenus list
								var contenus = contenusGetRes.body;

								// Set assertions
								(contenus[0].user._id).should.equal(userId);
								(contenus[0].name).should.match('Contenu Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Contenu instance if not logged in', function(done) {
		agent.post('/contenus')
			.send(contenu)
			.expect(401)
			.end(function(contenuSaveErr, contenuSaveRes) {
				// Call the assertion callback
				done(contenuSaveErr);
			});
	});

	it('should not be able to save Contenu instance if no name is provided', function(done) {
		// Invalidate name field
		contenu.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Contenu
				agent.post('/contenus')
					.send(contenu)
					.expect(400)
					.end(function(contenuSaveErr, contenuSaveRes) {
						// Set message assertion
						(contenuSaveRes.body.message).should.match('Please fill Contenu name');
						
						// Handle Contenu save error
						done(contenuSaveErr);
					});
			});
	});

	it('should be able to update Contenu instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Contenu
				agent.post('/contenus')
					.send(contenu)
					.expect(200)
					.end(function(contenuSaveErr, contenuSaveRes) {
						// Handle Contenu save error
						if (contenuSaveErr) done(contenuSaveErr);

						// Update Contenu name
						contenu.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Contenu
						agent.put('/contenus/' + contenuSaveRes.body._id)
							.send(contenu)
							.expect(200)
							.end(function(contenuUpdateErr, contenuUpdateRes) {
								// Handle Contenu update error
								if (contenuUpdateErr) done(contenuUpdateErr);

								// Set assertions
								(contenuUpdateRes.body._id).should.equal(contenuSaveRes.body._id);
								(contenuUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Contenus if not signed in', function(done) {
		// Create new Contenu model instance
		var contenuObj = new Contenu(contenu);

		// Save the Contenu
		contenuObj.save(function() {
			// Request Contenus
			request(app).get('/contenus')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Contenu if not signed in', function(done) {
		// Create new Contenu model instance
		var contenuObj = new Contenu(contenu);

		// Save the Contenu
		contenuObj.save(function() {
			request(app).get('/contenus/' + contenuObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', contenu.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Contenu instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Contenu
				agent.post('/contenus')
					.send(contenu)
					.expect(200)
					.end(function(contenuSaveErr, contenuSaveRes) {
						// Handle Contenu save error
						if (contenuSaveErr) done(contenuSaveErr);

						// Delete existing Contenu
						agent.delete('/contenus/' + contenuSaveRes.body._id)
							.send(contenu)
							.expect(200)
							.end(function(contenuDeleteErr, contenuDeleteRes) {
								// Handle Contenu error error
								if (contenuDeleteErr) done(contenuDeleteErr);

								// Set assertions
								(contenuDeleteRes.body._id).should.equal(contenuSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Contenu instance if not signed in', function(done) {
		// Set Contenu user 
		contenu.user = user;

		// Create new Contenu model instance
		var contenuObj = new Contenu(contenu);

		// Save the Contenu
		contenuObj.save(function() {
			// Try deleting Contenu
			request(app).delete('/contenus/' + contenuObj._id)
			.expect(401)
			.end(function(contenuDeleteErr, contenuDeleteRes) {
				// Set message assertion
				(contenuDeleteRes.body.message).should.match('User is not logged in');

				// Handle Contenu error error
				done(contenuDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Contenu.remove().exec();
		done();
	});
});