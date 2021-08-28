'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const Conf = require('conf');
const {
  generateConfigFull,
  generateConfigEssential,
  fileMap
} = require('./data.js');

module.exports = class extends Generator {
  initializing()
  {
    this.log(`${chalk.black.bgWhite("WELCOME")} to creating unity packages interface`);
    this.log(`${chalk.black.bgWhite("INFO:")} initial configuration might be long, but you may save config by the end`);

    this.conf = new Conf();
  }
  async prompting() {
    if (!this.fs.exists(this.destinationPath("packages-lock.json")) || !this.fs.exists(this.destinationPath("manifest.json")))
    { 
      this.log(`${chalk.bgRed("ERROR:")} Change directory to Packages folder inside your unity project`);
      throw new Error();
    }

    this.userPreset = this.conf.get('UserPreset');

    const confinguration = (await this.prompt({
      type: "list",
      name: "conf",
      message: "Select configuration",
      choices: [...this.userPreset != null ? [this.userPreset.name] : [], "Full", "Essential only", "Configure"],
      default: "Full"
    })).conf;

    this.presetUsed = confinguration == this.userPreset.name;

    // Essential inputs
    this.answers = await this.prompt([
    {
      type: "input",
      name: "name",
      message: "Your package name",
      default: this.presetUsed ? this.userPreset.conf.name : "com.example-company.example-package" // TODO
    },
    {
      type: "input",
      name: "version",
      message: "Your package version",
      default: "1.0.0"
    },
    {
      type: "input",
      name: "displayName",
      message: "Your package displaName (name in UnityEditor)",
      default: "Example Package" // TODO
    },
    {
      type: "input",
      name: "description",
      message: "Your package description",
      default: ""
    },
    {
      type: "input",
      name: "unity",
      message: "Your package unity version",
      default: this.presetUsed ? this.userPreset.conf.unity : "2019.4" // TODO
    }]);

    if (this.userPreset != null && this.presetUsed)
    {
      this.answers = {...this.userPreset.conf, ...this.answers};

      this.composeWith(require.resolve('generator-license'), {
        defaultLicense: 'MIT',  
      });
      return;
    }

    this.answers = {...this.answers, ...await this.prompt({
      type: "confirm",
      name: "fullPackageJsonConfig",
      message: "Do you want to fill all pacakge.json properties? (type, author, keywords)",
      default: true,
    })};

    // configure package.json
    if (this.answers.fullPackageJsonConfig)
    {
      this.answers = {...this.answers, ...await this.prompt([
        {
          type: "list",
          name: "type",
          message: "Select package type",
          choices: ["tests", "sample", "template", "module", "library", "tool"],
        },
        {
          type: "input",
          name: "unityRelease",
          message: "Your Unity release (example: 0b4)",
        },
        {
          type: "input",
          name: "author.name",
          message: "Package author name",
          default: "Jon Doe"
        },
        {
          type: "input",
          name: "author.email",
          message: "Package author email",
          default: "john.doe@example.com"
        },
        {
          type: "input",
          name: "author.url",
          message: "Package author url",
          default: "https://example.com"
        },
        {
          type: "input",
          name: "keywords",
          message: "Enter keyword separated with comma",
          default: "example, new, default"
        },
        {
          type: "confirm",
          name: "hideInEditor",
          message: "Hide package in Editor?",
          default: false,
        }
      ])};

      this.answers.keywords = this.answers.keywords.split(",").map(s => s.trim());
    }

    if (confinguration == "Full")
    {
      this.answers = {...this.answers, ...generateConfigFull};
    }
    else if (confinguration == "Essential only")
    {
      this.answers = {...this.answers, ...generateConfigEssential};
    }
    else
    {
      const files = await this.prompt({
        type: "checkbox",
        name: "filesConf",
        message: "Do you want to generate this folders and files?",
        choices: [
          { "name": "Accompanying files (CHANGELOG, README, DOCUMENTATION)", value: "accompanyingFiles", checked: true},
          { "name": "Runtime scripts folder", value: "runtime", checked: true},
          { "name": "Editor scripts folder", value: "editor", checked: true},
          { "name": "Test scripts folder", value: "tests", checked: false},
        ]
      });

      for (const key of ["accompanyingFiles", "runtime", "editor", "tests"])
      {
        this.answers[key] = files.filesConf.includes(key);
      }

      if (this.answers.accompanyingFiles)
      {
        this.answers = {...this.answers, ...await this.prompt({
          type: "confirm",
          name: "textInAccompanyingFiles",
          message: "Do you want to generate template text in accompanying files?",
          default: true,
        })};
      }

      if ((this.answers.runtime != null && this.answers.runtime) ||
        (this.answers.editor != null && this.answers.editor) ||
        (this.answers.tests != null && this.answers.tests) )
      {
        this.answers = {...this.answers, ...await this.prompt({
          type: "confirm",
          name: "exampleCode",
          message: "Do you want to generate example scripts?",
          default: true,
        })};
      }

      this.answers = {...this.answers, ...await this.prompt({
        type: "confirm",
        name: "samples",
        message: "Do you want to generate package sample?",
        default: true,
      })};

    }

    if (this.answers.license != null && this.answers.license)
    {
      this.answers = {...this.answers, ...await this.prompt({
      type: "confirm",
      name: "license",
      message: "Do you want to generate license?",
      default: true,
    })};
  }

    if (this.answers.license)
    {
      this.composeWith(require.resolve('generator-license'), {
        licensePrompt: 'Which license do you want to use?',
      });
    }

  }

  async configuring() {

    this.destinationRoot(this.answers.displayName);
  }

  __buildPackageObject()
  {
    let pack = {};
    for (const key of [
      "name",
      "version",
      "displayName",
      "description",
      "type",
      "unity",
      "author",
      "keywords"
    ])
    {
      pack[key] = this.answers[key];
    }

    if (this.answers.samples)
    {
      pack.samples = [
        {
          displayName: "Example Sample",
          description: "Contains Sample assets for template",
          path: "Samples~/ExampleSample"
        }
      ]
    }

    return pack;
  }

  async writing() {
    this.fs.writeJSON(this.destinationPath("package.json"), this.__buildPackageObject());

    for (const key of ["accompanyingFiles", "runtime", "editor", "tests", "samples"]) {
      if (this.answers[key] != null && this.answers[key])
      {
        fileMap[key].forEach(element => {
          this.fs.copyTpl(
            this.templatePath(element),
            this.destinationPath(element),
            this.answers
          );
        });
      }
    }
    
    if (this.answers.exampleCode)
    {
      for (const key of ["runtime", "editor", "tests"]) {
        if (this.answers[key] != null && this.answers[key])
        {
          fileMap.exampleCode[key].forEach(element => {
            this.fs.copyTpl(
              this.templatePath(element),
              this.destinationPath(element),
              this.answers
            );
          });
        }
      }
    }

    // raplace all ejs like filenames
    for (const key of fileMap.templateFilenames)
    {
      if (this.fs.exists(this.destinationPath(key)))
      {
        this.fs.move(this.destinationPath(key), this.destinationPath(key).replace("<%= name %>", this.answers.name)); // TODO
      }
    }


    // crutch for license generator
    this.destinationRoot(".");

    if (!this.presetUsed && (await this.prompt({
      type: "confirm",
      name: "save",
      message: "Do you want to save this configurations?",
      default: true,
    })).save)
    {
      if (this.userPreset != null && !(await this.prompt({
        type: "confirm",
        name: "override",
        message: `Do you override "${this.userPreset.name}"?`,
        default: false,
      })).override)
      {
        return;
      }

      const saveName = (await this.prompt({
        type: "input",
        name: "saveName",
        message: "Choose name for your preset",
        default: "MyPreset"
      })).saveName;
      

      this.conf.set('UserPreset', {
        name: saveName,
        conf: this.answers
      });
    }
  }


  end()
  {
    this.log(`${chalk.black.bgWhite("CONGRATULATIONS!")} ${this.answers.displayName} is successfully created!`);
    this.log("if you have wishes and suggestions please contact generator author at stasiandr@gmail.com");
  }

};
