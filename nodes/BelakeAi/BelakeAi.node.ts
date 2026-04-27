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
						name: 'Get Language Model by ID',
						value: 'Get Language Model by ID',
						action: 'Get language model by id',
					},
					{
						name: 'Get Language Models',
						value: 'Get Language Models',
						action: 'Get language models',
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
						operation: ['Get Language Model by ID', 'Create Agent'],
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
						operation: ['Get Agent by ID', 'Delete Agent by ID'],
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
						resource: ['workspace'],
						operation: ['Add User to Workspace'],
					},
				},
				description: 'The user identifier to add to the workspace',
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
				displayName: 'Workspace ID',
				name: 'workspaceId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['chat','agent','datasource','group','languageModel','workspace'],
						operation: [
							'Send Message',
							'Get Chats',
							'Get Agents',
							'Create Agent',
							'Get Datasources',
							'Get Group by ID',
							'Get Groups',
							'Create Group',
							'Delete Group',
							'Get Language Models',
							'Get Language Model by ID',
							'Get Workspace by ID',
							'Delete Workspace',
							'Add User to Workspace',
							'Add Members to Workspace',
							'Remove Users from Workspace',
							'Add Users to Groups',
							'Remove User from Group',
						],
					},
				},
				description: 'The workspace identifier',
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
