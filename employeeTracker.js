// Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// Connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employeeTrackerDB",
});

connection.connect((err) => {
  if (err) throw err;
  runApp();
});

//RUN APP function
const runApp = () => {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: ["Add Data", "View Data", "Update Data"],
    })
    .then((answer) => {
      switch (answer.action) {
        case "Add Data":
          addData();
          break;
        case "View Data":
          viewData();
          break;
        case "Update Data":
          updateData();
          break;
        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

//ADD department function
const adddepartment = () => {
  inquirer
    .prompt({
      name: "name",
      type: "input",
      message: "What is the name of the department? ",

      validate: (departmentNameInput) => {
        // Check that user entered a string
        if (departmentNameInput) {
          return true;
        } else {
          console.log("Enter a department name: ");
        }
      },
    })
    .then((answer) => {
      const query = "INSERT INTO department SET ?";
      connection.query(query, { department_name: answer.name }, (err, res) => {
        runApp();
      });
    });
};

//ADD Role function
const addRoles = () => {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What is the name of the roles? ",
      },
      {
        name: "salary",
        type: "input",
        message: "Enter the salary for the roles? ",
      },
      {
        name: "departmentID",
        type: "input",
        message: "Which department does the roles belong to? ",
      },
    ])
    .then((answer) => {
      const query = "INSERT INTO roles SET ?";
      connection.query(
        query,
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.departmentID,
        },
        (err, res) => {
          if (err) throw err;
          runApp();
        }
      );
    });
};

// ADD Employee function
const addEmployee = () => {
  let manager, firstname, lastname, roles;
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "Please enter first name of employee: ",
        validate: (nameEntry) => {
          if (nameEntry) {
            return true;
          } else {
            console.log("Please enter employee first name!");
          }
        },
      },
      {
        name: "last_name",
        type: "input",
        message: "Please enter last name of employee: ",
        validate: (nameEntry) => {
          if (nameEntry) {
            return true;
          } else {
            console.log("Please enter employee last name!");
          }
        },
      },
    ])
    .then((answer) => {
      firstname = answer.first_name;
      lastname = answer.last_name;
      // GET the existing roles from table
      connection.query("SELECT * FROM roles", (err, results) => {
        if (err) throw err;
        inquirer
          .prompt([
            {
              name: "roles",
              type: "rawlist",
              choices() {
                const choiceArray = [];
                results.forEach(({ title }) => {
                  // save all roles titles to array
                  choiceArray.push(title);
                });
                return choiceArray;
              },
              message: "What is the new role for the the employee?",
            },
          ])
          .then((answer) => {
            results.forEach((item) => {
              if (item.title === answer.roles) {
                roles = item.id;
              }
            });
            connection.query("SELECT * FROM employee", (err, results) => {
              if (err) throw err;
              inquirer
                .prompt([
                  {
                    name: "manager",
                    type: "rawlist",
                    choices() {
                      const choiceArray = [];
                      results.forEach(({ first_name, last_name }) => {
                        choiceArray.push(first_name + " " + last_name);
                      });
                      choiceArray.push("None");
                      return choiceArray;
                    },
                    message: "What is the new manager for the employee?",
                  },
                ])
                .then((answer) => {
                  results.forEach((item) => {
                    if (item.last_name === answer.manager.split(" ")[1]) {
                      manager = item.id;
                    } else if (answer.manager === "None") {
                      // if employee has no manager
                      manager = null;
                    }
                  });
                  const query = "INSERT INTO employee SET ?";
                  connection.query(
                    query,
                    {
                      first_name: firstname,
                      last_name: lastname,
                      manager_id: manager,
                      role_id: roles,
                    },
                    (err, res) => {
                      if (err) throw err;
                      runApp();
                    }
                  );
                });
            });
          });
      });
    });
};

// ADD main fuction calls other add fuctions according to the choice
const addData = () => {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to create?",
      choices: ["department", "roles", "employee"],
    })
    .then((answer) => {
      switch (answer.action) {
        case "department":
          adddepartment();
          break;
        case "roles":
          addRoles();
          break;
        case "employee":
          addEmployee();
          break;
        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

// VIEW department
const viewDepartment = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    console.table(res);
    runApp();
  });
};

// VIEW Roles
const viewRoles = () => {
  connection.query("SELECT * FROM roles", (err, res) => {
    console.table(res);
    runApp();
  });
};

// VIEW employee
const viewEmployee = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    console.table(res);
    runApp();
  });
};

// VIEW main FUNCTION calls other add fuctions according to the choice
const viewData = () => {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to View?",
      choices: ["department", "roles", "employee"],
    })
    .then((answer) => {
      switch (answer.action) {
        case "department":
          viewDepartment();
          break;
        case "roles":
          viewRoles();
          break;
        case "employee":
          viewEmployee();
          break;
        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

// UPDATE Roles
const updateData = () => {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "Would you liketo update employee role?",
      choices: ["Y","N"],
    })
    .then((answer) => {
        switch (answer.action) {
            case "Y":
                updateRoles();
              break;
              case "N":
                runApp();
              break;
            default:
              console.log(`Invalid action: ${answer.action}`);
              break;
          }
    });
};

// UPDATE role function
const updateRoles = () => {
  let employeeID;
  let updatedRole;
  connection.query("SELECT * FROM employee", (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "employee",
          type: "rawlist",
          //give employee list options to update
          choices() {
            const choiceArray = [];
            results.forEach(({ first_name, last_name }) => {
              choiceArray.push(first_name + " " + last_name);
            });
            return choiceArray;
          },
          message: "Which employee would you like to update?",
        },
      ])
      .then((answer) => {
        results.forEach((employeeData) => {
          //if  we have a match for, selected users last name
          if (employeeData.last_name === answer.employee.split(" ")[1]) {
           // get employee ID
            employeeID = employeeData.id;
          }
        });
        connection.query("SELECT * FROM roles", (err, results) => {
          if (err) throw err;
          inquirer
            .prompt([
              {
                name: "updatedRoles",
                type: "rawlist",
                //Give all role options
                choices() {
                  const choiceArray = [];
                  results.forEach(({ title }) => {
                    choiceArray.push(title);
                  });
                  return choiceArray;
                },
                message: "What is the new roles for the selected employee?",
              },
            ])
            .then((answer) => {
              results.forEach((roles) => {
                if (roles.title === answer.updatedRoles) {
                  //get the new role
                  updatedRole = roles.id;
                }
              });
              var query = "UPDATE employee SET ? WHERE ?";
              connection.query(
                query,
                //UPDATE employee(table) SET role_id = updatedRole WHERE employee.id =employeeID 
                [{ role_id: updatedRole }, { id: employeeID }],
                (error) => {
                  if (error) throw err;
                  runApp();
                }
              );
            });
        });
      });
  });
};





