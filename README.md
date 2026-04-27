# n8n-nodes-belakeai

This is an [n8n community node](https://docs.n8n.io/integrations/#community-nodes). It lets you use [Belake.ai](https://www.belake.ai/) inside your n8n workflows.

Belake.ai is an AI platform that provides intelligent agents, chat interactions, datasources, group organization, language model integrations, tools (HTTP/MCP), and workspace governance — all of which can be orchestrated from this node.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation. The package is published on npm as `n8n-nodes-belakeai`.

All API calls performed by this node are routed through the `/v1` prefix automatically — you only need to configure the base **Backend URL** in the credentials.

## Operations

### Operations matrix

| Resource | Operation | HTTP method + path |
| --- | --- | --- |
| Agent | Create Agent | `POST /v1/agents?workspaceId={workspaceId}` |
| Agent | Update Agent | `PATCH /v1/agents/{agentId}?workspaceId={workspaceId}` |
| Agent | Delete Agent by ID | `DELETE /v1/agents/{agentId}` |
| Agent | Get Agent by ID | `GET /v1/agents/{agentId}` |
| Agent | Get Agents | `GET /v1/agents` |
| Chat | Send Message | `POST /v1/chats/messages` |
| Chat | Get Chat by ID | `GET /v1/chats/{chatId}` |
| Chat | Get Chats | `GET /v1/chats` |
| Datasource | Get Datasource by ID | `GET /v1/datasources/{datasourceId}` |
| Datasource | Get Datasources | `GET /v1/datasources` |
| Group | Create Group | `POST /v1/groups?workspaceId={workspaceId}` |
| Group | Delete Group | `DELETE /v1/groups/{groupId}` |
| Group | Get Group by ID | `GET /v1/groups/{groupId}` |
| Group | Get Groups | `GET /v1/groups` |
| Language Model | Create Language Model | `POST /v1/languagemodels` |
| Language Model | Update Language Model | `PATCH /v1/languagemodels/{id}` |
| Language Model | Delete Language Model by ID | `DELETE /v1/languagemodels/{id}` |
| Language Model | Get Language Model by ID | `GET /v1/languagemodels/{id}` |
| Language Model | Get Language Models | `GET /v1/languagemodels` |
| Language Model | Link Language Model to Workspace | `POST /v1/workspaces/{workspaceId}/languagemodels` |
| Language Model | Unlink Language Model from Workspace | `DELETE /v1/workspaces/{workspaceId}/languagemodels/{id}` |
| Tool | Create Tool | `POST /v1/tools?workspaceId={workspaceId}` |
| Tool | Update Tool | `PATCH /v1/tools/{toolId}` |
| Tool | Delete Tool by ID | `DELETE /v1/tools/{toolId}` |
| User | Create User | `POST /v1/users` |
| User | Activate User by ID | `PUT /v1/users/{userId}/activate` |
| User | Revoke User by ID | `PUT /v1/users/{userId}/revoke` |
| User | Delete User by ID | `DELETE /v1/users/{userId}` |
| Workspace | Create Workspace | `POST /v1/workspaces` |
| Workspace | Delete Workspace | `DELETE /v1/workspaces/{workspaceId}` |
| Workspace | Get Workspace by ID | `GET /v1/workspaces/{workspaceId}` |
| Workspace | Get Workspaces | `GET /v1/workspaces` |
| Workspace | Add User to Workspace | `POST /v1/workspaces/{workspaceId}/users` |
| Workspace | Add Members to Workspace | `POST /v1/workspaces/{workspaceId}/users` (one request per user, `role: "member"`) |
| Workspace | Remove Users from Workspace | `DELETE /v1/workspaces/{workspaceId}/users/{userId}` (one request per user) |
| Workspace | Add Users to Groups | `POST /v1/workspaces/{workspaceId}/groups/{groupId}/users` (one request per user × group) |
| Workspace | Remove User from Group | `DELETE /v1/workspaces/{workspaceId}/groups/{groupId}/users/{userId}` (one request per user) |

### Agent

* **Create Agent** — Creates a new AI agent in a workspace. Required: `Name`, `Prompt`, `Language Model ID`, `Workspace ID`. Optional: `Description`, `Display Mode` (`Apenas Eu` or `Grupos` — when `Grupos` is selected, `Group IDs` becomes required as a JSON array), `Tools` (JSON array of tool IDs), `Enable Web Search`, `Enable Thinking`, `Thinking Level` (`Mínimo`, `Baixo`, `Médio`, `Alto` — only when `Enable Thinking` is on), `Datasource ID`. `enableDeepAgent` is always sent as `false` and `thinkingBudgetTokens` as `null` to mirror the backend contract.
* **Update Agent** — Partial update via `PATCH`. Always-visible fields: `Agent ID` and `Workspace ID`. The optional **Update Fields** collection accepts: `Datasource ID`, `Departments IDs`, `Description`, `Display Mode`, `Enable Thinking`, `Enable Web Search`, `Language Model ID`, `Name`, `Prompt`, `Thinking Level`, `Tools`. **Only the fields you explicitly add are sent in the body.** `enableDeepAgent: false` and `thinkingBudgetTokens: null` are always included. When `Enable Thinking` is `false`, `thinkingLevel` is forced to `null`; when `true`, the chosen level is sent.
* **Delete Agent by ID** — Deletes an agent by its identifier.
* **Get Agent by ID** — Retrieves a specific agent.
* **Get Agents** — Lists all agents (optionally scoped by `Workspace ID`).

### Chat

* **Send Message** — Sends a message to one or more agents. Required: `Message`, `Agent IDs` (JSON array), `Language` (default `pt-br`). Optional: `Chat ID` (to continue an existing conversation) and `Hide Chat` (boolean controlling chat visibility in the response).
* **Get Chat by ID** — Retrieves a single chat conversation.
* **Get Chats** — Lists all chats.

### Datasource

* **Get Datasource by ID** — Retrieves a specific datasource.
* **Get Datasources** — Lists all available datasources.

### Group

* **Create Group** — Creates a new group inside a workspace. Required: `Name`, `Workspace ID`. Optional: `Description`.
* **Delete Group** — Deletes a group.
* **Get Group by ID** — Retrieves a specific group.
* **Get Groups** — Lists all groups (optionally scoped by `Workspace ID`).

### Language Model

* **Create Language Model** — Creates a new language model. The `Platform` selector drives which fields appear:
  | Platform (UI label / internal value) | Fields exposed (besides Name, Description, Type, Is Default, API Model) |
  | --- | --- |
  | **OpenAI** (`OpenAI`) | API Key |
  | **Azure OpenAI** (`Microsoft`) | API Key, Endpoint, API Version, Model Name, Max Tokens |
  | **Azure Foundry** (`AzureFoundry`) | API Key, Endpoint, API Version, Max Tokens |
  | **Gemini (Vertex)** (`Vertex`) | API Key |
  | **AWS Bedrock** (`Bedrock`) | Region, Access Key, Secret Key, Bearer Token, Max Tokens |
  | **Anthropic** (`Anthropic`) | API Key, Max Tokens |

  * Supported `Type` values: `Chat Completion`, `OCR`, `Multimodal`, `Translation`, `Emedding`, `Web Search` (sent verbatim).
  * `tool` is mapped automatically from the chosen `Platform` (`OpenAI` → `OpenAI`, `Microsoft` → `Azure OpenAI`, `AzureFoundry` → `Azure Foundry`, `Vertex` → `Gemini`, `Bedrock` → `AWS Bedrock`, `Anthropic` → `Anthropic`).
  * `isActive` is always sent as `true` and `departmentsIds` as an empty array.

* **Update Language Model** — Partial update via `PATCH`. Always-visible: `Language Model ID` and `Platform` (drives which fields are available inside **Update Fields**). The optional **Update Fields** collection accepts (subject to the same platform rules above): `Access Key`, `API Key`, `API Model`, `API Version`, `Bearer Token`, `Description`, `Endpoint`, `Is Default`, `Max Tokens`, `Model Name`, `Name`, `Region`, `Secret Key`, `Type`. **Only the fields you explicitly add are sent in the body.** `platform`, `tool` (derived from `Platform`) and `isActive: true` are always included. The fields `departmentsIds` and `iconUrl` are intentionally **not** exposed and cannot be modified through this node.

* **Delete Language Model by ID** — Removes a language model.
* **Get Language Model by ID** — Retrieves a single language model.
* **Get Language Models** — Lists all language models.
* **Link Language Model to Workspace** — Links an existing language model to a workspace.
* **Unlink Language Model from Workspace** — Unlinks a language model from a workspace.

### Tool

* **Create Tool** — Creates a new tool inside a workspace. The `Tool Type` selector drives which fields appear:
  * **HTTP**:
    * Required: `Name`, `Description`, `Docstring`, `Method` (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`), `URL`, `Auth Type` (`No Auth`, `Basic Auth`, `Bearer Token`, `JWT Bearer`).
    * Optional: `Headers` (key/value collection), `Param Sets` (JSON array), `Body`, plus credential fields specific to the chosen `Auth Type`.
  * **MCP**:
    * Required: `Name`, `Description`, `Docstring`, `Server URL`, `Transport Type` (`HTTP`, `SSE`, `STDIO`), `Auth Type` (`None` or `Bearer`), `Timeout`.
    * Optional: `Auth Config` (key/value collection), `Selected Tools` (JSON array of exposed tool names), bearer token credential when `Auth Type` is `Bearer`.

* **Update Tool** — Partial update via `PATCH`. Always-visible: `Tool ID` and `Tool Type` (HTTP or MCP — drives which fields are available inside **Update Fields**). The optional **Update Fields** collection accepts:
  * **HTTP**: `Auth Type`, `Body`, `Description`, `Docstring`, `Headers`, `Method`, `Name`, `Param Sets`, `URL`.
  * **MCP**: `Auth Config`, `Auth Type`, `Description`, `Docstring`, `Name`, `Selected Tools`, `Server URL`, `Timeout`, `Transport Type`.
  * **Only the fields you explicitly add are sent in the body.** `type` is always sent according to the selected `Tool Type`. The fields `workspaceId` and `iconUrl` are intentionally **not** exposed and cannot be modified through this node.

* **Delete Tool by ID** — Removes a tool.

### User

* **Create User** — Creates a new user. Required: `Email`, `Name`, `Login Type` (`Email e Senha` or `Azure AD`), `Global Role` (`User` or `Global Admin`). The `Password` field is required only when `Login Type` is `Email e Senha`. Optional: `Phone`, `Company Department`, `Job Title`, `Manager Email`.
* **Activate User by ID** — Activates a user.
* **Revoke User by ID** — Revokes (deactivates) a user.
* **Delete User by ID** — Permanently deletes a user.

### Workspace

* **Create Workspace** — Creates a new workspace. Required: `Name`. Optional: `Description`, `Type` (`Sandbox`, `Trial`, or `Production`). The `menuConfig` payload is applied with all features enabled by default.
* **Delete Workspace** — Deletes a workspace.
* **Get Workspace by ID** — Retrieves a single workspace.
* **Get Workspaces** — Lists all workspaces.
* **Add User to Workspace** — Adds a single user with a selectable `Role` (`admin`, `member`, or `owner`).
* **Add Members to Workspace** — Adds one or more users as members. Accepts a JSON array of user IDs and produces **one request per user** with `role: "member"`.
* **Remove Users from Workspace** — Removes one or more users. Accepts a JSON array of user IDs (one request per user).
* **Add Users to Groups** — Adds one or more users to one or more groups within a workspace. Accepts JSON arrays of user IDs and group IDs (one request per user × group).
* **Remove User from Group** — Removes one or more users from a specific group within a workspace. Accepts a JSON array of user IDs (one request per user).

> **Note about batch operations:** every governance operation that receives a JSON array of user IDs (Add Members, Remove Users, Add Users to Groups, Remove User from Group) produces **one output item per user/group pair processed**, so downstream nodes can react to each individual call.

## Credentials

To use this node you need to authenticate with Belake.ai using API key authentication.

### Prerequisites

1. **Belake.ai account** — sign up at [https://www.belake.ai/](https://www.belake.ai/) if you don't have one.
2. **Backend URL** — your Belake.ai backend instance URL (e.g., `https://[instance].belake.ai`). All API routes use the `/v1` prefix automatically — do **not** include it in the URL.
3. **API Key** — issued from the Belake.ai portal.

### Authentication method

This node uses **API Key authentication** with the following flow:

* Your **Backend URL** and **API Key** are stored in the credential (no HTTP requests happen at credential level — fully compliant with n8n's marketplace requirements).
* On every workflow execution, the node exchanges your API key for a bearer token via `POST /login/api-key-auth` using `this.helpers.httpRequest()`.
* That bearer token is then attached as `Authorization: Bearer …` to all subsequent calls within the same execution.

### Setting up credentials

1. In n8n, create a new credential and select **Belake API**.
2. Enter your **Backend URL** including the protocol (e.g., `https://your-team.belake.ai`).
3. Paste your **API Key**.
4. Click **Test** to verify the credentials.
5. Save.

For a deeper walkthrough (including troubleshooting and security guidelines) see [credentials/README.md](credentials/README.md).

## Compatibility

* Requires **n8n ≥ 1.0.0** and the **Nodes API v1** with strict mode enabled.
* TypeScript-first implementation with full `IDataObject` typing — no `any`.
* All operations honor n8n's **Continue on Fail** mode and surface `NodeOperationError` with descriptive messages on validation failures (invalid JSON arrays, missing required fields, etc.).

### Technical implementation

* **Credentials** store the API key and backend URL without performing HTTP requests.
* **Authentication** is performed at execution time using `this.helpers.httpRequest()`.
* **Operations map** — a single declarative `Record<resource, Record<operation, () => Promise<...>>>` keeps each operation's logic isolated and easy to extend.
* **Helpers** — internal `parseIdArray` helper validates JSON-array inputs (e.g., agent IDs, group IDs, tool IDs) and throws user-friendly `NodeOperationError`s when the input is malformed.

## Usage

### Send a message to one or more agents

The most common workflow: send a chat message and route the response.

1. Add a **Belake.ai** node to your workflow.
2. Pick your saved **Belake API** credentials.
3. Resource = **Chat**, Operation = **Send Message**.
4. Configure the parameters:
   * **Message** — the text content to send.
   * **Agent IDs** — JSON array of agent IDs, e.g. `["agent_abc","agent_def"]`.
   * **Language** — language code (default `pt-br`).
   * **Chat ID** *(optional)* — pass an existing chat ID to continue a conversation.
   * **Hide Chat** — controls whether the chat appears in the user's history.
5. Execute.

### Create an HTTP tool and attach it to a new agent

1. **Tool** → **Create Tool**, with `Tool Type = HTTP`. Fill in `Name`, `Description`, `Docstring`, `Method`, `URL`, `Auth Type` (and corresponding credentials), optional `Headers`/`Body`/`Param Sets`, plus `Workspace ID`. Capture the resulting tool ID.
2. **Agent** → **Create Agent**, with the desired `Language Model ID`, `Workspace ID`, and pass the captured tool ID inside the `Tools` JSON array.

### Provision a Language Model and link it to a workspace

1. **Language Model** → **Create Language Model**, picking the appropriate `Platform` (e.g., `Azure OpenAI`) and filling in only the platform-specific fields shown by the UI.
2. **Language Model** → **Link Language Model to Workspace**, passing the new `Language Model ID` and the target `Workspace ID`.
3. *(Optional)* **Language Model** → **Update Language Model** to tweak only the fields you want without overwriting unrelated ones.

### Partially update an Agent / Tool / Language Model

The three `Update *` operations follow the same pattern:

* They expose an **Update Fields** collection that starts empty.
* Add only the fields you actually want to change — anything you leave out is **not** sent to the backend, so it stays untouched.
* For Agent / Language Model the `enableDeepAgent`, `thinkingBudgetTokens`, `platform`, `tool` and `isActive` book-keeping fields are filled in automatically by the node where applicable.

### Best practices

* Use descriptive credential names per Belake.ai instance/environment.
* Use chat continuation (`Chat ID`) to preserve conversation context across messages.
* Wrap fan-out operations (Add Members, Add Users to Groups, etc.) with **Continue on Fail** when partial success is acceptable — the node already produces one output item per user/group pair processed.
* Prefer the `Update *` operations over `Create *` whenever you only need to change a subset of fields, to avoid silently overwriting backend-managed properties.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Belake.ai homepage](https://www.belake.ai/)
* [Belake.ai API credentials documentation](credentials/README.md)
* [Project changelog](CHANGELOG.md) (auto-generated by `auto-changelog`)

## Version history

* **v1.0.3** - API v1 routes and Workspace resource
  * Migrated all API endpoints to `/v1` prefix
  * Replaced Department resource with Group resource
  * Added Workspace resource with Get Workspace by ID and Get Workspaces operations
  * Workspace ID field available across resources for filtering

* **v1.0.2** - Architecture improvements
  * Refactored authentication to comply with n8n best practices
  * Moved token exchange from credentials to node execution
  * Implemented declarative operations map for cleaner code
  * Enhanced type safety (removed `any` types)
  * Improved error handling and code maintainability

* **v1.0.1** - Repository updates
  * Renamed repository references and added lint file

* **v1.0.0** - First release
  * Support for Agent, Chat, Datasource, Department, and Language Model resources
  * API key authentication
  * Operations for retrieving and managing Belake.ai resources
  * Chat message sending with multi-agent support and language specification
