# API Keys Setup Guide

## 🔐 Razorpay API Keys Configuration

This guide explains how to securely configure your Razorpay API keys for the Event Management System.

## Getting Your API Keys

1. **Sign up for Razorpay**: https://dashboard.razorpay.com/signup
2. **Navigate to API Keys**: Settings → API Keys
3. **Generate Keys**: Click "Generate Test Keys" or "Generate Live Keys"
4. **Copy Keys**: You'll receive:
   - **Key ID**: `rzp_test_XXXXX` (test) or `rzp_live_XXXXX` (live)
   - **Key Secret**: A long string used for signature verification

⚠️ **NEVER share your Key Secret publicly or commit it to Git!**

## Configuration Methods

### Method 1: Development (application.properties) - NOT RECOMMENDED FOR PRODUCTION

**File**: `server/src/main/resources/application.properties`

```properties
# Razorpay Configuration
razorpay.key.id=rzp_test_YOUR_KEY_ID_HERE
razorpay.key.secret=YOUR_KEY_SECRET_HERE
razorpay.currency=INR
```

⚠️ **Security Notes**:
- This file is gitignored by default
- **NEVER** remove it from `.gitignore`
- **NEVER** commit actual API keys to version control
- Only use for local development
- Use placeholder values in the repository

### Method 2: Environment Variables (RECOMMENDED FOR PRODUCTION)

Environment variables are the most secure way to manage API keys in production.

#### Setting Environment Variables

**Linux/Mac (Bash/Zsh):**
```bash
# Temporary (current session only)
export RAZORPAY_KEY_ID="rzp_live_YOUR_KEY_ID"
export RAZORPAY_KEY_SECRET="YOUR_KEY_SECRET"

# Permanent (add to ~/.bashrc or ~/.zshrc)
echo 'export RAZORPAY_KEY_ID="rzp_live_YOUR_KEY_ID"' >> ~/.bashrc
echo 'export RAZORPAY_KEY_SECRET="YOUR_KEY_SECRET"' >> ~/.bashrc
source ~/.bashrc
```

**Windows (Command Prompt):**
```cmd
# Temporary
set RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_ID
set RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET

# Permanent (System Environment Variables)
setx RAZORPAY_KEY_ID "rzp_live_YOUR_KEY_ID"
setx RAZORPAY_KEY_SECRET "YOUR_KEY_SECRET"
```

**Windows (PowerShell):**
```powershell
# Temporary
$env:RAZORPAY_KEY_ID="rzp_live_YOUR_KEY_ID"
$env:RAZORPAY_KEY_SECRET="YOUR_KEY_SECRET"

# Permanent (User scope)
[System.Environment]::SetEnvironmentVariable('RAZORPAY_KEY_ID', 'rzp_live_YOUR_KEY_ID', 'User')
[System.Environment]::SetEnvironmentVariable('RAZORPAY_KEY_SECRET', 'YOUR_KEY_SECRET', 'User')
```

#### Update application.properties to use environment variables:

```properties
# Razorpay Configuration (reads from environment)
razorpay.key.id=${RAZORPAY_KEY_ID:rzp_test_placeholder}
razorpay.key.secret=${RAZORPAY_KEY_SECRET:placeholder_secret}
razorpay.currency=INR
```

The `:placeholder` syntax provides fallback values if env variables aren't set.

### Method 3: Cloud Platform Configuration

#### AWS Elastic Beanstalk
1. Navigate to your application environment
2. Go to **Configuration** → **Software**
3. Scroll to **Environment properties**
4. Add:
   - `RAZORPAY_KEY_ID` = `rzp_live_XXXXX`
   - `RAZORPAY_KEY_SECRET` = `your_secret`

#### Heroku
```bash
heroku config:set RAZORPAY_KEY_ID=rzp_live_XXXXX
heroku config:set RAZORPAY_KEY_SECRET=your_secret
```

Or via Dashboard:
1. Go to your app → **Settings**
2. Click **Reveal Config Vars**
3. Add the variables

#### Azure App Service
1. Navigate to your App Service
2. Go to **Configuration** → **Application settings**
3. Click **+ New application setting**
4. Add both keys

