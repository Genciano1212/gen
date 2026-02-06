module.exports = {
  globDirectory: '.',
  globPatterns: [
    '**/*.{html,js,css,png,svg,ico,json}'
  ],
  swDest: 'service-worker-v135.js',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365
        }
      }
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'gstatic-fonts-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365
        }
      }
    },
    {
      urlPattern: /^https:\/\/www\.gstatic\.com\/firebasejs\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'firebase-js-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 7
        }
      }
    },
    {
      urlPattern: /.*firebaseio\.com.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'firebase-realtime-cache',
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 5
        }
      }
    },
    {
      urlPattern: /.*firestore\.googleapis\.com.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'firestore-cache',
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 5
        }
      }
    },
    {
      urlPattern: /.*firebase\.app\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'firebase-app-cache',
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 5
        }
      }
    }
  ],
  ignoreURLParametersMatching: [/^utm_/, /^fbclid/],
  cleanupOutdatedCaches: true,
  skipWaiting: true,
  clientsClaim: true
};
