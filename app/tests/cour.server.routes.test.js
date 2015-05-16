'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Cour = mongoose.model('Cour'),
    agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, cour;

/**
 * Cour routes tests
 */
describe('Cour CRUD tests', function () {
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

        // Save a user to the test db and create new Cour
        user.save(function () {
            cour = {
                name: 'Cour Name'
            };

            done();
        });
    });

    it('should be able to save Cour instance if logged in', function (done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Cour
                agent.post('/cours')
                    .send(cour)
                    .expect(200)
                    .end(function (courSaveErr, courSaveRes) {
                        // Handle Cour save error
                        if (courSaveErr) done(courSaveErr);

                        // Get a list of Cours
                        agent.get('/cours')
                            .end(function (coursGetErr, coursGetRes) {
                                // Handle Cour save error
                                if (coursGetErr) done(coursGetErr);

                                // Get Cours list
                                var cours = coursGetRes.body;

                                // Set assertions
                                (cours[0].user._id).should.equal(userId);
                                (cours[0].name).should.match('Cour Name');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to save Cour instance if not logged in', function (done) {
        agent.post('/cours')
            .send(cour)
            .expect(401)
            .end(function (courSaveErr, courSaveRes) {
                // Call the assertion callback
                done(courSaveErr);
            });
    });

    it('should not be able to save Cour instance if no name is provided', function (done) {
        // Invalidate name field
        cour.name = '';

        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Cour
                agent.post('/cours')
                    .send(cour)
                    .expect(400)
                    .end(function (courSaveErr, courSaveRes) {
                        // Set message assertion
                        (courSaveRes.body.message).should.match('Please fill Cour name');

                        // Handle Cour save error
                        done(courSaveErr);
                    });
            });
    });

    it('should be able to update Cour instance if signed in', function (done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Cour
                agent.post('/cours')
                    .send(cour)
                    .expect(200)
                    .end(function (courSaveErr, courSaveRes) {
                        // Handle Cour save error
                        if (courSaveErr) done(courSaveErr);

                        // Update Cour name
                        cour.name = 'WHY YOU GOTTA BE SO MEAN?';

                        // Update existing Cour
                        agent.put('/cours/' + courSaveRes.body._id)
                            .send(cour)
                            .expect(200)
                            .end(function (courUpdateErr, courUpdateRes) {
                                // Handle Cour update error
                                if (courUpdateErr) done(courUpdateErr);

                                // Set assertions
                                (courUpdateRes.body._id).should.equal(courSaveRes.body._id);
                                (courUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should be able to get a list of Cours if not signed in', function (done) {
        // Create new Cour model instance
        var courObj = new Cour(cour);

        // Save the Cour
        courObj.save(function () {
            // Request Cours
            request(app).get('/cours')
                .end(function (req, res) {
                    // Set assertion
                    res.body.should.be.an.Array.with.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });


    it('should be able to get a single Cour if not signed in', function (done) {
        // Create new Cour model instance
        var courObj = new Cour(cour);

        // Save the Cour
        courObj.save(function () {
            request(app).get('/cours/' + courObj._id)
                .end(function (req, res) {
                    // Set assertion
                    res.body.should.be.an.Object.with.property('name', cour.name);

                    // Call the assertion callback
                    done();
                });
        });
    });

    it('should be able to delete Cour instance if signed in', function (done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Cour
                agent.post('/cours')
                    .send(cour)
                    .expect(200)
                    .end(function (courSaveErr, courSaveRes) {
                        // Handle Cour save error
                        if (courSaveErr) done(courSaveErr);

                        // Delete existing Cour
                        agent.delete('/cours/' + courSaveRes.body._id)
                            .send(cour)
                            .expect(200)
                            .end(function (courDeleteErr, courDeleteRes) {
                                // Handle Cour error error
                                if (courDeleteErr) done(courDeleteErr);

                                // Set assertions
                                (courDeleteRes.body._id).should.equal(courSaveRes.body._id);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to delete Cour instance if not signed in', function (done) {
        // Set Cour user
        cour.user = user;

        // Create new Cour model instance
        var courObj = new Cour(cour);

        // Save the Cour
        courObj.save(function () {
            // Try deleting Cour
            request(app).delete('/cours/' + courObj._id)
                .expect(401)
                .end(function (courDeleteErr, courDeleteRes) {
                    // Set message assertion
                    (courDeleteRes.body.message).should.match('User is not logged in');

                    // Handle Cour error error
                    done(courDeleteErr);
                });

        });
    });

    afterEach(function (done) {
        User.remove().exec();
        Cour.remove().exec();
        done();
    });
});
