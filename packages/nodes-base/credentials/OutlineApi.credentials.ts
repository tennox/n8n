import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';


export class OutlineApi implements ICredentialType {
	name = 'outlineApi';
	displayName = 'Outline API';
	documentationUrl = 'outline';
	properties: INodeProperties[] = [
		{
			displayName: 'Outline Server',
			name: 'server',
			type: 'string',
			default: 'https://app.getoutline.com/api/',
		},
		{
			displayName: 'Token',
			name: 'token',
			type: 'string',
			default: '',
		},
	];
}
