USE employeeTrackerDB

INSERT INTO department (department_name)
VALUES
    ('Business'), 
    ('IT'), 
    ('Web Technology'), 
    ('Data'),  
    ('Delivery');


INSERT INTO roles (title, salary, department_id)
VALUES 
    ('Team Lead', 170000, 1),
    ('Software Engineer', 150000, 2),
    ('Contractor', 140000, 3),
    ('Database Admin', 130000, 4),
    ('Devops', 120000, 5),
    ('Test Engineer', 80000, 1),
    ('Automation Engineer', 120000, 2);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Hanna', 'Kaplan', 1, 1),
('Ava', 'Peyman', 2, 1),
('John', 'Davis', 3, 1),
('Mike', 'Lewis', 4, NULL),
('Amelia', 'Green', 5, NULL),
('Amber', 'White', 6, 2),
('Aras', 'Johnson', 7, 2);


