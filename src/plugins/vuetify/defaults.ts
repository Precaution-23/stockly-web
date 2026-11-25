// Component defaults modelled on the uvosyo web UI.
// Pages should rely on these instead of repeating variant/density props.

const itemsPerPageOptions = [
  { value: 10, title: '10' },
  { value: 25, title: '25' },
  { value: 50, title: '50' },
  { value: 100, title: '100' },
]

const tablePagination = {
  showFirstLastPage: true,
  firstIcon: 'mdi-chevron-double-left',
  lastIcon: 'mdi-chevron-double-right',
}

const field = {
  variant: 'outlined',
  density: 'comfortable',
  color: 'primary',
  hideDetails: 'auto',
}

export default {
  IconBtn: {
    icon: true,
    color: 'default',
    variant: 'text',
  },
  VAlert: {
    density: 'comfortable',
    VBtn: { color: undefined },
  },
  VBadge: { color: 'primary' },
  VBtn: { color: 'primary' },
  VCard: { elevation: 6 },
  VChip: { label: true },
  VDataTable: {
    hover: true,
    itemsPerPage: 10,
    itemsPerPageOptions,
    VPagination: tablePagination,
  },
  VDataTableServer: {
    hover: true,
    itemsPerPage: 10,
    itemsPerPageOptions,
    VPagination: tablePagination,
  },
  VList: {
    color: 'primary',
    density: 'compact',
    VCheckboxBtn: { density: 'compact' },
    VListItem: { ripple: false },
  },
  VMenu: { offset: '2px' },
  VPagination: {
    density: 'comfortable',
    variant: 'tonal',
  },
  VTabs: {
    color: 'primary',
    density: 'comfortable',
    VSlideGroup: { showArrows: true },
  },
  VTooltip: { location: 'top' },
  VCheckboxBtn: { color: 'primary' },
  VCheckbox: {
    color: 'primary',
    density: 'comfortable',
    hideDetails: 'auto',
  },
  VRadioGroup: {
    color: 'primary',
    density: 'comfortable',
    hideDetails: 'auto',
  },
  VRadio: {
    density: 'comfortable',
    hideDetails: 'auto',
  },
  VSwitch: {
    inset: true,
    color: 'primary',
    hideDetails: 'auto',
    ripple: false,
  },
  VProgressLinear: {
    height: 6,
    roundedBar: true,
    rounded: true,
  },
  VTextField: field,
  VTextarea: field,
  VFileInput: field,
  VSelect: { ...field, VChip: { label: true } },
  VAutocomplete: { ...field, VChip: { label: true } },
  VCombobox: { ...field, VChip: { label: true } },
  VSnackbar: {
    VBtn: { density: 'comfortable' },
  },
  VNavigationDrawer: { touchless: true },
}
