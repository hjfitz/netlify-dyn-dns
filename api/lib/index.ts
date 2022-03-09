// todo: does netlify have an internal logger?
import {Handler, HandlerEvent} from '@netlify/functions'
import {StatusCodes, getReasonPhrase} from 'http-status-codes'
import config from './config'
import {setDNSRecord} from './netlify-dns.service'

export function createResponse<T>(code: number, body?: T)  {
	return {
		statusCode: code,
		body: body ? JSON.stringify(body) : getReasonPhrase(code)
	}
}

// expected params
// token=$our_token_set_in_env
// hostname=$some_sumdomain
export function validateIncomingRequest(event: HandlerEvent): StatusCodes | null {
	const apiToken = config.get('API_TOKEN', true)
	if (!event.queryStringParameters) {
		console.log('No querystring params passed')
		return StatusCodes.BAD_REQUEST
	}
	const {token, hostname} = event.queryStringParameters
	if (!token || !hostname) {
		console.log('Missing token or header: ', {token, hostname})
		return StatusCodes.BAD_REQUEST
	}

	if (token !== apiToken) {
		return StatusCodes.UNAUTHORIZED
	}
	return null
}

export const handler: Handler = async (event) => {
	const invalidResponseCode = validateIncomingRequest(event)
	if (invalidResponseCode) {
		return createResponse(invalidResponseCode)
	}
	const {hostname} = event.queryStringParameters!

	const incomingIp = event.headers['client-ip'] ?? event.headers['x-forwarded-for']!

	console.log('Setting record', {incomingIp, hostname})

	const resp = await setDNSRecord(incomingIp, hostname!)

	return createResponse(resp)
}

