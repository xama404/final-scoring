const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('final', 'postgres', 'sengok123', {
    host: 'localhost',
    dialect: 'postgres',
});

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'users',
    timestamps: false,
});

const Collection = sequelize.define('Collection', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'collections_tbs',
    timestamps: false,
});

const Task = sequelize.define('Task', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_done: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    collections_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'task_tbs',
    timestamps: false,
});

// Relasi
User.hasMany(Collection, { foreignKey: 'user_id' });
Collection.belongsTo(User, { foreignKey: 'user_id' });

Collection.hasMany(Task, { foreignKey: 'collections_id' });
Task.belongsTo(Collection, { foreignKey: 'collections_id' });

sequelize.sync();

module.exports = { sequelize, User, Collection, Task };
