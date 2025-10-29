import { INodeType, INodeTypeDescription } from 'n8n-workflow';

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
		inputs: ['main'],
		outputs: ['main'],
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
						routing: {
							request: {
								method: 'GET',
								url: '=/Agent/{{$parameter.agentId}}',
							},
						},
					},
					{
						name: 'Get Agents',
						value: 'Get Agents',
						action: 'Get agents',
						routing: {
							request: {
								method: 'GET',
								url: '/Agent/availables',
							},
						},
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
						routing: {
							request: {
								method: 'GET',
								url: '=/chat/{{$parameter.chatId}}',
							},
						},
					},
					{
						name: 'Get Chats',
						value: 'Get Chats',
						action: 'Get chats',
						routing: {
							request: {
								method: 'GET',
								url: '/chat',
							},
						},
					},
					{
						name: 'Send Message',
						value: 'Send Message',
						action: 'Send message',
						routing: {
							request: {
								method: 'POST',
								url: '/chat/agentchat',
								body: {
									agentsIds: '={{ $parameter["agentsIds"] }}',
									message: '={{ $parameter["message"] }}',
									language: '={{ $parameter["language"] }}',
									chatId: '={{ $parameter["chatId"] }}',
									hideChat: '={{ $parameter["hideChat"] }}',
								},
							},
						},
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
						routing: {
							request: {
								method: 'GET',
								url: '=/datasource/{{$parameter.datasourceId}}',
							},
						},
					},
					{
						name: 'Get Datasources',
						value: 'Get Datasources',
						action: 'Get datasources',
						routing: {
							request: {
								method: 'GET',
								url: '/datasource/availables',
							},
						},
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
						routing: {
							request: {
								method: 'GET',
								url: '=/Department/{{$parameter.departmentId}}',
							},
						},
					},
					{
						name: 'Get Departments',
						value: 'Get Departments',
						action: 'Get departments',
						routing: {
							request: {
								method: 'GET',
								url: '/Department',
							},
						},
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
						routing: {
							request: {
								method: 'GET',
								url: '=/languageModel/{{$parameter.languageModelId}}',
							},
						},
					},
					{
						name: 'Get Language Models',
						value: 'Get Language Models',
						action: 'Get language models',
						routing: {
							request: {
								method: 'GET',
								url: '/languageModel/availables',
							},
						},
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
}
