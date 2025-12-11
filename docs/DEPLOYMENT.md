# Deployment & Hosting Standards

## Firebase Hosting Configuration

**Critical Note for Firebase Authentication**

When using Firebase Auth with Google Provider on a custom domain or `web.app` (which are cross-origin to `firebaseapp.com` where the auth handler lives), strict COOP/COEP policies will break the popup flow.

### Required Headers

The `firebase.json` **MUST** be configured with `unsafe-none` for Cross-Origin policies.

**Correct Configuration:**

```json
"headers": [
  {
    "source": "**",
    "headers": [
      {
        "key": "Cross-Origin-Opener-Policy",
        "value": "unsafe-none"
      },
      {
        "key": "Cross-Origin-Embedder-Policy",
        "value": "unsafe-none"
      }
    ]
  }
]
```

### Prohibited Headers

**NEVER** use `Clear-Site-Data` on the main application or static assets during a session.

- **Risk**: It allows the session to start (IndexedDB opens) but then immediately kills the database connection when a background asset loads, causing "Connection Closing" errors and Auth loops.
- **Zombie Risk**: If this header is accidentally deployed, it effectively "poisons" the client browser cache. Users must stick to `unsafe-none` and manually clear their cache to recover.

### Deployment Commands

To ensure `firebase.json` rules are propagated directly to the CDN (overwriting any cached logic):

```bash
firebase deploy --only hosting
```

Then verify with:

```bash
curl -I https://your-site.web.app/some-static-asset.js
```
