import os, time
import platform

ProRootDir = 'H:\\PrivateCodePlates\\LLWokerPlateform\\' \
                if platform.system() == 'Windows' else '/Users/wangjiawei/justpython/'
# 创建日志文件
def createLog():
    curtime = time.strftime("%Y%m%d_%H%M%S")
    dir_path = os.path.abspath(os.path.dirname(__file__))
    path = dir_path + '/log/' + str(curtime) + '.log'
    if not os.path.exists(path):
        file = open(path, 'w')
        file.close()

def createFile(filename, pathname=''):
    global ProRootDir
    try:
        default_path = os.path.abspath(ProRootDir + 'DataHub') \
            if pathname.strip() == '' else os.path.abspath(ProRootDir + pathname)
        if pathname.strip() != '' and not os.path.exists(default_path):
            os.makedirs(default_path)
        path = default_path + '/' + filename
        if not os.path.exists(path):
            file = open(path, 'w')
            file.close()
        return path
    except Exception as ex:
        print('utils -> create(filename, pathname) has errors. \n', ex)
        raise ex