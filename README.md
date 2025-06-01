# Projeto Segurança da Informação
- Aplicação dos seguintes tópicos da LGPD (Lei Geral de Proteção dos Dados):
  - Notificação: App Notify
  - EasyTerms: App Opt in Opt out;
  - Portabilidade: App Talents-a

# 📜 Easy Terms – Sistema de Consentimento LGPD (Opt-In/Opt-Out)

**Easy Terms** é um sistema prático e seguro, criado para garantir a conformidade com a **Lei Geral de Proteção de Dados (LGPD)** no que se refere ao **consentimento informado** dos usuários sobre o uso de seus dados pessoais.

Com base no modelo **Opt-In / Opt-Out**, o sistema permite que usuários aceitem ou revoguem termos gerais e campos opcionais de forma totalmente rastreável e transparente.


## 🔐 Objetivo

Garantir que os usuários tenham **controle total** sobre seus dados, com clareza e liberdade para **consentir** ou **revogar consentimentos** quando quiserem.

## 👥 Perfis de Acesso

### 🛠️ Admin

O perfil de administrador possui as seguintes permissões:

- ✅ Criar e editar termos (com campos opcionais);
- ✅ Visualizar o histórico completo de termos e usuários;
- ✅ Visualizar todos os consentimentos e revogações;
- ✅ Editar seus próprios dados.

**Detalhe importante:**  
➡️ Sempre que um termo é criado com o mesmo título de outro existente, **uma nova versão é gerada automaticamente** (incremento de versão) para manter o histórico e rastreabilidade de alterações no conteúdo.

### 👤 Usuário

O usuário final pode:

- ✅ Criar sua própria conta;
- ✅ Editar seus próprios dados;
- ✅ Aceitar ou revogar termos;
- ✅ Aceitar ou revogar individualmente **campos opcionais** de um termo;
- ✅ Visualizar somente o seu **próprio histórico de ações**.

Todas as ações de consentimento e revogação são **registradas** para fins de auditoria.

## 📌 Funcionalidades

| Funcionalidade                       | Admin  | Usuário  |
|--------------------------------------|:------:|:--------:|
| Criar termos                         | ✅     | ❌      |
| Gerar nova versão de um termo        | ✅     | ❌      |
| Editar dados pessoais                | ✅     | ✅      |
| Criar usuários                       | ✅     | ✅      |
| Aceitar termos pessoais              | ✅     | ✅      |
| Revogar termos pessoais              | ✅     | ✅      |
| Aceitar campos opcionais pessoais    | ✅     | ✅      |
| Revogar campos opcionais pessoais    | ✅     | ✅      |
| Visualizar histórico completo        | ✅     | ❌      |
| Visualizar histórico pessoal         | ✅     | ✅      |

## 📑 Aplicação da LGPD

O Easy Terms atende aos principais princípios da LGPD:

- **Transparência** – Exibição clara dos termos e suas versões;
- **Livre acesso** – Histórico acessível pelo usuário;
- **Revogabilidade** – Consentimentos podem ser removidos a qualquer momento;
- **Responsabilização e prestação de contas** – Todas as ações são registradas com data, hora e usuário;
- **Segurança e rastreabilidade** – Histórico detalhado por termo, campo e versão.

## 📂 Histórico de Ações

Todo consentimento ou revogação é registrado com:

- 🕓 Data e hora da ação;
- 📄 Termo e versão associados;
- 📌 Campos opcionais envolvidos;
- 👤 Usuário responsável.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React + Chakra UI  
- **Backend:** NestJS + TypeORM  
- **Banco de Dados:** PostgreSQL  
- **Autenticação:** JWT 
- **Controle de Histórico:** Sistema robusto de logs por ação
