import _ = require('lodash');
import {
	IExecuteFunctions,
	IHookFunctions,
} from 'n8n-core';
import { NodeApiError, NodeOperationError, } from 'n8n-workflow';

import {
	OptionsWithUri,
} from 'request';

/**
 * Make an API request to Outline
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
export async function outlineApiRequest(
	this: IHookFunctions | IExecuteFunctions,
	method: string,
	path: string,
	body: object | string | Buffer,
	headers?: object,
	encoding?: null | undefined,
	query?: object
): Promise<any> { // tslint:disable-line:no-any
	const resource = this.getNodeParameter('resource', 0);
	const operation = this.getNodeParameter('operation', 0);

	const options: OptionsWithUri = {
		headers,
		method,
		body,
		qs: query ?? {},
		uri: '',
		json: true,
	};

	if (encoding === null) {
		options.encoding = null;
	}

	try {
		const credentials = await this.getCredentials('outlineApi');
		if (credentials === undefined) {
			throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
		}

		options.auth = {
			bearer: credentials.token as string,
		};

		const serverUri = _.endsWith(credentials.server as string, '/') ? credentials.server : (credentials.server + '/');
		options.uri = `${serverUri}${path}`;

		return await this.helpers.request(options);
	} catch (error) {
		// console.error("Outline error", error.response)
		throw new NodeApiError(this.getNode(), error);
	}
}
