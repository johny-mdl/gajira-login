/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 574:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Jira = __nccwpck_require__(747)

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

    return this.config
  }
}


/***/ }),

/***/ 747:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { get } = __nccwpck_require__(655)

const serviceName = 'jira'
const { format } = __nccwpck_require__(310)
const client = __nccwpck_require__(596)(serviceName)

class Jira {
  constructor ({ baseUrl, token, email }) {
    this.baseUrl = baseUrl
    this.token = token
    this.email = email
  }

  async getMyself () {
    return this.fetch('getMyself',
      { pathname: '/rest/api/2/myself' }, {
        method: 'GET',
      })
  }

  async createIssue (body) {
    return this.fetch('createIssue',
      { pathname: '/rest/api/2/issue' },
      { method: 'POST', body })
  }

  async getIssue (issueId, query = {}) {
    const { fields = [], expand = [] } = query

    try {
      return this.fetch('getIssue', {
        pathname: `/rest/api/2/issue/${issueId}`,
        query: {
          fields: fields.join(','),
          expand: expand.join(','),
        },
      })
    } catch (error) {
      if (get(error, 'res.status') === 404) {
        return
      }

      throw error
    }
  }

  async getIssueTransitions (issueId) {
    return this.fetch('getIssueTransitions', {
      pathname: `/rest/api/2/issue/${issueId}/transitions`,
    }, {
      method: 'GET',
    })
  }

  async transitionIssue (issueId, data) {
    return this.fetch('transitionIssue', {
      pathname: `/rest/api/3/issue/${issueId}/transitions`,
    }, {
      method: 'POST',
      body: data,
    })
  }

  async fetch (apiMethodName,
    { host, pathname, query },
    { method, body, headers = {} } = {}) {
    const url = format({
      host: host || this.baseUrl,
      pathname,
      query,
    })

    if (!method) {
      method = 'GET'
    }

    if (headers['Content-Type'] === undefined) {
      headers['Content-Type'] = 'application/json'
    }

    if (headers.Authorization === undefined) {
      headers.Authorization = `Basic ${Buffer.from(`${this.email}:${this.token}`).toString('base64')}`
    }

    // strong check for undefined
    // cause body variable can be 'false' boolean value
    if (body && headers['Content-Type'] === 'application/json') {
      body = JSON.stringify(body)
    }

    const state = {
      req: {
        method,
        headers,
        body,
        url,
      },
    }

    try {
      await client(state, `${serviceName}:${apiMethodName}`)
    } catch (error) {
      const fields = {
        originError: error,
        source: 'jira',
      }

      delete state.req.headers

      throw Object.assign(
        new Error('Jira API error'),
        state,
        fields
      )
    }

    return state.res.body
  }
}

module.exports = Jira


/***/ }),

/***/ 596:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const fetch = __nccwpck_require__(161)

module.exports = serviceName => async (state, apiMethod = 'unknown') => {
  const response = await fetch(state.req.url, state.req)

  state.res = {
    headers: response.headers.raw(),
    status: response.status,
  }

  state.res.body = await response.text()

  const isJSON = (response.headers.get('content-type') || '').includes('application/json')

  if (isJSON && state.res.body) {
    state.res.body = JSON.parse(state.res.body)
  }

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return state
}


/***/ }),

/***/ 655:
/***/ ((module) => {

module.exports = eval("require")("lodash");


/***/ }),

/***/ 161:
/***/ ((module) => {

module.exports = eval("require")("node-fetch");


/***/ }),

/***/ 24:
/***/ ((module) => {

module.exports = eval("require")("yaml");


/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 17:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 310:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const fs = __nccwpck_require__(147)
const path = __nccwpck_require__(17)
const YAML = __nccwpck_require__(24)

const cliConfigPath = `${process.env.HOME}/.jira.d/config.yml`
const cliCredentialsPath = `${process.env.HOME}/.jira.d/credentials`
const configPath = `${process.env.HOME}/jira/config.yml`

const Action = __nccwpck_require__(574)

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

    const result = await new Action({
      githubEvent,
      argv: {},
      config,
    }).execute()

    if (result) {
      const extendedConfig = Object.assign({}, config, result)

      if (!fs.existsSync(configPath)) {
        fs.mkdirSync(path.dirname(configPath), { recursive: true })
      }

      fs.writeFileSync(configPath, YAML.stringify(extendedConfig))

      if (!fs.existsSync(cliConfigPath)) {
        fs.mkdirSync(path.dirname(cliConfigPath), { recursive: true })
      }

      fs.writeFileSync(cliConfigPath, YAML.stringify({
        endpoint: result.baseUrl,
        login: result.email,
      }))

      fs.writeFileSync(cliCredentialsPath, `JIRA_API_TOKEN=${result.token}`)

      return
    }

    console.log('Failed to login.')
    process.exit(78)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

exec()

})();

module.exports = __webpack_exports__;
/******/ })()
;