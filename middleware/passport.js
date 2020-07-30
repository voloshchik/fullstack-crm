const JwtStrategy = require('passport-jwt').Strategy;
const mongoose = require('mongoose');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require('../config/keys');

const User = mongoose.model('users');

const optrions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.jwt,
};

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(optrions, async (payload, done) => {
            try {
                const user = await User.findById(payload.userId).select(
                    'email id'
                );

                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            } catch (error) {
                console.log(error);
            }
        })
    );
};
