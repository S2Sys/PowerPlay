# Mobile Security Standards

**Version**: 2.7.0  
**Applies to**: iOS, Android, React Native, Flutter, PWAs  
**Last Updated**: 2026-04-09

---

## 🎯 Core Principle

Mobile devices are threatened environments: lost devices, public WiFi, jailbreaks, screen capture, clipboard access, packet sniffing. This standard addresses mobile-specific vulnerabilities beyond standard OWASP Top 10.

---

## 🔑 Credential Management

### 1. Never Store in Plaintext

**Bad:**
```swift
// iOS: Never use UserDefaults for tokens
UserDefaults.standard.set(token, forKey: "auth_token")

// Android: Never use SharedPreferences
sharedPreferences.edit().putString("auth_token", token).apply()

// React Native: Never use AsyncStorage
await AsyncStorage.setItem('token', token);
```

### 2. Use Platform-Native Secure Storage

**iOS: Keychain**
```swift
import Security

func saveToken(_ token: String) {
    let query: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrAccount as String: "auth_token",
        kSecValueData as String: token.data(using: .utf8)!,
        kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
    ]
    
    SecItemDelete(query as CFDictionary)
    SecItemAdd(query as CFDictionary, nil)
}

func retrieveToken() -> String? {
    let query: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrAccount as String: "auth_token",
        kSecReturnData as String: true,
    ]
    
    var result: AnyObject?
    SecItemCopyMatching(query as CFDictionary, &result)
    
    guard let data = result as? Data else { return nil }
    return String(data: data, encoding: .utf8)
}
```

**Android: KeyStore**
```kotlin
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

val masterKey = MasterKey.Builder(context)
    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
    .build()

val encryptedSharedPrefs = EncryptedSharedPreferences.create(
    context,
    "secret_shared_prefs",
    masterKey,
    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)

encryptedSharedPrefs.edit().putString("auth_token", token).apply()
```

**React Native: react-native-keychain**
```typescript
import * as Keychain from 'react-native-keychain';

// Save
await Keychain.setGenericPassword('username', 'password', {
  service: 'auth_token',
  storage: Platform.OS === 'android' ? Keychain.SECURITY_LEVEL.SECURE_HARDWARE : Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
});

// Retrieve
const credentials = await Keychain.getGenericPassword({ service: 'auth_token' });
const token = credentials.password;

// Delete
await Keychain.resetGenericPassword({ service: 'auth_token' });
```

**Flutter: flutter_secure_storage**
```dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final storage = FlutterSecureStorage(
  aOptions: AndroidOptions(
    keyCipherAlgorithm: KeyCipherAlgorithm.RSA_ECB_OAEPwithSHA_256andMGF1Padding,
    storageCipherAlgorithm: StorageCipherAlgorithm.AES_GCM_NoPadding,
  ),
);

await storage.write(key: 'auth_token', value: token);
final token = await storage.read(key: 'auth_token');
```

---

## 🔐 Authentication & Authorization

### 1. OAuth 2.0 + PKCE (Not Implicit, Not Password)

**Implicit flow (BAD):** Token exposed in URL, can be intercepted  
**Password flow (BAD):** App stores user password, phishing risk  
**PKCE (Authorization Code, GOOD):** Server confirms app via code challenge

**Flow:**
```
1. App generates code_verifier (random 43-128 char)
2. App generates code_challenge = SHA256(code_verifier)
3. App opens browser: /authorize?client_id=...&code_challenge=...
4. User logs in, grants permission
5. Browser redirects: myapp://callback?code=xyz&state=abc
6. App exchanges code + code_verifier for token (server verifies match)
7. Token issued, app can make API calls
```

