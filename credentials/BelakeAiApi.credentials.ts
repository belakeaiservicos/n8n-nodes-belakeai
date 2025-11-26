import type {
	ICredentialType,
	INodeProperties,
	IHttpRequestOptions,
	ICredentialDataDecryptedObject,
	IHttpRequestMethods,
	Icon,
} from 'n8n-workflow';

interface AuthResponse {
	access_token?: string;
	refresh_token?: string;
	[k: string]: unknown;
}

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

	test = {
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

	authenticate = async (
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> => {
		const backendUrl = credentials.backendUrl as string;
		
		if (!backendUrl) {
			throw new Error('Backend URL is required and must not be empty');
		}
		
		const response = await fetch(`${backendUrl}/login/api-key-auth`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ apiKey: credentials.apiKey }),
		});

		if (!response.ok) {
			throw new Error(`Authentication failed: ${response.statusText}`);
		}

		const data = (await response.json()) as AuthResponse;

		const token = data.access_token;

		if (!token) {
			throw new Error(`Token not returned by API. Response: ${JSON.stringify(data)}`);
		}

		requestOptions.headers = {
			...(requestOptions.headers || {}),
			Authorization: `Bearer ${token}`,
		};

		return requestOptions;
	};
}
