'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Offre = mongoose.model('Offre'),
    agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, offre;

/**
 * Offre routes tests
 */
describe('Offre CRUD tests', function () {
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

        // Save a user to the test db and create new Offre
        user.save(function () {
            offre = {
                name: 'Offre Name'
            };

            done();
        });
    });

    it('should be able to save Offre instance if logged in', function (done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Offre
                agent.post('/offres')
                    .send(offre)
                    .expect(200)
                    .end(function (offreSaveErr, offreSaveRes) {
                        // Handle Offre save error
                        if (offreSaveErr) done(offreSaveErr);

                        // Get a list of Offres
                        agent.get('/offres')
                            .end(function (offresGetErr, offresGetRes) {
                                // Handle Offre save error
                                if (offresGetErr) done(offresGetErr);

                                // Get Offres list
                                var offres = offresGetRes.body;

                                // Set assertions
                                (offres[0].user._id).should.equal(userId);
                                (offres[0].name).should.match('Offre Name');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to save Offre instance if not logged in', function (done) {
        agent.post('/offres')
            .send(offre)
            .expect(401)
            .end(function (offreSaveErr, offreSaveRes) {
                // Call the assertion callback
                done(offreSaveErr);
            });
    });

    it('should not be able to save Offre instance if no name is provided', function (done) {
        // Invalidate name field
        offre.name = '';

        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Offre
                agent.post('/offres')
                    .send(offre)
                    .expect(400)
                    .end(function (offreSaveErr, offreSaveRes) {
                        // Set message assertion
                        (offreSaveRes.body.message).should.match('Please fill Offre name');

                        // Handle Offre save error
                        done(offreSaveErr);
                    });
            });
    });

    it('should be able to update Offre instance if signed in', function (done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Offre
                agent.post('/offres')
                    .send(offre)
                    .expect(200)
                    .end(function (offreSaveErr, offreSaveRes) {
                        // Handle Offre save error
                        if (offreSaveErr) done(offreSaveErr);

                        // Update Offre name
                        offre.name = 'WHY YOU GOTTA BE SO MEAN?';

                        // Update existing Offre
                        agent.put('/offres/' + offreSaveRes.body._id)
                            .send(offre)
                            .expect(200)
                            .end(function (offreUpdateErr, offreUpdateRes) {
                                // Handle Offre update error
                                if (offreUpdateErr) done(offreUpdateErr);

                                // Set assertions
                                (offreUpdateRes.body._id).should.equal(offreSaveRes.body._id);
                                (offreUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should be able to get a list of Offres if not signed in', function (done) {
        // Create new Offre model instance
        var offreObj = new Offre(offre);

        // Save the Offre
        offreObj.save(function () {
            // Request Offres
            request(app).get('/offres')
                .end(function (req, res) {
                    // Set assertion
                    res.body.should.be.an.Array.with.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });


    it('should be able to get a single Offre if not signed in', function (done) {
        // Create new Offre model instance
        var offreObj = new Offre(offre);

        // Save the Offre
        offreObj.save(function () {
            request(app).get('/offres/' + offreObj._id)
                .end(function (req, res) {
                    // Set assertion
                    res.body.should.be.an.Object.with.property('name', offre.name);

                    // Call the assertion callback
                    done();
                });
        });
    });

    it('should be able to delete Offre instance if signed in', function (done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Offre
                agent.post('/offres')
                    .send(offre)
                    .expect(200)
                    .end(function (offreSaveErr, offreSaveRes) {
                        // Handle Offre save error
                        if (offreSaveErr) done(offreSaveErr);

                        // Delete existing Offre
                        agent.delete('/offres/' + offreSaveRes.body._id)
                            .send(offre)
                            .expect(200)
                            .end(function (offreDeleteErr, offreDeleteRes) {
                                // Handle Offre error error
                                if (offreDeleteErr) done(offreDeleteErr);

                                // Set assertions
                                (offreDeleteRes.body._id).should.equal(offreSaveRes.body._id);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to delete Offre instance if not signed in', function (done) {
        // Set Offre user
        offre.user = user;

        // Create new Offre model instance
        var offreObj = new Offre(offre);

        // Save the Offre
        offreObj.save(function () {
            // Try deleting Offre
            request(app).delete('/offres/' + offreObj._id)
                .expect(401)
                .end(function (offreDeleteErr, offreDeleteRes) {
                    // Set message assertion
                    (offreDeleteRes.body.message).should.match('User is not logged in');

                    // Handle Offre error error
                    done(offreDeleteErr);
                });

        });
    });

    afterEach(function (done) {
        User.remove().exec();
        Offre.remove().exec();
        done();
    });
});
