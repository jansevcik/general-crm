const fs = require('fs');
const content = `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/crm_db"
NEXTAUTH_SECRET="secret-change-me-in-prod-1234567890"
NEXTAUTH_URL="http://localhost:3000"
`;
fs.writeFileSync('.env', content);
console.log('.env written');
