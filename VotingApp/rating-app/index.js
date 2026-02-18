const express = require('express');
const { Pool } = require('pg');
const app = express();

const pool = new Pool({
    host: process.env.DB_HOST || 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'voting'
});

app.get('/results', async (req, res) => {
    const totalRes = await pool.query('SELECT COUNT(*) FROM votes');
    const total = parseInt(totalRes.rows[0].count || 0);

    const javaRes = await pool.query("SELECT COUNT(*) FROM votes WHERE option_name='Java'");
    const cppRes = await pool.query("SELECT COUNT(*) FROM votes WHERE option_name='C++'");

    const javaVotes = parseInt(javaRes.rows[0].count || 0);
    const cppVotes = parseInt(cppRes.rows[0].count || 0);

    res.json({
        totalVotes: total,
        results: [
            { option: 'Java', votes: javaVotes, rate: total ? ((javaVotes/total)*100).toFixed(2) + '%' : '0%' },
            { option: 'C++', votes: cppVotes, rate: total ? ((cppVotes/total)*100).toFixed(2) + '%' : '0%' }
        ]
    });
});

app.listen(4000, () => console.log('Rating app running on port 4000'));
