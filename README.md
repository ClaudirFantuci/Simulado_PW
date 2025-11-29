# README.md - Sistema de Reservas de Laboratórios

## Descrição

Aplicação web para reservas de laboratórios universitários, desenvolvida como simulado para prova de Programação Web. Inclui API REST (Spring Boot) com WebSocket e frontend em React.
Funcionalidades Principais:
Criação, edição, cancelamento e exclusão de reservas.
Resumo de ocupação de laboratórios na home.
Filtros na tabela de reservas.
Notificações em tempo real para ações em reservas (criar, atualizar, cancelar, excluir).
Regras de negócio: Sem conflitos de horários, limite de 3 reservas ativas por solicitante, etc.

O projeto segue boas práticas, mas é uma versão simplificada para o cenario de tempo limitado da prova , removendo DTOs e handlers de exceções globais.

- **Backend**: Spring Boot com camadas (Controller, Service, Repository), enums, validações e notificações em tempo real.
- **Frontend**: React com páginas Home/Reservas, formulários, tabelas e integração API/WebSocket.
- **Funcionalidades**: Criação/edição/cancelamento/exclusão de reservas; resumo de ocupação; filtros; regras de negócio (sem conflitos, limite por solicitante).

Tecnologias: Java/Spring Boot/Lombok/MySQL; React/Vite/Axios/SockJS.

## Estrutura
back/
├── src/
│   ├── main/
│   │   ├── java/com/seuapp/reservas/
│   │   │   ├── config/              
│   │   │   ├── controller/
│   │   │   ├── model/
│   │   │   ├── enums/               
│   │   │   ├── repository/          
│   │   │   ├── service/            
│   │   │   └── websocket/           # Serviços WebSocket (ex: WebSocketNotificationService.java)
│   │   └── resources/               
└── pom.xml      

front/
├── src/
│   ├── components/                  
│   ├── pages/                      
│   ├── services/                    
│   ├── App.jsx                      
│   ├── main.jsx                    
│   └── index.css                    
├── public/                          
├── package.json                     
             

- **Backend**: Pacotes para config, controller, entity, enums, repository, service, websocket.
- **Frontend**: Componentes (Header, FormReserva), páginas (Home, Reservas), services (api.js, websocket.js).

## Instalação e Execução

1. **Clonar**: `git clone https://github.com/seu-usuario/repo.git`
2. **Backend** (pasta `backend`):
   - Configure `application.properties` (MySQL).
   - `mvn spring-boot:run` (porta 8080).
3. **Frontend** (pasta `frontend`):
   - `npm install`
   - `npm run dev` (porta 3000).
4. Teste WebSocket: Abra duas abas em `/reservas` e crie uma reserva.

## Regras de Negócio

- Valores válidos via enums.
- Sem conflitos de horários.
- Máx. 3 reservas ativas por solicitante.
- Edição/cancelamento/exclusão com restrições.

