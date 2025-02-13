# Tests de Sécurité Backend

## 📚 Vue d'Ensemble

Les tests de sécurité vérifient la robustesse du système contre :
- Les attaques courantes (OWASP Top 10)
- Les failles d'authentification et d'autorisation
- Les vulnérabilités d'injection
- Les fuites de données sensibles
- Les attaques par déni de service (DoS/DDoS)
- Les attaques sur la gestion des sessions

## 🔧 Configuration

### Installation

```bash
# Installation des outils de sécurité
npm install -D jest-security @adonisjs/security-scanner
npm install -D snyk zap-cli
npm install -D @adonisjs/shield @adonisjs/bouncer
```

### Configuration Avancée

```typescript
// tests/security/config.ts
export default {
  scanTargets: ['app/**/*.ts'],
  ignorePatterns: ['node_modules/**', 'build/**'],
  rules: {
    'no-sql-injection': 'error',
    'no-unsafe-regex': 'error',
    'no-eval': 'error',
    'no-weak-crypto': 'error',
    'no-hardcoded-credentials': 'error',
    'secure-headers': 'error',
    'csrf-protection': 'error'
  },
  customRules: {
    'sensitive-data-logging': {
      create: (context) => ({
        // Règle personnalisée pour détecter les logs de données sensibles
      })
    }
  }
}
```

## 🎯 Tests de Sécurité

### 1. Tests d'Authentification Avancés

```typescript
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories/UserFactory'
import Hash from '@ioc:Adonis/Core/Hash'
import jwt from 'jsonwebtoken'

test.group('Sécurité Authentification', () => {
  test('protection contre force brute avec délai exponentiel', async ({ client }) => {
    const attempts = []
    for (let i = 0; i < 10; i++) {
      const startTime = Date.now()
      const response = await client
        .post('/api/auth/login')
        .json({
          email: 'test@test.com',
          password: 'wrong_password'
        })
      attempts.push({
        attempt: i + 1,
        duration: Date.now() - startTime,
        status: response.status
      })
    }

    // Vérifier le délai exponentiel
    for (let i = 1; i < attempts.length; i++) {
      if (attempts[i].status === 429) {
        assert.isAbove(
          attempts[i].duration,
          attempts[i-1].duration,
          'Le délai doit augmenter exponentiellement'
        )
      }
    }
  })

  test('gestion complète du cycle JWT', async ({ client }) => {
    const user = await UserFactory.create()
    
    // Login et obtention du token
    const loginResponse = await client
      .post('/api/auth/login')
      .json({
        email: user.email,
        password: 'password123'
      })
    
    const token = loginResponse.body.token
    const refreshToken = loginResponse.body.refreshToken

    // Vérification du token
    const decodedToken: any = jwt.decode(token)
    assert.exists(decodedToken.exp)
    assert.exists(decodedToken.iat)
    assert.equal(decodedToken.sub, user.id)

    // Test du refresh token
    await new Promise(resolve => setTimeout(resolve, 1000))
    const refreshResponse = await client
      .post('/api/auth/refresh')
      .json({ refreshToken })

    assert.notEqual(refreshResponse.body.token, token)
    
    // Révocation du token
    await client
      .post('/api/auth/revoke')
      .header('Authorization', `Bearer ${token}`)

    const revokedResponse = await client
      .get('/api/protected')
      .header('Authorization', `Bearer ${token}`)
    
    assert.equal(revokedResponse.status, 401)
  })
})
```

### 2. Tests d'Injection Avancés

```typescript
test.group('Protection Injection', () => {
  test('protection contre les injections SQL avancées', async ({ client }) => {
    const maliciousQueries = [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "' UNION SELECT * FROM users --",
      "' WAITFOR DELAY '0:0:10'--",
      "'; EXEC xp_cmdshell 'dir' --"
    ]

    for (const query of maliciousQueries) {
      const response = await client
        .get('/api/users')
        .qs({ search: query })

      assert.equal(response.status, 400)
      
      // Vérifier l'intégrité de la base
      const tables = await Database
        .rawQuery("SELECT tablename FROM pg_tables WHERE schemaname='public'")
      assert.include(
        tables.rows.map(t => t.tablename),
        'users'
      )
    }
  })

  test('protection contre les attaques XSS polyformes', async ({ client }) => {
    const xssPayloads = [
      '<script>alert("xss")</script>',
      '<img src="x" onerror="alert(\'xss\')">',
      '<svg/onload=alert("xss")>',
      'javascript:alert("xss")',
      '"><script>alert("xss")</script>',
      '<?php echo("<script>alert(\'xss\')</script>"); ?>'
    ]

    for (const payload of xssPayloads) {
      const response = await client
        .post('/api/users')
        .json({
          name: payload,
          email: 'test@test.com'
        })

      assert.notEqual(
        response.body.name,
        payload,
        'Le payload XSS doit être nettoyé'
      )
    }
  })
})
```

