'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Affectation = mongoose.model('Affectation');

/**
 * Globals
 */
var user, affectation;

/**
 * Unit tests
 */
describe('Affectation Model Unit Tests:', function () {
    beforeEach(function (done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });

        user.save(function () {
            affectation = new Affectation({
                name: 'Affectation Name',
                user: user
            });

            done();
        });
    });

    describe('Method Save', function () {
        it('should be able to save without problems', function (done) {
            return affectation.save(function (err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without name', function (done) {
            affectation.name = '';

            return affectation.save(function (err) {
                should.exist(err);
                done();
            });
        });
    });

    afterEach(function (done) {
        Affectation.remove().exec();
        User.remove().exec();

        done();
    });
});
