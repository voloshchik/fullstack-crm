const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const categoryRoutes = require('./routes/category');
const positionRoutes = require('./routes/position');
const orderRoutes = require('./routes/order');
const keys = require('./config/keys');

const app = express();

mongoose
    .connect(keys.mongoURI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected...'))
    .catch((error) => console.log(error));

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use('/uploads', express.static('uploads'));

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('cors')());
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/position', positionRoutes);
app.use('/api/order', orderRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/dist/client'));

    app.get('*', (req, res) => {
        res.sendFile(
            path.resolve(__dirname, 'client', 'dist', 'client', 'index.html')
        );
    });
}

module.exports = app;
