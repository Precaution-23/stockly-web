export default [
  {
    heading: 'Admin',
    action: 'read',
    subject: 'AdminView'
  },
  {
    title: 'Configurations',
    icon: { icon: 'mdi-cog-outline' },
    to: { name: 'configurations-tab', params: { tab: 'items' } },
    action: 'read',
    subject: 'Configurations'
  },
  {
    title: 'Roles & Permissions',
    icon: { icon: 'mdi-shield-account-outline' },
    to: { name: 'roles-tab', params: { tab: 'users' } },
    action: 'read',
    subject: 'Roles'
  },
  {
    title: 'Inventory',
    icon: { icon: 'mdi-warehouse' },
    to: { name: 'inventory' },
    action: 'read',
    subject: 'Inventory'
  }
]