### 3. Tests de Protection des Données

```typescript
test.group('Protection des Données', () => {
  test('chiffrement des données sensibles', async ({ client }) => {
    const user = await UserFactory.create()
    const sensitiveData = {
      creditCard: '4242424242424242',
      ssn: '123-45-6789',
      address: '123 Secret St'
    }

    // Stockage des données
    const response = await client
      .post('/api/users/sensitive-data')
      .loginAs(user)
      .json(sensitiveData)

    // Vérification en base
    const dbData = await Database
      .from('sensitive_data')
      .where('user_id', user.id)
      .first()

    // Les données doivent être chiffrées
    assert.notEqual(dbData.credit_card, sensitiveData.creditCard)
    assert.notEqual(dbData.ssn, sensitiveData.ssn)

    // Mais récupérables avec les bonnes autorisations
    const retrieveResponse = await client
      .get('/api/users/sensitive-data')
      .loginAs(user)

    assert.equal(retrieveResponse.body.creditCard, sensitiveData.creditCard)
  })

  test('anonymisation des logs', async ({ client }) => {
    const user = await UserFactory.create()
    const sensitiveData = {
      creditCard: '4242424242424242',
      password: 'secret123'
    }

    // Effectuer une opération qui génère des logs
    await client
      .post('/api/payments')
      .loginAs(user)
      .json(sensitiveData)

    // Vérifier les logs
    const logs = await fs.readFile('storage/logs/app.log', 'utf8')
    assert.notInclude(logs, sensitiveData.creditCard)
    assert.notInclude(logs, sensitiveData.password)
    assert.include(logs, '****4242')
  })
})
```

## 🔒 Tests OWASP Avancés

### 1. Tests de Broken Access Control (OWASP A5)

```typescript
test.group('OWASP A5 - Broken Access Control', () => {
  test('protection contre l\'escalade de privilèges', async ({ client }) => {
    const regularUser = await UserFactory.create()
    const adminUser = await UserFactory.create({ role: 'admin' })

    // Tentative d'accès aux routes admin
    const response = await client
      .get('/api/admin/users')
      .loginAs(regularUser)
    
    assert.equal(response.status, 403)

    // Tentative de modification de rôle
    const updateResponse = await client
      .put(`/api/users/${regularUser.id}`)
      .loginAs(regularUser)
      .json({ role: 'admin' })
    
    assert.equal(updateResponse.status, 403)

    // Vérification que le rôle n'a pas changé
    const user = await User.find(regularUser.id)
    assert.notEqual(user.role, 'admin')
  })

  test('isolation des données entre utilisateurs', async ({ client }) => {
    const user1 = await UserFactory.create()
    const user2 = await UserFactory.create()
    
    // Création de données privées pour user1
    const privateData = { content: 'secret data' }
    await client
      .post('/api/user-data')
      .loginAs(user1)
      .json(privateData)

    // Tentative d'accès par user2
    const response = await client
      .get(`/api/user-data/${user1.id}`)
      .loginAs(user2)
    
    assert.equal(response.status, 403)
  })
})
```

### 2. Tests de Protection Cryptographique (OWASP A2)

```typescript
test.group('OWASP A2 - Cryptographic Failures', () => {
  test('utilisation correcte du hachage des mots de passe', async ({ assert }) => {
    const password = 'StrongP@ssw0rd123'
    const user = await UserFactory.create({ password })

    // Vérifier que le mot de passe est haché
    assert.notEqual(user.password, password)
    assert.isTrue(await Hash.verify(user.password, password))

    // Vérifier l'algorithme de hachage
    assert.match(user.password, /^\$argon2id\$/)
  })

  test('rotation des clés de chiffrement', async ({ client }) => {
    // Simuler une rotation de clé
    await KeyRotationService.rotate()

    // Les données existantes doivent rester accessibles
    const user = await UserFactory.create()
    const sensitiveData = { secret: 'important data' }
    
    await client
      .post('/api/encrypted-data')
      .loginAs(user)
      .json(sensitiveData)

    const response = await client
      .get('/api/encrypted-data')
      .loginAs(user)

    assert.equal(response.body.secret, sensitiveData.secret)
  })
})
```

## 🛡️ Tests de Configuration Avancés

### 1. Tests des En-têtes de Sécurité

