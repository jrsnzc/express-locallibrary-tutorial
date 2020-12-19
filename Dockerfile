FROM selenium/node-firefox
USER root
RUN apt-get update && apt-get install -y nodejs npm 