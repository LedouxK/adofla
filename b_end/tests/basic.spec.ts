import { test } from '@japa/runner'

test.group('Basic Tests', () => {
  test('should pass a simple assertion', async ({ assert }) => {
    assert.isTrue(true)
  })

  test('should be able to perform math operations', async ({ assert }) => {
    assert.equal(1 + 1, 2)
    assert.notEqual(1 + 1, 3)
  })
})
