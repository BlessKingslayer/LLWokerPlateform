1. 使用 pip3 安装 virtualenv  
   pip3 install virtualenv  

2. 进入你需要创建虚拟环境的目录,   
   然后执行 virtualenv venv 创建名为venv的虚拟环境  
   virtualenv -p /usr/bin/python2.7 venv     
   # -p 指定python解释器程序路径, 否则默认使用环境变量中的python解释器路径

3. 运行 虚拟环境  H:\PrivateCodePlates\LLWokerPlateform\Utils\venv\Scripts\activate

4. 删除虚拟环境  rm -rf venv