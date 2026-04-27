import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	IDataObject,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

interface BelakeAuthResponse {
	access_token?: string;
	refresh_token?: string;
	[k: string]: unknown;
}

export class BelakeAi implements INodeType {
	description: INodeTypeDescription = {
		// ===== METADATA =====
		displayName: 'Belake.ai',
		name: 'belakeAi',
		icon:  'file:../../icons/belake.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] }}',
		description: 'Belake.ai API operations',
		defaults: {
			name: 'Belake.ai',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		// ===== AUTHENTICATION/CREDENTIALS =====
		credentials: [
			{
				name: 'belakeAiApi',
				required: true,
			},
		],
		properties: [
			// ===== RESOURCE =====
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
				  { name: 'Agent', value: 'agent' },
				  { name: 'Chat', value: 'chat' },
				  { name: 'Datasource', value: 'datasource' },
				  { name: 'Group', value: 'group' },
				  { name: 'Language Model', value: 'languageModel' },
				  { name: 'Tool', value: 'tool' },
				  { name: 'User', value: 'user' },
				  { name: 'Workspace', value: 'workspace' }
				],
				default: 'chat',
			},
			// ===== OPERATIONS =====
			{
				// ===== AGENTS OPERATIONS =====
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {show: { resource: ['agent'],},},
				options: [
					{
						name: 'Create Agent',
						value: 'Create Agent',
						action: 'Create agent',
					},
					{
						name: 'Delete Agent by ID',
						value: 'Delete Agent by ID',
						action: 'Delete agent by id',
					},
					{
						name: 'Get Agent by ID',
						value: 'Get Agent by ID',
						action: 'Get agent by id',
					},
					{
						name: 'Get Agents',
						value: 'Get Agents',
						action: 'Get agents',
					},
					{
						name: 'Update Agent',
						value: 'Update Agent',
						action: 'Update agent',
					},
				],
				default: 'Get Agents',
			},
			{
				// ===== CHAT OPERATIONS =====
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {show: { resource: ['chat'],},},
				options: [
					{
						name: 'Get Chat by ID',
						value: 'Get Chat by ID',
						action: 'Get chat by id',
					},
					{
						name: 'Get Chats',
						value: 'Get Chats',
						action: 'Get chats',
					},
					{
						name: 'Send Message',
						value: 'Send Message',
						action: 'Send message',
					},
				],
				default: 'Send Message',
			},
			{
				// ===== DATASOURCES OPERATIONS =====
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {show: { resource: ['datasource'],},},
				options: [
					{
						name: 'Get Datasource by ID',
						value: 'Get Datasource by ID',
						action: 'Get datasource by id',
					},
					{
						name: 'Get Datasources',
						value: 'Get Datasources',
						action: 'Get datasources',
					},
				],
				default: 'Get Datasources',
			},
			{
				// ===== GROUPS OPERATIONS =====
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {show: { resource: ['group'],},},
				options: [
					{
						name: 'Create Group',
						value: 'Create Group',
						action: 'Create group',
					},
					{
						name: 'Delete Group',
						value: 'Delete Group',
						action: 'Delete group',
					},
					{
						name: 'Get Group by ID',
						value: 'Get Group by ID',
						action: 'Get group by id',
					},
					{
						name: 'Get Groups',
						value: 'Get Groups',
						action: 'Get groups',
					},
				],
				default: 'Get Groups',
			},
			{
				// ===== LANGUAGE MODELS OPERATIONS =====
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {show: { resource: ['languageModel'],},},
				options: [
					{
						name: 'Create Language Model',
						value: 'Create Language Model',
						action: 'Create language model',
					},
					{
						name: 'Delete Language Model by ID',
						value: 'Delete Language Model by ID',
						action: 'Delete language model by id',
					},
					{
						name: 'Get Language Model by ID',
						value: 'Get Language Model by ID',
						action: 'Get language model by id',
					},
					{
						name: 'Get Language Models',
						value: 'Get Language Models',
						action: 'Get language models',
					},
					{
						name: 'Link Language Model to Workspace',
						value: 'Link Language Model to Workspace',
						action: 'Link language model to workspace',
					},
					{
						name: 'Unlink Language Model From Workspace',
						value: 'Unlink Language Model from Workspace',
						action: 'Unlink language model from workspace',
					},
					{
						name: 'Update Language Model',
						value: 'Update Language Model',
						action: 'Update language model',
					},
				],
				default: 'Get Language Models',
			},
			{
				// ===== WORKSPACES OPERATIONS =====
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {show: { resource: ['workspace'],},},
				options: [
					{
						name: 'Add Members to Workspace',
						value: 'Add Members to Workspace',
						action: 'Add members to workspace',
					},
					{
						name: 'Add User to Workspace',
						value: 'Add User to Workspace',
						action: 'Add user to workspace',
					},
					{
						name: 'Add Users to Groups',
						value: 'Add Users to Groups',
						action: 'Add users to groups',
					},
					{
						name: 'Create Workspace',
						value: 'Create Workspace',
						action: 'Create workspace',
					},
					{
						name: 'Delete Workspace',
						value: 'Delete Workspace',
						action: 'Delete workspace',
					},
					{
						name: 'Get Workspace by ID',
						value: 'Get Workspace by ID',
						action: 'Get workspace by id',
					},
					{
						name: 'Get Workspaces',
						value: 'Get Workspaces',
						action: 'Get workspaces',
					},
					{
						name: 'Remove User From Group',
						value: 'Remove User from Group',
						action: 'Remove user from group',
					},
					{
						name: 'Remove Users From Workspace',
						value: 'Remove Users from Workspace',
						action: 'Remove users from workspace',
					},
				],
				default: 'Get Workspaces',
			},
			{
				// ===== TOOLS OPERATIONS =====
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {show: { resource: ['tool'],},},
				options: [
					{
						name: 'Create Tool',
						value: 'Create Tool',
						action: 'Create tool',
					},
					{
						name: 'Delete Tool by ID',
						value: 'Delete Tool by ID',
						action: 'Delete tool by id',
					},
					{
						name: 'Update Tool',
						value: 'Update Tool',
						action: 'Update tool',
					},
				],
				default: 'Create Tool',
			},
			{
				// ===== USERS OPERATIONS =====
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {show: { resource: ['user'],},},
				options: [
					{
						name: 'Activate User by ID',
						value: 'Activate User by ID',
						action: 'Activate user by id',
					},
					{
						name: 'Create User',
						value: 'Create User',
						action: 'Create user',
					},
					{
						name: 'Delete User by ID',
						value: 'Delete User by ID',
						action: 'Delete user by id',
					},
					{
						name: 'Revoke User by ID',
						value: 'Revoke User by ID',
						action: 'Revoke user by id',
					},
				],
				default: 'Create User',
			},
			// ===== FIELDS =====
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['chat'],
						operation: ['Send Message'],
					},
				},
				description: 'The message content to send',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: 'pt-br',
				required: true,
				displayOptions: {
					show: {
						resource: ['chat'],
						operation: ['Send Message'],
					},
				},
				description: 'The language code (e.g., pt-br, en-us)',
			},
			{
				displayName: 'Agent IDs',
				name: 'agentsIds',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['chat'],
						operation: ['Send Message'],
					},
				},
				description: 'Array of agent IDs',
			},
			{
				displayName: 'Chat ID',
				name: 'chatId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['Send Message'],
					},
				},
				description: 'Optional chat identifier for message continuation',
			},
			{
				displayName: 'Chat ID',
				name: 'chatId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['chat'],
						operation: ['Get Chat by ID'],
					},
				},
				description: 'The chat identifier to retrieve',
			},
			{
				displayName: 'Hide Chat',
				name: 'hideChat',
				type: 'boolean',
				default: false,

				displayOptions: {
					show: {
						resource: ['chat'],
						operation: ['Send Message'],
					},
				},
				description: 'Whether to hide the chat in the response',
			},
			{
				displayName: 'Datasource ID',
				name: 'datasourceId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['datasource'],
						operation: ['Get Datasource by ID'],
					},
				},
				description: 'The datasource identifier',
			},
			{
				displayName: 'Language Model ID',
				name: 'languageModelId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['languageModel', 'agent'],
						operation: [
							'Get Language Model by ID',
							'Create Agent',
							'Delete Language Model by ID',
							'Link Language Model to Workspace',
							'Unlink Language Model from Workspace',
							'Update Language Model',
						],
					},
				},
				description: 'The language model identifier',
			},
			{
				displayName: 'Agent ID',
				name: 'agentId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['agent'],
						operation: ['Get Agent by ID', 'Delete Agent by ID', 'Update Agent'],
					},
				},
				description: 'The agent identifier',
			},
			{
				displayName: 'Agent Name',
				name: 'agentName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['agent'],
						operation: ['Create Agent'],
					},
				},
				description: 'The name of the agent to create',
			},
			{
				displayName: 'Agent Description',
				name: 'agentDescription',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['agent'],
						operation: ['Create Agent'],
					},
				},
				description: 'The description of the agent',
			},
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['agent'],
						operation: ['Create Agent'],
					},
				},
				description: 'The system prompt that guides the agent behavior',
			},
			{
				displayName: 'Display Mode',
				name: 'displayMode',
				type: 'options',
				default: 'me',
				required: true,
				options: [
					{ name: 'Apenas Eu', value: 'me' },
					{ name: 'Grupos', value: 'group' },
				],
				displayOptions: {
					show: {
						resource: ['agent'],
						operation: ['Create Agent'],
					},
				},
				description: 'Who can see this agent: only the creator or specific groups',
			},
			{
				displayName: 'Group IDs',
				name: 'departmentsIds',
				type: 'string',
				default: '',
				required: true,
				placeholder: '["id1","id2"]',
				displayOptions: {
					show: {
						resource: ['agent'],
						operation: ['Create Agent'],
						displayMode: ['group'],
					},
				},
				description: 'JSON array of group IDs that can see this agent',
			},
			{
				displayName: 'Tools',
				name: 'tools',
				type: 'string',
				default: '',
				placeholder: '["id1","id2"]',
				displayOptions: {
					show: {
						resource: ['agent'],
						operation: ['Create Agent'],
					},
				},
				description: 'Optional JSON array of tool IDs available to the agent',
			},
			{
				displayName: 'Enable Web Search',
				name: 'enableWebSearch',
				type: 'boolean',
				default: false,
				required: true,
				displayOptions: {
					show: {
						resource: ['agent'],
						operation: ['Create Agent'],
					},
				},
				description: 'Whether to enable web search for this agent',
			},
			{
				displayName: 'Enable Thinking',
				name: 'enableThinking',
				type: 'boolean',
				default: false,
				required: true,
				displayOptions: {
					show: {
						resource: ['agent'],
						operation: ['Create Agent'],
					},
				},
				description: 'Whether to enable reasoning/thinking for this agent',
			},
			{
				displayName: 'Thinking Level',
				name: 'thinkingLevel',
				type: 'options',
				default: 'low',
				required: true,
				options: [
					{ name: 'Mínimo', value: 'minimal' },
					{ name: 'Baixo', value: 'low' },
					{ name: 'Médio', value: 'medium' },
					{ name: 'Alto', value: 'high' },
				],
				displayOptions: {
					show: {
						resource: ['agent'],
						operation: ['Create Agent'],
						enableThinking: [true],
					},
				},
				description: 'The reasoning level for the agent',
			},
			{
				displayName: 'Datasource ID',
				name: 'agentDatasourceId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['agent'],
						operation: ['Create Agent'],
					},
				},
				description: 'Optional datasource identifier to attach to the agent',
			},
			{
				displayName: 'Group ID',
				name: 'groupId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['group', 'workspace'],
						operation: [
							'Get Group by ID',
							'Delete Group',
							'Remove User from Group',
						],
					},
				},
				description: 'The group identifier',
			},
			{
				displayName: 'Group Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['Create Group'],
					},
				},
				description: 'The name of the group to create',
			},
			{
				displayName: 'Group Description',
				name: 'description',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['Create Group'],
					},
				},
				description: 'The description of the group to create',
			},
			{
				displayName: 'User IDs',
				name: 'userIds',
				type: 'string',
				default: '',
				required: true,
				placeholder: '["id1","id2"]',
				displayOptions: {
					show: {
						resource: ['workspace'],
						operation: [
							'Add Members to Workspace',
							'Remove Users from Workspace',
							'Add Users to Groups',
							'Remove User from Group',
						],
					},
				},
				description: 'JSON array of user IDs. One request will be made per user ID.',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['workspace', 'user'],
						operation: [
							'Add User to Workspace',
							'Activate User by ID',
							'Revoke User by ID',
							'Delete User by ID',
						],
					},
				},
				description: 'The user identifier',
			},
			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				default: 'member',
				required: true,
				options: [
					{ name: 'Admin', value: 'admin' },
					{ name: 'Member', value: 'member' },
					{ name: 'Owner', value: 'business_unit' },
				],
				displayOptions: {
					show: {
						resource: ['workspace'],
						operation: ['Add User to Workspace'],
					},
				},
				description: 'The role to assign to the user in the workspace',
			},
			{
				displayName: 'Group IDs',
				name: 'groupIds',
				type: 'string',
				default: '',
				required: true,
				placeholder: '["id1","id2"]',
				displayOptions: {
					show: {
						resource: ['workspace'],
						operation: ['Add Users to Groups'],
					},
				},
				description: 'JSON array of group IDs to add each user to',
			},
			{
				displayName: 'Workspace Name',
				name: 'workspaceName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['workspace'],
						operation: ['Create Workspace'],
					},
				},
				description: 'The name of the workspace to create',
			},
			{
				displayName: 'Workspace Description',
				name: 'workspaceDescription',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['workspace'],
						operation: ['Create Workspace'],
					},
				},
				description: 'The description of the workspace to create',
			},
			{
				displayName: 'Workspace Type',
				name: 'workspaceType',
				type: 'options',
				default: 'Sandbox',
				required: true,
				options: [
					{ name: 'Sandbox', value: 'Sandbox' },
					{ name: 'Trial', value: 'Trial' },
					{ name: 'Production', value: 'Production' },
				],
				displayOptions: {
					show: {
						resource: ['workspace'],
						operation: ['Create Workspace'],
					},
				},
				description: 'The type of workspace to create',
			},
			{
				displayName: 'Name',
				name: 'userName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['Create User'],
					},
				},
				description: 'The full name of the user',
			},
			{
				displayName: 'Email',
				name: 'userEmail',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'user@belake.ai',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['Create User'],
					},
				},
				description: 'The email address of the user',
			},
			{
				displayName: 'Login Type',
				name: 'loginType',
				type: 'options',
				default: 'DEFAULT',
				required: true,
				options: [
					{ name: 'Email E Senha', value: 'DEFAULT' },
					{ name: 'Azure AD', value: 'AZUREAD' },
				],
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['Create User'],
					},
				},
				description: 'How the user will authenticate',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['Create User'],
						loginType: ['DEFAULT'],
					},
				},
				description: 'The password for the user (only required when login type is Email e Senha)',
			},
			{
				displayName: 'Global Role',
				name: 'globalRole',
				type: 'options',
				default: 'user',
				required: true,
				options: [
					{ name: 'User', value: 'user' },
					{ name: 'Global Admin', value: 'global_admin' },
				],
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['Create User'],
					},
				},
				description: 'The global role assigned to the user',
			},
			{
				displayName: 'Phone',
				name: 'userPhone',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['Create User'],
					},
				},
				description: 'Optional phone number for the user',
			},
			{
				displayName: 'Company Department',
				name: 'companyDepartment',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['Create User'],
					},
				},
				description: 'Optional company department of the user',
			},
			{
				displayName: 'Job Title',
				name: 'jobTitle',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['Create User'],
					},
				},
				description: 'Optional job title of the user',
			},
			{
				displayName: 'Manager Email',
				name: 'managerEmail',
				type: 'string',
				default: '',
				placeholder: 'manager@belake.ai',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['Create User'],
					},
				},
				description: 'Optional email of the user\'s manager',
			},
			{
				displayName: 'Tool ID',
				name: 'toolId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['tool'],
						operation: ['Delete Tool by ID', 'Update Tool'],
					},
				},
				description: 'The tool identifier',
			},
			{
				displayName: 'Tool Name',
				name: 'toolName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['tool'],
						operation: ['Create Tool'],
					},
				},
				description: 'The name of the tool to create',
			},
			{
				displayName: 'Tool Type',
				name: 'toolType',
				type: 'options',
				default: 'http',
				required: true,
				options: [
					{ name: 'HTTP', value: 'http' },
					{ name: 'MCP', value: 'mcp' },
				],
				displayOptions: {
					show: {
						resource: ['tool'],
						operation: ['Create Tool', 'Update Tool'],
					},
				},
				description: 'The type of the tool. Drives which fields are available.',
			},
			{
				displayName: 'Tool Description',
				name: 'toolDescription',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['tool'],
						operation: ['Create Tool'],
					},
				},
				description: 'Short description of what the tool does',
			},
			{
				displayName: 'Docstring',
				name: 'toolDocstring',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['tool'],
						operation: ['Create Tool'],
					},
				},
				description: 'Detailed docstring describing the tool behavior, parameters and outputs',
			},
			{
				displayName: 'Method',
				name: 'toolMethod',
				type: 'options',
				default: 'GET',
				required: true,
				options: [
					{ name: 'DELETE', value: 'DELETE' },
					{ name: 'GET', value: 'GET' },
					{ name: 'PATCH', value: 'PATCH' },
					{ name: 'POST', value: 'POST' },
					{ name: 'PUT', value: 'PUT' }
				],
				displayOptions: {
					show: {
						resource: ['tool'],
						operation: ['Create Tool'],
						toolType: ['http'],
					},
				},
				description: 'HTTP method used by the tool',
			},
			{
				displayName: 'URL',
				name: 'toolUrl',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'https://api.example.com/endpoint',
				displayOptions: {
					show: {
						resource: ['tool'],
						operation: ['Create Tool'],
						toolType: ['http'],
					},
				},
				description: 'The URL the tool will call',
			},
			{
				displayName: 'Auth Type',
				name: 'httpAuthType',
				type: 'options',
				default: 'NoAuth',
				required: true,
				options: [
					{ name: 'No Auth', value: 'NoAuth' },
					{ name: 'Basic Auth', value: 'BasicAuth' },
					{ name: 'Bearer Token', value: 'BearerToken' },
					{ name: 'JWT Bearer', value: 'JWTBearer' },
				],
				displayOptions: {
					show: {
						resource: ['tool'],
						operation: ['Create Tool'],
						toolType: ['http'],
					},
				},
				description: 'Authentication strategy used by the HTTP tool',
			},
			{
				displayName: 'Headers',
				name: 'headers',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				placeholder: 'Add Header',
				displayOptions: {
					show: {
						resource: ['tool'],
						operation: ['Create Tool'],
						toolType: ['http'],
					},
				},
				options: [
					{
						name: 'header',
						displayName: 'Header',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								description: 'Header name',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Header value',
							},
						],
					},
				],
				description: 'Optional headers sent by the tool',
			},
			{
				displayName: 'Param Sets',
				name: 'params',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				placeholder: 'Add Param Set',
				displayOptions: {
					show: {
						resource: ['tool'],
						operation: ['Create Tool'],
						toolType: ['http'],
					},
				},
				options: [
					{
						name: 'paramSet',
						displayName: 'Param Set',
						values: [
							{
								displayName: 'Parameters JSON',
								name: 'value',
								type: 'string',
								typeOptions: {
									rows: 3,
								},
								default: '',
								placeholder: '{"key1": "value1", "key2": "value2"}',
								description: 'JSON object representing one parameter set',
							},
						],
					},
				],
				description: 'Optional list of parameter sets. Each entry is a JSON object.',
			},
			{
				displayName: 'Body',
				name: 'toolBody',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				placeholder: '{"key": "value"}',
				displayOptions: {
					show: {
						resource: ['tool'],
						operation: ['Create Tool'],
						toolType: ['http'],
					},
				},
				description: 'Optional request body as a JSON string',
			},
			{
				displayName: 'Server URL',
				name: 'serverUrl',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'https://mcp.example.com',
				displayOptions: {
					show: {
						resource: ['tool'],
						operation: ['Create Tool'],
						toolType: ['mcp'],
					},
				},
				description: 'The MCP server URL',
			},
			{
				displayName: 'Transport Type',
				name: 'transportType',
				type: 'options',
				default: 'http',
				required: true,
				options: [
					{ name: 'HTTP', value: 'http' },
					{ name: 'SSE', value: 'sse' },
					{ name: 'STDIO', value: 'stdio' },
				],
				displayOptions: {
					show: {
						resource: ['tool'],
						operation: ['Create Tool'],
						toolType: ['mcp'],
					},
				},
				description: 'Transport protocol used by the MCP server',
			},
			{
				displayName: 'Auth Type',
				name: 'mcpAuthType',
				type: 'options',
				default: 'none',
				required: true,
				options: [
					{ name: 'None', value: 'none' },
					{ name: 'Bearer', value: 'bearer' },
				],
				displayOptions: {
					show: {
						resource: ['tool'],
						operation: ['Create Tool'],
						toolType: ['mcp'],
					},
				},
				description: 'Authentication strategy used by the MCP tool',
			},
			{
				displayName: 'Auth Config',
				name: 'authConfig',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				placeholder: 'Add Entry',
				displayOptions: {
					show: {
						resource: ['tool'],
						operation: ['Create Tool'],
						toolType: ['mcp'],
					},
				},
				options: [
					{
						name: 'entry',
						displayName: 'Entry',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								description: 'Auth config key',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Auth config value',
							},
						],
					},
				],
				description: 'Optional auth configuration as key-value pairs',
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 30000,
				required: true,
				displayOptions: {
					show: {
						resource: ['tool'],
						operation: ['Create Tool'],
						toolType: ['mcp'],
					},
				},
				description: 'Request timeout in milliseconds',
			},
			{
				displayName: 'Selected Tools',
				name: 'selectedTools',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				placeholder: 'Add Tool',
				displayOptions: {
					show: {
						resource: ['tool'],
						operation: ['Create Tool'],
						toolType: ['mcp'],
					},
				},
				options: [
					{
						name: 'tool',
						displayName: 'Tool',
						values: [
							{
								displayName: 'Tool Name',
								name: 'name',
								type: 'string',
								default: '',
								description: 'Name of the tool to expose from the MCP server',
							},
						],
					},
				],
				description: 'Optional list of tool names to expose from the MCP server',
			},
			{
				displayName: 'Name',
				name: 'llmName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['languageModel'],
						operation: ['Create Language Model'],
					},
				},
				description: 'The display name of the language model',
			},
			{
				displayName: 'Description',
				name: 'llmDescription',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['languageModel'],
						operation: ['Create Language Model'],
					},
				},
				description: 'A short description of the language model',
			},
			{
				displayName: 'Platform',
				name: 'llmPlatform',
				type: 'options',
				default: 'OpenAI',
				required: true,
				options: [
					{ name: 'Anthropic', value: 'Anthropic' },
					{ name: 'AWS Bedrock', value: 'Bedrock' },
					{ name: 'Azure Foundry', value: 'AzureFoundry' },
					{ name: 'Azure OpenAI', value: 'Microsoft' },
					{ name: 'Gemini (Vertex)', value: 'Vertex' },
					{ name: 'OpenAI', value: 'OpenAI' },
				],
				displayOptions: {
					show: {
						resource: ['languageModel'],
						operation: ['Create Language Model', 'Update Language Model'],
					},
				},
				description: 'The AI provider/platform that hosts this model. Drives which fields are available.',
			},
			{
				displayName: 'Type',
				name: 'llmType',
				type: 'options',
				default: 'Chat Completion',
				required: true,
				options: [
					{ name: 'Chat Completion', value: 'Chat Completion' },
					{ name: 'Embedding', value: 'Embedding' },
					{ name: 'Multimodal', value: 'Multimodal' },
					{ name: 'OCR', value: 'OCR' },
					{ name: 'Translation', value: 'Translation' },
					{ name: 'Web Search', value: 'Web Search' },
				],
				displayOptions: {
					show: {
						resource: ['languageModel'],
						operation: ['Create Language Model'],
					},
				},
				description: 'The capability/type of the language model',
			},
			{
				displayName: 'Is Default',
				name: 'llmIsDefault',
				type: 'boolean',
				default: false,
				required: true,
				displayOptions: {
					show: {
						resource: ['languageModel'],
						operation: ['Create Language Model'],
					},
				},
				description: 'Whether this model should be set as the default for the workspace',
			},
			{
				displayName: 'API Model',
				name: 'llmApiModel',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['languageModel'],
						operation: ['Create Language Model'],
					},
				},
				description: 'The provider model identifier (e.g., gpt-4o, claude-3-5-sonnet, gemini-1.5-pro)',
			},
			{
				displayName: 'API Key',
				name: 'llmApiKey',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['languageModel'],
						operation: ['Create Language Model'],
						llmPlatform: ['OpenAI', 'Microsoft', 'AzureFoundry', 'Vertex', 'Anthropic'],
					},
				},
				description: 'The API key used to authenticate against the provider',
			},
			{
				displayName: 'Endpoint',
				name: 'llmEndpoint',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'https://endpoint.example.com',
				displayOptions: {
					show: {
						resource: ['languageModel'],
						operation: ['Create Language Model'],
						llmPlatform: ['Microsoft', 'AzureFoundry'],
					},
				},
				description: 'The provider endpoint URL',
			},
			{
				displayName: 'API Version',
				name: 'llmApiVersion',
				type: 'string',
				default: '',
				required: true,
				placeholder: '2024-05-02',
				displayOptions: {
					show: {
						resource: ['languageModel'],
						operation: ['Create Language Model'],
						llmPlatform: ['Microsoft', 'AzureFoundry'],
					},
				},
				description: 'The provider API version',
			},
			{
				displayName: 'Model Name',
				name: 'llmModelName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['languageModel'],
						operation: ['Create Language Model'],
						llmPlatform: ['Microsoft'],
					},
				},
				description: 'The deployment/model name on Azure OpenAI',
			},
			{
				displayName: 'Max Tokens',
				name: 'llmMaxTokens',
				type: 'number',
				default: 4096,
				required: true,
				displayOptions: {
					show: {
						resource: ['languageModel'],
						operation: ['Create Language Model'],
						llmPlatform: ['Microsoft', 'AzureFoundry', 'Bedrock', 'Anthropic'],
					},
				},
				description: 'Maximum number of tokens supported by the model',
			},
			{
				displayName: 'Region',
				name: 'llmRegion',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'us-east-1',
				displayOptions: {
					show: {
						resource: ['languageModel'],
						operation: ['Create Language Model'],
						llmPlatform: ['Bedrock'],
					},
				},
				description: 'The AWS region where the Bedrock model is hosted',
			},
			{
				displayName: 'Access Key',
				name: 'llmAccessKey',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['languageModel'],
						operation: ['Create Language Model'],
						llmPlatform: ['Bedrock'],
					},
				},
				description: 'The AWS access key',
			},
			{
				displayName: 'Secret Key',
				name: 'llmSecretKey',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['languageModel'],
						operation: ['Create Language Model'],
						llmPlatform: ['Bedrock'],
					},
				},
				description: 'The AWS secret key',
			},
			{
				displayName: 'Bearer Token',
				name: 'llmBearerToken',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['languageModel'],
						operation: ['Create Language Model'],
						llmPlatform: ['Bedrock'],
					},
				},
				description: 'The bearer token used by AWS Bedrock',
			},
			{
				displayName: 'Workspace ID',
				name: 'workspaceId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['chat','agent','datasource','group','languageModel','workspace','tool'],
						operation: [
							'Send Message',
							'Get Chats',
							'Get Agents',
							'Create Agent',
							'Update Agent',
							'Get Datasources',
							'Get Group by ID',
							'Get Groups',
							'Create Group',
							'Delete Group',
						'Get Language Models',
						'Get Language Model by ID',
						'Link Language Model to Workspace',
						'Unlink Language Model from Workspace',
						'Get Workspace by ID',
							'Delete Workspace',
							'Add User to Workspace',
							'Add Members to Workspace',
							'Remove Users from Workspace',
							'Add Users to Groups',
							'Remove User from Group',
							'Create Tool',
						],
					},
				},
				description: 'The workspace identifier',
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['agent'],
						operation: ['Update Agent'],
					},
				},
				description: 'Only the fields you add here will be sent in the update request',
				options: [
					{
						displayName: 'Datasource ID',
						name: 'datasourceId',
						type: 'string',
						default: '',
						description: 'Datasource identifier to attach to the agent',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'New description for the agent',
					},
					{
						displayName: 'Display Mode',
						name: 'displayMode',
						type: 'options',
						default: 'me',
						options: [
							{ name: 'Apenas Eu', value: 'me' },
							{ name: 'Grupos', value: 'group' },
						],
						description: 'Who can see this agent',
					},
					{
						displayName: 'Enable Thinking',
						name: 'enableThinking',
						type: 'boolean',
						default: false,
						description: 'Whether to enable reasoning. When false, thinkingLevel is set to null.',
					},
					{
						displayName: 'Enable Web Search',
						name: 'enableWebSearch',
						type: 'boolean',
						default: false,
						description: 'Whether to enable web search for this agent',
					},
					{
						displayName: 'Group IDs',
						name: 'departmentsIds',
						type: 'string',
						default: '',
						placeholder: '["id1","id2"]',
						description: 'JSON array of group IDs (only relevant when Display Mode is Grupos). Pass [] to clear.',
					},
					{
						displayName: 'Language Model ID',
						name: 'languageModelId',
						type: 'string',
						default: '',
						description: 'Identifier of the language model the agent should use',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'New name for the agent',
					},
					{
						displayName: 'Prompt',
						name: 'prompt',
						type: 'string',
						typeOptions: {
							rows: 5,
						},
						default: '',
						description: 'New system prompt',
					},
					{
						displayName: 'Thinking Level',
						name: 'thinkingLevel',
						type: 'options',
						default: 'low',
						options: [
							{ name: 'Mínimo', value: 'minimal' },
							{ name: 'Baixo', value: 'low' },
							{ name: 'Médio', value: 'medium' },
							{ name: 'Alto', value: 'high' },
						],
						displayOptions: {
							show: {
								enableThinking: [true],
							},
						},
						description: 'Reasoning level (only applied if Enable Thinking is true)',
					},
					{
						displayName: 'Tools',
						name: 'tools',
						type: 'string',
						default: '',
						placeholder: '["id1","id2"]',
						description: 'JSON array of tool IDs available to the agent. Pass [] to clear.',
					}
				],
			},
			{
				displayName: 'Update Fields',
				name: 'toolUpdateFieldsHttp',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['tool'],
						operation: ['Update Tool'],
						toolType: ['http'],
					},
				},
				description: 'Only the fields you add here will be sent in the update request',
				options: [
					{
						displayName: 'Auth Type',
						name: 'authType',
						type: 'options',
						default: 'NoAuth',
						options: [
							{ name: 'Basic Auth', value: 'BasicAuth' },
							{ name: 'Bearer Token', value: 'BearerToken' },
							{ name: 'JWT Bearer', value: 'JWTBearer' },
							{ name: 'No Auth', value: 'NoAuth' },
						],
						description: 'Authentication strategy used by the HTTP tool',
					},
					{
						displayName: 'Body',
						name: 'body',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						default: '',
						placeholder: '{"key": "value"}',
						description: 'Request body as a JSON string',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Short description of what the tool does',
					},
					{
						displayName: 'Docstring',
						name: 'docstring',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						default: '',
						description: 'Detailed docstring describing the tool behavior, parameters and outputs',
					},
					{
						displayName: 'Headers',
						name: 'headers',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						placeholder: 'Add Header',
						options: [
							{
								name: 'header',
								displayName: 'Header',
								values: [
									{
										displayName: 'Name',
										name: 'name',
										type: 'string',
										default: '',
										description: 'Header name',
									},
									{
										displayName: 'Value',
										name: 'value',
										type: 'string',
										default: '',
										description: 'Header value',
									},
								],
							},
						],
						description: 'Headers sent by the tool. Add an empty entry to clear.',
					},
					{
						displayName: 'Method',
						name: 'method',
						type: 'options',
						default: 'GET',
						options: [
							{ name: 'DELETE', value: 'DELETE' },
							{ name: 'GET', value: 'GET' },
							{ name: 'PATCH', value: 'PATCH' },
							{ name: 'POST', value: 'POST' },
							{ name: 'PUT', value: 'PUT' },
						],
						description: 'HTTP method used by the tool',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'New name for the tool',
					},
					{
						displayName: 'Param Sets',
						name: 'params',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						placeholder: 'Add Param Set',
						options: [
							{
								name: 'paramSet',
								displayName: 'Param Set',
								values: [
									{
										displayName: 'Parameters JSON',
										name: 'value',
										type: 'string',
										typeOptions: {
											rows: 3,
										},
										default: '',
										placeholder: '{"key1": "value1"}',
										description: 'JSON object representing one parameter set',
									},
								],
							},
						],
						description: 'List of parameter sets. Each entry is a JSON object.',
					},
					{
						displayName: 'URL',
						name: 'url',
						type: 'string',
						default: '',
						placeholder: 'https://api.example.com/endpoint',
						description: 'The URL the tool will call',
					},
				],
			},
			{
				displayName: 'Update Fields',
				name: 'toolUpdateFieldsMcp',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['tool'],
						operation: ['Update Tool'],
						toolType: ['mcp'],
					},
				},
				description: 'Only the fields you add here will be sent in the update request',
				options: [
					{
						displayName: 'Auth Config',
						name: 'authConfig',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						placeholder: 'Add Entry',
						options: [
							{
								name: 'entry',
								displayName: 'Entry',
								values: [
									{
										displayName: 'Name',
										name: 'name',
										type: 'string',
										default: '',
										description: 'Auth config key',
									},
									{
										displayName: 'Value',
										name: 'value',
										type: 'string',
										default: '',
										description: 'Auth config value',
									},
								],
							},
						],
						description: 'Auth configuration as key-value pairs',
					},
					{
						displayName: 'Auth Type',
						name: 'authType',
						type: 'options',
						default: 'none',
						options: [
							{ name: 'Bearer', value: 'bearer' },
							{ name: 'None', value: 'none' },
						],
						description: 'Authentication strategy used by the MCP tool',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Short description of what the tool does',
					},
					{
						displayName: 'Docstring',
						name: 'docstring',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						default: '',
						description: 'Detailed docstring describing the tool behavior, parameters and outputs',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'New name for the tool',
					},
					{
						displayName: 'Selected Tools',
						name: 'selectedTools',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						placeholder: 'Add Tool',
						options: [
							{
								name: 'tool',
								displayName: 'Tool',
								values: [
									{
										displayName: 'Tool Name',
										name: 'name',
										type: 'string',
										default: '',
										description: 'Name of the tool to expose from the MCP server',
									},
								],
							},
						],
						description: 'List of tool names to expose from the MCP server',
					},
					{
						displayName: 'Server URL',
						name: 'serverUrl',
						type: 'string',
						default: '',
						placeholder: 'https://mcp.example.com',
						description: 'The MCP server URL',
					},
					{
						displayName: 'Timeout',
						name: 'timeout',
						type: 'number',
						default: 30000,
						description: 'Request timeout in milliseconds',
					},
					{
						displayName: 'Transport Type',
						name: 'transportType',
						type: 'options',
						default: 'http',
						options: [
							{ name: 'HTTP', value: 'http' },
							{ name: 'SSE', value: 'sse' },
							{ name: 'STDIO', value: 'stdio' },
						],
						description: 'Transport protocol used by the MCP server',
					},
				],
			},
			{
				displayName: 'Update Fields',
				name: 'llmUpdateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['languageModel'],
						operation: ['Update Language Model'],
					},
				},
				description: 'Only the fields you add here will be sent in the update request',
				options: [
					{
						displayName: 'Access Key',
						name: 'accessKey',
						type: 'string',
						typeOptions: {
							password: true,
						},
						default: '',
						displayOptions: {
							show: {
								'/llmPlatform': ['Bedrock'],
							},
						},
						description: 'AWS access key (Bedrock only)',
					},
					{
						displayName: 'API Key',
						name: 'apiKey',
						type: 'string',
						typeOptions: {
							password: true,
						},
						default: '',
						displayOptions: {
							show: {
								'/llmPlatform': ['OpenAI', 'Microsoft', 'AzureFoundry', 'Vertex', 'Anthropic'],
							},
						},
						description: 'Provider API key',
					},
					{
						displayName: 'API Model',
						name: 'apiModel',
						type: 'string',
						default: '',
						description: 'The provider model identifier (e.g., gpt-4o, claude-3-5-sonnet, gemini-1.5-pro)',
					},
					{
						displayName: 'API Version',
						name: 'apiVersion',
						type: 'string',
						default: '',
						placeholder: '2024-05-02',
						displayOptions: {
							show: {
								'/llmPlatform': ['Microsoft', 'AzureFoundry'],
							},
						},
						description: 'Provider API version (Azure OpenAI / Azure Foundry only)',
					},
					{
						displayName: 'Bearer Token',
						name: 'bearerToken',
						type: 'string',
						typeOptions: {
							password: true,
						},
						default: '',
						displayOptions: {
							show: {
								'/llmPlatform': ['Bedrock'],
							},
						},
						description: 'Bearer token used by AWS Bedrock',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Short description of the language model',
					},
					{
						displayName: 'Endpoint',
						name: 'endpoint',
						type: 'string',
						default: '',
						placeholder: 'https://endpoint.example.com',
						displayOptions: {
							show: {
								'/llmPlatform': ['Microsoft', 'AzureFoundry'],
							},
						},
						description: 'Provider endpoint URL (Azure OpenAI / Azure Foundry only)',
					},
					{
						displayName: 'Is Default',
						name: 'isDefault',
						type: 'boolean',
						default: false,
						description: 'Whether this model should be set as the default for the workspace',
					},
					{
						displayName: 'Max Tokens',
						name: 'maxTokens',
						type: 'number',
						default: 4096,
						displayOptions: {
							show: {
								'/llmPlatform': ['Microsoft', 'AzureFoundry', 'Bedrock', 'Anthropic'],
							},
						},
						description: 'Maximum number of tokens supported by the model',
					},
					{
						displayName: 'Model Name',
						name: 'modelName',
						type: 'string',
						default: '',
						displayOptions: {
							show: {
								'/llmPlatform': ['Microsoft'],
							},
						},
						description: 'The deployment/model name on Azure OpenAI',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'New display name for the language model',
					},
					{
						displayName: 'Region',
						name: 'region',
						type: 'string',
						default: '',
						placeholder: 'us-east-1',
						displayOptions: {
							show: {
								'/llmPlatform': ['Bedrock'],
							},
						},
						description: 'AWS region (Bedrock only)',
					},
					{
						displayName: 'Secret Key',
						name: 'secretKey',
						type: 'string',
						typeOptions: {
							password: true,
						},
						default: '',
						displayOptions: {
							show: {
								'/llmPlatform': ['Bedrock'],
							},
						},
						description: 'AWS secret key (Bedrock only)',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						default: 'Chat Completion',
						options: [
							{ name: 'Chat Completion', value: 'Chat Completion' },
							{ name: 'Emedding', value: 'Emedding' },
							{ name: 'Multimodal', value: 'Multimodal' },
							{ name: 'OCR', value: 'OCR' },
							{ name: 'Translation', value: 'Translation' },
							{ name: 'Web Search', value: 'Web Search' },
						],
						description: 'The capability/type of the language model',
					},
				],
			}
		],
		usableAsTool: true,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		
		// Get credentials and obtain access token once
		const credentials = await this.getCredentials('belakeAiApi');
		const backendUrl = credentials.backendUrl as string;
		const apiKey = credentials.apiKey as string;

		// Get Bearer token using n8n's httpRequest helper
		const authResponse = await this.helpers.httpRequest({
			method: 'POST',
			url: `${backendUrl}/v1/login/api-key-auth`,
			headers: { 'Content-Type': 'application/json' },
			body: { apiKey },
			json: true,
		}) as BelakeAuthResponse;

		const accessToken = authResponse.access_token_v2;
		if (!accessToken) {
			throw new NodeOperationError(
				this.getNode(),
				`Failed to obtain access token. Response: ${JSON.stringify(authResponse)}`,
			);
		}

		// Helper function to make authenticated requests
		const makeRequest = async (options: IHttpRequestOptions) => {
			return await this.helpers.httpRequest({
				...options,
				baseURL: backendUrl,
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Authorization: `Bearer ${accessToken}`,
					...options.headers,
				},
				json: true,
			});
		};

		// Parse a JSON-array string field into a string[] with a clear error message
		const parseIdArray = (raw: string, fieldName: string): string[] => {
			try {
				const parsed = JSON.parse(raw);
				if (!Array.isArray(parsed)) throw new NodeOperationError(this.getNode(), 'not an array');
				return parsed.map((v) => String(v));
			} catch {
				throw new NodeOperationError(
					this.getNode(),
					`${fieldName} must be a JSON array, e.g. ["id1","id2"]`,
				);
			}
		};

		// Process each item using the declarative routing approach
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const resource = this.getNodeParameter('resource', itemIndex) as string;
				const operation = this.getNodeParameter('operation', itemIndex) as string;

				// Map of all operations to their request configurations
				const operationsMap: Record<string, Record<string, () => Promise<IDataObject | IDataObject[]>>> = {
					chat: {
						'Send Message': async () => makeRequest({
							method: 'POST',
							url: '/v1/chats/agentchat',
							body: {
								agentsIds: this.getNodeParameter('agentsIds', itemIndex),
								message: this.getNodeParameter('message', itemIndex),
								language: this.getNodeParameter('language', itemIndex),
								...(this.getNodeParameter('chatId', itemIndex, '') && { 
									chatId: this.getNodeParameter('chatId', itemIndex) 
								}),
								hideChat: this.getNodeParameter('hideChat', itemIndex, false),
								workspaceId: this.getNodeParameter('workspaceId', itemIndex)
							},
						}),
						'Get Chat by ID': async () => makeRequest({
							method: 'GET',
							url: `/v1/chats/${this.getNodeParameter('chatId', itemIndex)}`,
						}),
						'Get Chats': async () => makeRequest({
							method: 'GET',
							url: '/v1/chats',
							qs: {
								workspaceId: this.getNodeParameter('workspaceId', itemIndex)
							}
						}),
					},
					agent: {
						'Get Agent by ID': async () => makeRequest({
							method: 'GET',
							url: `/v1/agents/${this.getNodeParameter('agentId', itemIndex)}`,
						}),
						'Delete Agent by ID': async () => makeRequest({
							method: 'DELETE',
							url: `/v1/agents/${this.getNodeParameter('agentId', itemIndex)}`,
						}),
						'Get Agents': async () => makeRequest({
							method: 'GET',
							url: '/v1/agents/availables',
							qs: {
								workspaceId: this.getNodeParameter('workspaceId', itemIndex)
							}
						}),
						'Create Agent': async () => {
							const workspaceId = this.getNodeParameter('workspaceId', itemIndex) as string;
							const displayMode = this.getNodeParameter('displayMode', itemIndex) as string;
							const enableThinking = this.getNodeParameter('enableThinking', itemIndex) as boolean;
							const toolsRaw = this.getNodeParameter('tools', itemIndex, '') as string;
							const datasourceId = this.getNodeParameter('agentDatasourceId', itemIndex, '') as string;

							const departmentsIds = displayMode === 'group'
								? parseIdArray(
									this.getNodeParameter('departmentsIds', itemIndex) as string,
									'Group IDs',
								)
								: [];

							const tools = toolsRaw ? parseIdArray(toolsRaw, 'Tools') : [];

							const body: IDataObject = {
								name: this.getNodeParameter('agentName', itemIndex),
								description: this.getNodeParameter('agentDescription', itemIndex),
								prompt: this.getNodeParameter('prompt', itemIndex),
								languageModelId: this.getNodeParameter('languageModelId', itemIndex),
								displayMode,
								departmentsIds,
								tools,
								enableWebSearch: this.getNodeParameter('enableWebSearch', itemIndex),
								enableThinking,
								thinkingLevel: enableThinking
									? this.getNodeParameter('thinkingLevel', itemIndex)
									: null,
								filesIds: [],
								foldersIds: [],
								isDraft: false,
								workspace: workspaceId,
								workspaceId,
							};

							if (datasourceId) {
								body.datasourceId = datasourceId;
							}

							return await makeRequest({
								method: 'POST',
								url: '/v1/agents',
								qs: { workspaceId },
								body,
							});
						},
						'Update Agent': async () => {
							const agentId = this.getNodeParameter('agentId', itemIndex) as string;
							const workspaceId = this.getNodeParameter('workspaceId', itemIndex) as string;
							const updateFields = this.getNodeParameter(
								'updateFields',
								itemIndex,
								{},
							) as IDataObject;

							const body: IDataObject = {
								enableDeepAgent: false,
								thinkingBudgetTokens: null,
							};

							if (updateFields.name !== undefined) {
								body.name = updateFields.name;
							}
							if (updateFields.description !== undefined) {
								body.description = updateFields.description;
							}
							if (updateFields.prompt !== undefined) {
								body.prompt = updateFields.prompt;
							}
							if (updateFields.languageModelId !== undefined) {
								body.languageModelId = updateFields.languageModelId;
							}
							if (updateFields.displayMode !== undefined) {
								body.displayMode = updateFields.displayMode;
							}
							if (updateFields.departmentsIds !== undefined) {
								const raw = (updateFields.departmentsIds as string) ?? '';
								body.departmentsIds =
									raw.trim() !== '' ? parseIdArray(raw, 'Group IDs') : [];
							}
							if (updateFields.tools !== undefined) {
								const raw = (updateFields.tools as string) ?? '';
								body.tools = raw.trim() !== '' ? parseIdArray(raw, 'Tools') : [];
							}
							if (updateFields.enableWebSearch !== undefined) {
								body.enableWebSearch = updateFields.enableWebSearch;
							}
							if (updateFields.enableThinking !== undefined) {
								const enableThinking = updateFields.enableThinking as boolean;
								body.thinkingLevel = enableThinking
									? (updateFields.thinkingLevel ?? 'low')
									: null;
							}
							if (updateFields.datasourceId !== undefined) {
								body.datasourceId = updateFields.datasourceId;
							}

							return await makeRequest({
								method: 'PATCH',
								url: `/v1/agents/${agentId}`,
								qs: { workspaceId },
								body,
							});
						},
					},
					datasource: {
						'Get Datasource by ID': async () => makeRequest({
							method: 'GET',
							url: `/v1/datasources/${this.getNodeParameter('datasourceId', itemIndex)}`,
						}),
						'Get Datasources': async () => makeRequest({
							method: 'GET',
							url: '/v1/datasources/availables',
							qs: {
								workspaceId: this.getNodeParameter('workspaceId', itemIndex)
							}
						}),
					},
					group: {
						'Get Group by ID': async () => makeRequest({
							method: 'GET',
							url: `/v1/groups/${this.getNodeParameter('groupId', itemIndex)}`,
							qs: {
								workspaceId: this.getNodeParameter('workspaceId', itemIndex)
							}
						}),
						'Get Groups': async () => makeRequest({
							method: 'GET',
							url: '/v1/groups',
							qs: {
								workspaceId: this.getNodeParameter('workspaceId', itemIndex)
							}
						}),
						'Create Group': async () => makeRequest({
							method: 'POST',
							url: '/v1/groups',
							body: {
								name: this.getNodeParameter('name', itemIndex),
								description: this.getNodeParameter('description', itemIndex, ''),
								workspaceId: this.getNodeParameter('workspaceId', itemIndex),
							},
						}),
						'Delete Group': async () => makeRequest({
							method: 'DELETE',
							url: `/v1/groups/${this.getNodeParameter('groupId', itemIndex)}`,
							qs: {
								workspaceId: this.getNodeParameter('workspaceId', itemIndex),
							},
						}),
					},
					languageModel: {
						'Get Language Model by ID': async () => makeRequest({
							method: 'GET',
							url: `/v1/languageModels/${this.getNodeParameter('languageModelId', itemIndex)}`,
							qs: {
								workspaceId: this.getNodeParameter('workspaceId', itemIndex)
							}
						}),
						'Get Language Models': async () => makeRequest({
							method: 'GET',
							url: '/v1/languageModels/availables',
							qs: {
								workspaceId: this.getNodeParameter('workspaceId', itemIndex)
							}
						}),
						'Create Language Model': async () => {
							const platform = this.getNodeParameter('llmPlatform', itemIndex) as string;
							const platformToTool: Record<string, string> = {
								OpenAI: 'OpenAI',
								Microsoft: 'Azure OpenAI',
								AzureFoundry: 'Azure Foundry',
								Vertex: 'Gemini',
								Bedrock: 'AWS Bedrock',
								Anthropic: 'Anthropic',
							};

							const body: IDataObject = {
								name: this.getNodeParameter('llmName', itemIndex),
								description: this.getNodeParameter('llmDescription', itemIndex),
								platform,
								tool: platformToTool[platform],
								type: this.getNodeParameter('llmType', itemIndex),
								isDefault: this.getNodeParameter('llmIsDefault', itemIndex),
								departmentsIds: [],
								apiModel: this.getNodeParameter('llmApiModel', itemIndex),
								isActive: true,
							};

							if (platform === 'Bedrock') {
								body.region = this.getNodeParameter('llmRegion', itemIndex);
								body.accessKey = this.getNodeParameter('llmAccessKey', itemIndex);
								body.secretKey = this.getNodeParameter('llmSecretKey', itemIndex);
								body.bearerToken = this.getNodeParameter('llmBearerToken', itemIndex);
								body.maxTokens = this.getNodeParameter('llmMaxTokens', itemIndex);
							} else {
								body.apiKey = this.getNodeParameter('llmApiKey', itemIndex);
							}

							if (platform === 'Microsoft' || platform === 'AzureFoundry') {
								body.endpoint = this.getNodeParameter('llmEndpoint', itemIndex);
								body.apiVersion = this.getNodeParameter('llmApiVersion', itemIndex);
								body.maxTokens = this.getNodeParameter('llmMaxTokens', itemIndex);
							}

							if (platform === 'Microsoft') {
								body.modelName = this.getNodeParameter('llmModelName', itemIndex);
							}

							if (platform === 'Anthropic') {
								body.maxTokens = this.getNodeParameter('llmMaxTokens', itemIndex);
							}

							return await makeRequest({
								method: 'POST',
								url: '/v1/languagemodels',
								body,
							});
						},
						'Delete Language Model by ID': async () => makeRequest({
							method: 'DELETE',
							url: `/v1/languagemodels/${this.getNodeParameter('languageModelId', itemIndex)}`,
						}),
						'Link Language Model to Workspace': async () => {
							const workspaceId = this.getNodeParameter('workspaceId', itemIndex) as string;
							const languageModelId = this.getNodeParameter('languageModelId', itemIndex) as string;
							return await makeRequest({
								method: 'POST',
								url: `/v1/workspaces/${workspaceId}/languagemodels`,
								body: { languageModelId },
							});
						},
						'Unlink Language Model from Workspace': async () => {
							const workspaceId = this.getNodeParameter('workspaceId', itemIndex) as string;
							const languageModelId = this.getNodeParameter('languageModelId', itemIndex) as string;
							return await makeRequest({
								method: 'DELETE',
								url: `/v1/workspaces/${workspaceId}/languagemodels/${languageModelId}`,
							});
						},
						'Update Language Model': async () => {
							const languageModelId = this.getNodeParameter('languageModelId', itemIndex) as string;
							const platform = this.getNodeParameter('llmPlatform', itemIndex) as string;
							const updateFields = this.getNodeParameter(
								'llmUpdateFields',
								itemIndex,
								{},
							) as IDataObject;

							const platformToTool: Record<string, string> = {
								OpenAI: 'OpenAI',
								Microsoft: 'Azure OpenAI',
								AzureFoundry: 'Azure Foundry',
								Vertex: 'Gemini',
								Bedrock: 'AWS Bedrock',
								Anthropic: 'Anthropic',
							};

							const body: IDataObject = {
								platform,
								tool: platformToTool[platform],
								isActive: true,
							};

							if (updateFields.name !== undefined) body.name = updateFields.name;
							if (updateFields.description !== undefined) body.description = updateFields.description;
							if (updateFields.type !== undefined) body.type = updateFields.type;
							if (updateFields.isDefault !== undefined) body.isDefault = updateFields.isDefault;
							if (updateFields.apiModel !== undefined) body.apiModel = updateFields.apiModel;

							if (platform !== 'Bedrock' && updateFields.apiKey !== undefined) {
								body.apiKey = updateFields.apiKey;
							}

							if (
								(platform === 'Microsoft' || platform === 'AzureFoundry') &&
								updateFields.endpoint !== undefined
							) {
								body.endpoint = updateFields.endpoint;
							}
							if (
								(platform === 'Microsoft' || platform === 'AzureFoundry') &&
								updateFields.apiVersion !== undefined
							) {
								body.apiVersion = updateFields.apiVersion;
							}
							if (platform === 'Microsoft' && updateFields.modelName !== undefined) {
								body.modelName = updateFields.modelName;
							}
							if (
								(platform === 'Microsoft' ||
									platform === 'AzureFoundry' ||
									platform === 'Bedrock' ||
									platform === 'Anthropic') &&
								updateFields.maxTokens !== undefined
							) {
								body.maxTokens = updateFields.maxTokens;
							}

							if (platform === 'Bedrock') {
								if (updateFields.region !== undefined) body.region = updateFields.region;
								if (updateFields.accessKey !== undefined) body.accessKey = updateFields.accessKey;
								if (updateFields.secretKey !== undefined) body.secretKey = updateFields.secretKey;
								if (updateFields.bearerToken !== undefined) body.bearerToken = updateFields.bearerToken;
							}

							return await makeRequest({
								method: 'PATCH',
								url: `/v1/languagemodels/${languageModelId}`,
								body,
							});
						},
					},
					workspace: {
						'Get Workspace by ID': async () => makeRequest({
							method: 'GET',
							url: `/v1/workspaces/${this.getNodeParameter('workspaceId', itemIndex)}`,
						}),
						'Get Workspaces': async () => makeRequest({
							method: 'GET',
							url: '/v1/workspaces?page=1&pageSize=100',
						}),
						'Create Workspace': async () => makeRequest({
							method: 'POST',
							url: '/v1/workspaces',
							body: {
								name: this.getNodeParameter('workspaceName', itemIndex),
								description: this.getNodeParameter('workspaceDescription', itemIndex, ''),
								type: this.getNodeParameter('workspaceType', itemIndex),
								menuConfig: {
									newChat: true,
									myAgents: true,
									belakeBuilder: true,
									reports: true,
									documents: true,
									advanced: true,
								},
							},
						}),
						'Delete Workspace': async () => makeRequest({
							method: 'DELETE',
							url: `/v1/workspaces/${this.getNodeParameter('workspaceId', itemIndex)}`,
						}),
						'Add User to Workspace': async () => {
							const workspaceId = this.getNodeParameter('workspaceId', itemIndex) as string;
							const userId = this.getNodeParameter('userId', itemIndex) as string;
							const role = this.getNodeParameter('role', itemIndex) as string;
							return await makeRequest({
								method: 'POST',
								url: `/v1/workspaces/${workspaceId}/users`,
								body: { userId, role },
							});
						},
						'Add Members to Workspace': async () => {
							const workspaceId = this.getNodeParameter('workspaceId', itemIndex) as string;
							const userIds = parseIdArray(
								this.getNodeParameter('userIds', itemIndex) as string,
								'User IDs',
							);
							const results: IDataObject[] = [];
							for (const userId of userIds) {
								const response = await makeRequest({
									method: 'POST',
									url: `/v1/workspaces/${workspaceId}/users`,
									body: { userId, role: 'member' },
								});
								results.push({ userId, response });
							}
							return results;
						},
						'Remove Users from Workspace': async () => {
							const workspaceId = this.getNodeParameter('workspaceId', itemIndex) as string;
							const userIds = parseIdArray(
								this.getNodeParameter('userIds', itemIndex) as string,
								'User IDs',
							);
							const results: IDataObject[] = [];
							for (const userId of userIds) {
								const response = await makeRequest({
									method: 'DELETE',
									url: `/v1/workspaces/${workspaceId}/users/${userId}`,
								});
								results.push({ userId, response });
							}
							return results;
						},
						'Add Users to Groups': async () => {
							const workspaceId = this.getNodeParameter('workspaceId', itemIndex) as string;
							const userIds = parseIdArray(
								this.getNodeParameter('userIds', itemIndex) as string,
								'User IDs',
							);
							const groupIds = parseIdArray(
								this.getNodeParameter('groupIds', itemIndex) as string,
								'Group IDs',
							);
							const results: IDataObject[] = [];
							for (const userId of userIds) {
								const response = await makeRequest({
									method: 'POST',
									url: `/v1/workspaces/${workspaceId}/users/${userId}/groups`,
									body: { groupIds },
								});
								results.push({ userId, response });
							}
							return results;
						},
						'Remove User from Group': async () => {
							const workspaceId = this.getNodeParameter('workspaceId', itemIndex) as string;
							const groupId = this.getNodeParameter('groupId', itemIndex) as string;
							const userIds = parseIdArray(
								this.getNodeParameter('userIds', itemIndex) as string,
								'User IDs',
							);
							const results: IDataObject[] = [];
							for (const userId of userIds) {
								const response = await makeRequest({
									method: 'DELETE',
									url: `/v1/workspaces/${workspaceId}/users/${userId}/groups/${groupId}`,
								});
								results.push({ userId, response });
							}
							return results;
						},
					},
					user: {
						'Create User': async () => {
							const loginType = this.getNodeParameter('loginType', itemIndex) as string;
							const phone = this.getNodeParameter('userPhone', itemIndex, '') as string;
							const companyDepartment = this.getNodeParameter('companyDepartment', itemIndex, '') as string;
							const jobTitle = this.getNodeParameter('jobTitle', itemIndex, '') as string;
							const managerEmail = this.getNodeParameter('managerEmail', itemIndex, '') as string;

							const body: IDataObject = {
								name: this.getNodeParameter('userName', itemIndex),
								email: this.getNodeParameter('userEmail', itemIndex),
								loginType,
								globalRole: this.getNodeParameter('globalRole', itemIndex),
								roles: ['user'],
							};

							if (loginType === 'DEFAULT') {
								body.password = this.getNodeParameter('password', itemIndex);
							}
							if (phone) body.phone = phone;
							if (companyDepartment) body.companyDepartment = companyDepartment;
							if (jobTitle) body.jobTitle = jobTitle;
							if (managerEmail) body.managerEmail = managerEmail;

							return await makeRequest({
								method: 'POST',
								url: '/v1/users',
								body,
							});
						},
						'Activate User by ID': async () => makeRequest({
							method: 'PUT',
							url: `/v1/users/${this.getNodeParameter('userId', itemIndex)}/activate`,
						}),
						'Revoke User by ID': async () => makeRequest({
							method: 'PUT',
							url: `/v1/users/${this.getNodeParameter('userId', itemIndex)}/revoke`,
						}),
						'Delete User by ID': async () => makeRequest({
							method: 'DELETE',
							url: `/v1/users/${this.getNodeParameter('userId', itemIndex)}`,
						}),
					},
					tool: {
						'Create Tool': async () => {
							const toolType = this.getNodeParameter('toolType', itemIndex) as string;
							const workspaceId = this.getNodeParameter('workspaceId', itemIndex) as string;

							const body: IDataObject = {
								name: this.getNodeParameter('toolName', itemIndex),
								type: toolType,
								description: this.getNodeParameter('toolDescription', itemIndex),
								docstring: this.getNodeParameter('toolDocstring', itemIndex),
								workspaceId,
							};

							if (toolType === 'http') {
								body.method = this.getNodeParameter('toolMethod', itemIndex);
								body.url = this.getNodeParameter('toolUrl', itemIndex);
								body.authType = this.getNodeParameter('httpAuthType', itemIndex);

								const headersRaw = this.getNodeParameter(
									'headers.header',
									itemIndex,
									[],
								) as Array<{ name: string; value: string }>;
								if (headersRaw.length > 0) {
									const headers: IDataObject = {};
									for (const { name, value } of headersRaw) {
										if (name) headers[name] = value;
									}
									if (Object.keys(headers).length > 0) {
										body.headers = headers;
									}
								}

								const paramsRaw = this.getNodeParameter(
									'params.paramSet',
									itemIndex,
									[],
								) as Array<{ value: string }>;
								if (paramsRaw.length > 0) {
									body.params = paramsRaw
										.map((p) => p.value)
										.filter((v) => v && v.trim() !== '');
								}

								const toolBody = this.getNodeParameter('toolBody', itemIndex, '') as string;
								if (toolBody) {
									body.body = toolBody;
								}
							} else if (toolType === 'mcp') {
								body.serverUrl = this.getNodeParameter('serverUrl', itemIndex);
								body.transportType = this.getNodeParameter('transportType', itemIndex);
								body.authType = this.getNodeParameter('mcpAuthType', itemIndex);
								body.timeout = this.getNodeParameter('timeout', itemIndex);

								const authConfigRaw = this.getNodeParameter(
									'authConfig.entry',
									itemIndex,
									[],
								) as Array<{ name: string; value: string }>;
								if (authConfigRaw.length > 0) {
									const authConfig: IDataObject = {};
									for (const { name, value } of authConfigRaw) {
										if (name) authConfig[name] = value;
									}
									if (Object.keys(authConfig).length > 0) {
										body.authConfig = authConfig;
									}
								}

								const selectedToolsRaw = this.getNodeParameter(
									'selectedTools.tool',
									itemIndex,
									[],
								) as Array<{ name: string }>;
								if (selectedToolsRaw.length > 0) {
									const selectedTools = selectedToolsRaw
										.map((t) => t.name)
										.filter((n) => n && n.trim() !== '');
									if (selectedTools.length > 0) {
										body.selectedTools = selectedTools;
									}
								}
							}

							return await makeRequest({
								method: 'POST',
								url: '/v1/tools',
								body,
							});
						},
						'Delete Tool by ID': async () => makeRequest({
							method: 'DELETE',
							url: `/v1/tools/${this.getNodeParameter('toolId', itemIndex)}`,
						}),
						'Update Tool': async () => {
							const toolId = this.getNodeParameter('toolId', itemIndex) as string;
							const toolType = this.getNodeParameter('toolType', itemIndex) as string;

							const body: IDataObject = {
								type: toolType,
							};

							if (toolType === 'http') {
								const updateFields = this.getNodeParameter(
									'toolUpdateFieldsHttp',
									itemIndex,
									{},
								) as IDataObject;

								if (updateFields.name !== undefined) body.name = updateFields.name;
								if (updateFields.description !== undefined) body.description = updateFields.description;
								if (updateFields.docstring !== undefined) body.docstring = updateFields.docstring;
								if (updateFields.method !== undefined) body.method = updateFields.method;
								if (updateFields.url !== undefined) body.url = updateFields.url;
								if (updateFields.authType !== undefined) body.authType = updateFields.authType;
								if (updateFields.body !== undefined) body.body = updateFields.body;

								if (updateFields.headers !== undefined) {
									const headersRaw =
										((updateFields.headers as IDataObject)?.header as Array<{
											name: string;
											value: string;
										}>) ?? [];
									const headers: IDataObject = {};
									for (const { name, value } of headersRaw) {
										if (name) headers[name] = value;
									}
									body.headers = headers;
								}

								if (updateFields.params !== undefined) {
									const paramsRaw =
										((updateFields.params as IDataObject)?.paramSet as Array<{
											value: string;
										}>) ?? [];
									body.params = paramsRaw
										.map((p) => p.value)
										.filter((v) => v && v.trim() !== '');
								}
							} else if (toolType === 'mcp') {
								const updateFields = this.getNodeParameter(
									'toolUpdateFieldsMcp',
									itemIndex,
									{},
								) as IDataObject;

								if (updateFields.name !== undefined) body.name = updateFields.name;
								if (updateFields.description !== undefined) body.description = updateFields.description;
								if (updateFields.docstring !== undefined) body.docstring = updateFields.docstring;
								if (updateFields.serverUrl !== undefined) body.serverUrl = updateFields.serverUrl;
								if (updateFields.transportType !== undefined) body.transportType = updateFields.transportType;
								if (updateFields.authType !== undefined) body.authType = updateFields.authType;
								if (updateFields.timeout !== undefined) body.timeout = updateFields.timeout;

								if (updateFields.authConfig !== undefined) {
									const authConfigRaw =
										((updateFields.authConfig as IDataObject)?.entry as Array<{
											name: string;
											value: string;
										}>) ?? [];
									const authConfig: IDataObject = {};
									for (const { name, value } of authConfigRaw) {
										if (name) authConfig[name] = value;
									}
									body.authConfig = authConfig;
								}

								if (updateFields.selectedTools !== undefined) {
									const selectedToolsRaw =
										((updateFields.selectedTools as IDataObject)?.tool as Array<{
											name: string;
										}>) ?? [];
									body.selectedTools = selectedToolsRaw
										.map((t) => t.name)
										.filter((n) => n && n.trim() !== '');
								}
							}

							return await makeRequest({
								method: 'PATCH',
								url: `/v1/tools/${toolId}`,
								body,
							});
						},
					},
				};

				// Execute the operation
				const responseData = await operationsMap[resource][operation]();
				if (Array.isArray(responseData)) {
					for (const entry of responseData) {
						returnData.push({ json: entry, pairedItem: itemIndex });
					}
				} else {
					returnData.push({ json: responseData, pairedItem: itemIndex });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message }, pairedItem: itemIndex });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
