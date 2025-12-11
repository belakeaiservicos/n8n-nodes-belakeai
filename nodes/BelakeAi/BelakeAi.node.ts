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
		// ===== HTTP REQUEST DEFAULTS =====
		requestDefaults: {
			baseURL: '={{ $credentials.backendUrl }}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
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
				  { name: 'Department', value: 'department' },
				  { name: 'Language Model', value: 'languageModel' },
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
				// ===== DEPARTMENTS OPERATIONS =====
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {show: { resource: ['department'],},},
				options: [
					{
						name: 'Get Department by ID',
						value: 'Get Department by ID',
						action: 'Get department by id',
					},
					{
						name: 'Get Departments',
						value: 'Get Departments',
						action: 'Get departments',
					},
				],
				default: 'Get Departments',
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
				displayName: 'Department ID',
				name: 'departmentId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['department'],
						operation: ['Get Department by ID'],
					},
				},
				description: 'The department identifier',
			},
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
			url: `${backendUrl}/login/api-key-auth`,
			headers: { 'Content-Type': 'application/json' },
			body: { apiKey },
			json: true,
		}) as BelakeAuthResponse;

		const accessToken = authResponse.access_token;
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
							url: '/chat/agentchat',
							body: {
								agentsIds: this.getNodeParameter('agentsIds', itemIndex),
								message: this.getNodeParameter('message', itemIndex),
								language: this.getNodeParameter('language', itemIndex),
								...(this.getNodeParameter('chatId', itemIndex, '') && { 
									chatId: this.getNodeParameter('chatId', itemIndex) 
								}),
								hideChat: this.getNodeParameter('hideChat', itemIndex, false),
							},
						}),
						'Get Chat by ID': async () => makeRequest({
							method: 'GET',
							url: `/chat/${this.getNodeParameter('chatId', itemIndex)}`,
						}),
						'Get Chats': async () => makeRequest({
							method: 'GET',
							url: '/chat',
						}),
					},
					agent: {
						'Get Agent by ID': async () => makeRequest({
							method: 'GET',
							url: `/Agent/${this.getNodeParameter('agentId', itemIndex)}`,
						}),
						'Get Agents': async () => makeRequest({
							method: 'GET',
							url: '/Agent/availables',
						}),
					},
					datasource: {
						'Get Datasource by ID': async () => makeRequest({
							method: 'GET',
							url: `/datasource/${this.getNodeParameter('datasourceId', itemIndex)}`,
						}),
						'Get Datasources': async () => makeRequest({
							method: 'GET',
							url: '/datasource/availables',
						}),
					},
					department: {
						'Get Department by ID': async () => makeRequest({
							method: 'GET',
							url: `/Department/${this.getNodeParameter('departmentId', itemIndex)}`,
						}),
						'Get Departments': async () => makeRequest({
							method: 'GET',
							url: '/Department',
						}),
					},
					languageModel: {
						'Get Language Model by ID': async () => makeRequest({
							method: 'GET',
							url: `/languageModel/${this.getNodeParameter('languageModelId', itemIndex)}`,
						}),
						'Get Language Models': async () => makeRequest({
							method: 'GET',
							url: '/languageModel/availables',
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
