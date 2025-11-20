const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf-8');

// MUDANÇA 1: Adicionar modelo Organization após WorkspaceRole
const organizationModel = `
model Organization {
  id          String   @id @default(cuid())
  name        String
  document    String?  @unique  // CNPJ/Documento Fiscal

  // Relação com Workspaces que pertencem a esta Organização
  workspaces  Workspace[]

  // Relação com o Endereço de Cobrança
  billingAddressId String?
  billingAddress   Address? @relation("OrganizationBilling", fields: [billingAddressId], references: [id], onDelete: SetNull)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([document])
}
`;

schema = schema.replace(
  /(model WorkspaceRole \{[^}]+\}\n)/,
  `$1${organizationModel}\n`
);

// MUDANÇA 2: Adicionar organizationId ao Workspace
schema = schema.replace(
  /(  members   WorkspaceMember\[\]\n)(  createdAt DateTime)/,
  `$1  \n  // Relação com Organização (empresa cliente)\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  \n$2`
);

// MUDANÇA 3: Adicionar índice organizationId ao Workspace
schema = schema.replace(
  /(  subscription WorkspaceSubscription\?\n)(\})/,
  `$1  \n  @@index([organizationId])\n$2`
);

// MUDANÇA 4: Adicionar relação inversa ao Address
schema = schema.replace(
  /(  units       Unit\[\]\n\n)(  createdAt DateTime)/,
  `$1  // Relação inversa para Organization (endereço de cobrança)\n  organizationBilling Organization[] @relation("OrganizationBilling")\n\n$2`
);

fs.writeFileSync(schemaPath, schema);
console.log('✅ Schema atualizado com sucesso!');
