# Tests de Performance Backend

## 📚 Vue d'Ensemble

Les tests de performance évaluent la capacité du système à :
- Gérer une charge importante d'utilisateurs
- Maintenir des temps de réponse acceptables
- Gérer les ressources système efficacement
- Identifier les goulots d'étranglement
- Valider les objectifs de performance (SLO/SLA)
- Mesurer l'impact des mises à jour

## 🔧 Configuration

### Installation

```bash
# Installation des outils de performance
npm install -D artillery artillery-plugin-metrics-by-endpoint
npm install -D autocannon clinic
npm install -D @artillery/plugin-expect
```

### Configuration Avancée

```yaml
# artillery.config.yml
config:
  target: "http://localhost:3333"
  plugins:
    metrics-by-endpoint: {}
    expect: {}
  phases:
    - duration: 60
      arrivalRate: 5
      rampTo: 50
      name: "Montée en charge progressive"
  processor: "./processors.js"
  variables:
    userPool: "./data/users.csv"
  defaults:
    headers:
      Content-Type: "application/json"
      Accept: "application/json"
  apdex:
    threshold: 100
  ensure:
    thresholds:
      - http.response_time.p95: 200
      - http.requests.rate: 1000
      - errors.rate: 1
```

## 🎯 Scénarios de Test

### 1. Tests de Charge Réalistes

```yaml
# tests/performance/realistic-load.yml
config:
  target: "http://localhost:3333"
  phases:
    - duration: 300
      arrivalRate: 10
      maxVusers: 50
      name: "Trafic normal matinal"
    - duration: 300
      arrivalRate: 30
      maxVusers: 100
      name: "Pic de midi"
    - duration: 300
      arrivalRate: 50
      maxVusers: 200
      name: "Pic de soirée"

scenarios:
  - name: "Parcours utilisateur complet"
    weight: 70
    flow:
      # Authentification
      - post:
          url: "/api/auth/login"
          json:
            email: "{{ $processEnvironment.TEST_USER_EMAIL }}"
            password: "{{ $processEnvironment.TEST_USER_PASSWORD }}"
          capture:
            - json: "$.token"
              as: "userToken"
          expect:
            - statusCode: 200
            - contentType: json
            - hasProperty: token
      
      # Navigation et actions utilisateur
      - think: 2
      - get:
          url: "/api/profile"
          headers:
            Authorization: "Bearer {{ userToken }}"
      - think: 3
      - get:
          url: "/api/subscriptions/available"
      - think: 5
      - post:
          url: "/api/subscriptions"
          headers:
            Authorization: "Bearer {{ userToken }}"
          json:
            planId: "{{ $randomString() }}"
            paymentMethod: "card"

  - name: "Parcours visiteur"
    weight: 30
    flow:
      - get:
          url: "/api/products"
      - think: 2
      - get:
          url: "/api/categories"
```

### 2. Tests de Stress Avancés

```yaml
# tests/performance/advanced-stress.yml
config:
  target: "http://localhost:3333"
  phases:
    - duration: 60
      arrivalRate: 50
      rampTo: 300
      name: "Montée en charge exponentielle"
    - duration: 120
      arrivalRate: 300
      name: "Maintien charge maximale"
    - duration: 60
      arrivalRate: 300
      rampTo: 50
      name: "Descente progressive"

scenarios:
  - name: "Opérations intensives"
    flow:
      # Opérations de recherche complexes
      - get:
          url: "/api/search"
          qs:
            q: "{{ $randomString(10) }}"
            filters: "{{ $processEnvironment.SEARCH_FILTERS }}"
            sort: "relevance"
      
      # Opérations de base de données lourdes
      - post:
          url: "/api/analytics/aggregate"
          json:
            dimensions: ["date", "category", "location"]
            metrics: ["revenue", "users", "conversion_rate"]
            filters: {
              date_range: {
                start: "{{ $processEnvironment.START_DATE }}",
                end: "{{ $processEnvironment.END_DATE }}"
              }
            }
```

### 3. Tests d'Endurance Enrichis

