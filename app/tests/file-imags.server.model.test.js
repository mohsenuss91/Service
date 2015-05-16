'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    FileImags = mongoose.model('FileImags');

/**
 * Globals
 */
var user, fileImags;

/**
 * Unit tests
 */
describe('File imags Model Unit Tests:', function () {
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
            fileImags = new FileImags({
                // Add model fields
                // ...
            });

            done();
        });
    });

    describe('Method Save', function () {
        it('should be able to save without problems', function (done) {
            return fileImags.save(function (err) {
                should.not.exist(err);
                done();
            });
        });
    });

    afterEach(function (done) {
        FileImags.remove().exec();
        User.remove().exec();

        done();
    });
});
