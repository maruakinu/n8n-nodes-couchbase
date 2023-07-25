import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import {
    Bucket,
    Collection,
    connect,
	GetResult,
  } from 'couchbase'

export class CouchbaseDB implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Couchbase',
		name: 'couchbaseDB',
		icon: 'file:CBLogomark.svg',
		group: ['transform'],
		version: 1,
		description: 'Couchbase Node to add, update and delete data from couchbase',
		defaults: {
			name: 'Couchbase',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'CouchbaseApi',
				required: false,
			},
		],
		properties: [
			{
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Create',
                        value: 'insert',
                        description: 'Create document in couchbase',
                        action: 'Create document in couchbase',
                    },
					{
						name: 'Update',
						value: 'update',
						description: 'Update document in couchbase',
						action: 'Update document in couchbase',
					},
					{
						name: 'Delete',
						value: 'remove',
						description: 'Delete document in couchbase',
						action: 'Delete document in couchbase',
					},
					{
						name: 'Read',
						value: 'find',
						description: 'Read document in couchbase',
						action: 'Read document in couchbase',
					},
                ],
                default: 'insert',
            },

			// ----------------------------------
			//         credentials
			// ----------------------------------
			// {
			// 	displayName: 'Connection String',
			// 	name: 'myConnection',
			// 	type: 'string',
			// 	displayOptions: {
			// 		show: {
			// 			operation: ['insert', 'update', 'remove', 'find'],
			// 		},
			// 	},
			// 	default: '',
			// 	placeholder: 'Enter Connection String',
			// 	description: 'The description text',
			// },

			// {
			// 	displayName: 'Username',
			// 	name: 'myUsername',
			// 	type: 'string',
			// 	displayOptions: {
			// 		show: {
			// 			operation: ['insert', 'update', 'remove', 'find'],
			// 		},
			// 	},
			// 	default: '',
			// 	placeholder: 'Enter Your Username',
			// 	description: 'The description text',
			// },

			// {
			// 	displayName: 'Password',
			// 	name: 'myPassword',
			// 	type: 'string',
			// 	displayOptions: {
			// 		show: {
			// 			operation: ['insert', 'update', 'remove', 'find'],
			// 		},
			// 	},
			// 	default: '',
			// 	placeholder: 'Enter Your Password',
			// 	description: 'The description text',
			// },

			// {
			// 	displayName: 'Bucket',
			// 	name: 'myBucket',
			// 	type: 'string',
			// 	displayOptions: {
			// 		show: {
			// 			operation: ['insert', 'update', 'remove', 'find'],
			// 		},
			// 	},
			// 	default: '',
			// 	placeholder: 'Enter Bucket Name',
			// 	description: 'The description text',
			// },

			// {
			// 	displayName: 'Scope',
			// 	name: 'myScope',
			// 	type: 'string',
			// 	displayOptions: {
			// 		show: {
			// 			operation: ['insert', 'update', 'remove', 'find'],
			// 		},
			// 	},
			// 	default: '',
			// 	placeholder: 'Enter Scope Name',
			// 	description: 'The description text',
			// },

			// {
			// 	displayName: 'Colection',
			// 	name: 'myCollection',
			// 	type: 'string',
			// 	displayOptions: {
			// 		show: {
			// 			operation: ['insert', 'update', 'remove', 'find'],
			// 		},
			// 	},
			// 	default: '',
			// 	placeholder: 'Enter Collection Name',
			// 	description: 'The description text',
			// },


			// ----------------------------------
			//         insert
			// ----------------------------------
			{
				displayName: 'Value',
				name: 'myDocument',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['insert'],
					},
				},
				default: '',
				placeholder: 'Placeholder value',
				description: 'The description text',
			},



			// ----------------------------------
			//         update
			// ----------------------------------
			{
				displayName: 'Document ID',
				name: 'myDocument',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['update'],
					},
				},
				default: '',
				placeholder: 'Placeholder value',
				description: 'The description text',
			},
			{
				displayName: 'Value',
				name: 'myValue',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['update'],
					},
				},
				default: '',
				placeholder: 'Placeholder value',
				description: 'The description text',
			},

			// ----------------------------------
			//         delete
			// ----------------------------------
			{
				displayName: 'ID',
				name: 'myDocument',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['remove'],
					},
				},
				default: '',
				placeholder: 'Placeholder value',
				description: 'The description text',
			},

		    // ----------------------------------
			//         find
			// ----------------------------------
			{
				displayName: 'Document ID',
				name: 'myDocument',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['find'],
					},
				},
				default: '',
				placeholder: 'Placeholder value',
				description: 'The description text',
			},



		],
	};



	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

		const credentials = await this.getCredentials('CouchbaseApi');
		const myConnection = credentials.MyConnection as string;
		const myUsername = credentials.MyUsername as string;
		const myPassword = credentials.MyPassword as string;
		const myBucket = credentials.MyBucket as string;
		const myScope = credentials.MyScope as string;
		const myCollection = credentials.MyCollection as string;

		const items = this.getInputData();

		let item: INodeExecutionData;
		let item2: INodeExecutionData;
		let myDocument: string;
		let myNewValue: string;
		// let myUsername: string;
		// let myPassword: string;
		// let myBucket: string;
		// let myScope: string;
		// let myCollection: string;
		// let myConnection: string;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {

			try {
				myNewValue = this.getNodeParameter('myValue', itemIndex, '') as string;
				myDocument = this.getNodeParameter('myDocument', itemIndex, '') as string;

			//	myUsername = this.getNodeParameter('myUsername', itemIndex, '') as string;
			//	myPassword = this.getNodeParameter('myPassword', itemIndex, '') as string;
			//	myBucket = this.getNodeParameter('myBucket', itemIndex, '') as string;
			//	myScope = this.getNodeParameter('myScope', itemIndex, '') as string;
			//	myCollection = this.getNodeParameter('myCollection', itemIndex, '') as string;
			//	myConnection = this.getNodeParameter('myConnection', itemIndex, '') as string;

				const clusterConnStr = myConnection;
				const username = myUsername;
				const password = myPassword;
				const bucketName = myBucket;

				const cluster = await connect(clusterConnStr, {
					username: username,
					password: password,
					configProfile: 'wanDevelopment'
				  })
		  
			  
				  const bucket: Bucket = cluster.bucket(bucketName)
			  
				  const collection: Collection = bucket
				  .scope(myScope)
				  .collection(myCollection)


				item = items[itemIndex];
				item.json['myDocument'] = myDocument;


				const operation = this.getNodeParameter('operation', 0);

				if (operation === 'insert') {

					await collection.insert(myDocument, item.json)

				}else if (operation === 'update'){

					item2 = items[itemIndex];
					item2.json['myDocument'] = myNewValue;

					await collection.upsert(myDocument, item2.json)

				}else if (operation === 'remove'){


					await collection.remove(myDocument)

				}else if (operation === 'find'){

					const getResult: GetResult = await collection.get(myDocument)
					console.log('Get Result:', getResult)
					await collection.get(myDocument)

				}

				
			} catch (error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return this.prepareOutputData(items);
	}
}
