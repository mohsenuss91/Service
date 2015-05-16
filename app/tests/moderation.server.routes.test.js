'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Moderation = mongoose.model('Moderation'),
    agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, moderation;

/**
 * Moderation routes tests
 */
describe('Moderation CRUD tests', function () {
    beforeEach(function (done) {
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

        // Save a user to the test db and create new Moderation
        user.save(function () {
            moderation = {
                name: 'Moderation Name'
            };

            done();
        });
    });

    it('should be able to save Moderation instance if logged in', function (done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Moderation
                agent.post('/moderations')
                    .send(moderation)
                    .expect(200)
                    .end(function (moderationSaveErr, moderationSaveRes) {
                        // Handle Moderation save error
                        if (moderationSaveErr) done(moderationSaveErr);

                        // Get a list of Moderations
                        agent.get('/moderations')
                            .end(function (moderationsGetErr, moderationsGetRes) {
                                // Handle Moderation save error
                                if (moderationsGetErr) done(moderationsGetErr);

                                // Get Moderations list
                                var moderations = moderationsGetRes.body;

                                // Set assertions
                                (moderations[0].user._id).should.equal(userId);
                                (moderations[0].name).should.match('Moderation Name');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to save Moderation instance if not logged in', function (done) {
        agent.post('/moderations')
            .send(moderation)
            .expect(401)
            .end(function (moderationSaveErr, moderationSaveRes) {
                // Call the assertion callback
                done(moderationSaveErr);
            });
    });

    it('should not be able to save Moderation instance if no name is provided', function (done) {
        // Invalidate name field
        moderation.name = '';

        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Moderation
                agent.post('/moderations')
                    .send(moderation)
                    .expect(400)
                    .end(function (moderationSaveErr, moderationSaveRes) {
                        // Set message assertion
                        (moderationSaveRes.body.message).should.match('Please fill Moderation name');

                        // Handle Moderation save error
                        done(moderationSaveErr);
                    });
            });
    });

    it('should be able to update Moderation instance if signed in', function (done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Moderation
                agent.post('/moderations')
                    .send(moderation)
                    .expect(200)
                    .end(function (moderationSaveErr, moderationSaveRes) {
                        // Handle Moderation save error
                        if (moderationSaveErr) done(moderationSaveErr);

                        // Update Moderation name
                        moderation.name = 'WHY YOU GOTTA BE SO MEAN?';

                        // Update existing Moderation
                        agent.put('/moderations/' + moderationSaveRes.body._id)
                            .send(moderation)
                            .expect(200)
                            .end(function (moderationUpdateErr, moderationUpdateRes) {
                                // Handle Moderation update error
                                if (moderationUpdateErr) done(moderationUpdateErr);

                                // Set assertions
                                (moderationUpdateRes.body._id).should.equal(moderationSaveRes.body._id);
                                (moderationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should be able to get a list of Moderations if not signed in', function (done) {
        // Create new Moderation model instance
        var moderationObj = new Moderation(moderation);

        // Save the Moderation
        moderationObj.save(function () {
            // Request Moderations
            request(app).get('/moderations')
                .end(function (req, res) {
                    // Set assertion
                    res.body.should.be.an.Array.with.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });


    it('should be able to get a single Moderation if not signed in', function (done) {
        // Create new Moderation model instance
        var moderationObj = new Moderation(moderation);

        // Save the Moderation
        moderationObj.save(function () {
            request(app).get('/moderations/' + moderationObj._id)
                .end(function (req, res) {
                    // Set assertion
                    res.body.should.be.an.Object.with.property('name', moderation.name);

                    // Call the assertion callback
                    done();
                });
        });
    });

    it('should be able to delete Moderation instance if signed in', function (done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Moderation
                agent.post('/moderations')
                    .send(moderation)
                    .expect(200)
                    .end(function (moderationSaveErr, moderationSaveRes) {
                        // Handle Moderation save error
                        if (moderationSaveErr) done(moderationSaveErr);

                        // Delete existing Moderation
                        agent.delete('/moderations/' + moderationSaveRes.body._id)
                            .send(moderation)
                            .expect(200)
                            .end(function (moderationDeleteErr, moderationDeleteRes) {
                                // Handle Moderation error error
                                if (moderationDeleteErr) done(moderationDeleteErr);

                                // Set assertions
                                (moderationDeleteRes.body._id).should.equal(moderationSaveRes.body._id);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to delete Moderation instance if not signed in', function (done) {
        // Set Moderation user
        moderation.user = user;

        // Create new Moderation model instance
        var moderationObj = new Moderation(moderation);

        // Save the Moderation
        moderationObj.save(function () {
            // Try deleting Moderation
            request(app).delete('/moderations/' + moderationObj._id)
                .expect(401)
                .end(function (moderationDeleteErr, moderationDeleteRes) {
                    // Set message assertion
                    (moderationDeleteRes.body.message).should.match('User is not logged in');

                    // Handle Moderation error error
                    done(moderationDeleteErr);
                });

        });
    });

    afterEach(function (done) {
        User.remove().exec();
        Moderation.remove().exec();
        done();
    });
});
