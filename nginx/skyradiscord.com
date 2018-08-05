server {
    #listen 80;
    #listen 443 ssl http2;
    #
    #server_name skyradiscord.com;
    #
    #access_log /var/log/nginx/skyra.log;
    #ssl_certificate /etc/nginx/ssl/skyra.pem;
    #ssl_certificate_key /etc/nginx/ssl/skyra.key;
    #
	#root /var/www/html;
    #
    #location / {
	#	expires 1h;
    #    try_files $uri $uri/ =404;
    #}

    listen 80;
    listen 443 ssl http2;

    server_name skyradiscord.com;

    access_log /var/log/nginx/skyra.log;

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

    location /donate {
        return 301 https://www.patreon.com/kyranet;
    }

    location /translate {
        return 301 https://github.com/kyranet/Skyra/blob/master/LANGUAGES.md;
    }

    location /trello {
        return 301 https://trello.com/b/PcO6zNh2;
    }
}
