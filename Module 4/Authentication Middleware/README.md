## Task

Implement `requireAuth` middleware in `src/middleware/requireAuth.js`.

The function currently calls `next()` unconditionally — all routes are unprotected. Your job is to make it:

1. Read the Bearer token from the `Authorization` header.
2. Return 401 if the token is missing or the scheme is wrong.
3. Call `jwt.verify` with the test secret and `algorithms: ['HS256']`.
4. Attach the verified payload to `req.user`.
5. Call `next()` on success.
6. Return 401 (same generic body) in the catch block for any failure.

## Setup

```bash
cp .env.example .env
npm install
npm start
```

## Test manually

```bash
# 1. Get a test token
curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"sub":"user-7"}' | jq .

# 2. Use the token (replace TOKEN)
curl -s -H "Authorization: Bearer TOKEN" http://localhost:3000/profile | jq .

# 3. No token → should return 401
curl -s http://localhost:3000/profile | jq .

# 4. Bad token → should return 401
curl -s -H "Authorization: Bearer not.a.valid.token" http://localhost:3000/profile | jq .
```

## Run tests

```bash
npm test
```

Tests check: missing token → 401, invalid token → 401, valid token → req.user set, protected route → 200.

## File to edit

```
src/middleware/requireAuth.js   ← implement here
```

Do not modify any other files.
