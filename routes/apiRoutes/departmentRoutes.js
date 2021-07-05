const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/departments', (req,res)=>{
    const sql = `SELECT*FROM departments`;

    db.query(sql, (err, rows)=>{
        if(err){
            res.status(500).json({error:err.message});
            return;
        }
        res.json({
            message:'success',
            data:rows
        });
    });
});

router.post('/department', ({body}, res)=>{
    const sql = `INSERT INTO departments(name) VALUES (?)`;
    const params = [body.name];

    db.query(sql, params, (err, result)=>{
        if(err){
            res.status(400).json({error:err.message});
            return;
        }
        res.json({
            message:'success',
            data:body
        });
    });
});

router.delete('/department/:id', (req,res)=>{
    const sql = `DELETE FROM departments WHERE id = ?`;

    db.query(sql, req.params.id, (err, result)=>{
        if(err){
            res.status(400).json({error:err.message});
            return;
        } else if(!result.affectedRows){
            res.json({
                message:'Department not found'
            })
        }else{
            res.json({
                message:'deleted',
                changes: result.affectedRows,
                id: req.params.id
            })
        };
    });
});

module.exports = router;