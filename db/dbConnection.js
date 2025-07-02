const mongoose = require('mongoose')


async function dbConnect() {
    mongoose.connect('mongodb://localhost:27017/apiAuth')
        .then(() => console.log('Base conectada'))
        .catch(error => console.log(error))
}

module.exports = dbConnect