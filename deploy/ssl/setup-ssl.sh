#!/bin/bash
set -e

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

# 2. Mở cổng trên iptables (cả INPUT và DOCKER-USER chain để không bị Docker/UFW nuốt gói)
for port in 5445 5446 5006 5007 5010 5011; do
    iptables -C INPUT -p tcp --dport $port -j ACCEPT 2>/dev/null || iptables -I INPUT -p tcp --dport $port -j ACCEPT 2>/dev/null || true
    iptables -C DOCKER-USER -p tcp --dport $port -j ACCEPT 2>/dev/null || iptables -I DOCKER-USER -p tcp --dport $port -j ACCEPT 2>/dev/null || true
done

# 3. Lưu quy tắc tường lửa vĩnh viễn (chống mất cấu hình sau khi DHCP renew hoặc reboot)
if command -v netfilter-persistent >/dev/null 2>&1; then
    netfilter-persistent save >/dev/null 2>&1 || true
elif command -v iptables-save >/dev/null 2>&1; then
    mkdir -p /etc/iptables
    iptables-save > /etc/iptables/rules.v4 2>/dev/null || true
fi

# 4. Chuẩn hóa tệp tin cấu hình (xóa bỏ \r nếu có)
sed -i 's/\r$//' nginx.conf docker-compose.ssl.yml 2>/dev/null || true

# 5. Khởi động lại container Nginx Proxy dành riêng cho ViOne
echo "[Docker] Đảm bảo mạng vione-network và khởi tạo container vione-ssl-proxy..."
docker network create vione-network 2>/dev/null || true
docker compose -f docker-compose.ssl.yml down --remove-orphans 2>/dev/null || true
docker rm -f vione-ssl-proxy 2>/dev/null || true

docker compose -f docker-compose.ssl.yml up -d --force-recreate

# 6. Đợi 2s để Nginx worker process ổn định
sleep 2

# 7. Kiểm tra trạng thái và logs
echo "--- TRẠNG THÁI VIONE SSL PROXY CONTAINER ---"
docker ps -a --filter name=vione-ssl-proxy --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'

echo "--- NHẬT KÝ VIONE NGINX (LOGS) ---"
docker logs --tail 15 vione-ssl-proxy 2>&1 || true

echo "--- TEST NỘI BỘ HTTPS 5445 (VIONE APP MẠNG XÃ HỘI) ---"
curl -k -s -I https://127.0.0.1:5445/ 2>&1 | head -n 5 || echo "Lỗi kết nối https 5445 nội bộ"

echo "--- TEST NỘI BỘ HTTPS 5446 (VIONE ENTERPRISE CRM) ---"
curl -k -s -I https://127.0.0.1:5446/ 2>&1 | head -n 5 || echo "Lỗi kết nối https 5446 nội bộ"
