'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Categorie = mongoose.model('Categorie'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, categorie;

/**
 * Categorie routes tests
 */
describe('Categorie CRUD tests', function() {
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

		// Save a user to the test db and create new Categorie
		user.save(function() {
			categorie = {
				name: 'Categorie Name'
			};

			done();
		});
	});

	it('should be able to save Categorie instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Categorie
				agent.post('/categories')
					.send(categorie)
					.expect(200)
					.end(function(categorieSaveErr, categorieSaveRes) {
						// Handle Categorie save error
						if (categorieSaveErr) done(categorieSaveErr);

						// Get a list of Categories
						agent.get('/categories')
							.end(function(categoriesGetErr, categoriesGetRes) {
								// Handle Categorie save error
								if (categoriesGetErr) done(categoriesGetErr);

								// Get Categories list
								var categories = categoriesGetRes.body;

								// Set assertions
								(categories[0].user._id).should.equal(userId);
								(categories[0].name).should.match('Categorie Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Categorie instance if not logged in', function(done) {
		agent.post('/categories')
			.send(categorie)
			.expect(401)
			.end(function(categorieSaveErr, categorieSaveRes) {
				// Call the assertion callback
				done(categorieSaveErr);
			});
	});

	it('should not be able to save Categorie instance if no name is provided', function(done) {
		// Invalidate name field
		categorie.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Categorie
				agent.post('/categories')
					.send(categorie)
					.expect(400)
					.end(function(categorieSaveErr, categorieSaveRes) {
						// Set message assertion
						(categorieSaveRes.body.message).should.match('Please fill Categorie name');
						
						// Handle Categorie save error
						done(categorieSaveErr);
					});
			});
	});

	it('should be able to update Categorie instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Categorie
				agent.post('/categories')
					.send(categorie)
					.expect(200)
					.end(function(categorieSaveErr, categorieSaveRes) {
						// Handle Categorie save error
						if (categorieSaveErr) done(categorieSaveErr);

						// Update Categorie name
						categorie.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Categorie
						agent.put('/categories/' + categorieSaveRes.body._id)
							.send(categorie)
							.expect(200)
							.end(function(categorieUpdateErr, categorieUpdateRes) {
								// Handle Categorie update error
								if (categorieUpdateErr) done(categorieUpdateErr);

								// Set assertions
								(categorieUpdateRes.body._id).should.equal(categorieSaveRes.body._id);
								(categorieUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Categories if not signed in', function(done) {
		// Create new Categorie model instance
		var categorieObj = new Categorie(categorie);

		// Save the Categorie
		categorieObj.save(function() {
			// Request Categories
			request(app).get('/categories')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Categorie if not signed in', function(done) {
		// Create new Categorie model instance
		var categorieObj = new Categorie(categorie);

		// Save the Categorie
		categorieObj.save(function() {
			request(app).get('/categories/' + categorieObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', categorie.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Categorie instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Categorie
				agent.post('/categories')
					.send(categorie)
					.expect(200)
					.end(function(categorieSaveErr, categorieSaveRes) {
						// Handle Categorie save error
						if (categorieSaveErr) done(categorieSaveErr);

						// Delete existing Categorie
						agent.delete('/categories/' + categorieSaveRes.body._id)
							.send(categorie)
							.expect(200)
							.end(function(categorieDeleteErr, categorieDeleteRes) {
								// Handle Categorie error error
								if (categorieDeleteErr) done(categorieDeleteErr);

								// Set assertions
								(categorieDeleteRes.body._id).should.equal(categorieSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Categorie instance if not signed in', function(done) {
		// Set Categorie user 
		categorie.user = user;

		// Create new Categorie model instance
		var categorieObj = new Categorie(categorie);

		// Save the Categorie
		categorieObj.save(function() {
			// Try deleting Categorie
			request(app).delete('/categories/' + categorieObj._id)
			.expect(401)
			.end(function(categorieDeleteErr, categorieDeleteRes) {
				// Set message assertion
				(categorieDeleteRes.body.message).should.match('User is not logged in');

				// Handle Categorie error error
				done(categorieDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Categorie.remove().exec();
		done();
	});
});