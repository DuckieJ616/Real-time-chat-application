# 开发环境 Dockerfile
FROM golang:1.23-alpine

# 安装必要工具
RUN apk add --no-cache git gcc musl-dev

# 设置工作目录
WORKDIR /app

# 安装 golang-migrate
RUN go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

# 复制 go mod 文件
COPY go.mod go.sum ./

# 下载依赖
RUN go mod download

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 8080

# 直接运行 Go 程序
CMD ["go", "run", "main.go"]