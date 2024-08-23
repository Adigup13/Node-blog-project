const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const app = express();

app.use

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');


app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files
app.use('/api/auth', authRoutes);
app.use('/api', blogRoutes);

mongoose.connect('mongodb+srv://adityagup15:UGlpVaf0yLpbxWci@cluster0.ndmfbo8.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