**React Native Example**
```typescript
import * as AuthSession from 'expo-auth-session';
import { Buffer } from 'buffer';
import crypto from 'crypto';

const generateCodeChallenge = () => {
  const verifier = Buffer.from(crypto.randomBytes(32)).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  const challenge = Buffer.from(crypto.createHash('sha256').update(verifier).digest()).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  return { verifier, challenge };
};

const login = async () => {
  const { verifier, challenge } = generateCodeChallenge();
  
  // Store verifier securely
  await Keychain.setGenericPassword('pkce', verifier, { service: 'code_verifier' });
  
  // Open auth server
  const result = await AuthSession.startAsync({
    authUrl: `https://auth.example.com/authorize?` +
      `client_id=${CLIENT_ID}&` +
      `code_challenge=${challenge}&` +
      `code_challenge_method=S256&` +
      `redirect_uri=${AuthSession.getRedirectUrl()}&` +
      `state=random_state`,
  });
  
  if (result.type === 'success') {
    const code = result.params.code;
    const retrievedVerifier = await Keychain.getGenericPassword({ service: 'code_verifier' });
    
    // Exchange code for token
    const token = await exchangeCodeForToken(code, retrievedVerifier.password);
    await Keychain.setGenericPassword('auth', token, { service: 'access_token' });
  }
};
```

### 2. Token Expiration & Refresh

```typescript
// Access token: short-lived (1 hour)
// Refresh token: long-lived (7 days), stored securely

const makeAPICall = async (endpoint: string) => {
  let token = await getAccessToken();
  
  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (response.status === 401) {
    // Token expired, refresh it
    token = await refreshAccessToken();
    
    // Retry request
    return fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
  
  return response;
};

const refreshAccessToken = async () => {
  const refreshToken = await Keychain.getGenericPassword({ service: 'refresh_token' });
  
  const response = await fetch('https://api.example.com/refresh', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken.password })
  });
  
  const { access_token } = await response.json();
  await Keychain.setGenericPassword('auth', access_token, { service: 'access_token' });
  
  return access_token;
};
```

### 3. Logout = Delete Tokens

```typescript
const logout = async () => {
  // Delete from secure storage
  await Keychain.resetGenericPassword({ service: 'access_token' });
  await Keychain.resetGenericPassword({ service: 'refresh_token' });
  
  // Optional: notify server of logout (for audit)
  await api.post('/logout');
  
  // Clear local user state
  setUser(null);
  navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
};
```

---

## 🔒 Network Security

### 1. HTTPS Only

**Never mix HTTP and HTTPS:**
```swift
// iOS: Block HTTP in Info.plist
// Add: App Transport Security Settings → Allow Arbitrary Loads = NO
// (This is default in iOS 9+)

// Android: res/xml/network_security_config.xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="false">
        <domain includeSubdomains="true">api.example.com</domain>
        <pin-set>
            <pin digest="SHA-256">hash1</pin>
            <pin digest="SHA-256">hash2</pin>
        </pin-set>
    </domain-config>
</network-security-config>
```

### 2. Certificate Pinning

Prevent man-in-the-middle attacks by pinning your server's certificate:

**React Native: axios + certificate pinning**
```typescript
import axios from 'axios';
import { TLSCertificate } from 'react-native-tls-cert-pinning';

const axiosInstance = axios.create({
  timeout: 10000,
});

// Pin certificate
TLSCertificate.setCertificate('api.example.com', [
  require('./certificates/api.pem'),
], 'sha256');

// Use pinned instance
export default axiosInstance;
```

**Flutter: dio + certificate pinning**
```dart
import 'package:dio/dio.dart';
import 'package:dio_http_cache/dio_http_cache.dart';

final dio = Dio();
final httpClient = HttpClient();

// Load certificate
final certificate = await rootBundle.load('assets/cert.pem');
final certs = SecurityContext.defaultContext;
certs.setTrustedCertificatesBytes(certificate.buffer.asUint8List());

// Pin certificate
httpClient.badCertificateCallback = (X509Certificate cert, String host, int port) {
  return cert.issuer.contains('Expected Issuer');
};
```

### 3. Avoid Public WiFi Risks

```typescript
const isOnPublicNetwork = async () => {
  const netInfo = await NetInfo.fetch();
  // Check if SSID is known/trusted
  return !trustedNetworks.includes(netInfo.details.ssid);
};

const shouldUseTunnel = async () => {
  // Force VPN/tunnel on public networks
  return await isOnPublicNetwork();
};
```

---

## 🛡️ Data Protection

### 1. No Sensitive Data in Logs

```swift
// BAD
os_log("User email: \(user.email)")
os_log("Authenticating user: \(token)")

