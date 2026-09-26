FROM harbor.dcos.wuxi.unicom.local/digital-ccr/nginx:1.27.4
ADD ./dist-app/ /usr/share/nginx/html/heilongjiang/wosaleapp/ai-digital-app/
ADD ./dockerfile/appprod/default.conf /etc/nginx/conf.d/
ADD ./dockerfile/appprod/nginx.conf /etc/nginx/
EXPOSE :8081