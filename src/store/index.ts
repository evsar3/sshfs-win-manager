import { createPinia } from 'pinia'

import { storage } from '../lib/storage'

const pinia = createPinia()

pinia.use(storage)

export default pinia
