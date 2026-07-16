# Project Artifact - API Design Best Practices

Your frontend team has started a new ritual.

Every time they open this API, they guess first.

- Is listing posts `GET /getPosts` or something else?
- Will create return raw JSON, `{ post }`, or `{ ok: true }`?
- If a route fails, will it send a useful error or a mini server autopsy?
- If a list has more results, how is client supposed to know?

Nothing is fully broken. That is what makes this dangerous. The API works just enough to survive, while quietly teaching every client a different rule.

Your task is to refactor this API so it stops feeling like a collection of handlers and starts feeling like a real backend contract.

## Starter Repo

Use starter repo here:
[Backend Web Development - API Design Best Practices](https://github.com/kalviumcommunity/Backend-Web-Development/tree/main/Module%203/API%20Design%20Best%20Practices)

Submit **Pull Request link** after refactor.

## Keep These Capabilities Working

- list posts
- fetch one post
- create one post
- like one post
- expose one safe internal-failure route for demo/testing

Keep in-memory store. Do not add DB.

## What Your Refactor Should Achieve

1. Public API uses **noun-based resource routes**.
2. Route naming becomes **predictable and consistent**.
3. Success responses use **consistent envelope design**.
4. Missing-resource and internal-failure responses use **consistent error design**.
5. Public errors **do not leak** stack traces, fake DB errors, or implementation details.
6. List endpoint returns **pagination metadata**.
7. Client-supplied `limit` is **capped server-side**.
8. Old verb routes are no longer public contract.

## Where You Will Likely Work

- `src/routes/`
- `src/controllers/`
- `src/services/`
- `src/utils/`
- `src/data/`
- `src/app.js`

## Submission

Submit **PR link**.

## Reminder

This is not rename-only cleanup. Think about:
- what is resource
- what URI should express
- what success shape client should learn once
- what error details belong in response vs logs
- what list metadata client needs to continue safely
