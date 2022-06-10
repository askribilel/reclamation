const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../utils/connect-to-database')


class Reclamation extends Model {}

Reclamation.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    fix_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reference_tt: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    client: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reclamation_date: {
        type: DataTypes.DATE
    },
    description: {
        type: DataTypes.TEXT
    },
    offer: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.TEXT
    },
    state_date: {
        type: DataTypes.DATE
    },
    governorate: {
        type: DataTypes.STRING
    },
    central: {
        type: DataTypes.STRING
    },
    verification_date: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    modelName: 'reclamation',
    timestamps: true
});

module.exports = Reclamation;
