import axios from 'axios'
import type {AxiosError} from 'axios'
import config from './config'

const bearer = config.get('NETLIFY_BEARER', true)

const api = axios.create({
	baseURL: 'https://api.netlify.com/api/v1/dns_zones',
	headers: {
		authorization: `Bearer ${bearer}`,
	},
})


export function getZone(): string {
	const zone = config.get('DNS_ZONE', true)
	return `${zone}/dns_records`
}
 
export async function setDNSRecord(ip: string, host: string): Promise<number> {
	try {
		const path = getZone()
		const resp = await api.post(path, {
		   type: 'A',
		   hostname: host,
		   value: ip,
		})
		console.log('Successfully set dns record')
		return resp.status
	} catch (err) {
		console.log(err)
		if (axios.isAxiosError(err)) {
			const error = err as AxiosError
			return error.response?.status ?? 500
		}
		return 500
	}
}
