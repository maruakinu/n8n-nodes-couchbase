import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CouchbaseCredentialsApi implements ICredentialType {
	name = 'CouchbaseApi';
	displayName = 'Couchbase Credentials';
	documentationUrl = 'https://github.com/maruakinu/n8n-nodes-couchbase.git';
	properties: INodeProperties[] = [
		{
			displayName: 'Connection String',
			name: 'MyConnection',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Username',
			name: 'MyUsername',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Password',
			name: 'MyPassword',
			type: 'string',
			// typeOptions: {
			// 	password: true,
			// },
			default: '',
		},
		{
			displayName: 'Bucket',
			name: 'MyBucket',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Scope',
			name: 'MyScope',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Collection',
			name: 'MyCollection',
			type: 'string',
			default: '',
		},
	];

	// static myConnection = 'couchbase://127.0.0.1/?connectionTimeout=1200';
	// static myUsername = 'Administrator';
	// static myPassword = '123456';
	// static myBucket = 'n8n-sample';
	// static myScope = 'n8n';
	// static myCollection = 'users';
}


