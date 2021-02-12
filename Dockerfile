FROM node:14.9.0-stretch as step01
MAINTAINER Theppirak Kaensom <kaensom@tel.co.th>

WORKDIR /smd/src
COPY ./package.json /smd/src/package.json
RUN npm install
COPY . /smd/src
RUN npm run build

FROM nginx
MAINTAINER Theppirak Kaensom <kaensom@tel.co.th>

# Set the time zone
RUN echo "Asia/Bangkok" > /etc/timezone
RUN rm /etc/localtime
RUN ln -s /usr/share/zoneinfo/Asia/Bangkok /etc/localtime

WORKDIR /usr/share/nginx/html
COPY --from=step01 /smd/src/dist .
