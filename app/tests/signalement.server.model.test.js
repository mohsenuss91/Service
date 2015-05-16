'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Signalement = mongoose.model('Signalement');

/**
 * Globals
 */
var user, signalement;

/**
 * Unit tests
 */
describe('Signalement Model Unit Tests:', function () {
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
            signalement = new Signalement({
                name: 'Signalement Name',
                user: user
            });

            done();
        });
    });

    describe('Method Save', function () {
        it('should be able to save without problems', function (done) {
            return signalement.save(function (err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without name', function (done) {
            signalement.name = '';

            return signalement.save(function (err) {
                should.exist(err);
                done();
            });
        });
    });

    afterEach(function (done) {
        Signalement.remove().exec();
        User.remove().exec();

        done();
    });
});