// GOOD
os_log("User authenticated", log: OSLog.default, type: .info)
os_log("API call to /users")
```

### 2. No Sensitive Data in UI

```swift
// BAD
textField.text = sensitiveString // Can be captured by screenshot, accessibility

// GOOD
textField.isSecureTextEntry = true // Hides from screenshots
textField.text = maskedString // Show ••••1234 not full number
```

### 3. No Sensitive Data in Memory Longer Than Needed

```swift
// BAD: String kept in memory
let password = "my_password"
// ... do stuff ...
// (still in memory)

// GOOD: Clear after use
var password = "my_password"
defer {
  password = String(repeating: "\0", count: password.count)
}
// ... do stuff ...
// (cleared on exit)
```

### 4. Clipboard Access Risks

```typescript
// Warn user when pasting into sensitive fields
const SensitiveInput = () => {
  const [clipboardWarning, setClipboardWarning] = useState(false);
  
  const handlePaste = async () => {
    const clipboard = await Clipboard.getString();
    if (clipboard) {
      setClipboardWarning(true);
      // Let user confirm, or just accept
    }
  };
  
  return (
    <TextInput
      placeholder="Password"
      secureTextEntry
      onPaste={handlePaste}
    />
  );
};
```

---

## 📲 Mobile-Specific Threats

### 1. Jailbreak / Root Detection

Detect compromised devices:
```typescript
// React Native
import { root } from 'react-native-device-check';

const isDeviceCompromised = async () => {
  return await root.isDeviceRooted();
};

// iOS/Android: Check for jailbreak indicators
const checkJailbreak = () => {
  const jailbreakPaths = [
    '/Applications/Cydia.app',
    '/Applications/blackra1n.app',
    '/Library/MobileSubstrate/MobileSubstrate.dylib',
  ];
  
  // Check if any exist, and if so, refuse to proceed
};
```

### 2. Reverse Engineering Protection

```
- Enable code obfuscation (ProGuard on Android, link-time optimization on iOS)
- Use R8/ProGuard to shrink APK, rename classes/methods
- Strip symbols from iOS binary
- Don't hardcode API keys or configuration (use remote config)
```

### 3. Debugger Detection

```swift
// Prevent debugger attachment on iOS
let isBeingDebugged = { () -> Bool in
    var info = kinfo_proc()
    var mib : [Int32] = [CTL_KERN, KERN_PROC, KERN_PROC_PID, getpid()]
    var size = MemoryLayout<kinfo_proc>.stride
    let junk = sysctl(&mib, u_int32_t(mib.count), &info, &size, nil, 0)
    assert(junk == 0, "sysctl failed")
    return (info.kp_proc.p_flag & P_TRACED) != 0
}()
```

---

## 🔍 Security Checklist for Mobile Apps

- [ ] Credentials stored in native secure storage (Keychain, KeyStore, secure_storage)
- [ ] HTTPS only, no hardcoded HTTP endpoints
- [ ] Certificate pinning for sensitive APIs
- [ ] OAuth 2.0 + PKCE, not implicit/password flows
- [ ] Tokens short-lived (1hr access, 7d refresh)
- [ ] No sensitive data logged or visible in UI
- [ ] Clipboard access warnings for password fields
- [ ] No hardcoded API keys, secrets, or credentials
- [ ] Biometric authentication optional (don't require)
- [ ] Device compromise detection (jailbreak/root checks)
- [ ] Code obfuscation enabled (ProGuard, R8, link-time opt)
- [ ] Debugger detection & prevention
- [ ] Local database encryption if storing PII
- [ ] Screen capture / screenshot blocking for sensitive screens (optional)
- [ ] Secure logout clears all tokens & state
- [ ] Rate limiting on authentication attempts (prevent brute-force)
- [ ] Request/response validation (don't trust client data)
- [ ] Deep link handling securely (validate source)

---

**Version**: 2.7.0  
**Last Updated**: 2026-04-09  
**Author**: SmartWorkz Dev
