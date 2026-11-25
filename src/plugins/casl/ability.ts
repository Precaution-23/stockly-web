import { Ability } from '@casl/ability'
import type { UserAbility } from './AppAbility'

const storedAbilities = localStorage.getItem('stockly_abilities')
const existingAbilities: UserAbility[] = storedAbilities ? JSON.parse(storedAbilities) : []

export default new Ability(existingAbilities.length > 0 ? existingAbilities : [{ action: 'read', subject: 'Auth' }])
