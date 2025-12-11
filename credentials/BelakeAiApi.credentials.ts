import type {
	ICredentialType,
	INodeProperties,
	IAuthenticateGeneric,
	ICredentialTestRequest,
	IHttpRequestMethods,
	Icon,
} from 'n8n-workflow';

export class BelakeAiApi implements ICredentialType {
	name = 'belakeAiApi';
	displayName = 'Belake API';
	icon: Icon = 'file:../icons/belake.svg';
	documentationUrl = 'https://github.com/belakeaiservicos/n8n-nodes-belakeai/blob/main/credentials/README.md';
	properties: INodeProperties[] = [
		{
			displayName: 'Backend URL',
			name: 'backendUrl',
			type: 'string',
			default: '',
			required: true,
			description: 'Belake.ai backend URL',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'API Key for authentication. Get this key directly from the Belake.ai portal.',
		},
	];

	// Return authentication headers without making the request directly
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest  = {
		request: {
			baseURL: '={{$credentials.backendUrl}}',
			url: '/login/api-key-auth',
			method: 'POST' as IHttpRequestMethods,
			headers: {
				'Content-Type': 'application/json',
			},
			body: {
				apiKey: '={{$credentials.apiKey}}',
			},
		},
	};
}
