#!/bin/bash
set -e

echo "========================================================================="
echo ">>> [CRM Subdomain] Cấu hình Nginx cho https://crm_vione.viconnect.vn <<<"
echo "========================================================================="

# 1. Đảm bảo mở port trên firewall
if command -v ufw >/dev/null 2>&1; then
    echo "[UFW] Mở các cổng 5006, 5007 trên tường lửa Ubuntu..."
    ufw allow 5006/tcp >/dev/null 2>&1 || true
    ufw allow 5007/tcp >/dev/null 2>&1 || true
fi

for port in 5006 5007; do
    iptables -C INPUT -p tcp --dport $port -j ACCEPT 2>/dev/null || iptables -I INPUT -p tcp --dport $port -j ACCEPT 2>/dev/null || true
    iptables -C DOCKER-USER -p tcp --dport $port -j ACCEPT 2>/dev/null || iptables -I DOCKER-USER -p tcp --dport $port -j ACCEPT 2>/dev/null || true
done

# 2. Cấu hình Nginx trên máy chủ host (Ubuntu Nginx)
if command -v nginx >/dev/null 2>&1; then
    echo "[Host Nginx] Kiểm tra Nginx reverse proxy trên hệ điều hành Ubuntu..."

    # Tìm chứng chỉ SSL hợp lệ cho tên miền viconnect.vn
    SSL_CERT=""
    SSL_KEY=""

    # 2.1. Tìm kiếm trong Let's Encrypt
    for cert in /etc/letsencrypt/live/viconnect.vn/fullchain.pem \
                /etc/letsencrypt/live/vione.viconnect.vn/fullchain.pem \
                /etc/letsencrypt/live/*/fullchain.pem; do
        if [ -f "$cert" ]; then
            SSL_CERT="$cert"
            SSL_KEY="$(dirname "$cert")/privkey.pem"
            echo "[Host Nginx] Tìm thấy chứng chỉ SSL Let's Encrypt: $SSL_CERT"
            break
        fi
    done

    # 2.2. Fallback nếu không thấy trong Let's Encrypt
    if [ -z "$SSL_CERT" ] || [ ! -f "$SSL_CERT" ]; then
        if [ -f "/etc/nginx/ssl/server.crt" ]; then
            SSL_CERT="/etc/nginx/ssl/server.crt"
            SSL_KEY="/etc/nginx/ssl/server.key"
        elif [ -f "/root/vione-ssl-proxy/server.crt" ]; then
            SSL_CERT="/root/vione-ssl-proxy/server.crt"
            SSL_KEY="/root/vione-ssl-proxy/server.key"
        fi
    fi

    echo "[Host Nginx] Sử dụng SSL Cert: $SSL_CERT"
    echo "[Host Nginx] Sử dụng SSL Key:  $SSL_KEY"

    # 2.3. Xác định thư mục cấu hình Nginx
    NGINX_CONF_DIR=""
    if [ -d "/etc/nginx/conf.d" ]; then
        NGINX_CONF_DIR="/etc/nginx/conf.d"
    elif [ -d "/etc/nginx/sites-available" ]; then
        NGINX_CONF_DIR="/etc/nginx/sites-available"
    fi

    if [ -n "$NGINX_CONF_DIR" ] && [ -n "$SSL_CERT" ] && [ -f "$SSL_CERT" ]; then
        CONF_FILE="$NGINX_CONF_DIR/crm_vione.viconnect.vn.conf"
        echo "[Host Nginx] Ghi cấu hình máy chủ ảo tại $CONF_FILE..."

        cat << 'EOF' > "$CONF_FILE"
# =========================================================================
# VIONE CRM SUBDOMAIN - https://crm_vione.viconnect.vn
# Proxy chuẩn về CRM Frontend (127.0.0.1:5006) & CRM Backend (127.0.0.1:5007)
# =========================================================================

server {
    listen 80;
    server_name crm_vione.viconnect.vn crm-vione.viconnect.vn crm.viconnect.vn;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name crm_vione.viconnect.vn crm-vione.viconnect.vn crm.viconnect.vn;

    ssl_certificate SSL_CERT_PLACEHOLDER;
    ssl_certificate_key SSL_KEY_PLACEHOLDER;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    client_max_body_size 50M;

    # Cấm phục vụ /connect-app tại CRM (chuyển hướng sang App PWA)
    location /connect-app {
        return 301 https://vione.viconnect.vn/connect-app;
    }

    location = /sw.js {
        proxy_pass http://127.0.0.1:5006;
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
        add_header Pragma "no-cache" always;
        add_header Expires "0" always;
    }

    location /assets/ {
        proxy_pass http://127.0.0.1:5006;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        proxy_pass http://127.0.0.1:5006;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
        add_header Pragma "no-cache" always;
        add_header Expires "0" always;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5007;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:5007;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    location /upload/ {
        rewrite ^/upload/(.*)$ /api/upload/$1 break;
        proxy_pass http://127.0.0.1:5007;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:5007;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
EOF

        sed -i "s|SSL_CERT_PLACEHOLDER|$SSL_CERT|g" "$CONF_FILE"
        sed -i "s|SSL_KEY_PLACEHOLDER|$SSL_KEY|g" "$CONF_FILE"

        if [ -d "/etc/nginx/sites-enabled" ]; then
            ln -sf "$CONF_FILE" /etc/nginx/sites-enabled/crm_vione.viconnect.vn.conf 2>/dev/null || true
        fi

        # Kiểm tra tính toàn vẹn cú pháp trước khi nạp lại Nginx
        if nginx -t >/dev/null 2>&1; then
            echo "[Host Nginx] Cú pháp hợp lệ (nginx -t OK). Nạp lại Nginx host..."
            systemctl reload nginx 2>/dev/null || nginx -s reload 2>/dev/null || true
            echo "[Host Nginx] Đã kích hoạt reverse proxy cho https://crm_vione.viconnect.vn thành công!"
        else
            echo "[Host Nginx] CẢNH BÁO: 'nginx -t' phát hiện lỗi cú pháp, xem chi tiết:"
            nginx -t 2>&1 || true
        fi
    fi
fi

# 3. Kiểm tra tính sẵn sàng của Container CRM Frontend
echo "[Test] Kiểm tra HTTP phản hồi nội bộ trên cổng 5006..."
curl -s -I http://127.0.0.1:5006/ 2>&1 | head -n 5 || echo "Container CRM Frontend (5006) đang nạp..."

echo "========================================================================="
echo ">>> Hoàn tất thiết lập Subdomain CRM https://crm_vione.viconnect.vn <<<"
echo "========================================================================="
