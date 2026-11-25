import { Ability } from '@casl/ability'
import type { AnyAbility } from '@casl/ability'

export type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage'

export type Subjects =
  | 'Dashboard'
  | 'Requests'
  | 'Inventory'
  | 'Items'
  | 'Locations'
  | 'Vendors'
  | 'Users'
  | 'Roles'
  | 'AuditLogs'
  | 'Configurations'
  | 'AdminView'
  | 'Auth'
  | 'all'

export interface UserAbility {
  action: Actions
  subject: Subjects
}

export type AppAbility = Ability<[Actions, Subjects]>

export default Ability as unknown as new (rules?: UserAbility[]) => AppAbility