```typescript
test.group('Configuration de Sécurité', () => {
  test('en-têtes de sécurité complets', async ({ client }) => {
    const response = await client.get('/')
    
    const securityHeaders = {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self'"
      ].join('; '),
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=()'
    }

    for (const [header, value] of Object.entries(securityHeaders)) {
      assert.equal(response.headers[header.toLowerCase()], value)
    }
  })

  test('configuration TLS/SSL', async ({ assert }) => {
    const response = await fetch('https://api.example.com', {
      method: 'HEAD'
    })

    const tlsVersion = response.headers.get('server-timing')
    assert.match(tlsVersion, /TLSv1.3/)

    const cert = await getCertificateInfo('api.example.com')
    assert.isTrue(cert.valid)
    assert.isAbove(new Date(cert.validTo), new Date())
  })
})
```

### 2. Tests de Rate Limiting Avancé

```typescript
test.group('Rate Limiting', () => {
  test('limites par IP et par utilisateur', async ({ client }) => {
    const user = await UserFactory.create()
    const limits = {
      anonymous: 30,
      authenticated: 100,
      admin: 1000
    }

    // Test des limites anonymes
    for (let i = 0; i <= limits.anonymous; i++) {
      const response = await client.get('/api/public')
      if (i === limits.anonymous) {
        assert.equal(response.status, 429)
      }
    }

    // Test des limites authentifiées
    for (let i = 0; i <= limits.authenticated; i++) {
      const response = await client
        .get('/api/protected')
        .loginAs(user)
      if (i === limits.authenticated) {
        assert.equal(response.status, 429)
      }
    }

    // Vérifier les headers de rate limit
    const response = await client.get('/api/public')
    assert.exists(response.headers['x-ratelimit-limit'])
    assert.exists(response.headers['x-ratelimit-remaining'])
    assert.exists(response.headers['x-ratelimit-reset'])
  })
})
```

## 📝 Bonnes Pratiques et Surveillance

### 1. Audit de Sécurité Automatisé

```bash
#!/bin/bash
# scripts/security-audit.sh

echo "🔒 Démarrage de l'audit de sécurité..."

# Analyse des dépendances
echo "📦 Analyse des dépendances..."
npm audit
snyk test

# Scan OWASP ZAP
echo "🔍 Scan OWASP ZAP..."
zap-cli quick-scan \
  --self-contained \
  --start-options "-config api.disablekey=true" \
  --spider http://localhost:3333

# Tests de sécurité personnalisés
echo "🧪 Tests de sécurité..."
npm run test:security

# Analyse statique
echo "📊 Analyse statique..."
npm run lint:security

# Génération du rapport
echo "📝 Génération du rapport..."
node scripts/generate-security-report.js
```

### 2. Surveillance Continue

```typescript
// config/security-monitoring.ts
export default {
  monitoring: {
    failedLogins: {
      threshold: 5,
      timeWindow: '15m',
      banDuration: '1h',
      notifyAfter: 3
    },
    suspiciousActivities: {
      patterns: [
        'sql injection attempt',
        'xss attempt',
        'csrf token mismatch',
        'file upload attempt',
        'unauthorized access attempt'
      ],
      notification: {
        email: 'security@example.com',
        slack: {
          webhook: process.env.SLACK_SECURITY_WEBHOOK,
          channel: '#security-alerts'
        }
      }
    },
    realTimeAlerts: {
      enabled: true,
      metrics: [
        {
          name: 'high-error-rate',
          condition: 'error_rate > 0.05',
          duration: '5m'
        },
        {
          name: 'unusual-traffic',
          condition: 'requests_per_second > 1000',
          duration: '1m'
        }
      ]
    }
  }
}
```

### 3. Documentation et Rapports

```typescript
// scripts/generate-security-report.ts
interface SecurityReport {
  timestamp: string;
  summary: {
    criticalVulnerabilities: number;
    highVulnerabilities: number;
    mediumVulnerabilities: number;
    lowVulnerabilities: number;
  };
  dependencyAudit: {
    totalDependencies: number;
    vulnerableDependencies: number;
    actionRequired: Array<{
      package: string;
      currentVersion: string;
      recommendedVersion: string;
      severity: string;
    }>;
  };
  securityTests: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    details: Array<{
      name: string;
      status: 'passed' | 'failed' | 'skipped';
      duration: number;
      error?: string;
    }>;
  };
  configurations: {
    headers: {
      status: 'secure' | 'warning' | 'insecure';
      missingHeaders: string[];
    };
    ssl: {
      grade: string;
      issues: string[];
    };
    firewall: {
      status: string;
      blockedAttacks: number;
    };
  };
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    description: string;
    impact: string;
    remediation: string;
  }>;
}

async function generateSecurityReport(): Promise<SecurityReport> {
  // Implémentation de la génération du rapport
  // ...
}
```

Ce fichier fournit une documentation complète et structurée pour la mise en œuvre des tests de sécurité sur le backend de votre application, facilitant ainsi la maintenance et l'amélioration continue de la sécurité.