const core = require('@actions/core')

const Action = require('./action')

// eslint-disable-next-line import/no-dynamic-require
const githubEvent = require(process.env.GITHUB_EVENT_PATH)

async function exec () {
  try {
    if (!process.env.JIRA_BASE_URL) throw new Error('Please specify JIRA_BASE_URL env')
    if (!process.env.JIRA_API_TOKEN) throw new Error('Please specify JIRA_API_TOKEN env')
    if (!process.env.JIRA_USER_EMAIL) throw new Error('Please specify JIRA_USER_EMAIL env')

    const config = {
      baseUrl: process.env.JIRA_BASE_URL,
      token: process.env.JIRA_API_TOKEN,
      email: process.env.JIRA_USER_EMAIL,
    }

    await new Action({
      githubEvent,
      argv: parseArgs(),
      config,
    }).execute()

    return
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

function parseArgs () {
  const transition = core.getInput('transition')
  const transitionId = core.getInput('transitionId')

  // if (!transition && !transitionId) {
  //   // Either transition _or_ transitionId _must_ be provided
  //   throw new Error('Error: please specify either a transition or transitionId')
  // }

  return {
    transition,
    transitionId,
  }
}

exec()
