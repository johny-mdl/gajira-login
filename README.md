# Jira Transition

## Usage
An example workflow to transition a Jira issue:

```yaml
on:
  pull_request:
    types: [opened, reopened]

permissions:
  pull-requests: read
  contents: read

jobs:
  transition-jira-ticket:
    runs-on: [ self-hosted, linux ]
    steps:
      - name: Transition Jira Ticket
        uses: johny-mdl/gajira-login@integrateAllActions
        env:
            JIRA_BASE_URL: ${{ secrets.JIRA_BASE_URL }}
            JIRA_USER_EMAIL: ${{ secrets.JIRA_USER_EMAIL }}
            JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}
        with:
          transition: "In review"
```


----
## Action Spec:

### Enviroment variables
- `JIRA_BASE_URL` - URL of Jira instance. Example: `https://<yourdomain>.atlassian.net`
- `JIRA_API_TOKEN` - **Access Token** for Authorization. Example: `HXe8DGg1iJd2AopzyxkFB7F2` ([How To](https://confluence.atlassian.com/cloud/api-tokens-938839638.html))
- `JIRA_USER_EMAIL` - email of the user for which **Access Token** was created for . Example: `human@example.com`

### Arguments
- None

### Inputs
- `transition` - Case insensetive name of transition to apply. Example: `Cancel` or `Accept`
- `transitionId` - transition id to apply to an issue


## Build project
After changing code in the project and before pushing we must build the project with the command: 

```ncc build -m --license licenses.txt```