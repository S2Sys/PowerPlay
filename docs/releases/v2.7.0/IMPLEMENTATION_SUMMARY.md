# PowerPlay v2.7.0 — Mobile & Cross-Platform Implementation

**Version**: 2.7.0  
**Release Date**: 2026-04-09  
**Focus**: Mobile Development Standards (iOS, Android, React Native, Flutter)  
**Rules**: 5 | **Prompts**: 5 | **Total Coverage**: 54 rules, 63 prompts

---

## 📱 What's New in v2.7.0

v2.7.0 adds comprehensive mobile development standards covering native iOS/Android, cross-platform frameworks (React Native, Flutter), and the complete app lifecycle from architecture to post-launch monitoring.

### 5 New Rules

**1. mobile-development.md** (800+ lines)
- iOS standards: Swift 5.9+, SwiftUI, async/await, Keychain for credentials
- Android standards: Kotlin 1.9+, Jetpack, coroutines, KeyStore for credentials
- React Native standards: TypeScript, Expo, React Navigation, Axios
- Flutter standards: Dart 3+, Provider/Riverpod, Material 3
- Performance optimization: battery, memory, startup time
- Security: OAuth 2.0 + PKCE, HTTPS, certificate pinning
- **Globs**: `**/*.swift`, `**/*.kt`, `**/*.tsx`, `**/*.dart`, `**/*.ts`, `**/*.js`

**2. cross-platform-design.md** (600+ lines)
- Platform abstraction layer (no Platform.OS scattered in components)
- Navigation patterns: iOS (stack-based, swipe back) vs. Android (bottom navigation, system back)
- UI conventions: dialogs, buttons, gestures differ per platform
- Design token system (adaptive colors, spacing, typography)
- Code organization: shared/ platform/ ui/ folder structure
- Performance per platform (iOS vs. Android profiling)
- Localization with RTL support
- **Purpose**: Write once, adapt to platform conventions
- **Globs**: `**/*.tsx`, `**/*.ts`, `**/*.dart`, `**/*.js`

**3. offline-first.md** (700+ lines)
- Local-first data store (all data lives on device, synced when online)
- Event log / transaction log (queue changes, replay on sync)
- Local database tech: WatermelonDB, Realm, Room, Isar, Hive
- Sync strategies: optimistic updates + event log, incremental sync (cursor-based)
- Conflict resolution: latest-write-wins, merge, user prompt
- Network detection: trigger sync on restore, monitor connectivity
- Data integrity: soft deletes (IsDeleted + DeletedAt)
- UI patterns: sync status indicator, optimistic updates, conflict notification
- Testing: network mocking, sync simulation, conflict handling
- **Purpose**: App works offline, syncs when connected
- **Globs**: `**/*.swift`, `**/*.kt`, `**/*.tsx`, `**/*.dart`, `**/*.ts`, `**/*.js`

**4. mobile-security.md** (650+ lines)
- Credential management: Keychain (iOS), KeyStore (Android), secure_storage (React Native/Flutter)
- Never store in plaintext: AsyncStorage, SharedPreferences, UserDefaults
- Authentication: OAuth 2.0 + PKCE (not implicit, not password flow)
- Token management: short-lived access (1hr), refresh tokens (7d)
- Network security: HTTPS only, certificate pinning, avoid public WiFi
- Data protection: no sensitive data logged, no PII in UI, clear memory after use
- Mobile-specific threats: jailbreak/root detection, reverse engineering, debugger attachment
- OWASP Mobile Top 10: cryptography, auth, storage, network, logging
- Biometric auth (fingerprint/face): optional, don't require
- **Globs**: `**/*.swift`, `**/*.kt`, `**/*.tsx`, `**/*.dart`, `**/*.ts`, `**/*.js`

