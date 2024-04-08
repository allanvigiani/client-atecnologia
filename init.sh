#!/bin/bash

check_rabbitmq_health() {
  echo "Verificando a saúde do RabbitMQ..."
  for i in {1..30}; do
    health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:15672/)
    if [ "$health" -eq 200 ]; then
      echo "RabbitMQ está saudável."
      return 0
    else
      echo "Aguardando RabbitMQ ficar pronto..."
      sleep 2
    fi
  done
  echo "RabbitMQ não ficou pronto a tempo."
  return 1
}

start_service() {
  echo "Iniciando $1..."
  docker-compose up -d $1
  sleep 4
}

echo "Iniciando RabbitMQ..."
docker-compose up -d rabbitmq

if check_rabbitmq_health; then
  services=("frontend" "auth" "company" "company-service" "schedule" "user" "user-auth" "service-create-schedule" "service-send-email")

  for service in "${services[@]}"; do
    start_service $service
  done

  echo "Todos os serviços foram iniciados."
else
  echo "Falha ao iniciar os serviços dependendo do RabbitMQ."
  exit 1
fi
