#!/bin/bash

# 日历应用启动脚本
# 提供多种启动方式：本地、Docker、测试等

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 帮助信息
show_help() {
    echo -e "${BLUE}日历应用启动脚本${NC}"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  local       使用本地服务器启动"
    echo "  docker      使用Docker启动"
    echo "  compose     使用Docker Compose启动"
    echo "  test        运行测试"
    echo "  build       构建Docker镜像"
    echo "  stop        停止所有服务"
    echo "  logs        查看日志"
    echo "  help        显示帮助信息"
}

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 本地启动
start_local() {
    echo -e "${GREEN}启动本地服务器...${NC}"
    
    if command_exists python3; then
        echo "使用Python服务器..."
        python3 -m http.server 8000
    elif command_exists python; then
        echo "使用Python2服务器..."
        python -m SimpleHTTPServer 8000
    elif command_exists node; then
        echo "使用Node.js服务器..."
        npx serve . -l 8000
    elif command_exists php; then
        echo "使用PHP服务器..."
        php -S localhost:8000
    else
        echo -e "${RED}错误：未找到可用的服务器程序${NC}"
        echo "请安装Python、Node.js或PHP"
        exit 1
    fi
}

# Docker启动
start_docker() {
    echo -e "${GREEN}使用Docker启动...${NC}"
    
    if ! command_exists docker; then
        echo -e "${RED}错误：未安装Docker${NC}"
        exit 1
    fi
    
    echo "构建Docker镜像..."
    docker build -t calendar-app .
    
    echo "启动容器..."
    docker run -d -p 8080:80 --name calendar-web calendar-app
    
    echo -e "${GREEN}应用已启动！访问 http://localhost:8080${NC}"
}

# Docker Compose启动
start_compose() {
    echo -e "${GREEN}使用Docker Compose启动...${NC}"
    
    if ! command_exists docker-compose; then
        echo -e "${RED}错误：未安装Docker Compose${NC}"
        exit 1
    fi
    
    echo "构建并启动服务..."
    docker-compose up --build -d
    
    echo -e "${GREEN}应用已启动！访问 http://localhost:8080${NC}"
}

# 运行测试
run_tests() {
    echo -e "${GREEN}运行测试...${NC}"
    
    if command_exists python3; then
        echo "启动测试服务器..."
        python3 -m http.server 8000 &
        SERVER_PID=$!
        
        echo "等待服务器启动..."
        sleep 2
        
        echo "打开测试页面..."
        if command_exists open; then
            open http://localhost:8000/tests/test.html
        elif command_exists xdg-open; then
            xdg-open http://localhost:8000/tests/test.html
        else
            echo "请手动打开：http://localhost:8000/tests/test.html"
        fi
        
        echo "按Ctrl+C停止服务器"
        wait $SERVER_PID
    else
        echo -e "${RED}错误：未安装Python3${NC}"
        exit 1
    fi
}

# 构建镜像
build_image() {
    echo -e "${GREEN}构建Docker镜像...${NC}"
    
    if ! command_exists docker; then
        echo -e "${RED}错误：未安装Docker${NC}"
        exit 1
    fi
    
    docker build -t calendar-app .
    echo -e "${GREEN}镜像构建完成！${NC}"
}

# 停止服务
stop_services() {
    echo -e "${YELLOW}停止所有服务...${NC}"
    
    # 停止Docker容器
    if command_exists docker; then
        docker stop calendar-web 2>/dev/null || true
        docker rm calendar-web 2>/dev/null || true
    fi
    
    # 停止Docker Compose
    if command_exists docker-compose; then
        docker-compose down 2>/dev/null || true
    fi
    
    # 停止本地服务器
    pkill -f "http.server" 2>/dev/null || true
    pkill -f "SimpleHTTPServer" 2>/dev/null || true
    pkill -f "serve" 2>/dev/null || true
    
    echo -e "${GREEN}所有服务已停止${NC}"
}

# 查看日志
show_logs() {
    echo -e "${GREEN}查看日志...${NC}"
    
    if command_exists docker && docker ps | grep -q calendar; then
        echo "Docker容器日志:"
        docker logs calendar-web
    elif command_exists docker-compose; then
        echo "Docker Compose日志:"
        docker-compose logs
    else
        echo "无运行中的容器"
    fi
}

# 主逻辑
case "$1" in
    local)
        start_local
        ;;
    docker)
        start_docker
        ;;
    compose)
        start_compose
        ;;
    test)
        run_tests
        ;;
    build)
        build_image
        ;;
    stop)
        stop_services
        ;;
    logs)
        show_logs
        ;;
    help|--help|-h)
        show_help
        ;;
    "")
        echo -e "${YELLOW}未指定启动方式，默认使用本地启动${NC}"
        start_local
        ;;
    *)
        echo -e "${RED}错误：未知选项 '$1'${NC}"
        show_help
        exit 1
        ;;
esac