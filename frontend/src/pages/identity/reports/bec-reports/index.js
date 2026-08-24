import { Layout as DashboardLayout } from '../../../../layouts/index.js'
import { CippTablePage } from '../../../../components/CippComponents/CippTablePage.jsx'
import { Visibility, DeleteForever, Archive } from '@mui/icons-material'
import { useSettings } from '../../../../hooks/use-settings'

const Page = () => {
  const pageTitle = 'BEC Reports'
  const { currentTenant } = useSettings()

  const actions = [
    {
      label: 'View run',
      icon: <Visibility />,
      link: '/identity/administration/users/user/bec?userId=[UserId]&caseId=[CaseId]&tenantFilter=[Tenant]',
      multiPost: false,
      condition: (row) => row.Status === 'Completed',
    },
    {
      // built fresh on demand from the stored run (no PDF - only the browser can render it);
      // every export is hashed and recorded on the run for later verification
      label: 'Download evidence package (ZIP)',
      icon: <Archive />,
      link: '/api/ListBECEvidence?tenantFilter=[Tenant]&caseId=[CaseId]&download=true',
      external: true,
      target: '_blank',
      multiPost: false,
      condition: (row) => row.Status === 'Completed',
    },
    {
      label: 'Delete run',
      icon: <DeleteForever />,
      type: 'POST',
      url: '/api/ExecBECReport',
      data: { Action: '!Delete', caseId: 'CaseId', tenantFilter: 'Tenant' },
      confirmText:
        'Delete run [CaseId] for [UserPrincipalName] permanently, including its results and evidence package?',
      multiPost: false,
    },
  ]

  const offCanvas = {
    extendedInfoFields: [
      'CaseId',
      'Tenant',
      'UserPrincipalName',
      'DisplayName',
      'Scope',
      'Status',
      'Level',
      'Score',
      'IncompleteCount',
      'ExtractedAt',
      'RequestedAt',
      'RequestedBy',
      'ContainmentRuns',
      'HasEvidence',
      'EvidenceSha256',
      'EvidenceCreatedAt',
      'ErrorMessage',
    ],
    actions: actions,
  }

  const simpleColumns = [
    'Tenant',
    'UserPrincipalName',
    'Level',
    'Score',
    'Scope',
    'Status',
    'ExtractedAt',
    'RequestedBy',
    'ContainmentRuns',
    'HasEvidence',
    'CaseId',
  ]

  return (
    <CippTablePage
      title={pageTitle}
      apiUrl="/api/ListBECReports"
      queryKey={`ListBECReports-${currentTenant}`}
      actions={actions}
      offCanvas={offCanvas}
      simpleColumns={simpleColumns}
      filters={[
        {
          filterName: 'High threat level',
          value: [{ id: 'Level', value: 'High' }],
          type: 'column',
        },
        {
          filterName: 'Completed runs',
          value: [{ id: 'Status', value: 'Completed' }],
          type: 'column',
        },
      ]}
    />
  )
}

Page.getLayout = (page) => (
  <DashboardLayout allTenantsSupport={true}>{page}</DashboardLayout>
)

export default Page
