FROM node:4.2

WORKDIR /pheromon

COPY package.json ./package.json

RUN apt-get update -y \
  && apt-get upgrade -y \
  && apt-get install -y --no-install-recommends wget ca-certificates \
    postgresql-9.4 \
    python2.7 python-dev python-pip \
  && pip install ansible \
  && mkdir /etc/ansible \
  && npm install

# Node app
COPY ./api ./api
COPY ./broker ./broker
COPY ./database ./database
COPY ./tests ./tests
COPY ./tools ./tools
COPY ./updateFiles ./updateFiles
COPY ./.eslintrc ./eslintrc

# Ansible config
RUN echo '[ssh_connection]' >> /etc/ansible/ansible.cfg
RUN echo 'pipelining = True' >> /etc/ansible/ansible.cfg

# SSH config
RUN echo '' >> /etc/ssh/ssh_config
RUN echo 'Host *' >> /etc/ssh/ssh_config
RUN echo '    StrictHostKeyChecking no' >> /etc/ssh/ssh_config
RUN echo '    UserKnownHostsFile=/dev/null' >> /etc/ssh/ssh_config

CMD ["npm", "start"]
