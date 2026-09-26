FROM harbor.dcos.wuxi.unicom.local/digital-ccr/nginx:1.27.4
ADD ./dist-prod/ /usr/share/nginx/html/
ADD ./dockerfile/prod/default.conf /etc/nginx/conf.d/
ADD ./dockerfile/prod/nginx.conf /etc/nginx/
EXPOSE :8081