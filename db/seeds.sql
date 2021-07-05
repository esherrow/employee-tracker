INSERT INTO departments(name)
VALUES
    ('Engineering'), ('Training'),('Marketing'),('Human Resources');

INSERT INTO roles(title, salary, department_id)
VALUES
    ('Engineer', 65000, 1),
    ('Senior Engineer', 75000, 1),
    ('Supervising Engineer', 90000, 1),
    ('Trainer', 65000, 2),
    ('Training Coordinator', 70000, 2),
    ('NPMG', 50000, 3),
    ('Project Manager', 62000, 3),
    ('Generalist', 40000, 4),
    ('HR Manager', 55000, 4),
    ('HR Director', 100000, 4);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES
    ('Barbara', 'Gorden', 10, NULL),
    ('Anthony', 'Stark', 3, NULL),
    ('Lou', 'Fox', 3, NULL),
    ('Bruce', 'Wayne', 5, NULL),
    ('Charles', 'Xavier', 5, NULL),
    ('Steven', 'Rogers', 7, NULL),
    ('Tim', 'Drake', 4, 4),
    ('Scott', 'Lang', 2, 2),
    ('Peter','Parker',1,8);