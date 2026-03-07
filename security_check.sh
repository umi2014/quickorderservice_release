#!/bin/bash
echo "====================================="
echo " 🔍 Ubuntu 服务器安全一键扫描脚本"
echo "====================================="

echo ""
echo "1️⃣ CPU 占用检查（寻找挖矿特征）"
echo "-------------------------------------"
ps aux --sort=-%cpu | head -n 10

echo ""
echo "2️⃣ 可疑进程检查（xmrig / miner / 随机名称）"
echo "-------------------------------------"
ps aux | grep -Ei "xmrig|minerd|cryptonight|kinsing|kdevtmpfsi|kthreaddi|masscan" | grep -v grep

echo ""
echo "3️⃣ 网络端口检查（是否连接矿池 IP / 可疑端口）"
echo "-------------------------------------"
sudo ss -tulpn

echo ""
echo "4️⃣ 外连检查（排查挖矿连接）"
echo "-------------------------------------"
sudo ss -antp | grep -E "3333|4444|5555|7777|14444|18080"

echo ""
echo "5️⃣ 检查 /tmp、/var/tmp、/dev/shm 可疑文件"
echo "-------------------------------------"
find /tmp /var/tmp /dev/shm -type f -mtime -7 -exec ls -lh {} \;

echo ""
echo "6️⃣ 定时任务（Cron）检查"
echo "-------------------------------------"
echo "➡️ 用户 crontab:"
crontab -l 2>/dev/null
echo "➡️ root crontab:"
sudo crontab -l 2>/dev/null
echo "➡️ /etc/cron.*:"
sudo ls -R /etc/cron.*

echo ""
echo "7️⃣ 自启动服务检查（systemd）"
echo "-------------------------------------"
systemctl list-unit-files | grep enabled

echo ""
echo "8️⃣ 最近登录 & 爆破检查"
echo "-------------------------------------"
echo "➡️ 正常登录记录:"
last -a | head -n 10
echo ""
echo "➡️ 登录失败记录（是否有人爆破 SSH）:"
sudo lastb | head -n 10

echo ""
echo "9️⃣ 检查隐藏可执行文件"
echo "-------------------------------------"
sudo find / -perm -111 -type f -mtime -7 2>/dev/null | head -n 20

echo ""
echo "🔚 扫描完成！请根据输出判断是否有可疑活动。"
echo "====================================="
