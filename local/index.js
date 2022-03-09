import fetch from 'node-fetch'


async function main() {
	const token = process.env.API_TOKEN
	// at this point I realise we should rename host
	const host = process.env.SUBDOMAIN
	const resp = await fetch(`${process.env.API_URL}?token=${token}&host=${host}`)
	if (resp.status >= 400) {
		console.log('unable to update dns')
		process.exit(1)
	}
}

void main()


