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
  } from 'couchbase'

export class ExampleNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Couchbase',
		name: 'couchbaseDB',
		icon: 'file:CBLogomark.svg',
		group: ['transform'],
		version: 1,
		description: 'Basic Example Node',
		defaults: {
			name: 'Couchbase',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Insert',
                        value: 'insert',
                        description: 'Insert document in couchbase',
                        action: 'Insert document in couchbase',
                    },
					{
						name: 'Update',
						value: 'update',
						description: 'Update document in couchbase',
						action: 'Update document in couchbase',
					},
					{
						name: 'Remove',
						value: 'remove',
						description: 'Remove document in couchbase',
						action: 'Remove document in couchbase',
					},
                ],
                default: 'insert',
            },

			// ----------------------------------
			//         credentials
			// ----------------------------------
			{
				displayName: 'Username',
				name: 'myUsername',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['insert', 'update', 'remove'],
					},
				},
				default: '',
				placeholder: 'Enter Your Username',
				description: 'The description text',
			},

			{
				displayName: 'Password',
				name: 'myPassword',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['insert', 'update', 'remove'],
					},
				},
				default: '',
				placeholder: 'Enter Your Password',
				description: 'The description text',
			},

			{
				displayName: 'Bucket',
				name: 'myBucket',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['insert', 'update', 'remove'],
					},
				},
				default: '',
				placeholder: 'Enter Bucket Name',
				description: 'The description text',
			},

			{
				displayName: 'Scope',
				name: 'myScope',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['insert', 'update', 'remove'],
					},
				},
				default: '',
				placeholder: 'Enter Scope Name',
				description: 'The description text',
			},

			{
				displayName: 'Colection',
				name: 'myCollection',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['insert', 'update', 'remove'],
					},
				},
				default: '',
				placeholder: 'Enter Collection Name',
				description: 'The description text',
			},


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
				displayName: 'ID',
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



		],
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let item: INodeExecutionData;
		let item2: INodeExecutionData;
		let myDocument: string;
		let myNewValue: string;
		let myUsername: string;
		let myPassword: string;
		let myBucket: string;
		let myScope: string;
		let myCollection: string;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				myNewValue = this.getNodeParameter('myValue', itemIndex, '') as string;
				myDocument = this.getNodeParameter('myDocument', itemIndex, '') as string;

				myUsername = this.getNodeParameter('myUsername', itemIndex, '') as string;
				myPassword = this.getNodeParameter('myPassword', itemIndex, '') as string;
				myBucket = this.getNodeParameter('myBucket', itemIndex, '') as string;
				myScope = this.getNodeParameter('myScope', itemIndex, '') as string;
				myCollection = this.getNodeParameter('myCollection', itemIndex, '') as string;

				const clusterConnStr = "couchbase://127.0.0.1/?connectionTimeout=1200";
				const username = myUsername
				const password = myPassword
				const bucketName = myBucket

				const cluster = await connect(clusterConnStr, {
					username: username,
					password: password,
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
