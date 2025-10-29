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

1. **Initial Request**: When you use the credentials, n8n sends your API key to the authentication endpoint (`POST /login/api-key-auth`)
2. **Token Retrieval**: Belake.ai validates the API key and returns an access token
3. **Bearer Token**: The access token is used as a Bearer token in the Authorization header for all subsequent requests
4. **Automatic Refresh**: The authentication is handled automatically for each request

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

- Backend returned an unexpected response format
- Check backend status and logs
- Verify API key permissions
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

Tip: For chat workflows, reuse the same **Chat ID** to maintain conversation context across messages.

### Multiple Instances

If you're working with multiple Belake.ai instances:

- Create separate credentials for each instance
- Use naming conventions to distinguish them
- Test workflows before deploying

## Need Help?

- **Documentation**: Check the main [README](../README.md)
- **n8n Community**: Visit the [n8n Community Forum](https://community.n8n.io/)
- **Belake.ai Support**: Contact Belake.ai support for API-related issues

## Version History

- **v1.0.0**: Initial implementation with API key authentication
