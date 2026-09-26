FROM harbor.dcos.wuxi.unicom.local/img-freerdhl-jjsl/nginx:1.27.3
ADD ./dist-test/ /usr/share/nginx/html/heilongjiang/wopc/gz-web/
ADD ./dockerfile/test/default.conf /etc/nginx/conf.d/
ADD ./dockerfile/test/nginx.conf /etc/nginx/
EXPOSE :8082