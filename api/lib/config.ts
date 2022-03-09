import dotenv from 'dotenv-flow'

class Config {
	constructor() {
		dotenv.config()
	}

	get(key: string, throws = false): string {
		const val = process.env[key]
		if (!val) {
			if (throws) {
				const err = `Unable to fetch 'process.env.${key}'`
				console.error(err)
				throw new Error(err)
			}
			else return ''
		}
		return val
	}
}

export default new Config()
