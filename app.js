const express = require('express');

const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const categoryRoutes = require('./routes/category');
const positionRoutes = require('./routes/position');
const orderRoutes = require('./routes/order');

const app = express();

app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/posiston', positionRoutes);
app.use('/api/order', orderRoutes);

module.exports = app;
