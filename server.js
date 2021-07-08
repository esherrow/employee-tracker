const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'C0ff33&c4t5',
    database: 'tracker_db'
    },
    console.log('Connected to Employee Tracker')
);

app.use(express.urlencoded({ extended: false}));
app.use(express.json());


//CatchAll
app.use((req, res)=>{
    res.status(404).end();
});

db.connect(err => {
    if(err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

function viewAllDept (){
    const sql = `SELECT*FROM departments`;

    db.query(sql, (err, rows)=>{
        if(err) throw err;
        console.table(rows);
    });    
    userAction();
};
function addDept(){
    return inquirer.prompt([
        {
            type:'input', 
            name: 'deptName',
            message: 'What is the name of the department to add?'
        }
    ]).then(newDept=>{
        const sql = `INSERT INTO departments(name) VALUES (?)`;
        const params = newDept.deptName;

        db.query(sql, params, (err, result)=>{
            if(err) throw err;
            console.log(`\n ${newDept.deptName} has been added.`)
            });
        userAction();
    });
};

function deleteDept(){
    db.query(`SELECT*FROM departments`, (err, res)=>{
        if(err) throw err;
        const departmentList = res.map(departments => ({name:departments.name, value:departments.id}));
        return inquirer.prompt([
            {
                type:'list',
                name:'department',
                message:'What department do you wish to remove?',
                choices: departmentList
            }
        ]).then(delDept=>{
            const sql = `DELETE FROM departments WHERE id = ?`;
            const params = delDept.department
            db.query(sql, params, (err, result)=>{
                if(err) throw err;
                console.log(`nDepartment Removed\n`)
            });
            userAction();
        })
    })
};

function viewAllRoles(){
    const sql = `SELECT*FROM roles LEFT JOIN departments ON roles.department_id = departments.id`;

    db.query(sql, (err, rows)=>{
        if(err){
            res.status(500).json({error:err.message});
            return;
        }
        console.table(rows);
        });
    userAction();
};
function addRoles(){
    db.query(`SELECT*FROM departments`, (err, res)=>{
        if(err) throw err;
        const departmentList = res.map(departments => ({name:departments.name, value:departments.id}));
        return inquirer.prompt([
            {
                type:'input',
                name:'title',
                message:'What is the name of the role to add?'
            },{
                type: 'number',
                name:'salary',
                message:'What is the associated salary for this role?'
            },{
                type:'list',
                name:'department',
                message:'What department does the role fall under?',
                choices: departmentList
            }
        ]).then(newRole=>{
            const sql = `INSERT INTO roles(title, salary, department_id) VALUES (?,?,?)`;
            const params = [newRole.title, newRole.salary, newRole.department];

            db.query(sql, params, (err, result)=>{
                if(err) throw err;
                console.log(`n${newRole.title} has been added.`);
            });
            userAction();
        })
    })    
};
// function updateSalary(){
//     const sql = `UPDATE roles SET salary = ? WHERE id = ?`;
//     const params = [req.body.salary, req.params.id];

//     db.query(sql, params, (err, result)=>{
//         if(err){
//             res.status(400).json({error:err.message});
//             return;
//         } else if(!result.affectedRows){
//             res.json({
//                 message:'Role not found'
//             })
//         }else{
//             res.json({
//                 message:'success',
//                 data:req.body,
//                 changes: result.affectedRows
//             })
//         };
//     });
//     userAction();
// };
// function deleteRoles(){
//     const sql = `DELETE FROM roles WHERE id = ?`;

//     db.query(sql, req.params.id, (err, result)=>{
//         if(err){
//             res.status(400).json({error:err.message});
//             return;
//         } else if(!result.affectedRows){
//             res.json({
//                 message:'Role not found'
//             })
//         }else{
//             res.json({
//                 message:'deleted',
//                 changes: result.affectedRows,
//                 id: req.params.id
//             })
//         };
//     });
//     userAction();
// };

function viewAllEmployees(){
    const sql = `SELECT employees.first_name, employees.last_name,  roles.title, roles.salary, departments.name FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id`;

    db.query(sql, (err, rows)=>{
        if(err){
            res.status(500).json({error:err.message});
            return;
        }
        console.table(rows);
    });
    userAction();    
};
function addEmployees(){
    db.query(`SELECT*FROM roles`, (err, res)=>{
        if(err) throw err;
        const roleList= res.map(roles => ({name:roles.title, value:roles.id}));
        db.query(`SELECT*FROM employees`, (err, res)=>{
            if(err) throw err;
            const managerList = res.map(employees => ({name: employees.first_name+' '+employees.last_name, value:employees.id}));
            return inquirer.prompt([
                {
                    type:'input',
                    name:'first_name',
                    message:"What is the employee's first name?"
                },{
                    type:'input',
                    name:'last_name',
                    message:"What is the employee's last name?"
                },{
                    type:'list',
                    name:'role',
                    message:"What is the employee's role?",
                    choices:roleList
                },{
                    type:'list',
                    name:'manager',
                    message:'Who will the employee report to?',
                    choices:managerList
                }
            ]).then(newEmployee=>{
                const sql = `INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
                const params = [newEmployee.first_name, newEmployee.last_name, newEmployee.role, newEmployee.manager];

                db.query(sql, params, (err, result)=>{
                    if(err) throw err;
                    console.log(`${newEmployee,first_name} ${newEmployee.last_name} has been added.`)
                });
                userAction();
            })        
        })
    })
};
// function updateRoles(){
//     const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
//     const params = [req.body.role_id, req.params.id];

//     db.query(sql, params, (err, result)=>{
//         if(err){
//             res.status(400).json({error:err.message});
//             return;
//         } else if(!result.affectedRows){
//             res.json({
//                 message:'Employee not found'
//             })
//         }else{
//             res.json({
//                 message:'success',
//                 data:req.body,
//                 changes: result.affectedRows
//             })
//         };
//     });
//     userAction();   
// };
// function deleteEmployee(){
//     const sql = `DELETE FROM employees WHERE id = ?`;

//     db.query(sql, req.params.id, (err, result)=>{
//         if(err){
//             res.status(400).json({error:err.message});
//             return;
//         } else if(!result.affectedRows){
//             res.json({
//                 message:'Employee not found'
//             })
//         }else{
//             res.json({
//                 message:'deleted',
//                 changes: result.affectedRows,
//                 id: req.params.id
//             })
//         };
//     });
//     userAction();
// };

function userAction() {
    return inquirer.prompt([
        {
        type:'list',
        name:'options',
        message:'What would you like to do?  To Exit: Use Ctrl+C',
        choices:['View All Departments','View All Roles','View All Employees', 
        'Add A Department','Add A Role','Add An Employee',
        'Delete A Department','Delete A Role','Delete An Employee',
        'Update A Salary','Update An Employee Role']
        }
    ]).then(actions=>{
        switch(actions.options){
            case 'View All Departments':
                console.log(actions);
                viewAllDept();
                break;
            case "View All Roles":
                console.log(actions);
                viewAllRoles();
                break;
            case "View All Employees":
                console.log(actions);
                viewAllEmployees();
                break;
            case "Add A Department":
                console.log(actions);
                addDept();
                break;
            case "Add A Role":
                console.log(actions);
                addRoles();
                break;
            case "Add An Employee":
                console.log(actions);
                addEmployees();
                break;
            case "Delete A Department":
                console.log(actions);
                deleteDept();
                break;
            // case "Delete A Role":
            //     console.log(actions);
            //     deleteRoles();
            //     break;
            // case "Delete An Employee":
            //     console.log(actions);
            //     deleteEmployee();
            //     break;
            case "Update A Salary":
                console.log(actions);
                updateSalary();
                break;
            case "Update An Employee Role":
                console.log(actions);
                updateRoles();
                break;
        }})
};
userAction();