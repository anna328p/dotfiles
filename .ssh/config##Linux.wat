Host broker
	Hostname dkudriavtsev.ddns.net
	User dmitry
	Port 2222
Host tera-remote
	ProxyCommand ssh -q broker nc  10.10.10.50 22

Host TARGET_HOST
   User TARGET_USER
  ProxyCommand ssh -W %h:%p HOP_USER@HOP_HOST
