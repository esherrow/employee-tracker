const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/roles', (req,res)=>{
    const sql = `SELECT*FROM roles LEFT JOIN departments ON roles.department_id = departments.id`;

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

router.post('/role', ({body}, res)=>{
    const sql = `INSERT INTO roles(title, salary, department_id) VALUES (?,?,?)`;
    const params = [body.title, body.salary, body.department_id];

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

router.put('/role/:id', (req,res)=>{
    const sql = `UPDATE roles SET salary = ? WHERE id = ?`;
    const params = [req.body.salary, req.params.id];

    db.query(sql, params, (err, result)=>{
        if(err){
            res.status(400).json({error:err.message});
            return;
        } else if(!result.affectedRows){
            res.json({
                message:'Role not found'
            })
        }else{
            res.json({
                message:'success',
                data:req.body,
                changes: result.affectedRows
            })
        };
    });
});

router.delete('/role/:id', (req,res)=>{
    const sql = `DELETE FROM roles WHERE id = ?`;

    db.query(sql, req.params.id, (err, result)=>{
        if(err){
            res.status(400).json({error:err.message});
            return;
        } else if(!result.affectedRows){
            res.json({
                message:'Role not found'
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