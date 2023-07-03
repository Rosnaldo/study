FROM golang:1.19
WORKDIR /app
COPY . .
RUN CGO_ENABLE=0 GOOS=linux GOARCH=amd64 go build -o webserver main.go
ENTRYPOINT [ "/app/webserver" ]
