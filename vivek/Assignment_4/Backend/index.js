import express from 'express';
import cors from 'cors';
import db from './Database/db.js';

const app = express();

app.use(express.json());
app.use(cors());

db.query(`
    CREATE TABLE IF NOT EXISTS quizzes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        created_by VARCHAR(255) NOT NULL,
        code VARCHAR(6) UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT true,
        start_time DATETIME,
        end_time DATETIME,
        duration_minutes INT DEFAULT 30
    )
`);

db.query(`
    CREATE TABLE IF NOT EXISTS questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        quiz_id INT,
        question_text TEXT NOT NULL,
        options JSON NOT NULL,
        correct_answer INT NOT NULL,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
    )
`);

db.query(`
    CREATE TABLE IF NOT EXISTS participants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        quiz_id INT,
        prn VARCHAR(20) NOT NULL,
        score INT DEFAULT 0,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
    )
`);

db.query(`
    CREATE TABLE IF NOT EXISTS answers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        participant_id INT,
        question_id INT,
        selected_answer INT,
        FOREIGN KEY (participant_id) REFERENCES participants(id),
        FOREIGN KEY (question_id) REFERENCES questions(id)
    )
`);

app.post('/api/quizzes', async (req, res) => {
    try {
        const { title, questions, createdBy, durationMinutes, startTime } = req.body;
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const parsedStartTime = new Date(startTime);
        const endTime = new Date(parsedStartTime.getTime() + durationMinutes * 60000);

        const [result] = await db.promise().query(
            'INSERT INTO quizzes (title, created_by, code, start_time, end_time, duration_minutes) VALUES (?, ?, ?, ?, ?, ?)',
            [title, createdBy, code, parsedStartTime, endTime, durationMinutes]
        );

        for (const q of questions) {
            const optionsJson = JSON.stringify(q.options);
            await db.promise().query(
                'INSERT INTO questions (quiz_id, question_text, options, correct_answer) VALUES (?, ?, ?, ?)',
                [result.insertId, q.question, optionsJson, q.correctAnswer]
            );
        }

        res.status(201).json({ quizId: result.insertId, code, startTime: parsedStartTime, endTime });
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ error: 'Failed to create quiz' });
    }
});

app.put('/api/quizzes/:quizId/extend', async (req, res) => {
    try {
        const { additionalMinutes } = req.body;
        const [quiz] = await db.promise().query(
            'SELECT end_time FROM quizzes WHERE id = ?',
            [req.params.quizId]
        );

        if (!quiz.length) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        const currentEndTime = new Date(quiz[0].end_time);
        const newEndTime = new Date(currentEndTime.getTime() + additionalMinutes * 60000);

        await db.promise().query(
            'UPDATE quizzes SET end_time = ? WHERE id = ?',
            [newEndTime, req.params.quizId]
        );

        res.status(200).json({ newEndTime });
    } catch (error) {
        res.status(500).json({ error: 'Failed to extend quiz time' });
    }
});

app.get('/api/quizzes/:quizId/time', async (req, res) => {
    try {
        const [quiz] = await db.promise().query(
            'SELECT end_time, is_active FROM quizzes WHERE code = ?',
            [req.params.quizId]
        );

        if (!quiz.length) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        const now = new Date();
        const endTime = new Date(quiz[0].end_time);
        const timeRemaining = Math.max(0, endTime - now);
        const isActive = quiz[0].is_active && timeRemaining > 0;

        res.json({
            timeRemaining,
            isActive,
            endTime
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get quiz time' });
    }
});

app.post('/api/quizzes/join', async (req, res) => {
    try {
        const { code, prn } = req.body;
        
        const [quiz] = await db.promise().query(
            'SELECT id, is_active, end_time FROM quizzes WHERE code = ?',
            [code]
        );
    
        
        if (!quiz.length || !quiz[0].is_active || new Date() > new Date(quiz[0].end_time)) {
    
            return res.status(404).json({ error: 'Quiz not found or inactive' });
        }
        const [participant] = await db.promise().query(
            'SELECT prn from participants where prn = ? and quiz_id = ?', [prn, quiz[0].id]
        );
        
        if (participant.length > 0){
            return res.status(400).json("Participant has already joined the quiz")
        }
        const [result] = await db.promise().query(
            'INSERT INTO participants (quiz_id, prn) VALUES (?, ?)',
            [quiz[0].id, prn]
        );
        
        res.status(201).json("ok");
    } catch (error) {
        res.status(500).json({ error: 'Failed to join quiz' });
    }
});

app.post('/api/quizzes/:quizId/submit', async (req, res) => {
    try {
        const { prn, questionId, answer } = req.body;

        const [quiz] = await db.promise().query(
            'SELECT end_time, is_active FROM quizzes WHERE code = ?',
            [req.params.quizId]
        );
        
        if (!quiz.length || !quiz[0].is_active || new Date() > new Date(quiz[0].end_time)) {
            return res.status(403).json({ error: 'Quiz has ended or is inactive' });
        }

        const [participant] = await db.promise().query(
            'SELECT id FROM participants WHERE prn = ? AND quiz_id = (SELECT id FROM quizzes WHERE code = ?)',
            [prn, req.params.quizId]
        );

        if (!participant.length) {
            return res.status(404).json({ error: 'Participant not found' });
        }

        const [existingAnswer] = await db.promise().query(
            'SELECT id FROM answers WHERE participant_id = ? AND question_id = ?',
            [participant[0].id, questionId]
        );

        if (existingAnswer.length > 0) {
            return res.status(400).json({ error: 'Answer already submitted for this question' });
        }

        const [question] = await db.promise().query(
            'SELECT correct_answer FROM questions WHERE id = ?',
            [questionId]
        );

        await db.promise().query(
            'INSERT INTO answers (participant_id, question_id, selected_answer) VALUES (?, ?, ?)',
            [participant[0].id, questionId, answer]
        );

        if (question[0].correct_answer === answer) {
            await db.promise().query(
                'UPDATE participants SET score = score + 1 WHERE id = ?',
                [participant[0].id]
            );
        }

        const [updatedScore] = await db.promise().query(
            'SELECT score FROM participants WHERE id = ?',
            [participant[0].id]
        );

        res.json({ 
            success: true,
            score: updatedScore[0].score
        });
    } catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).json({ error: 'Failed to submit answer' });
    }
});

app.get('/api/quizzes/:quizId/participants/:prn/score', async (req, res) => {
    try {
        const { quizId, prn } = req.params;
        const [quiz_id] = await db.promise().query('SELECT id FROM quizzes WHERE code = ?', [quizId]);
  
        
        const [participant] = await db.promise().query(
            'SELECT score FROM participants WHERE quiz_id = ? AND prn = ?',
            [quiz_id[0].id, prn]
        );
    
        
        if (!participant.length) {
            return res.status(404).json({ error: 'Participant not found' });
        }

        res.json({ score: participant[0].score });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve participant score' });
    }
});

app.get('/api/quizzes/:code/questions', async (req, res) => {
    try {
        const [quiz] = await db.promise().query(
            'SELECT id FROM quizzes WHERE code = ?',
            [req.params.code]
        );

        if (!quiz.length) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        const [questions] = await db.promise().query(
            'SELECT id, question_text, options FROM questions WHERE quiz_id = ?',
            [quiz[0].id]
        );

        const formattedQuestions = questions.map(q => {
            try {
                return {
                    ...q,
                    options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
                };
            } catch (error) {
                return {
                    ...q,
                    options: q.options.split(',').map(opt => opt.trim())
                };
            }
        });

        res.json(formattedQuestions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Failed to load questions' });
    }
});

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
