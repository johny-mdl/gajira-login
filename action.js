const _ = require('lodash')
const Jira = require('./common/net/Jira')

const issueIdRegEx = /([a-zA-Z0-9]+-[0-9]+)/g

const transitionsStates = [
  {
    action: 'reopened',
    transition: 'in review',
  },
  {
    action: 'opened',
    transition: 'in review',
  },
  {
    action: 'closed',
    transition: 'done',
  }]

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
    await this.login()
    const issueId = await this.findIssue()

    if (!issueId) return

    return this.transition(issueId)
  }

  async login () {
    const myself = await this.Jira.getMyself()

    console.log(`Logged in as: ${myself.name}`)
  }

  async findIssue () {
    const foundIssue = await this.findIssueKeyIn(this.githubEvent.pull_request.head.ref)

    if (!foundIssue) return

    console.log(`Detected issueKey: ${foundIssue.issue}`)

    return foundIssue.issue
  }

  async transition (issueId) {
    const { argv } = this
    const { transitions } = await this.Jira.getIssueTransitions(issueId)

    const transitionName = argv.transition ? argv.transition : this.smartTransition()

    const transitionToApply = _.find(transitions, (t) => {
      if (t.id === argv.transitionId) return true
      if (t.name.toLowerCase() === transitionName.toLowerCase()) return true
    })

    if (!transitionToApply) {
      console.log('Please specify transition name or transition id.')
      console.log('Possible transitions:')
      transitions.forEach((t) => {
        console.log(`{ id: ${t.id}, name: ${t.name} } transitions issue to '${t.to.name}' status.`)
      })

      return
    }

    console.log(`Selected transition:${JSON.stringify(transitionToApply, null, 4)}`)

    await this.Jira.transitionIssue(issueId, {
      transition: {
        id: transitionToApply.id,
      },
    })

    const transitionedIssue = await this.Jira.getIssue(issueId)

    // console.log(`transitionedIssue:${JSON.stringify(transitionedIssue, null, 4)}`)
    console.log(`Changed ${issueId} status to : ${_.get(transitionedIssue, 'fields.status.name')} .`)
    console.log(`Link to issue: ${this.config.baseUrl}/browse/${issueId}`)

    return {}
  }

  smartTransition () {
    const pullRequestAction = this.githubEvent.action.toLowerCase()

    return transitionsStates.find(t => t.action === pullRequestAction).transition
  }

  async findIssueKeyIn (searchStr) {
    const match = searchStr.match(issueIdRegEx)

    console.log(`Searching in string: \n ${searchStr}`)

    if (!match) {
      console.log(`String does not contain issueKeys. No transition will be done!`)

      return
    }

    for (const issueKey of match) {
      const issue = await this.Jira.getIssue(issueKey)

      if (issue) {
        return { issue: issue.key }
      }
    }
  }
}
