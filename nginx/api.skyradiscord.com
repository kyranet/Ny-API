upstream backend {
    server 127.0.0.1:1337;
    keepalive 8;
}

server {
    listen 80;
    listen 443 ssl http2;

    server_name api.skyradiscord.com;

    access_log /var/log/nginx/api.skyra.log;

    ssl_certificate /etc/nginx/ssl/skyra.pem;
    ssl_certificate_key /etc/nginx/ssl/skyra.key;

    add_header 'Access-Control-Allow-Origin' '*';
    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://backend/;
        proxy_redirect off;
    }
}
