import { test } from '@japa/runner'

test.group('Basic Test', () => {
  test('assert is working', ({ assert }) => {
    assert.isTrue(true)
    assert.isFalse(false)
    assert.equal(2 + 2, 4)
  })
  
  test('client is available', async ({ client, assert }) => {
    // Test simple pour vérifier que le client API fonctionne
    const response = await client.get('/')
    
    // Vérifie juste que la réponse existe, peu importe le statut
    assert.exists(response)
  })
})