```yaml
# tests/performance/enhanced-endurance.yml
config:
  target: "http://localhost:3333"
  phases:
    - duration: 7200  # 2 heures
      arrivalRate: 50
      maxVusers: 200
      name: "Test d'endurance longue durée"

scenarios:
  - name: "Opérations métier critiques"
    flow:
      # Création de commande
      - post:
          url: "/api/orders"
          json:
            items: [
              { id: "{{ $randomString() }}", quantity: "{{ $randomNumber(1, 5) }}" }
            ]
      - think: 3
      
      # Traitement de paiement
      - post:
          url: "/api/payments/process"
          json:
            orderId: "{{ $processEnvironment.ORDER_ID }}"
            amount: "{{ $randomNumber(1000, 10000) }}"
      - think: 2
      
      # Mise à jour de stock
      - put:
          url: "/api/inventory/update"
          json:
            items: [
              { id: "{{ $randomString() }}", quantity: "{{ $randomNumber(-5, 5) }}" }
            ]
```

## 📊 Métriques Avancées

### Configuration des Métriques Personnalisées

```typescript
// metrics/custom.ts
export const customMetrics = {
  business: {
    orderSuccess: {
      type: 'counter',
      threshold: 95,
      description: 'Taux de succès des commandes'
    },
    paymentLatency: {
      type: 'histogram',
      buckets: [100, 200, 500, 1000],
      description: 'Latence des paiements'
    }
  },
  system: {
    dbConnections: {
      type: 'gauge',
      warning: 80,
      critical: 95,
      description: 'Utilisation du pool de connexions'
    },
    cacheHitRate: {
      type: 'rate',
      threshold: 0.8,
      description: 'Taux de succès du cache'
    }
  }
}
```

### Surveillance en Temps Réel

```typescript
// monitoring/realtime.ts
import { Monitor } from '@adonisjs/monitor'
import { Prometheus } from '@adonisjs/prometheus'

Monitor.track('api.business_metrics', async ({ request, response, duration }) => {
  const labels = {
    endpoint: request.url(),
    method: request.method(),
    status: response.statusCode
  }

  // Métriques métier
  Prometheus.histogram('api_response_time', labels).observe(duration)
  Prometheus.counter('api_requests_total', labels).inc()
  
  if (request.url().includes('/api/orders')) {
    Prometheus.gauge('active_orders').set(await getActiveOrdersCount())
  }
})
```

## 🛠️ Optimisations Avancées

### 1. Configuration Base de Données Optimisée

```typescript
// config/database.ts
{
  postgresql: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true',
      pool: {
        min: 2,
        max: 20,
        createTimeoutMillis: 3000,
        acquireTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 100,
        propagateCreateError: false
      },
      acquireConnectionTimeout: 60000
    },
    debug: process.env.NODE_ENV === 'development',
    asyncStackTraces: process.env.NODE_ENV === 'development'
  }
}
```

### 2. Cache Multi-niveaux

```typescript
// config/cache.ts
{
  default: 'redis',
  stores: {
    memory: {
      driver: 'memory',
      max: 1000,
      ttl: 60
    },
    redis: {
      driver: 'redis',
      connection: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        db: 0,
        keyPrefix: 'cache:',
        cluster: process.env.REDIS_CLUSTER === 'true',
        maxRetriesPerRequest: 20,
        enableReadyCheck: true,
        enableOfflineQueue: true,
        connectTimeout: 10000,
        disconnectTimeout: 2000,
        commandTimeout: 5000,
        retryStrategy: (times) => Math.min(times * 50, 2000)
      }
    }
  }
}
```

### 3. Gestion Avancée de la Charge

```typescript
// config/shield.ts
{
  rateLimit: {
    enabled: true,
    blacklist: [],
    whitelist: [],
    maxRequests: {
      default: 100,
      api: {
        authenticated: 1000,
        public: 50
      }
    },
    expires: 60 * 1000,
    timeWindow: 60 * 1000,
    skipFailedRequests: true,
    headers: true,
    store: 'redis'
  },
  ddos: {
    enabled: true,
    maxRequests: 1000,
    timeWindow: 60 * 1000,
    blockDuration: 60 * 60 * 1000,
    whitelistedIPs: []
  }
}
```

