const express = require('express');
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars');
const session = require('express-session');
const { User, Collection, Task } = require('./models');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', './views');

//parsing form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public'));


app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware untuk memeriksa sesi pengguna
function checkAuth(req, res, next) {
    console.log('Checking authentication...');
    if (req.session.user) {
        console.log('User is authenticated');
        next();
    } else {
        console.log('User is not authenticated');
        res.redirect('/');
    }
}

app.get('/', (req, res) => {
    console.log('Rendering login page');
    res.render('login', { title: 'Login' });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`Attempting login for user: ${email}`);

    try {
        const user = await User.findOne({ where: { email, password } });
        console.log('User found:', user);

        if (user) {
            console.log('Login successful');
            req.session.user = user;
            res.json({ message: 'Login successful!' });
        } else {
            console.log('Invalid email or password');
            res.json({ message: 'Invalid email or password.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    console.log(`Attempting registration for user: ${email}`);

    try {
        const user = await User.create({ email, password });
        console.log('Registration successful:', user);
        res.json({ message: 'Registration successful!', user });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

app.get('/add-data', checkAuth, (req, res) => {
    console.log('Rendering addData page');
    res.render('addData', { title: 'Add Data' });
});

app.post('/add-collection', checkAuth, async (req, res) => {
    const { name } = req.body;
    const user_id = req.session.user.id;
    console.log(`Adding collection: ${name} for user ID: ${user_id}`);

    try {
        const collection = await Collection.create({ name, user_id });
        console.log('Collection added successfully:', collection);
        res.json({ message: 'Collection added successfully!', collection });
    } catch (error) {
        console.error('Error adding collection:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

app.post('/add-task', checkAuth, async (req, res) => {
    const { name, collections_id } = req.body;
    console.log(`Adding task: ${name} to collection ID: ${collections_id}`);

    try {
        const task = await Task.create({ name, is_done: false, collections_id });
        console.log('Task added successfully:', task);
        res.json({ message: 'Task added successfully!', task });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

app.get('/collections', checkAuth, async (req, res) => {
    console.log('Fetching collections for user:', req.session.user.id);

    try {
        const collections = await Collection.findAll({ where: { user_id: req.session.user.id }, raw: true });
        console.log('Collections fetched:', collections);
        res.render('collections', { title: 'Collections', collections });
    } catch (error) {
        console.error('Error fetching collections:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
app.get('/collections/:id/tasks', checkAuth, async (req, res) => {
    const collectionId = req.params.id;
    console.log('Fetching tasks for collection:', collectionId);

    try {
        const tasks = await Task.findAll({ where: { collections_id: collectionId }, raw: true });
        console.log('Tasks fetched:', tasks);
        res.render('tasks', { title: 'Tasks', tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Rute untuk menampilkan formulir edit koleksi
app.get('/collections/:id/edit', checkAuth, async (req, res) => {
    const collectionId = req.params.id;
    console.log('Fetching collection for editing:', collectionId);

    try {
        const collection = await Collection.findOne({ where: { id: collectionId, user_id: req.session.user.id }, raw: true });
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found.' });
        }
        console.log('Collection fetched for editing:', collection);
        res.render('editCollection', { title: 'Edit Collection', collection });
    } catch (error) {
        console.error('Error fetching collection:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Rute untuk memperbarui koleksi
app.post('/collections/:id/edit', checkAuth, async (req, res) => {
    const collectionId = req.params.id;
    const { name } = req.body;
    console.log(`Updating collection: ${collectionId} with name: ${name}`);

    try {
        const collection = await Collection.findOne({ where: { id: collectionId, user_id: req.session.user.id } });
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found.' });
        }

        collection.name = name; // Pastikan name tidak null
        await collection.save();
        console.log('Collection updated successfully:', collection);
        res.redirect('/collections');
    } catch (error) {
        console.error('Error updating collection:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Rute untuk memperbarui is_done pada task
app.post('/tasks/:id/toggle', checkAuth, async (req, res) => {
    const taskId = req.params.id;
    console.log(`Toggling is_done for task: ${taskId}`);

    try {
        const task = await Task.findOne({ where: { id: taskId }, raw: false });
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        task.is_done = !task.is_done; // Toggle nilai is_done
        await task.save();
        console.log('Task updated successfully:', task);
        res.redirect('back'); // Redirect to the previous page
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Rute untuk menghapus koleksi
app.post('/collections/:id/delete', checkAuth, async (req, res) => {
    const collectionId = req.params.id;
    console.log(`Deleting collection: ${collectionId}`);

    try {
        const collection = await Collection.findOne({ where: { id: collectionId, user_id: req.session.user.id } });
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found.' });
        }

        await collection.destroy();
        console.log('Collection deleted successfully');
        res.redirect('/collections');
    } catch (error) {
        console.error('Error deleting collection:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Rute untuk menghapus tugas
app.post('/tasks/:id/delete', checkAuth, async (req, res) => {
    const taskId = req.params.id;
    console.log(`Deleting task: ${taskId}`);

    try {
        const task = await Task.findOne({ where: { id: taskId } });
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        await task.destroy();
        console.log('Task deleted successfully');
        res.redirect('back'); // Redirect to the previous page
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
