# Quick Start Guide

Getting started with wexi is incredibly easy! Just follow these simple steps:

## Prerequisites

- Docker
- Docker Compose

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your specific configuration values following the .env.example provided.

3. **Start all containers**
   ```bash
   docker compose up
   ```

That's it! 🎉

The command will automatically start all 4 containers and you'll be ready to go. Docker Compose will handle all the networking and dependencies between services.

## Additional Commands

- **Run in background:** `docker compose up -d`
- **Stop all services:** `docker compose down`
- **View logs:** `docker compose logs`
- **Rebuild containers:** `docker compose up --build`

## Need Help?

If you encounter any issues, make sure:
- Docker and Docker Compose are properly installed
- All required environment variables are set in your `.env` file
- No other services are running on the same ports