## 📝 Bonnes Pratiques et Analyse

### 1. Préparation Automatisée

```bash
#!/bin/bash
# scripts/prepare-perf-test.sh

# Configuration de l'environnement
export NODE_ENV=testing
export DB_CONNECTION=pg
export REDIS_PREFIX=test

# Nettoyage et préparation
echo "🧹 Nettoyage de l'environnement..."
node ace migration:reset --force
redis-cli FLUSHDB

echo "🌱 Préparation des données..."
node ace db:seed --files=PerformanceSeeder.ts

echo "🚀 Démarrage des services..."
docker-compose -f docker-compose.perf.yml up -d

echo "⏳ Attente de la disponibilité des services..."
./scripts/wait-for-it.sh localhost:5432 -t 60
./scripts/wait-for-it.sh localhost:6379 -t 60

echo "✅ Environnement prêt pour les tests"
```

### 2. Analyse des Résultats

```typescript
// analysis/performance-report.ts
interface PerformanceReport {
  summary: {
    duration: number;
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    medianResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    rps: number;
    scenariosCreated: number;
    scenariosCompleted: number;
  };
  endpoints: {
    [key: string]: {
      count: number;
      meanResponseTime: number;
      medianResponseTime: number;
      p95ResponseTime: number;
      errorRate: number;
    };
  };
  errors: {
    [key: string]: {
      count: number;
      rate: number;
      examples: Array<{
        timestamp: string;
        error: string;
        context: any;
      }>;
    };
  };
  resources: {
    cpu: {
      mean: number;
      max: number;
      timeline: Array<{
        timestamp: string;
        value: number;
      }>;
    };
    memory: {
      mean: number;
      max: number;
      timeline: Array<{
        timestamp: string;
        value: number;
      }>;
    };
    eventLoop: {
      meanLatency: number;
      maxLatency: number;
      timeline: Array<{
        timestamp: string;
        value: number;
      }>;
    };
  };
}

async function generatePerformanceReport(
  testResults: any,
  systemMetrics: any
): Promise<PerformanceReport> {
  // Implémentation de l'analyse
  // ...
}
```

### 3. Documentation et Suivi

```markdown
# Rapport de Performance - {{ date }}

## 📊 Résumé Exécutif
- Durée du test : {{ duration }}
- Utilisateurs simultanés max : {{ maxUsers }}
- RPS moyen : {{ meanRPS }}
- Temps de réponse P95 : {{ p95ResponseTime }}ms

## 🎯 Objectifs de Performance (SLO)
- [{{ sloStatus.responseTime }}] Temps de réponse P95 < 200ms
- [{{ sloStatus.availability }}] Disponibilité > 99.9%
- [{{ sloStatus.errorRate }}] Taux d'erreur < 0.1%

## 📈 Métriques Clés
1. Performance API
   - Temps de réponse moyen : {{ metrics.api.meanResponseTime }}ms
   - Taux de succès : {{ metrics.api.successRate }}%
   - Débit : {{ metrics.api.throughput }} req/s

2. Base de Données
   - Temps de requête moyen : {{ metrics.db.meanQueryTime }}ms
   - Connexions actives max : {{ metrics.db.maxConnections }}
   - Taux de hit cache : {{ metrics.db.cacheHitRate }}%

3. Ressources Système
   - CPU max : {{ metrics.system.maxCpu }}%
   - Mémoire max : {{ metrics.system.maxMemory }}MB
   - Latence Event Loop max : {{ metrics.system.maxEventLoopLatency }}ms

## ⚠️ Points d'Attention
{{ #issues }}
- {{ description }}
  - Impact : {{ impact }}
  - Recommandation : {{ recommendation }}
{{ /issues }}

## 🔄 Actions Recommandées
1. {{ actions.immediate }}
2. {{ actions.shortTerm }}
3. {{ actions.longTerm }}

## 📝 Notes Techniques
{{ technicalNotes }}