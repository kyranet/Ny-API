server {
    listen 80;
    server_name cdn.skyradiscord.com;

    location / {
        expires 90d;
        root /var/www/assets/;
    }
}
