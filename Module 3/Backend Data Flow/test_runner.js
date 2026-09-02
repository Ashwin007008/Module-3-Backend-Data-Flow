const postsService = require('./services/postsService');
const votesService = require('./services/votesService');
const commentsService = require('./services/commentsService');
const postsRepo = require('./repository/postsRepo');
const AppError = require('./utils/AppError');
const assert = require('assert');

async function test() {
  console.log('Testing editPost...');
  
  // 1. Post not found -> 404
  try {
    await postsService.editPost(999, 1, { title: 'Test' });
    assert.fail('Should have thrown 404');
  } catch (err) {
    assert.strictEqual(err.statusCode, 404);
    assert.strictEqual(err.message, 'Post not found');
  }

  // 2. Only author may edit -> 403
  try {
    await postsService.editPost(1, 2, { title: 'Test' });
    assert.fail('Should have thrown 403 author');
  } catch (err) {
    assert.strictEqual(err.statusCode, 403);
    assert.strictEqual(err.message, 'You can only edit your own post');
  }

  // 3. Post expired (>24h) -> 403
  try {
    await postsService.editPost(2, 2, { title: 'Test' });
    assert.fail('Should have thrown 403 edit window');
  } catch (err) {
    assert.strictEqual(err.statusCode, 403);
    assert.strictEqual(err.message, 'Post can no longer be edited');
  }

  // 4. Valid edit -> success
  const updatedPost = await postsService.editPost(1, 1, { title: 'New Title' });
  assert.strictEqual(updatedPost.title, 'New Title');
  console.log('editPost passed!');

  console.log('Testing castVote...');
  
  // 1. Post not found -> 404
  try {
    await votesService.castVote(999, 1);
    assert.fail('Should have thrown 404');
  } catch (err) {
    assert.strictEqual(err.statusCode, 404);
    assert.strictEqual(err.message, 'Post not found');
  }

  // 2. First vote -> success
  const vote = await votesService.castVote(1, 1);
  assert.strictEqual(vote.postId, 1);
  assert.strictEqual(vote.userId, 1);

  // 3. Duplicate vote -> 409
  try {
    await votesService.castVote(1, 1);
    assert.fail('Should have thrown 409');
  } catch (err) {
    assert.strictEqual(err.statusCode, 409);
    assert.strictEqual(err.message, 'You have already voted on this post');
  }
  console.log('castVote passed!');

  console.log('Testing addComment...');
  
  // 1. Post not found -> 404
  try {
    await commentsService.addComment(999, 1, 'Comment text');
    assert.fail('Should have thrown 404');
  } catch (err) {
    assert.strictEqual(err.statusCode, 404);
    assert.strictEqual(err.message, 'Post not found');
  }

  // 2. Post locked -> 409
  try {
    await commentsService.addComment(3, 1, 'Comment text');
    assert.fail('Should have thrown 409');
  } catch (err) {
    assert.strictEqual(err.statusCode, 409);
    assert.strictEqual(err.message, 'Post is locked for new comments');
  }

  // 3. Valid comment -> success & increment count
  const initialPost = await postsRepo.findById(1);
  const initialCount = initialPost.commentCount;

  const comment = await commentsService.addComment(1, 1, 'Great post!');
  assert.strictEqual(comment.postId, 1);
  assert.strictEqual(comment.authorId, 1);
  assert.strictEqual(comment.body, 'Great post!');

  const postAfterComment = await postsRepo.findById(1);
  assert.strictEqual(postAfterComment.commentCount, initialCount + 1);

  console.log('addComment passed!');

  console.log('ALL DOMAIN RULE TESTS PASSED SUCCESSFULLY!');
}

test().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