#### Google Cloud Run
```bash
gcloud run services update YOUR_SERVICE_NAME \
  --set-env-vars RAZORPAY_KEY_ID=rzp_live_XXXXX,RAZORPAY_KEY_SECRET=your_secret
```

#### Docker / Docker Compose

**docker-compose.yml:**
```yaml
services:
  backend:
    image: event-management-backend
    environment:
      - RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}
      - RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET}
    env_file:
      - .env  # Load from .env file
```

**Create .env file** (add to .gitignore):
```
RAZORPAY_KEY_ID=rzp_live_XXXXX
RAZORPAY_KEY_SECRET=your_secret
```

**Docker run command:**
```bash
docker run -e RAZORPAY_KEY_ID=rzp_live_XXXXX \
           -e RAZORPAY_KEY_SECRET=your_secret \
           event-management-backend
```

### Method 4: Kubernetes Secrets

```bash
# Create secret
kubectl create secret generic razorpay-secrets \
  --from-literal=key-id=rzp_live_XXXXX \
  --from-literal=key-secret=your_secret

# Use in deployment
```

**deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: event-management-backend
spec:
  template:
    spec:
      containers:
      - name: backend
        image: event-management-backend:latest
        env:
        - name: RAZORPAY_KEY_ID
          valueFrom:
            secretKeyRef:
              name: razorpay-secrets
              key: key-id
        - name: RAZORPAY_KEY_SECRET
          valueFrom:
            secretKeyRef:
              name: razorpay-secrets
              key: key-secret
```

## Frontend Configuration

The Razorpay Key ID is needed in the frontend, but it's **safe to expose** (it's a public identifier).

**File**: `client/src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  razorpayKeyId: 'rzp_test_YOUR_KEY_ID'  // Safe to commit - public key
};
```

**File**: `client/src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api',
  razorpayKeyId: 'rzp_live_YOUR_PRODUCTION_KEY_ID'  // Safe to commit
};
```

## Security Best Practices

### ✅ DO:
- Use environment variables in production
- Use secrets managers (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault)
- Rotate keys periodically
- Use test keys for development
- Use live keys only in production
- Restrict API key permissions in Razorpay dashboard
- Monitor API key usage in Razorpay dashboard

### ❌ DON'T:
- Commit API keys to Git
- Share API keys in Slack/Email
- Use production keys in development
- Hard-code keys in source code
- Log API keys in application logs
- Expose Key Secret in frontend code
- Share keys with unauthorized team members

## Testing Your Configuration

### Verify Environment Variables (Backend):

```bash
# Linux/Mac
echo $RAZORPAY_KEY_ID
echo $RAZORPAY_KEY_SECRET

# Windows (Command Prompt)
echo %RAZORPAY_KEY_ID%
echo %RAZORPAY_KEY_SECRET%

# Windows (PowerShell)
echo $env:RAZORPAY_KEY_ID
echo $env:RAZORPAY_KEY_SECRET
```

### Test Backend Connection:

Start your Spring Boot application and check logs:
```
Successfully connected to Razorpay with Key ID: rzp_test_XXXXX
```

Or make a test API call:
```bash
curl -X POST http://localhost:8080/api/payment/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 100000, "currency": "INR"}'
```

## Troubleshooting

### Issue: "Invalid API Key"
- **Solution**: Verify keys are copied correctly without extra spaces
- Check if using test key in test mode and live key in production

### Issue: "Environment variable not found"
- **Solution**: Restart terminal/IDE after setting environment variables
- Verify variables are set: `printenv | grep RAZORPAY` (Linux/Mac)

### Issue: "Signature verification failed"
- **Solution**: Ensure Key Secret matches the Key ID being used
- Check if keys haven't been regenerated in Razorpay dashboard

## Key Rotation

If your keys are compromised:

1. **Immediately**: Generate new keys in Razorpay dashboard
2. **Update**: All deployment environments with new keys
3. **Revoke**: Old keys in Razorpay dashboard
4. **Monitor**: Check for unauthorized transactions
5. **Audit**: Review access logs

## Support

- **Razorpay Documentation**: https://razorpay.com/docs/
- **Razorpay Support**: https://razorpay.com/support/
- **Security Issues**: security@razorpay.com

---

**Remember**: Your API Key Secret is like a password. Treat it with the same level of security! 🔐
