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
						name: 'Get Workspace by ID',
						value: 'Get Workspace by ID',
						action: 'Get workspace by id',
					},
					{
						name: 'Get Workspaces',
						value: 'Get Workspaces',
						action: 'Get workspaces',
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
						resource: ['languageModel'],
						operation: ['Get Language Model by ID'],
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
						operation: ['Get Agent by ID'],
					},
				},
				description: 'The agent identifier',
			},
			{
				displayName: 'Group ID',
				name: 'groupId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['Get Group by ID'],
					},
				},
				description: 'The group identifier',
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
							'Get Datasources',
							'Get Group by ID',
							'Get Groups',
							'Get Language Models',
							'Get Language Model by ID',
							'Get Workspace by ID',
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

		// Process each item using the declarative routing approach
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const resource = this.getNodeParameter('resource', itemIndex) as string;
				const operation = this.getNodeParameter('operation', itemIndex) as string;

				// Map of all operations to their request configurations
				const operationsMap: Record<string, Record<string, () => Promise<IDataObject>>> = {
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
						'Get Agents': async () => makeRequest({
							method: 'GET',
							url: '/v1/agents/availables',
							qs: {
								workspaceId: this.getNodeParameter('workspaceId', itemIndex)
							}
						}),
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
					},
				};

				// Execute the operation
				const responseData = await operationsMap[resource][operation]();
				returnData.push({ json: responseData });
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
