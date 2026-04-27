# Belake.ai API Credentials

This document describes how to configure and use the Belake.ai API credentials in n8n.

## Overview

The Belake.ai API credentials provide secure authentication to interact with Belake.ai services. These credentials use API key-based authentication, where an initial API key is used to obtain a bearer token for subsequent requests.

## What You Need

Before configuring credentials, ensure you have:

1. **Backend URL**: The URL of your Belake.ai backend instance
   - Format: `https://[your-instance].belake.ai`
   - No trailing slash required
   - Must include the protocol (http:// or https://)
   - Examples:
     - `https://acme.belake.ai`
     - `https://your-team.belake.ai`

2. **API Key**: Your API key from the Belake.ai portal
   - This is obtained when you create an account
   - Stored securely by n8n
   - Has associated permissions for your account

## Setting Up Credentials

### Step 1: Access Credential Configuration

1. In n8n, navigate to **Credentials** (or go to a node that requires these credentials)
2. Select **Belake API** from the credential type dropdown
3. Click **Create New Credential**

### Step 2: Enter Your Information

Fill in the required fields:

#### Backend URL

- Enter your complete Belake.ai backend URL
- Don't add path segments or query parameters
- Test that the URL is reachable from your network

#### API Key

- Paste your API key from the Belake.ai portal
- This field is masked for security
- Ensure no extra spaces are included
- Keep this key confidential

### Step 3: Test Your Credentials

1. Click the **Test** button
2. The system will attempt to authenticate with the provided credentials
3. Success message confirms your setup is correct
4. Error messages indicate what needs to be fixed

## How It Works

### Authentication Flow

The Belake.ai credentials follow n8n best practices by separating credential **storage** from runtime authentication:

1. **Credential Storage**: The credentials class declaratively returns the `X-API-Key` header — it does not make HTTP requests during storage or retrieval.
2. **Credential Test**: Clicking **Test** issues a single `POST /login/api-key-auth` request to validate that your API Key + Backend URL combination is reachable and accepted by Belake.ai.
3. **Workflow Execution**: When a Belake.ai node runs:
   - It retrieves the stored credentials.
   - Exchanges your API key for a short-lived access token via `POST /login/api-key-auth` using `this.helpers.httpRequest()`.
   - Belake.ai validates the API key and returns the access token.
4. **Bearer Token Usage**: The access token is attached as `Authorization: Bearer …` to every subsequent API call within that execution.
5. **Automatic Process**: This entire flow is transparent — you only configure the Backend URL and API Key once.

### Technical Details

- **Credentials Class**: Declaratively returns auth headers and exposes a `test` request for validation (`ICredentialTestRequest`).
- **Node Execution**: Performs the token exchange at runtime through `this.helpers.httpRequest()`.
- **Token Scope**: Access tokens are obtained per workflow execution to guarantee freshness.
- **Security**: API keys are encrypted by n8n and never exposed in logs, responses, or workflow exports.

### Security Considerations

- **Never commit credentials to version control**
- **Use environment variables in production when possible**
- **Rotate API keys periodically**
- **Revoke unused credentials**
- **Limit access through Belake.ai portal permissions**

## Troubleshooting

### "Backend URL is required" Error

- Check that you've entered a URL in the Backend URL field
- Ensure the field is not empty or contains only whitespace

### "Authentication failed" Error

Possible causes:

- Invalid API key (check for typos or expired key)
- Incorrect backend URL (verify the URL is correct)
- Network connectivity issues
- Backend service is temporarily unavailable

### "Token not returned by API" Error

This error occurs during workflow execution (not credential testing):

- Backend returned an unexpected response format
- Check backend status and logs
- Verify API key permissions
- Ensure the authentication endpoint `/login/api-key-auth` is accessible
- Contact Belake.ai support if the issue persists

### Connection Issues

- **URL reachable?** Verify the backend URL from a browser
- **Network access?** Check firewall and proxy settings
- **SSL/TLS?** Ensure proper certificates for HTTPS connections

## Best Practices

### Organization

- **Use descriptive names**: Name credentials to indicate their purpose
  - Good: "Production Belake.ai"
  - Avoid: "Test", "Credential 1"

### Credential Management

- **Separate environments**: Use different credentials for dev/staging/prod
- **Document usage**: Note which workflows use which credentials
- **Regular review**: Periodically review and clean up unused credentials

### Security

- **Limit scope**: Only grant necessary permissions in Belake.ai
- **Monitor usage**: Check for unexpected activity
- **Update promptly**: Apply security updates to n8n and the node
- **Secure storage**: Ensure n8n data directory permissions are configured correctly

## API Key Management

### Obtaining an API Key

1. Log into the Belake.ai portal
2. Navigate to your account settings or API section
3. Generate a new API key
4. Copy the key immediately (it won't be shown again)
5. Store it securely

### Regenerating a Key

If you need to regenerate your API key:

1. Generate a new key in the Belake.ai portal
2. Update all n8n credentials using the old key
3. Revoke the old key in Belake.ai
4. Test that workflows still function correctly

### Key Permissions

Your API key inherits permissions from your Belake.ai account. Contact your Belake.ai administrator if you need:

- Additional permissions
- Scope restrictions
- Custom access controls

## Integration Examples

### Using Credentials in Nodes

Once configured, select your credential from the dropdown in any Belake.ai node:

1. Add a Belake.ai node to your workflow
2. In the credentials field, select your saved credential
3. Choose the operation you want to perform
4. Configure the operation-specific fields
5. Execute the workflow

### Multiple Instances

If you're working with multiple Belake.ai instances:

- Create separate credentials for each instance
- Use naming conventions to distinguish them
- Test workflows before deploying

## Need Help?

- **Documentation**: Check the main [README](../README.md)
- **n8n Community**: Visit the [n8n Community Forum](https://community.n8n.io/)
- **Belake.ai Support**: Contact Belake.ai support for API-related issues

## Architecture Notes

### Why Credentials Don't Make HTTP Requests

Following n8n's official guidelines, credential classes should:

- ✅ Store authentication information securely
- ✅ Return authentication headers declaratively
- ❌ **NOT** make HTTP requests directly

This design ensures:

- **Performance**: Credentials are loaded once and reused
- **Reliability**: No network dependencies during credential validation
- **Compliance**: Meets n8n community node requirements for marketplace submission
- **Maintainability**: Clear separation between credential storage and authentication logic

### Implementation Details

The authentication implementation uses:

- **Credential Class** (`BelakeAiApi.credentials.ts`): Stores API key with `IAuthenticateGeneric` type
- **Node Execution** (`BelakeAi.node.ts`): Contains `execute()` method that:
  1. Retrieves credentials using `this.getCredentials()`
  2. Exchanges API key for access token via `this.helpers.httpRequest()`
  3. Uses token for all subsequent requests in that execution
- **Operations Map**: Declarative structure mapping resources and operations to their API calls
- **Type Safety**: Full TypeScript support with proper `IDataObject` typing

## Version History

The credential implementation follows the same release cycle as the node. See the project [CHANGELOG](../CHANGELOG.md) and the [Version history section in the main README](../README.md#version-history) for the full history.
