const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User, Customer } = require('../models');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'your-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-client-secret',
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ where: { email: profile.emails[0].value } });

        if (!user) {
          // Create new user for the customer
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: '', // No password for OAuth users
            role: 'CUSTOMER',
            isActive: true,
          });

          // Create corresponding customer record
          await Customer.create({
            userId: user.id,
            phone: '', // Will be updated later by the customer
            address: '',
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
