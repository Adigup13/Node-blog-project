const express = require('express');
const multer = require('multer');
const Blog = require('../models/Blog');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

router.post('/blogs', authMiddleware, upload.single('image'), async (req, res) => {
    const { title, description } = req.body;
    try {
        const blog = new Blog({ title, description, image: req.file.path, user: req.user });
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(400).json({ message: 'Error creating blog' });
    }
});

router.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find().populate('user', 'email');
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blogs' });
    }
});

router.put('/blogs/:id', authMiddleware, async (req, res) => {
    const { title, description } = req.body;
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        if (blog.user.toString() !== req.user) return res.status(401).json({ message: 'Not authorized' });

        blog.title = title || blog.title;
        blog.description = description || blog.description;

        await blog.save();
        res.status(200).json(blog);
    } catch (error) {
        res.status(400).json({ message: 'Error updating blog' });
    }
});

router.delete('/blogs/:id', authMiddleware, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        if (blog.user.toString() !== req.user) return res.status(401).json({ message: 'Not authorized' });

        await blog.remove();
        res.status(200).json({ message: 'Blog removed' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting blog' });
    }
});


module.exports = router;
