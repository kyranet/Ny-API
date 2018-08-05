upstream rethinkdb {
    server 127.0.0.1:9100;
    keepalive 8;
}

server {
	listen 80;
    listen 443 ssl http2;

    server_name db.skyradiscord.com;

    access_log /var/log/nginx/db.skyra.log;

	include snippets/ssl-db.skyradiscord.com.conf;

	location / {
		return 403;
	}

	## RethinkDB WebDash
	location /rethinkdb/ {
		auth_basic "Restricted";
		auth_basic_user_file /etc/nginx/.rethinkdb.pass;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://rethinkdb/;
        proxy_redirect off;
		proxy_set_header Authorization "";
    }
}
