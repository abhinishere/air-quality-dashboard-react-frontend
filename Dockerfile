# building

FROM node:19-alpine3.15 AS builder
ENV NODE_ENV production
# ARG VITE_API_URL
# ENV VITE_API_URL=$VITE_API_URL

# work directory

WORKDIR /app

# copy package.json files

COPY package.json .
COPY package-lock.json .

# install packages

RUN NODE_ENV=development npm i
# Copy remaining files

COPY . .

# Build the app

RUN npm run build

# for hosting

# Bundle static assets with nginx

FROM nginx:1.23-alpine as production
ENV NODE_ENV production

# copy build files

COPY --from=builder /app/dist /usr/share/nginx/html

# Add your nginx.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port

EXPOSE 80

# Start nginx server

CMD ["nginx", "-g", "daemon off;"]