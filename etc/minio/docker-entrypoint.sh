#!/bin/sh
set -e

echo "Starting MinIO server..."
minio server /data --console-address ":9001" &

MINIO_PID=$!

echo "Waiting for MinIO to be ready..."
sleep 5

echo "Configuring MinIO client..."
mc alias set local http://localhost:9000 "${MINIO_ROOT_USER}" "${MINIO_ROOT_PASSWORD}"

echo "Creating bucket: ${MINIO_BUCKET}"
mc mb local/${MINIO_BUCKET} --ignore-existing

echo "Setting bucket policy to public..."
mc anonymous set public local/${MINIO_BUCKET}

echo "MinIO initialization complete"

wait $MINIO_PID
