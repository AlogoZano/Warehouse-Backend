const express = require('express');
const cors = require('cors');
const PackageRoutes = require('./routes/packageRoutes');
const TrilatRoutes = require('./routes/trilatRoutes');
const InstitutionRoutes = require('./routes/institutionRoutes');
const UserRoutes = require('./routes/userRoutes');
const StateRoutes = require('./routes/stateRoutes');
const NotifyRoutes = require('./routes/notifyRoutes');
const LocationRoutes = require('./routes/locationRoutes');
const HistoryRoutes = require('./routes/historyRoutes');


const app = express();

app.use(cors());

app.use(cors({
    origin: '*'
}));

app.use(express.json());
app.use('/pkg', PackageRoutes);
app.use('/trilat', TrilatRoutes);
app.use('/institution', InstitutionRoutes)
app.use('/user', UserRoutes);
app.use('/state', StateRoutes);
app.use('/notify', NotifyRoutes);
app.use('/location', LocationRoutes);
app.use('/history', HistoryRoutes);

module.exports = app;