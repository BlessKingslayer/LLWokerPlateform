1. git config --global user.name "your name" 配置用户名  
   git config --global user.email "your email" 配置你注册的邮箱名 

2. 生成ssh-key  
   cd ~/.ssh  
   ssh-keygen  # 一直回车  
   cat ~/.ssh/id_rsa.pub  打印出ssh-key  
   复制粘贴到账户配置处，添加为新的key  