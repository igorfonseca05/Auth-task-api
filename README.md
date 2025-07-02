Testes API

## 🧪 Matriz de Testes – API de Autenticação

| 🧩 Funcionalidade      | 🔍 Cenário                                       | 🎯 Entrada                          | 📤 Resultado Esperado                       | ✅ Testado |
| ---------------------- | ------------------------------------------------ | ----------------------------------- | ------------------------------------------- | ---------- |
| Cadastro               | ✅ Criar usuário com dados válidos               | name, email, password válidos       | `201 Created`, retorna `user._id`           | ☑️         |
| Cadastro               | ❌ Nome vazio                                    | name: ""                            | `404`, erro de campo obrigatório            | ☑️         |
| Cadastro               | ❌ E-mail duplicado                              | email já usado                      | `404`, erro de duplicidade                  | ☑️         |
| Cadastro               | ❌ Senha curta                                   | password: "123"                     | `404`, erro de validação                    | ☑️         |
| Cadastro               | ❌ E-mail inválido                               | email: "fulano%gmail.com"           | `404`, erro de formato inválido             | ☑️         |
| Login                  | ✅ Login com dados válidos                       | email e password corretos           | `200 OK`, retorna `user._id`                | ☑️         |
| Login                  | ❌ E-mail não cadastrado                         | email inexistente                   | `404`, usuário não encontrado               | ☑️         |
| Login                  | ❌ Senha incorreta                               | email correto, senha errada         | `404`, erro de senha                        | ☑️         |
| Login                  | ❌ E-mail inválido                               | email: "fulano&&%gmail.com"         | `404`, erro de e-mail inválido              | ☑️         |
| Login                  | ❌ Campo de e-mail vazio                         | email: ""                           | `404`, erro de campo vazio                  | ☑️         |
| Rota protegida         | 🔐 Acesso com token válido                       | Authorization: Bearer `valid_token` | `200 OK`, retorna perfil do usuário         | ☑️         |
| Rota protegida         | 🔐 Token inválido                                | Authorization: Bearer `fake_token`  | `401 Unauthorized`, mensagem: invalid token | ☑️         |
| Rota protegida         | 🔐 Sem token                                     | Nenhum header Authorization         | `401 Unauthorized`, mensagem: Unauthorized  | ☑️         |
| Logout                 | 🔓 Logout com token válido                       | Authorization: Bearer `valid_token` | `200 OK`, usuário deslogado                 | ☑️         |
| Logout                 | 🔓 Logout sem token                              | Nenhum header Authorization         | `401 Unauthorized`                          | ☑️         |
| Logout All             | 🔁 Logout de todos os dispositivos               | Authorization: Bearer `valid_token` | `200 OK`, limpa todos os tokens             | ☑️         |
| Verificação de tokens  | 📦 Deve haver ao menos 1 token salvo             | Consulta ao banco (`user.tokens`)   | `length > 0`                                | ☑️         |
| Rotatividade de tokens | ♻️ Após 4 logins, token antigo deve ser removido | Gera 3 novos tokens seguidos        | token original não está mais no array       | ☑️         |
| Deletar perfil         | ❌ Deletar usuário autenticado                   | DELETE com token válido             | `200 OK`, usuário removido                  | ☑️         |
