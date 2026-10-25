#!/bin/bash

cd /root/vione-ssl-proxy

# 1. Mở các cổng trên UFW cho ViOne
if command -v ufw >/dev/null 2>&1; then
    echo "[UFW] Mở cổng 5445, 5446, 5006, 5007, 5010, 5011 trên tường lửa Ubuntu..."
    ufw allow 5445/tcp >/dev/null 2>&1 || true
    ufw allow 5446/tcp >/dev/null 2>&1 || true
    ufw allow 5006/tcp >/dev/null 2>&1 || true
    ufw allow 5007/tcp >/dev/null 2>&1 || true
    ufw allow 5010/tcp >/dev/null 2>&1 || true
    ufw allow 5011/tcp >/dev/null 2>&1 || true
    ufw reload >/dev/null 2>&1 || true
fi

# 2. Mở cổng trên iptables (cả INPUT và DOCKER-USER chain)
for port in 5445 5446 5006 5007 5010 5011; do
    iptables -C INPUT -p tcp --dport $port -j ACCEPT 2>/dev/null || iptables -I INPUT -p tcp --dport $port -j ACCEPT 2>/dev/null || true
    iptables -C DOCKER-USER -p tcp --dport $port -j ACCEPT 2>/dev/null || iptables -I DOCKER-USER -p tcp --dport $port -j ACCEPT 2>/dev/null || true
done

# 3. Đảm bảo chứng chỉ SSL tồn tại ở cả thư mục hiện tại và thư mục ssl/
mkdir -p ssl
if [ -f server.crt ]; then
    cp -f server.crt ssl/server.crt 2>/dev/null || true
    cp -f server.key ssl/server.key 2>/dev/null || true
elif [ -f ssl/server.crt ]; then
    cp -f ssl/server.crt server.crt 2>/dev/null || true
    cp -f ssl/server.key server.key 2>/dev/null || true
fi

# Đồng bộ file compose (đảm bảo docker-compose.yml luôn khớp với docker-compose.ssl.yml)
cp -f docker-compose.ssl.yml docker-compose.yml 2>/dev/null || true

# 4. Chuẩn hóa tệp tin cấu hình (xóa bỏ \r)
sed -i 's/\r$//' nginx.conf docker-compose.ssl.yml docker-compose.yml 2>/dev/null || true

# 4. Tự động kiểm tra và giải phóng cổng 5445 nếu bị ceo1983-ssl-proxy chiếm giữ
if docker ps --format '{{.Names}}\t{{.Ports}}' | grep -v 'vione-ssl-proxy' | grep -q ':5445'; then
    echo "[XUNG ĐỘT CỔNG 5445] Phát hiện container khác đang chiếm cổng 5445!"
    
    if docker ps --format '{{.Names}}' | grep -q 'ceo1983-ssl-proxy'; then
        echo "-> Tự động giải phóng cổng 5445 khỏi ceo1983-ssl-proxy..."
        CEO_COMPOSE=$(docker inspect ceo1983-ssl-proxy --format '{{ index .Config.Labels "com.docker.compose.project.config_files" }}' 2>/dev/null || echo "")
        [ -z "$CEO_COMPOSE" ] && CEO_COMPOSE=$(ls /root/ssl-proxy/*compose*.yml 2>/dev/null | head -n 1 || echo "")
        
        # Xóa container cũ
        docker rm -f ceo1983-ssl-proxy 2>/dev/null || true
        
        # Sửa file compose nếu có
        if [ -n "$CEO_COMPOSE" ] && [ -f "$CEO_COMPOSE" ]; then
            sed -i '/5445/d' "$CEO_COMPOSE" 2>/dev/null || true
            sed -i 's/5443-5445/5443-5444/g' "$CEO_COMPOSE" 2>/dev/null || true
            docker compose -f "$CEO_COMPOSE" up -d 2>/dev/null || true
        fi
        sleep 1
    fi
fi

# 5. Nếu cổng 5445 VẪN BỊ CHIẾM bởi tiến trình ngoài Docker:
# Tạm thời bỏ mapping 5445 trong docker-compose.ssl.yml để đảm bảo cổng 5446 (CRM) LUÔN KHỞI ĐỘNG THÀNH CÔNG!
if ss -tlpn 2>/dev/null | grep -E ':5445\s' | grep -vq docker-proxy; then
    echo "[CẢNH BÁO] Cổng 5445 chưa thể giải phóng. Ưu tiên khởi động cổng 5446..."
    sed -i '/"5445:5445"/d' docker-compose.ssl.yml 2>/dev/null || true
fi

# 6. Khởi động lại container Nginx Proxy dành riêng cho ViOne
echo "[Docker] Khởi tạo container vione-ssl-proxy..."
docker network create vione-network 2>/dev/null || true
docker rm -f vione-ssl-proxy 2>/dev/null || true

# Thử start compose. Nếu lỗi vì 5445, tự động bỏ 5445 và start lại 5446
if ! docker compose -f docker-compose.ssl.yml up -d --force-recreate; then
    echo "[PHỤC HỒI TỰ ĐỘNG] Cổng 5445 có xung đột. Tự động chuyển sang chế độ an toàn cổng 5446..."
    sed -i '/"5445:5445"/d' docker-compose.ssl.yml 2>/dev/null || true
    docker compose -f docker-compose.ssl.yml up -d --force-recreate || true
fi

# 7. Đợi 2s để Nginx worker process ổn định
sleep 2

# 8. Kiểm tra trạng thái và logs
echo "--- TRẠNG THÁI VIONE SSL PROXY CONTAINER ---"
docker ps -a --filter name=vione-ssl-proxy --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'

echo "--- NHẬT KÝ VIONE NGINX (LOGS) ---"
docker logs --tail 15 vione-ssl-proxy 2>&1 || true

echo "--- TEST NỘI BỘ HTTPS 5445 (VIONE APP) ---"
curl -k -s -I https://127.0.0.1:5445/ 2>&1 | head -n 5 || echo "Cổng 5445 chưa kích hoạt hoặc đang đợi giải phóng"

echo "--- TEST NỘI BỘ HTTPS 5446 (VIONE CRM) ---"
curl -k -s -I https://127.0.0.1:5446/ 2>&1 | head -n 5 || echo "Lỗi kết nối https 5446 nội bộ"