**5. app-distribution.md** (650+ lines)
- Release build process: iOS (Xcode Archive → TestFlight → App Store), Android (Gradle bundleRelease)
- Signing: iOS (distribution certificate), Android (upload key via KeyStore)
- App Store submission: iOS App Store Connect, Google Play Console
- Versioning: semantic versioning (MAJOR.MINOR.PATCH), build numbers
- App size optimization: < 150 MB (iOS APK, Android AAB)
- Beta testing: TestFlight (48+ hours), internal testing, staged rollout
- App Store Optimization (ASO): keywords, screenshots, ratings, reviews
- Post-launch: monitoring (Crashlytics), update strategy (OTA, forced updates)
- Release checklist: 20+ verification points
- **Applies to**: iOS, Android, React Native, Flutter, PWAs
- **Globs**: `**/*.swift`, `**/*.kt`, `**/*.tsx`, `**/*.dart`, `**/*.ts`, `**/*.js`, `*.gradle`, `*.plist`, `*.pbxproj`

### 5 New Prompts (Agent Slash Commands)

| Command | Purpose | Agent Role |
|---------|---------|-----------|
| `/mobile-architecture` | Design mobile app architecture (native vs. cross-platform) | Architecture Advisor |
| `/cross-platform-setup` | Setup cross-platform codebase with abstraction layers | DevOps Engineer |
| `/offline-sync` | Design offline-first data sync (local DB, event queue) | Backend Architect |
| `/mobile-security-audit` | Audit mobile app security (credentials, network, data protection) | Security Auditor |
| `/app-distribution-plan` | Plan app distribution (versioning, store submission, monitoring) | Release Manager |

---

## 🏗️ Architecture Overview

### Mobile App Architecture Pattern

```
┌─────────────────────────────────────┐
│  Presentation Layer (UI)            │
│  - SwiftUI / Jetpack Compose        │
│  - React Navigation / Flutter Nav   │
│  - Responsive + Adaptive             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  ViewModel / Provider Layer          │
│  - State management                 │
│  - Business logic                   │
│  - iOS: MVVM, Android: MVVM, RN: Redux │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Data Layer                          │
│  - API Client (Retrofit, Axios)     │
│  - Local DB (Room, Core Data, etc)  │
│  - Sync Manager (event log)         │
│  - Offline Queue                    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Security Layer                      │
│  - Keychain / KeyStore              │
│  - HTTPS + Cert Pinning             │
│  - Jailbreak/Root Detection         │
│  - Obfuscation                      │
└─────────────────────────────────────┘
```

### Cross-Platform Code Structure

```
myapp/
├── shared/                    # 100% platform-agnostic
│   ├── services/
│   │   ├── api.ts             # Network + typing
│   │   └── storage.ts         # Interface only
│   ├── models/
│   ├── hooks/ (RN)
│   ├── providers/ (Flutter)
│   └── utils/
│
├── platform/                  # Platform abstraction
│   ├── index.ts
│   ├── ios.ts
│   ├── android.ts
│   └── web.ts                 # Implements shared interfaces
│
├── ui/                        # Adaptive components
│   ├── Button.tsx             # Adapts per platform
│   ├── Dialog.tsx
│   ├── ios/                   # iOS-specific (swipe, safe area)
│   └── android/               # Android-specific (material, back)
│
├── screens/                   # Mostly shared
│   ├── HomeScreen.tsx
│   └── DetailScreen.tsx
│
└── (platform-specific project roots)
    ├── ios/                   # Xcode project (iOS native)
    ├── android/               # Android Studio project
    └── web/                   # Next.js / Vite for PWA
```

### Offline-First Data Flow

```
User Action
    │
    ▼
┌─────────────────────┐
│ Update Local DB     │  ← Optimistic
│ Show to user        │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Queue event for     │
│ sync (persisted)    │
└────────┬────────────┘
         │
    [Network check]
         │
    ┌────┴─────┐
    │ Offline   │ Online
    │           │
    ▼           ▼
[Queue]    [Send events]
           to server
                │
            [Server]
                │
         ┌──────┴──────┐
         │             │
    Success      Conflict
         │             │
         ▼             ▼
    [Sync        [Resolve
     status]      strategy]
         │             │
         └──────┬──────┘
                ▼
         [Update local]
```

---

## 📊 Platform Coverage

