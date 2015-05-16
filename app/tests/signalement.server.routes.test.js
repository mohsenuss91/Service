'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Signalement = mongoose.model('Signalement'),
    agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, signalement;

/**
 * Signalement routes tests
 */
describe('Signalement CRUD tests', function () {
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

        // Save a user to the test db and create new Signalement
        user.save(function () {
            signalement = {
                name: 'Signalement Name'
            };

            done();
        });
    });

    it('should be able to save Signalement instance if logged in', function (done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Signalement
                agent.post('/signalements')
                    .send(signalement)
                    .expect(200)
                    .end(function (signalementSaveErr, signalementSaveRes) {
                        // Handle Signalement save error
                        if (signalementSaveErr) done(signalementSaveErr);

                        // Get a list of Signalements
                        agent.get('/signalements')
                            .end(function (signalementsGetErr, signalementsGetRes) {
                                // Handle Signalement save error
                                if (signalementsGetErr) done(signalementsGetErr);

                                // Get Signalements list
                                var signalements = signalementsGetRes.body;

                                // Set assertions
                                (signalements[0].user._id).should.equal(userId);
                                (signalements[0].name).should.match('Signalement Name');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to save Signalement instance if not logged in', function (done) {
        agent.post('/signalements')
            .send(signalement)
            .expect(401)
            .end(function (signalementSaveErr, signalementSaveRes) {
                // Call the assertion callback
                done(signalementSaveErr);
            });
    });

    it('should not be able to save Signalement instance if no name is provided', function (done) {
        // Invalidate name field
        signalement.name = '';

        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Signalement
                agent.post('/signalements')
                    .send(signalement)
                    .expect(400)
                    .end(function (signalementSaveErr, signalementSaveRes) {
                        // Set message assertion
                        (signalementSaveRes.body.message).should.match('Please fill Signalement name');

                        // Handle Signalement save error
                        done(signalementSaveErr);
                    });
            });
    });

    it('should be able to update Signalement instance if signed in', function (done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Signalement
                agent.post('/signalements')
                    .send(signalement)
                    .expect(200)
                    .end(function (signalementSaveErr, signalementSaveRes) {
                        // Handle Signalement save error
                        if (signalementSaveErr) done(signalementSaveErr);

                        // Update Signalement name
                        signalement.name = 'WHY YOU GOTTA BE SO MEAN?';

                        // Update existing Signalement
                        agent.put('/signalements/' + signalementSaveRes.body._id)
                            .send(signalement)
                            .expect(200)
                            .end(function (signalementUpdateErr, signalementUpdateRes) {
                                // Handle Signalement update error
                                if (signalementUpdateErr) done(signalementUpdateErr);

                                // Set assertions
                                (signalementUpdateRes.body._id).should.equal(signalementSaveRes.body._id);
                                (signalementUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should be able to get a list of Signalements if not signed in', function (done) {
        // Create new Signalement model instance
        var signalementObj = new Signalement(signalement);

        // Save the Signalement
        signalementObj.save(function () {
            // Request Signalements
            request(app).get('/signalements')
                .end(function (req, res) {
                    // Set assertion
                    res.body.should.be.an.Array.with.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });


    it('should be able to get a single Signalement if not signed in', function (done) {
        // Create new Signalement model instance
        var signalementObj = new Signalement(signalement);

        // Save the Signalement
        signalementObj.save(function () {
            request(app).get('/signalements/' + signalementObj._id)
                .end(function (req, res) {
                    // Set assertion
                    res.body.should.be.an.Object.with.property('name', signalement.name);

                    // Call the assertion callback
                    done();
                });
        });
    });

    it('should be able to delete Signalement instance if signed in', function (done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Signalement
                agent.post('/signalements')
                    .send(signalement)
                    .expect(200)
                    .end(function (signalementSaveErr, signalementSaveRes) {
                        // Handle Signalement save error
                        if (signalementSaveErr) done(signalementSaveErr);

                        // Delete existing Signalement
                        agent.delete('/signalements/' + signalementSaveRes.body._id)
                            .send(signalement)
                            .expect(200)
                            .end(function (signalementDeleteErr, signalementDeleteRes) {
                                // Handle Signalement error error
                                if (signalementDeleteErr) done(signalementDeleteErr);

                                // Set assertions
                                (signalementDeleteRes.body._id).should.equal(signalementSaveRes.body._id);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to delete Signalement instance if not signed in', function (done) {
        // Set Signalement user
        signalement.user = user;

        // Create new Signalement model instance
        var signalementObj = new Signalement(signalement);

        // Save the Signalement
        signalementObj.save(function () {
            // Try deleting Signalement
            request(app).delete('/signalements/' + signalementObj._id)
                .expect(401)
                .end(function (signalementDeleteErr, signalementDeleteRes) {
                    // Set message assertion
                    (signalementDeleteRes.body.message).should.match('User is not logged in');

                    // Handle Signalement error error
                    done(signalementDeleteErr);
                });

        });
    });

    afterEach(function (done) {
        User.remove().exec();
        Signalement.remove().exec();
        done();
    });
});
