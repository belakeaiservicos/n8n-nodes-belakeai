import type {
	ICredentialType,
	INodeProperties,
	IAuthenticateGeneric,
	ICredentialTestRequest,
	IHttpRequestMethods,
	ICredentialDataDecryptedObject,
	IHttpRequestHelper,
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
		{
			displayName: 'Session Token',
			name: 'sessionToken',
			type: 'hidden',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];

	async preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject) {
		const response = (await this.helpers.httpRequest({
			method: 'POST',
			url: `${credentials.backendUrl as string}/v1/login/api-key-auth`,
			headers: { 'Content-Type': 'application/json' },
			body: { apiKey: credentials.apiKey as string },
			json: true,
		})) as { access_token_v2?: string; access_token?: string };

		const sessionToken = response.access_token_v2 ?? response.access_token;
		if (!sessionToken) {
			throw new Error(
				`Failed to obtain access token from Belake.ai. Response: ${JSON.stringify(response)}`,
			);
		}

		return { sessionToken };
	}

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.sessionToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.backendUrl}}',
			url: '/v1/login/api-key-auth',
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
