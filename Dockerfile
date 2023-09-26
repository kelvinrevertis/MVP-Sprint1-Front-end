FROM node:14

COPY . .

COPY index.html .

EXPOSE 8080

CMD ["npx", "http-server", "-p", "8080"]
