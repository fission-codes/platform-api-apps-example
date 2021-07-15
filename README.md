# Platform API for Apps Example

[![Built by FISSION](https://img.shields.io/badge/⌘-Built_by_FISSION-purple.svg)](https://fission.codes)
[![Built by FISSION](https://img.shields.io/badge/webnative-v0.25.2-purple.svg )](https://github.com/fission-suite/webnative)
[![Discord](https://img.shields.io/discord/478735028319158273.svg)](https://discord.gg/zAQBDEq)
[![Discourse](https://img.shields.io/discourse/https/talk.fission.codes/topics)](https://talk.fission.codes)

The repository demonstrates the webnative platform API for publishing apps. The API includes four methods:

- `webnative.apps.index`: List all of your apps and their associated domain names
- `webnative.apps.create`: Create a new app, assign an initial subdomain, and set an asset placeholder
- `webnative.apps.publish`: Publish a new app version
- `webnative.apps.deleteByDomain`: Destroy an app by domain name

Please see the [Platform API for Apps](https://talk.fission.codes/t/platform-api-for-apps/2019) post and the [Platform APIs guide](https://guide.fission.codes/developers/webnative/platform) for more details.

## Try it

This example is live at: https://awesome-thin-nylon-dolphin.fission.app

## Run

Run [http-server](https://www.npmjs.com/package/http-server) or another simple web server in the root of this project. No build or package installation needed.
