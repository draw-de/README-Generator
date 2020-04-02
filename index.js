const fs = require("fs");
const inquirer = require("inquirer");
const util = require("util");
const axios = require("axios");

const writeFileAsync = util.promisify(fs.writeFile);

inquirer
  .prompt([
    {
      type: "input",
      name: "github",
      message: "Enter your GitHub username."
    }
  ])
  .then(function(git) {
    const githubURL = `https://api.github.com/users/${git.github}`;

    axios({
      method: "get",
      url: githubURL
    }).then(function(obj) {
      function promptUser() {
        return inquirer.prompt([
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
        ]);
      }

      function generateREADME(answers) {
        if (answers.license === "None") {
          return `# ${answers.title} 
![alt text](${obj.data.avatar_url} "${obj.data.login}'s Avatar Picture")

## Description
${answers.description}

## Installation
${answers.installation}

## Usage
${answers.usage}

## Issues
If there's any issues with the application, please contact [${obj.data.login}](${obj.data.html_url}) or make an issue ticket`;
        } else {
          return `# ${answers.title}
![alt text](${obj.data.avatar_url} "${obj.data.login}'s Avatar Picture")

## Description
${answers.description}

## Installation
${answers.installation}

## Usage
${answers.usage}

## Issues
If there's any issues with the application, please contact [${obj.data.login}](${obj.data.html_url}) or make an issue ticket

###### ${answers.license}`;
        }
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
    });
  });
