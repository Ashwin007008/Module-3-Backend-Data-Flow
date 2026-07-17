# Repository Pattern Assignment Starter

Small community-post API domain. Services currently access the in-memory store directly. Refactor this codebase behind a repository boundary.

## Student task

Create a repository exposing `findAll`, `findById`, `create`, `update`, and `remove`. Rewire services to use repository methods without changing controller behavior or service business rules.

Keep the store private to the repository. `findAll` must return a copy, IDs must be generated inside the repository, and missing records must use the documented return shapes.

No tests or platform instructions are included in this repository. Use the assignment brief and inspect the existing code to decide where each responsibility belongs.
