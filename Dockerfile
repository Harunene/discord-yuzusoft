FROM node:13.1.0

# Env
ENV TIME_ZONE=Asia/Seoul
ENV ENV_NAME dev
ENV EGG_SERVER_ENV dev
ENV NODE_ENV dev
ENV NODE_CONFIG_ENV dev

RUN apt install python3

# Create Directory for the Container
WORKDIR /usr/src/app

# Only copy the package.json file to work directory
COPY package.json .
# Install all Packages
RUN npm install

# Copy all other source code to work directory
ADD . /usr/src/app

# Start
CMD [ "npm", "start" ]
EXPOSE 8000