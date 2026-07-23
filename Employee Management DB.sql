-- ============================================================
-- Employee Management System — Phase 2: Database
-- MySQL schema creation + seed data
-- ============================================================

-- ------------------------------------------------------------
-- 0. Database
-- ------------------------------------------------------------
DROP DATABASE IF EXISTS employee_management;
CREATE DATABASE employee_management
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE employee_management;

-- ------------------------------------------------------------
-- 1. Users  (login / authentication)
-- ------------------------------------------------------------
CREATE TABLE Users (
    Id            INT AUTO_INCREMENT PRIMARY KEY,
    Username      VARCHAR(50)  NOT NULL UNIQUE,
    Email         VARCHAR(150) NOT NULL UNIQUE,
    PasswordHash  VARCHAR(255) NOT NULL,          -- store a BCrypt hash from the API, never plain text
    Role          ENUM('Admin', 'HR', 'Employee') NOT NULL DEFAULT 'Employee',
    CreatedAt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                  ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 2. Departments
-- ------------------------------------------------------------
CREATE TABLE Departments (
    Id            INT AUTO_INCREMENT PRIMARY KEY,
    Name          VARCHAR(100) NOT NULL UNIQUE,
    Description   VARCHAR(255),
    CreatedAt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 3. Employees
-- ------------------------------------------------------------
CREATE TABLE Employees (
    Id             INT AUTO_INCREMENT PRIMARY KEY,
    FirstName      VARCHAR(50)  NOT NULL,
    LastName       VARCHAR(50)  NOT NULL,
    Email          VARCHAR(150) NOT NULL UNIQUE,
    Phone          VARCHAR(20),
    DepartmentId   INT,
    Position       VARCHAR(100),
    Salary         DECIMAL(12,2) NOT NULL DEFAULT 0.00 CHECK (Salary >= 0),
    HireDate       DATE NOT NULL,
    IsActive       TINYINT(1) NOT NULL DEFAULT 1,
    CreatedAt      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                   ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_employee_department
        FOREIGN KEY (DepartmentId) REFERENCES Departments(Id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_employees_department ON Employees(DepartmentId);
CREATE INDEX idx_employees_name       ON Employees(LastName, FirstName);

-- ------------------------------------------------------------
-- 4. Attendance
-- ------------------------------------------------------------
CREATE TABLE Attendance (
    Id           INT AUTO_INCREMENT PRIMARY KEY,
    EmployeeId   INT NOT NULL,
    Date         DATE NOT NULL,
    CheckIn      TIME,
    CheckOut     TIME,
    Status       ENUM('Present', 'Absent', 'Late', 'HalfDay', 'Leave') NOT NULL DEFAULT 'Present',
    CreatedAt    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attendance_employee
        FOREIGN KEY (EmployeeId) REFERENCES Employees(Id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT uq_attendance_employee_date UNIQUE (EmployeeId, Date)
) ENGINE=InnoDB;

CREATE INDEX idx_attendance_date ON Attendance(Date);

-- ------------------------------------------------------------
-- 5. Salary  (historical pay records; Employees.Salary holds the current value)
-- ------------------------------------------------------------
CREATE TABLE Salary (
    Id             INT AUTO_INCREMENT PRIMARY KEY,
    EmployeeId     INT NOT NULL,
    BaseSalary     DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    Bonus          DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    Deductions     DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    EffectiveDate  DATE NOT NULL,
    CreatedAt      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_salary_employee
        FOREIGN KEY (EmployeeId) REFERENCES Employees(Id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_salary_employee ON Salary(EmployeeId);


-- ============================================================
-- SEED DATA
-- ============================================================

-- ------------------------------------------------------------
-- Users
-- NOTE: PasswordHash values below are placeholders only.
-- Generate real BCrypt hashes from the API (e.g. BCrypt.HashPassword("password"))
-- and replace these before using the accounts for real login.
-- ------------------------------------------------------------
INSERT INTO Users (Username, Email, PasswordHash, Role) VALUES
('admin',   'admin@company.com',   '$2a$11$PLACEHOLDERHASH000000000000000000000000000000000000', 'Admin'),
('hr.jane', 'jane.hr@company.com', '$2a$11$PLACEHOLDERHASH000000000000000000000000000000000001', 'HR');

-- ------------------------------------------------------------
-- Departments
-- ------------------------------------------------------------
INSERT INTO Departments (Name, Description) VALUES
('Engineering', 'Software development and technical operations'),
('Human Resources', 'Recruitment, onboarding, and employee relations'),
('Sales', 'Business development and client acquisition'),
('Marketing', 'Brand, content, and campaign management'),
('Finance', 'Accounting, payroll, and financial planning');

-- ------------------------------------------------------------
-- Employees
-- ------------------------------------------------------------
INSERT INTO Employees (FirstName, LastName, Email, Phone, DepartmentId, Position, Salary, HireDate, IsActive) VALUES
('Rohan',  'Deshmukh', 'rohan.deshmukh@company.com', '9876543210', 1, 'Software Engineer',     650000.00, '2023-03-15', 1),
('Priya',  'Sharma',   'priya.sharma@company.com',   '9876543211', 1, 'Senior Software Engineer', 950000.00, '2021-07-01', 1),
('Ananya', 'Iyer',     'ananya.iyer@company.com',    '9876543212', 2, 'HR Executive',          480000.00, '2022-11-20', 1),
('Vikram', 'Nair',     'vikram.nair@company.com',    '9876543213', 3, 'Sales Manager',         720000.00, '2020-05-10', 1),
('Sneha',  'Kulkarni', 'sneha.kulkarni@company.com', '9876543214', 4, 'Marketing Specialist',  550000.00, '2023-01-09', 1),
('Arjun',  'Rao',      'arjun.rao@company.com',      '9876543215', 5, 'Financial Analyst',     600000.00, '2022-06-18', 1),
('Kavya',  'Menon',    'kavya.menon@company.com',    '9876543216', 1, 'QA Engineer',           580000.00, '2023-09-01', 1);

-- ------------------------------------------------------------
-- Attendance (sample week for employee IDs 1–3)
-- ------------------------------------------------------------
INSERT INTO Attendance (EmployeeId, Date, CheckIn, CheckOut, Status) VALUES
(1, '2026-07-20', '09:02:00', '18:05:00', 'Present'),
(1, '2026-07-21', '09:15:00', '18:00:00', 'Late'),
(2, '2026-07-20', '08:55:00', '17:50:00', 'Present'),
(2, '2026-07-21', NULL,       NULL,       'Leave'),
(3, '2026-07-20', '09:00:00', '13:00:00', 'HalfDay'),
(3, '2026-07-21', '09:05:00', '18:10:00', 'Present');

-- ------------------------------------------------------------
-- Salary (initial pay record per employee, matching Employees.Salary)
-- ------------------------------------------------------------
INSERT INTO Salary (EmployeeId, BaseSalary, Bonus, Deductions, EffectiveDate) VALUES
(1, 650000.00, 20000.00, 5000.00, '2023-03-15'),
(2, 950000.00, 40000.00, 8000.00, '2021-07-01'),
(3, 480000.00, 10000.00, 3000.00, '2022-11-20'),
(4, 720000.00, 30000.00, 6000.00, '2020-05-10'),
(5, 550000.00, 15000.00, 4000.00, '2023-01-09'),
(6, 600000.00, 18000.00, 4500.00, '2022-06-18'),
(7, 580000.00, 12000.00, 3500.00, '2023-09-01');

-- ============================================================
-- Quick sanity checks (optional — run after seeding)
-- ============================================================
SELECT e.Id, e.FirstName, e.LastName, d.Name AS Department, e.Salary
FROM Employees e LEFT JOIN Departments d ON e.DepartmentId = d.Id;
--
SELECT * FROM Attendance ORDER BY Date, EmployeeId;
SELECT * FROM Employees