| Platform | Rule Coverage | Key Tech |
|----------|---------------|----------|
| **iOS** | mobile-development, cross-platform-design, offline-first, mobile-security, app-distribution | Swift 5.9+, SwiftUI, async/await, Keychain |
| **Android** | mobile-development, cross-platform-design, offline-first, mobile-security, app-distribution | Kotlin 1.9+, Jetpack, coroutines, KeyStore |
| **React Native** | mobile-development, cross-platform-design, offline-first, mobile-security, app-distribution | TypeScript, React Navigation, Redux/Zustand |
| **Flutter** | mobile-development, cross-platform-design, offline-first, mobile-security, app-distribution | Dart 3+, Provider/Riverpod, Material 3 |
| **PWA** | offline-first, mobile-security, app-distribution | TypeScript, IndexedDB, Workbox |

---

## 🔧 Key Concepts Explained

### 1. Platform Abstraction Layer

Instead of:
```typescript
if (Platform.OS === 'ios') { ... }
else if (Platform.OS === 'android') { ... }
```

Use:
```typescript
const CameraService = Platform.select({
  ios: () => require('./ios/camera').default,
  android: () => require('./android/camera').default,
});
```

**Benefit**: Components don't know about platforms, easier to test and maintain.

### 2. Offline-First with Event Log

Instead of:
```typescript
await api.updateUser(id, changes); // Fails if offline
```

Use:
```typescript
// Update local immediately (optimistic)
db.updateUser(id, changes);

// Queue for later sync
eventLog.append({ type: 'user.updated', id, changes });

// Sync when online
if (isOnline()) syncEventLog();
```

**Benefit**: App always responsive, works offline, syncs when possible.

### 3. Conflict Resolution

When user edited offline and server also changed:

- **Latest-write-wins**: Server timestamp beats local (simplest)
- **Merge**: Combine changes (e.g., title from server, comments from local)
- **User prompt**: "Keep yours?" (safest but friction)

**Example**:
```typescript
const resolved = {
  ...serverVersion,
  comments: localVersion.comments, // Local wins
  updatedAt: Math.max(local.updatedAt, server.updatedAt),
};
```

### 4. Mobile Security: OAuth 2.0 + PKCE

Not "app stores password" or "token in URL (implicit flow)".

**Flow**:
1. App generates random verifier
2. App opens browser to: `/authorize?code_challenge=hash(...)`
3. User logs in, browser redirects: `myapp://callback?code=xyz`
4. App exchanges: POST code + verifier → server verifies match → token issued

**Benefit**: Server confirms it's really your app (not impostor). Safer than implicit.

---

## 💡 Best Practices Per Platform

### iOS (Swift)

✅ Do:
- Use SwiftUI for new screens (not UIKit)
- `@MainActor` for UI updates, `nonisolated` for background
- Async/await with CancellationToken
- Weak self in closures
- Keychain for credentials

❌ Don't:
- Force unwrap (use `guard let`)
- Synchronous network calls
- Hardcode strings (use Localizable.strings)
- Log sensitive data

### Android (Kotlin)

✅ Do:
- Use Jetpack libraries (ViewModel, Room, Hilt)
- Coroutines with `viewModelScope`
- Flow for reactive updates
- EncryptedSharedPreferences for credentials
- Material Design 3

❌ Don't:
- Use SharedPreferences for secrets
- Block on network in main thread
- Hardcode strings (use strings.xml)
- Ignore lifecycle

### React Native

✅ Do:
- TypeScript for type safety
- React Navigation for routing
- Redux Toolkit or Zustand for state
- Keychain for credentials
- Lazy load screens

❌ Don't:
- AsyncStorage for tokens
- Hardcode API endpoints
- Ignore platform differences
- Block on network

### Flutter

✅ Do:
- Provider or Riverpod for state
- FutureProvider for async data
- flutter_secure_storage for credentials
- Material 3 for UI
- Hot reload for development

❌ Don't:
- SharedPreferences for secrets
- Synchronous blocking operations
- Ignore null safety
- Skip testing

---

## 🧪 Testing Checklist

