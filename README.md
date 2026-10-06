# AI Automation Agent

An interactive workflow-automation demo for exploring triggers, actions, review steps, and sample outputs. It helps explain how a workflow could be organized before connecting real services.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20App-2ea44f?style=for-the-badge)](https://ai-automation-agent-phi.vercel.app/)

## What this demo does

The browser-based demo lets you choose a sample trigger, select an action, enter example text, and preview the result. It includes a local activity list and setup guidance for common integration patterns.

### Available in the demo

- Create and run a sample workflow in the current browser
- Preview a reply draft, text summary, priority suggestion, or handoff
- Review demo activity stored locally in the browser
- Read setup guidance for Email, Slack, Notion, and REST API examples
- Switch between dark and light themes

### Try it

1. Open the [live demo](https://ai-automation-agent-phi.vercel.app/).
2. Scroll to **Workflow builder**.
3. Select a trigger and action, then run the sample.
4. Inspect the preview and the local activity row.

## Demo limits and safety

This version is an interactive front-end demonstration. It does not call an AI model, connect to an external account, send email, change cloud resources, or perform background automation. Sample summaries and classifications use simple browser-side rules and are not factual or operational decisions. Activity and preferences are stored only in the current browser.

Real integrations need a server-side implementation, provider credentials, scoped permissions, and human review before external actions.

## Project structure

- `index.html` — accessible single-page interface
- `styles.css` — responsive styling and dark/light themes
- `app.js` — local workflow simulation and browser-only activity state

## Run locally

Serve this directory with any static HTTP server, or deploy it to Vercel. No build step or package installation is needed.

## Related project

[Multi Cloud Platform](https://multi-cloud-platform.vercel.app/) is a separate cloud-resource dashboard project; it is not this workflow demo.

## Author

Built by [Kalyan](https://github.com/kalyan870).

Feedback and suggestions are welcome.
