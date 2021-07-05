const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/employees', (req,res)=>{
    const sql = `SELECT employees.first_name, employees.last_name,  roles.title, roles.salary, departments.name FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id`;

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

router.post('/employee', ({body}, res)=>{
    const sql = `INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
    const params = [body.first_name, body.last_name, body.role_id, manager_id];

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

router.put('/employee/:id', (req,res)=>{
    const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
    const params = [req.body.role_id, req.params.id];

    db.query(sql, params, (err, result)=>{
        if(err){
            res.status(400).json({error:err.message});
            return;
        } else if(!result.affectedRows){
            res.json({
                message:'Employee not found'
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

router.delete('/employee/:id', (req,res)=>{
    const sql = `DELETE FROM employees WHERE id = ?`;

    db.query(sql, req.params.id, (err, result)=>{
        if(err){
            res.status(400).json({error:err.message});
            return;
        } else if(!result.affectedRows){
            res.json({
                message:'Employee not found'
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