- [ ] Unit tests: business logic (70% coverage)
- [ ] Component tests: UI adapts per platform (20% coverage)
- [ ] E2E tests: critical workflows offline → online (10% coverage)
- [ ] Network mocking: test offline scenario
- [ ] Sync testing: conflict resolution verified
- [ ] Real devices: iPhone + iPad (iOS), phone + tablet (Android)
- [ ] Screen sizes: test responsiveness across sizes
- [ ] Accessibility: VoiceOver (iOS), TalkBack (Android)
- [ ] Performance: < 3s startup, < 100MB RAM
- [ ] Battery: < 5% drain/hour
- [ ] Security audit: credentials, HTTPS, logs, jailbreak detection

---

## 📈 Release Workflow

```
1. [Develop] — Make changes, test locally
         ↓
2. [Version] — Increment MAJOR.MINOR.PATCH
         ↓
3. [Beta] — TestFlight (iOS), internal testing (Android) — 48+ hours
         ↓
4. [Review] — Check crashes, ratings, feedback
         ↓
5. [Submit] — App Store Connect (iOS), Play Console (Android)
         ↓
6. [Approve] — App Store review (24-48 hours typically)
         ↓
7. [Release] — Available to all users
         ↓
8. [Monitor] — Crashlytics, ratings, update adoption
```

---

## 🎯 Quick Start with v2.7.0

### 1. Design Mobile Architecture
```
Chat: /mobile-architecture
Input: "Design a task management app for iOS and Android"
Output: Platform selection, tech stack, MVVM pattern, data sync strategy
```

### 2. Setup Cross-Platform Codebase
```
Chat: /cross-platform-setup
Input: "Setup React Native with shared business logic and platform-specific navigation"
Output: Folder structure, abstraction layer code, build configuration
```

### 3. Add Offline Support
```
Chat: /offline-sync
Input: "Design offline sync for user tasks (create, edit, delete)"
Output: Local DB schema, event log, sync queue, conflict resolution
```

### 4. Security Audit
```
Chat: /mobile-security-audit
Input: "Audit our React Native app for security issues"
Output: Credentials storage, HTTPS check, logging audit, jailbreak detection
```

### 5. Plan Distribution
```
Chat: /app-distribution-plan
Input: "Plan release of v1.0.0 to iOS App Store and Google Play"
Output: Versioning scheme, beta testing timeline, store submission checklist
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `.continue/rules/mobile-development.md` | iOS/Android/RN/Flutter platform standards |
| `.continue/rules/cross-platform-design.md` | Platform abstraction, UI adaptation, code organization |
| `.continue/rules/offline-first.md` | Local-first data, event logs, sync strategies |
| `.continue/rules/mobile-security.md` | Credential storage, OAuth 2.0, HTTPS, jailbreak detection |
| `.continue/rules/app-distribution.md` | App store submission, versioning, beta testing, monitoring |
| `config-v2.7.0.yaml` | Latest config with 54 rules, 63 prompts |

---

## 🔗 Integration with Previous Versions

v2.7.0 **builds on** previous versions:
- **v2.0-v2.4**: Core rules (testing, performance, data, UX, DevOps)
- **v2.5**: Security & Compliance (zero-trust, secrets, incident response)
- **v2.6**: Integration & APIs (event-driven, gateways, webhooks)
- **v2.7**: Mobile & Cross-Platform (THIS RELEASE)

**Total Stack**: 54 rules, 63 prompts, 14 models, 5 MCP servers

---

## ✅ Verification Checklist

- [ ] All 5 rule files created (.continue/rules/)
- [ ] All 5 prompts added to config.yaml
- [ ] Version bumped to 2.7.0
- [ ] Capability map updated (Rules: 54, Prompts: 63)
- [ ] Config archived to config/versions/config-v2.7.0.yaml
- [ ] Implementation summary created (this file)
- [ ] Committed to git with v2.7.0 tag
- [ ] All rules have correct glob patterns
- [ ] All prompts are invokable (invokable: true)

---

**Version**: 2.7.0  
**Released**: 2026-04-09  
**Author**: SmartWorkz Dev  
**License**: MIT

**Next**: v2.8.0 (TBD — Additional domains or expansions)
