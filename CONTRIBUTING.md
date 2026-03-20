# Contributing to CAConnect

First off, thank you for considering contributing to CAConnect. It's people like you that make this tool such a great platform.

## 1. Where do I go from here?

If you've noticed a bug or have a feature request, make sure to check our **Issues** tab to ensure someone else hasn't already opened one. If not, go ahead and open a new Issue!

## 2. Fork & create a branch

If this is something you think you can fix, then fork CAConnect and create a branch with a descriptive name.

## 3. Implementation Guidelines

- Ensure any new microservices are registered with the Eureka Server and routed appropriately via the API Gateway.
- Use Docker to test your changes locally to ensure there are no configuration drift issues.
- If introducing new Environment Variables, document them in the `README.md` and ensure a fallback is provided in `docker-compose.yml`.

## 4. Make a Pull Request

At this point, you should switch back to the main repository and make a Pull Request. Provide a detailed summary of your changes and why they were necessary. We will review it as soon as possible.
