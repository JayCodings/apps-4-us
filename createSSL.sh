#!/usr/bin/env bash
set -e

# .env-Datei laden (wenn vorhanden)
if [ -f .env ]; then
    # Windows-Zeilenenden entfernen (\r)
    sed -i 's/\r$//' .env
    export $(grep -v '^#' .env | xargs)
fi


# Prüfen, ob PROJECT_NAME gesetzt ist
if [ -z "$PROJECT_NAME" ]; then
    echo "❌ Fehler: Die Variable PROJECT_NAME ist nicht gesetzt. Bitte füge sie in deine .env-Datei ein."
    echo "Beispiel: PROJECT_NAME=my-app"
    exit 1
fi

# Zertifikatspfad
CERT_DIR="etc/nginx/certs"
mkdir -p "$CERT_DIR"

# Zertifikatsnamen
KEY_FILE="$CERT_DIR/${PROJECT_NAME}.localhost.key"
CRT_FILE="$CERT_DIR/${PROJECT_NAME}.localhost.crt"

# OpenSSL-Befehl
openssl req \
    -newkey rsa:2048 \
    -x509 \
    -nodes \
    -keyout "$KEY_FILE" \
    -new \
    -out "$CRT_FILE" \
    -reqexts SAN \
    -extensions SAN \
    -config <(cat /System/Library/OpenSSL/openssl.cnf \
        <(printf '
[req]
default_bits = 2048
prompt = no
default_md = sha256
x509_extensions = v3_req
distinguished_name = dn

[dn]
C = JP
ST = Tokyo
L = Tokyo
O = MyDomain Inc.
OU = Technology Group
emailAddress = hello@my-domain.jp
CN = %s.localhost

[v3_req]
subjectAltName = @alt_names

[SAN]
subjectAltName = @alt_names

[alt_names]
DNS.1 = *.%s.localhost
DNS.2 = %s.localhost
' "$PROJECT_NAME" "$PROJECT_NAME" "$PROJECT_NAME")) \
    -sha256 \
    -days 3650

echo "✅ Zertifikat erfolgreich erstellt:"
echo "   - Key: $KEY_FILE"
echo "   - CRT: $CRT_FILE"
