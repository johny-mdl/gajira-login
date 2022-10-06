const _ = require('lodash')
const Jira = require('./common/net/Jira')

const issueIdRegEx = /([a-zA-Z0-9]+-[0-9]+)/g

module.exports = class {
  constructor ({ githubEvent, argv, config }) {
    this.Jira = new Jira({
      baseUrl: config.baseUrl,
      token: config.token,
      email: config.email,
    })

    this.config = config
    this.argv = argv
    this.githubEvent = githubEvent
  }

  async execute () {
    const myself = await this.Jira.getMyself()

    console.log(`Logged in as: ${myself.name}`)

    const foundIssue = await this.findIssueKeyIn('LPMSNEXT-359')

    if (!foundIssue) return

    console.log(`Detected issueKey: ${foundIssue.issue}`)

    const { argv } = this
    const { transitions } = await this.Jira.getIssueTransitions(foundIssue.issue)

    const transitionToApply = _.find(transitions, (t) => {
      if (t.id === argv.transitionId) return true
      if (t.name.toLowerCase() === argv.transition.toLowerCase()) return true
    })

    if (!transitionToApply) {
      console.log('Please specify transition name or transition id.')
      console.log('Possible transitions:')
      transitions.forEach((t) => {
        console.log(`{ id: ${t.id}, name: ${t.name} } transitions issue to '${t.to.name}' status.`)
      })
    }
  }

  async findIssueKeyIn (searchStr) {
    const match = searchStr.match(issueIdRegEx)

    console.log(`Searching in string: \n ${searchStr}`)

    if (!match) {
      console.log(`String does not contain issueKeys`)

      return
    }

    for (const issueKey of match) {
      console.log(`Found key is: \n ${issueKey}`)
      const issue = await this.Jira.getIssue(issueKey)

      if (issue) {
        return { issue: issue.key }
      }
    }
  }
}
