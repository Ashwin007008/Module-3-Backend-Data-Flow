# Domain Rules & Workflows: Encode Constraints as Service-Layer Guards

## Story & Problem Statement
`posts-api` is a small layered Express app where people create posts, comment on them, and vote. The routing, controllers, validators, and repositories are wired and working. But the **service layer is empty where the product rules should be** - the rules that turn a generic CRUD app into a real product.

Three of those rules are stubbed out and currently throw `501 Not Implemented`. Your job is to encode them as **service-layer guards that throw `AppError`**, and to express one multi-step process as an **ordered workflow** with all checks before any write. Identity is already provided at `req.userId` (from the `x-user-id` header stand-in), so never read a user id from `req.body`.

---

## What You Need to Build
All work happens in the three files under `services/`. Do not change the routes, controllers, validators, or repositories.

### 1. `services/postsService.js` -> `editPost(postId, userId, changes)`
A post may only be edited by its author, and only within 24 hours of creation. Guard in this order, throwing before any write:
1. Post must exist -> `AppError('Post not found', 404)`
2. Only the author may edit -> `AppError('You can only edit your own post', 403)`
3. Within the 24h window (`Date.now() - post.createdAt <= EDIT_WINDOW_MS`) -> else `AppError('Post can no longer be edited', 403)`
Then `return repo.update(postId, changes)`.

### 2. `services/votesService.js` -> `castVote(postId, userId)`
A user may vote on a post at most once.
1. Post must exist -> `AppError('Post not found', 404)`
2. No existing vote by this user -> else `AppError('You have already voted on this post', 409)`
Then `return votesRepo.insert(postId, userId)`.

### 3. `services/commentsService.js` -> `addComment(postId, userId, body)` (the workflow)
Adding a comment is a multi-step workflow. Run **all checks first, then the writes in order**:
1. Post must exist -> `AppError('Post not found', 404)`
2. Post must not be locked -> `AppError('Post is locked for new comments', 409)`
3. Insert the comment with `commentsRepo.insert({ postId, authorId: userId, body })`
4. Bump the post counter with `postsRepo.incrementCommentCount(postId)`
5. Return the created comment

No write may happen before both checks pass.

---

## Rules of the Game
*   Every rule lives in the **service**, never in a route or controller.
*   A failed rule must `throw new AppError(message, status)` - never call `res` from a service.
*   In a workflow, **all guards run before any write**, so the app never reaches a half-finished state.
*   Identity comes from `req.userId`. Do not trust a user id from the request body.

---

## How to Run & Test
1. `npm install`
2. `npm start`
3. Exercise with `curl` (the `-H "x-user-id: N"` header sets who you are):
   ```bash
   # Edit your own fresh post (200 OK)
   curl -X PATCH http://localhost:3000/posts/1 -H "Content-Type: application/json" -H "x-user-id: 1" -d "{\"title\":\"Edited\"}"

   # Edit a post that is too old (403)
   curl -X PATCH http://localhost:3000/posts/2 -H "Content-Type: application/json" -H "x-user-id: 2" -d "{\"title\":\"Too late\"}"

   # Edit a post you do not own (403)
   curl -X PATCH http://localhost:3000/posts/1 -H "Content-Type: application/json" -H "x-user-id: 9" -d "{\"title\":\"Not mine\"}"

   # Vote once (201), then vote again (409)
   curl -X POST http://localhost:3000/posts/1/votes -H "x-user-id: 5"
   curl -X POST http://localhost:3000/posts/1/votes -H "x-user-id: 5"

   # Comment on an open post (201), then on the locked post (409)
   curl -X POST http://localhost:3000/posts/1/comments -H "Content-Type: application/json" -H "x-user-id: 5" -d "{\"body\":\"Nice!\"}"
   curl -X POST http://localhost:3000/posts/3/comments -H "Content-Type: application/json" -H "x-user-id: 5" -d "{\"body\":\"Hello?\"}"
   ```

---

## Submission
Clone the starter, implement the three service files, and push to **your own** repository. Open a pull request and **submit the PR link**.

In your PR description, for **each** rule write one sentence explaining it and one sentence on **what would break without it** (for example: "Without the one-vote guard, a user could refresh and inflate a post's score indefinitely.").

Your submission is reviewed by an AI evaluator checking that:
*   `editPost` enforces existence, ownership, and the 24h window with the correct statuses.
*   `castVote` enforces one vote per user with a 409 on the duplicate.
*   `addComment` runs both checks before any write and updates the comment count.
*   All rules `throw AppError` and live in the service layer (no `res` in services, no rules in routes/controllers).
*   The PR description explains each rule and the failure it prevents.
