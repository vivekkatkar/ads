import mysql from 'mysql2'


const db = mysql.createPool({
    host : "localhost",
    database : "Exam",
    user: "root",
    password: "vivek@987"
})


export default db