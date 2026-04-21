import dotenv from 'dotenv';
import sequelize from './src/config/db.js';
import './src/models/index.js';
import app from './app.js';

dotenv.config();
const PORT = process.env.PORT;

async function connectDb(){
    try{
        await sequelize.authenticate();
        console.log('Database connected')
    }catch(err){
        console.error(`Failed to connect to database`, err);
    }
}

connectDb();

app.listen(PORT, ()=> {
    console.log(`server is running on http://localhost:${PORT}`)
});

