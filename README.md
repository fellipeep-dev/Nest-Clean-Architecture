# 🌊 Vizinho D'Água API

API do projeto **Vizinho D'Água**, voltada para gestão de denúncias, conteúdos educacionais e alertas relacionados a problemas de abastecimento de água.

O projeto segue o padrão **Clean Architecture** com **DDD + CQRS**, separando claramente domínio, aplicação e infraestrutura.

---

## 🚀 Principais Features

- **📣 Gestão de Alertas**
  - Criação automática de alertas a partir de denúncias agrupadas por localidade.
  - Preenchimento automático de endereço via CEP (Integração com ViaCEP).
  - Controle de status: Em verificação, Verificado, Descartado, Oficial.


- **📝 Gestão de Denúncias**
  - Criar, editar e consultar denúncias.
  - Encaminhamento automático para órgãos competentes após processamento.
  - Agrupamento por localidade para gerar alertas.


- **📚 Conteúdos Educacionais**
  - CRUD de conteúdos educativos com diferentes categorias.
  - Acesso direto do menu principal.


- **🔔 Notificações**
  - Disparo automático com base no status de alertas ou informes oficiais.
  - Usuários recebem notificações filtradas por localidade.


- **🛠 Integrações Externas**
  - ViaCEP para busca de endereço a partir do CEP.


- **📄 Documentação Interativa**
  - Swagger disponível para teste de todos os endpoints.
  - Acessível em `http://localhost:5000/swagger` quando rodando localmente.

---
