FROM daocloud.io/library/node

MAINTAINER eastpiger @ Geek Pie Association

EXPOSE 8080

RUN mkdir /server
COPY . /server

RUN cd /server \
  && npm install

WORKDIR /server

CMD [ "node", "/server/index.js" ]
