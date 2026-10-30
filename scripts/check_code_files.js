const fs = require('fs');

const files = [
  'apps/vione_app_be/src/platform-hub/platform-hub.service.ts',
  'apps/vione_app_be/src/platform-hub/platform-hub.controller.ts',
  'apps/vione_app_be/src/events/events.service.ts',
  'apps/vione_app_be/src/events/events.controller.ts',
  'apps/vione_app_be/src/members/members.service.ts',
  'apps/vione_app_be/src/companies/companies.service.ts',
  'apps/vione_app_be/src/admin/admin.service.ts',
  'apps/vione_app_be/src/operations/operations.service.ts',
  'apps/vione_app_fe/src/components/platform-app/SportTournamentHub.tsx',
  'apps/vione_app_fe/src/components/platform-app/RunRaceHub.tsx',
  'apps/vione_app_fe/src/components/platform-app/MuseumExplorer.tsx',
  'apps/vione_app_fe/src/components/platform-app/HeritageExplorer.tsx',
  'apps/vione_app_fe/src/components/platform-app/TicketWallet.tsx',
  'apps/mobile_vione/src/screens/platform/PlatformAppScreen.tsx'
];

let totalLines = 0;
files.forEach(f => {
  if (fs.existsSync(f)) {
    const lines = fs.readFileSync(f, 'utf-8').split('\n').length;
    totalLines += lines;
    console.log(`EXISTS: ${f} (${lines} lines)`);
  } else {
    console.log(`MISSING: ${f}`);
  }
});
console.log(`TOTAL REAL CODE LINES: ${totalLines}`);

