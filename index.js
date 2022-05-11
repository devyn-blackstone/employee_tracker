// pull packages being used to main file
const inquirer = require("inquirer");
const mysql = require("mysql2");
const { printTable } = require("console-table-printer");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "employee_db",
  },
  console.log("connected to employee_db"),
  options()
);

function options() {
  // list of all the quetions - using the prompt feature from inquirer
  inquirer
    .prompt([
      {
        type: "list",
        message: "Make a selection:",
        name: "Options",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
        ],
      },
    ])
    .then((select) => {
      if (select.Options === "view all departments") {
        viewDepartments();
      } else if (select.Options === "view all roles") {
        viewRoles();
      } else if (select.Options === "view all employees") {
        viewEmployees();
      } else if (select.Options === "add a department") {
        addDepartment();
      } else if (select.Options === "add a role") {
        addRole();
      } else if (select.Options === "add an employee") {
        addEmployee();
      } else {
        updateEmployee();
      }
    });
}

function viewDepartments() {
  db.query("SELECT * FROM department", (err, data) => {
    printTable(data);
    options();
  });
}

function viewRoles() {
  db.query("SELECT * FROM role", (err, data) => {
    printTable(data);
    options();
  });
}

function viewEmployees() {
  db.query("SELECT * FROM employee", (err, data) => {
    printTable(data);
    options();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What department do you want to add?",
        name: "Department",
      },
    ])
    .then((response) => {
      db.query(
        `INSERT INTO department (name) VALUES ('${response.Department}')`,
        (err, data) => {
          viewDepartments();
        }
      );
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Name of new role:",
        name: "RoleName",
      },
      {
        type: "input",
        message: "Salary of new role:",
        name: "RoleSalary",
      },
      {
        type: "input",
        message: "Name of department that role is in:",
        name: "RoleDepartment",
      },
    ])
    .then((response) => {
      db.query(
        `INSERT INTO role (title, salary, departments_id) VALUES ('${response.RoleName}', '${response.RoleSalary}', ${response.RoleDepartment})`,
        (err, data) => {
          viewRoles();
        }
      );
    });
}

function addEmployee() {}

function updateEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the employee id that you'd like to update?",
        name: "employeeID",
      },
      {
        type: "input",
        message: "What is the employees new role id",
        name: "employeeRole",
      },
    ])
    .then((response) => {
      db.query(
        `UPDATE employee SET role_id = ${response.employeeRole} WHERE id = ${response.employeeID}`
      ),
        (err, data) => {
          viewEmployees();
        };
    });
}
