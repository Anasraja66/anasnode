# Meta WhatsApp — Anaos (one-time platform setup)

End clients only click **Connect with Meta** in the dashboard. This doc is for **you** (Anaos owner) setting up the Meta app once.

## 1. Create Meta app

1. https://developers.facebook.com/ → **Create App** → **Business**
2. Add product: **WhatsApp**
3. Note **App ID** and **App Secret** (Settings → Basic)

## 2. Facebook Login for Business + Embedded Signup

1. App Dashboard → **Facebook Login for Business** → **Configurations**
2. **Create from template** → **WhatsApp Embedded Signup Configuration**
3. Copy **Configuration ID**

## 3. OAuth domains (required)

**Facebook Login for Business → Settings → Client OAuth settings**

- Client OAuth login: **Yes**
- Web OAuth login: **Yes**
- Login with JavaScript SDK: **Yes**
- **Allowed domains:** `localhost` (dev), your production domain
- **Valid OAuth redirect URIs:**
  - `http://localhost:3000/dashboard/integrations/connect/whatsapp`
  - `https://YOUR-DOMAIN/dashboard/integrations/connect/whatsapp`

## 4. Webhooks (app level)

**WhatsApp → Configuration**

- Callback URL: `https://YOUR-DOMAIN/api/webhooks/whatsapp`
- Verify token: same as `WHATSAPP_VERIFY_TOKEN` in `.env`
- Subscribe: `messages` (and `account_update` when available)

For local dev use **ngrok** — Meta cannot call `localhost`.

## 5. Environment variables

```env
META_APP_ID="your-app-id"
META_APP_SECRET="your-app-secret"
META_FB_LOGIN_CONFIG_ID="your-configuration-id"
NEXT_PUBLIC_META_APP_ID="same-as-app-id"
NEXT_PUBLIC_META_FB_LOGIN_CONFIG_ID="same-as-config-id"
META_GRAPH_API_VERSION="v21.0"
META_OAUTH_REDIRECT_URI="http://localhost:3000/dashboard/integrations/connect/whatsapp"
```

## 6. Test

1. Add yourself as **Admin/Developer** on the Meta app
2. Run Anaos → Integrations → WhatsApp → **Connect with Meta**
3. Complete popup → dashboard should show **Connected**

## 7. Go live

- **App Review** for `whatsapp_business_messaging` / `whatsapp_business_management`
- **Business Verification**
- Switch app to **Live** mode

Until then, only app roles (admin/developer/tester) can complete Embedded Signup.

## Tech Provider path

For production like ManyChat (any business customer), apply as **WhatsApp Tech Provider** in Meta partner docs. Embedded Signup is the default onboarding path for ISVs.
