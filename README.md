# n8n-nodes-belakeai

This is an n8n community node. It lets you use Belake.ai in your n8n workflows.

Belake.ai is an AI platform that provides intelligent agents, chat interactions, data source management, department organization, and language model integration to enhance your automation workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Agent

* **Get Agent by ID** - Retrieves detailed information about a specific agent using its identifier
* **Get Agents** - Retrieves a list of all available agents

### Chat

* **Get Chat by ID** - Retrieves a specific chat conversation using its identifier
* **Get Chats** - Retrieves a list of all chats
* **Send Message** - Sends a message to AI agents, with support for multiple agents, language specification, optional chat continuation, and chat visibility control

### Datasource

* **Get Datasource by ID** - Retrieves detailed information about a specific datasource using its identifier
* **Get Datasources** - Retrieves a list of all available datasources

### Department

* **Get Department by ID** - Retrieves detailed information about a specific department using its identifier
* **Get Departments** - Retrieves a list of all departments

### Language Model

* **Get Language Model by ID** - Retrieves detailed information about a specific language model using its identifier
* **Get Language Models** - Retrieves a list of all available language models

## Credentials

To use this node, you need to authenticate with Belake.ai using API key authentication.

### Prerequisites

1. **Belake.ai Account**: You need an active Belake.ai account. If you don't have one, sign up at [https://www.belake.ai/](https://www.belake.ai/)
2. **Backend URL**: Your Belake.ai backend instance URL (e.g., `https://[instance].belake.ai`)
3. **API Key**: Obtain your API key from the Belake.ai portal

### Authentication Method

**API Key Authentication** - This node uses API key-based authentication where:

* You provide your Backend URL and API Key in the credential configuration
* The node automatically exchanges your API key for a bearer token
* The bearer token is used for all subsequent API requests
* Authentication is handled automatically on each request

### Setting Up Credentials

1. In n8n, create a new credential and select "Belake API"
2. Enter your **Backend URL** (must include protocol, e.g., `https://[your-instance].belake.ai`)
3. Enter your **API Key** from the Belake.ai portal
4. Click "Test" to verify your credentials work correctly
5. Save the credential

For detailed credential setup instructions, see the [credentials documentation](credentials/README.md).

## Compatibility

This node requires n8n version 1.0.0 or higher. It has been tested with n8n versions 1.0.0 and above.

The node uses the n8n Nodes API version 1 with strict mode enabled.

## Usage

### Basic Workflow Example

A common use case is to send a message to AI agents and process the response:

1. Add a Belake.ai node to your workflow
2. Select your Belake API credentials
3. Choose the **Chat** resource and **Send Message** operation
4. Configure the message parameters:

   * **Message**: The message content to send
   * **Agent IDs**: Array of agent IDs to send the message to
   * **Language**: Language code (default: `pt-br`)
   * **Chat ID** (optional): For continuing an existing conversation
   * **Hide Chat**: Boolean to control chat visibility in response
5. Execute the workflow

### Retrieving Information

To retrieve information about available resources:

1. Select the appropriate resource (Agent, Datasource, Department, or Language Model)
2. Choose **Get [Resource]s** to list all available items
3. Use **Get [Resource] by ID** to retrieve specific item details using its identifier

### Best Practices

* Use descriptive names for your credentials to distinguish between different Belake.ai instances or environments
* Store sensitive information like API keys securely
* Handle errors appropriately in your workflows
* Use the chat continuation feature (Chat ID) to maintain conversation context across multiple messages

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Belake.ai homepage](https://www.belake.ai/)
* [Belake.ai API credentials documentation](credentials/README.md)

## Version history

* **v1.0.0** - First release
  * Support for Agent, Chat, Datasource, Department, and Language Model resources
  * API key authentication
  * Operations for retrieving and managing Belake.ai resources
  * Chat message sending with multi-agent support and language specification
