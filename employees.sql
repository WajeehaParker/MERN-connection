create database employees;

use employees;

create table employee(
	id int primary key auto_increment,
    username varchar(100) unique,
    name varchar(100),
    password varchar(100),
    gender varchar(10),
    department varchar(50)
);

insert into employee (username, name, password, gender, department) values('RamshaMalik', 'Ramsha', 'ramsha', 'female', 'IT');

drop procedure if exists employee_data;
DELIMITER $$
CREATE PROCEDURE employee_data(id int)
BEGIN        
SELECT * FROM employee e WHERE e.id =id;
END$$ 
DELIMITER ;

call employee_data(1);

drop procedure if exists employees_data;
DELIMITER $$
CREATE PROCEDURE employees_data()
BEGIN  
SELECT * FROM employee;
END$$ 
DELIMITER ;

call employees_data();