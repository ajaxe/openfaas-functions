FROM node:10-alpine

ENV MKDOCS_VERSION="1.0.4" \
    GIT_REPO='https://github.com/ajaxe/JournalDocs.git' \
    TERM=xterm \
    LOCAL_REPO='/home/app/doc_repo'

RUN addgroup -S app && adduser app -S -G app
RUN apk --no-cache add curl \
    && echo "Pulling watchdog binary from Github." \
    && curl -sSL https://github.com/openfaas/faas/releases/download/0.9.6/fwatchdog > /usr/bin/fwatchdog \
    && chmod +x /usr/bin/fwatchdog \
    && echo "Installing MkDocs" \
    && apk add --update \
        ca-certificates \
        bash \
        git \
        python2 \
        py-setuptools; \
    easy_install-2.7 pip \
    && pip install mkdocs==${MKDOCS_VERSION} \
        pymdown-extensions \
        mkdocs-material \
    && apk del --no-cache curl \
    && rm -rf /tmp/* /var/tmp/* /var/cache/apk/* /var/cache/distfiles/*

WORKDIR /root/

# Turn down the verbosity to default level.
ENV NPM_CONFIG_LOGLEVEL warn

RUN mkdir -p /home/app

# Wrapper/boot-strapper
WORKDIR /home/app
COPY package.json ./

# This ordering means the npm installation is cached for the outer function handler.
RUN npm i --production

# Copy outer function handler
COPY index.js ./

# COPY function node packages and install, adding this as a separate
# entry allows caching of npm install runtime dependencies
WORKDIR /home/app/function
COPY function/*.json ./
RUN npm i --production || :

# Copy in additional function files and folders
COPY --chown=app:app function/ .

WORKDIR /home/app/

# chmod for tmp is for a buildkit issue (@alexellis)
RUN chmod +rx -R ./function \
    && chown app:app -R /home/app \
    && chmod 777 /tmp

USER app

ENV cgi_headers="true"
ENV fprocess="node index.js"
EXPOSE 8080

HEALTHCHECK --interval=3s CMD [ -e /tmp/.lock ] || exit 1

# cache latest journal docs, git pull will be invoked each time anyways
RUN mkdir -p ${LOCAL_REPO} \
    && git clone  ${GIT_REPO} ${LOCAL_REPO}

CMD ["fwatchdog"]
