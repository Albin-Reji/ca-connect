# CAConnect

CAConnect is a fully-dockerized, modern microservices-based application combining a robust Spring Boot backend with a dynamic React (Vite) frontend. It features real-time messaging, location-based user discovery, and centralized authentication using Keycloak.

## 🌟 Features
- **Microservices Architecture:** Built with Spring Boot and Spring Cloud (Gateway, Eureka).
- **Centralized Auth:** Secure Identity and Access Management through Keycloak (OAuth2/OIDC).
- **Real-time Chatting:** WebSocket and STOMP integration for live messaging.
- **Location Services:** Geo-aware features to find and connect with nearby users.
- **Modern Frontend:** Fast and responsive UI built with React, Vite, and modern CSS.
- **Containerized:** Seamless 1-click deployment with Docker and Docker Compose.

## 🏗 Architecture Overview

| Component | Type | Description | Internal Port | Exposed Port |
|-----------|------|-------------|---------------|--------------|
| **Frontend UI** | React / Nginx | The user-facing single-page application | 80 | `5173` |
| **API Gateway** | Spring Cloud Gateway | Entry point routing requests to microservices | 8080 | `8080` |
| **Eureka Server** | Spring Cloud Netflix | Service Discovery Registry | 8761 | `8761` |
| **Keycloak** | Identity Provider | Handles OAuth2 / JWT authentication | 8080 | `8090` |
| **User Service** | Spring Boot | Manages user registration & synchronization | 8081 | `8081` |
| **Location Service**| Spring Boot | Handles geographical data and nearest-user logic | 8082 | `8082` |
| **Profile Service** | Spring Boot | Manages user profiles and extended info | 8083 | `8083` |
| **Messaging Service**| Spring Boot | WebSocket/STOMP server for real-time chats | 8084 | `8084` |
| **PostgreSQL DB** | PostgreSQL 15 | Relational data persistence layer | 5432 | `5432` |

## 🚀 Tech Stack
* **Backend:** Java 21, Spring Boot 3.x, Spring Cloud, Spring Data JPA, Spring Security
* **Frontend:** React, Vite, SockJS, STOMP.js
* **Database:** PostgreSQL
* **Infrastructure:** Docker, Docker Compose, Nginx

## ⚙️ Prerequisites
To run this application locally, you need:
- [Docker](https://www.docker.com/get-started) and Docker Compose installed.
- (Optional) Java 21 & Node.js if you wish to run services individually outside of containers.

## 🛠 Setup and Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ca-connect.git
   cd ca-connect
   ```

2. **Configure Environment Variables:**
   * Review the `.env` file in the project root if it exists, or provide environment variables directly. 
   * Ensure you have a valid API Key for location tracking:
     `export GEO_CAGE_API_KEY=your_api_key_here`

3. **Build and Run with Docker Compose:**
   The entire infrastructure can be spun up using a single command:
   ```bash
   docker compose up --build -d
   ```
   *Note: On the first run, it will take several minutes to download images, build the microservices, and initialize the database & Keycloak constraints.*

4. **Access the Application:**
   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **Eureka Dashboard:** [http://localhost:8761](http://localhost:8761)
   - **Keycloak Admin Console:** [http://localhost:8090](http://localhost:8090) *(Default: admin/admin)*
   - **API Gateway:** [http://localhost:8080](http://localhost:8080)

## 🔧 Development

* The backend services are built with Maven Wrapper (`./mvnw`).
* WebSockets are routed directly through the API Gateway (`/ws/**`), eliminating CORS issues and hiding internal service ports.
* If making changes to a specific service, you can rebuild it selectively:
  `docker compose up --build -d <service-name>`

## 📜 License
Currently unlicensed or explicitly intended for internal / educational use. (See `LICENSE` file if added).

---
**Albin Reji**
