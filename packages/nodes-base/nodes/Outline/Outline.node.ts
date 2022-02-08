import e = require('express');
import { IExecuteFunctions } from 'n8n-core';
import { INodeExecutionData, INodeType, INodeTypeDescription, NodeOperationError, IDataObject } from 'n8n-workflow';
import { outlineApiRequest } from './GenericFunctions';

// See docs: https://www.getoutline.com/developers

export class Outline implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Outline',
		name: 'outline',
		icon: 'file:outline.png',
		group: ['input', 'output'],
		version: 1,
		description: 'Interact with Outline App',
		defaults: {
			name: 'Outline',
			color: '#772244',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'outlineApi',
				required: true,
			}
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Collections',
						value: 'collections',
					},
					{
						name: 'Documents',
						value: 'documents',
					},
				],
				default: 'documents',
				description: 'The resource to operate on.',
			},

			// ----------------------------------
			//         operations
			// ----------------------------------

			// Collections //
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'collections',
						],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a collection',
					},
				],
				default: 'create',
				description: 'The operation to perform.',
			},

			// Documents //
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'documents',
						],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'info',
						description: 'Get details of a document',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a document',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a document',
					},
					{
						name: 'List',
						value: 'list',
						description: 'Return the contents of a given document',
					},
					{
						name: 'Move',
						value: 'move',
						description: 'Move a document',
					},
					{
						name: 'Share',
						value: 'share',
						description: 'Share a document',
					},
				],
				default: 'create',
				description: 'The operation to perform.',
			},

			/////////////
			// Options //
			/////////////

			// Documents //
			{
				displayName: 'Collection ID',
				name: 'collectionId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['documents'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				description: 'The UUID or URL-ID of the collection in which to perform the action.',
			},
			{
				displayName: 'Title',
				name: 'titled": 3,
    "Name": "Whiskey",
    "Animal": "Mouse",
    "Rating": 8
  },
  {
    "id": 4,
    "Name": "Paddy",
    "Animal": "Cat",
    "Rating": 4
  },
  {
    "id": 5,
    "Name": "Twinkletoes",
    "Animal": "Cat",
    "Rating": 1',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['documents'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				description: 'The title of the document.',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		// Itterates over all input items and resolves parameters.
		// (This could be a different value for each item in case it contains an expression)
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const resource = this.getNodeParameter('resource', 0) as string;
			const operation = this.getNodeParameter('operation', 0) as string;
			const item = items[itemIndex];

			let method = 'GET'
			let path: string = `${resource}.${operation}`
			let body: string | Buffer | IDataObject = '';
			if (resource === 'collections') {
				// if (operation === 'create') {}
			} else if (resource === 'documents') {
				// if (operation === 'create') {}
			} else {
				throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
			}

			let responseData: any; // tslint:disable-line:no-any
			try {
				responseData = await outlineApiRequest.call(this, method, path, body);
				returnData.push(responseData as IDataObject);
			} catch (error) {
				if (this.continueOnFail()) {
					// if (resource === 'file' && operation === 'download') {
					// 	items[i].json = { error: error.message };
					// } else {
					returnData.push({ error: error.message });
					// }
					continue;
				}

				throw error;
			}

			// item.json.myString = myString;
		}

		return [this.helpers.returnJsonArray(returnData)];
		// return this.prepareOutputData(items);
	}
}
