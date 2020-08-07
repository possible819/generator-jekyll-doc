const Generator = require('yeoman-generator')
const chalk = require('chalk')
const path = require('path')
const moment = require('moment')

module.exports = class extends Generator {
  info

  constructor(args, opts) {
    super(args, opts)

    this.askContinue = async (action) => {
      const { isContinue } = await this.prompt({
        type: 'confirm',
        name: 'isContinue',
        message: `Do you want to continue to ${action}?`,
      })

      return isContinue
    }

    this.validators = {
      required: (answer) => {
        if (!answer) {
          return `It's required value`
        } else {
          return true
        }
      },
    }
  }

  async promptMetaInfo() {
    const { path, subDir, fileName, title, summary } = await this.prompt([
      {
        type: 'input',
        name: 'path',
        message: `Where is your ${chalk.greenBright('posting directory')}?`,
        default: '_posts',
        validate: this.validators.required,
      },
      {
        type: 'input',
        name: 'subDir',
        message: `Where is ${chalk.greenBright('sub directory')} of this post?`,
        validate: this.validators.required,
      },
      {
        type: 'input',
        name: 'fileName',
        message: `What would be good for ${chalk.greenBright(
          'file name'
        )} of this post?`,
        validate: this.validators.required,
      },
      {
        type: 'input',
        name: 'title',
        message: `What is ${chalk.greenBright('title')} of this post?`,
        validate: this.validators.required,
      },
      {
        type: 'input',
        name: 'summary',
        message: `Please ${chalk.greenBright(
          'describe'
        )} this post, it will be shown list of posting page`,
        validate: this.validators.required,
      },
    ])

    this.info = {
      path,
      subDir: subDir || '',
      fileName: fileName.match(/.md$/g) ? fileName : `${fileName}.md`,
      title,
      summary,
    }
  }

  async promptTags() {
    let tags = []

    do {
      const { tag } = await this.prompt({
        type: 'input',
        name: 'tag',
        message: `Add related ${chalk.greenBright('tag')} with this post`,
      })

      if (tag) {
        if (tags.indexOf(tag) >= 0) {
          this.log(chalk.redBright('Duplicated'))
          continue
        } else {
          tags.push(tag)
        }
      }

      this.log(chalk.blueBright('Your current tags are below'))
      this.log(chalk.greenBright(tags.join(', ')))
    } while (await this.askContinue('add tags'))

    this.info.tags = tags
  }

  async promptIndexes() {
    let indexes = []

    do {
      const { id, display } = await this.prompt([
        {
          type: 'input',
          name: 'id',
          message: `${chalk.greenBright('ID')} of index No. ${
            indexes.length + 1
          }`,
          validate: this.validators.required,
        },
        {
          type: 'input',
          name: 'display',
          message: `${chalk.greenBright('Name')} of index No. ${
            indexes.length + 1
          }`,
          validate: this.validators.required,
        },
      ])

      if (id && display) {
        if (indexes.find((idx) => idx.id === id)) {
          this.log(chalk.redBright(`ID (${id}) is duplicated`))
          continue
        }

        if (indexes.find((idx) => idx.display === display)) {
          this.log(chalk.redBright(`Name (${display}) is duplicated`))
          continue
        }

        indexes.push({ id, display })
      }

      this.log(chalk.blueBright('Your current indexes are below'))
      this.log(
        chalk.greenBright(
          indexes.reduce((displayIndexes, index, idx) => {
            displayIndexes += '\n'
            displayIndexes += `${idx + 1}. ${index.display} (${index.id})`
            return displayIndexes
          }, '')
        )
      )
    } while (await this.askContinue('add index'))

    this.info.indexes = indexes
  }

  async showingGivenInfo() {
    this.log(chalk.greenBright(`Information of new Posting`))
    console.log(`
        Path: ${this.info.path}
        Sub directory path: ${this.info.subDir}
        File name: ${this.info.fileName}
        Title: ${this.info.title}
        Summary: 
            ${this.info.summary}

        Tags: ${this.info.tags.join(', ')}
        Indexes:
            ${this.info.indexes.reduce((displayIndexes, index, idx) => {
              displayIndexes += '\n'
              displayIndexes += `${idx + 1}. ${index.display} (${index.id})`
              return displayIndexes
            }, '')}
    `)

    if (
      !(await this.askContinue('create new posting with given information?'))
    ) {
      process.exit()
    }
  }

  writing() {
    console.log(this.info.indexes)

    this.fs.copyTpl(
      this.templatePath('post-template.md'),
      this.destinationPath(
        path.resolve(
          this.info.path,
          this.info.subDir,
          `${moment().format('YYYY-MM-DD')}-${this.info.fileName}`
        )
      ),
      { ...this.info, date: moment().format('YYYY-MM-DD hh:mm:ss ZZ') }
    )
  }
}
