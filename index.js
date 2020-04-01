const fs = require("fs");
const inquirer = require("inquirer");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "github",
        message: "Enter your GitHub username."
      },
      {
        type: "input",
        name: "title",
        message: "Type in the title of your new project."
      },
      {
        type: "input",
        name: "description",
        message: "Type in your description of your project."
      },
      {
        type: "input",
        name: "installation",
        message: "Type in how to install your project."
      },
      {
        type: "input",
        name: "usage",
        message: "Explain how you would use the project."
      },
      {
        type: "list",
        name: "license",
        choices: [
          "Apache License 2.0",
          "GNU General Public License v3.0",
          "MIT License",
          "None"
        ]
      }
    ])
    .then(function(answers) {
      const githubURL = "https://api.github.com";
    });
}

function generateREADME(answers) {
  return `#${answers.title}

  ${answers.description}
  
  ${answers.installation}
  
  ${answers.usage}
  
  ######${answers.license}`;
}

promptUser()
  .then(function(answers) {
    const readme = generateREADME(answers);

    return writeFileAsync("README.md", readme);
  })
  .then(function() {
    console.log("Successfully wrote to README.md");
  })
  .catch(function(err) {
    console.log(err);
  });
