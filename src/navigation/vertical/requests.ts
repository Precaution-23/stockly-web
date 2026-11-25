export default [

  {
    title: 'Manage Requests',
    icon: { icon: 'mdi-clipboard-check-outline' },
    to: { name: 'requests-tab', params: { tab: 'manage' } },
    action: 'update',
    subject: 'Requests',
  },
  {
    title: 'My Requests',
    icon: { icon: 'mdi-file-document-outline' },
    to: { name: 'requests-tab', params: { tab: 'mine' } },
    action: 'create',
    subject: 'Requests',
  },
]
