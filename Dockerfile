FROM selenium/standalone-firefox
USER root
RUN apt-get update && apt-get install -y apt-transport-https \
       ca-certificates curl gnupg2 \
       software-properties-common
RUN curl -sL https://deb.nodesource.com/setup_15.x | bash -
RUN apt-get install -y nodejs
RUN export SELENIUM_REMOTE_URL='http://localhost:4444/wd/hub'
