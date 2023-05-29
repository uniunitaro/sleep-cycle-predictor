import * as dotenv from 'dotenv'

// .env.testを読み込む
export default function setup() {
  const testEnv = dotenv.config({
    path: '.env.test',
  })

  Object.assign(process.env, {
    ...testEnv.parsed,
  })
}
