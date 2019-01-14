import base64
import platform
import sys
import time

import CreateFile
from fontTools.ttLib import TTFont

ProRootDir = 'H:\\PrivateCodePlates\\LLWokerPlateform\\' \
                if platform.system() == 'Windows' else '/Users/wangjiawei/justpython/'
sys.path.append(ProRootDir + "utils")


def createTtfAndXml(fontsstr, isxml):
    try:
        b = base64.b64decode(fontsstr)
        curtime = time.strftime("%Y%m%d_%H%M%S")
        pathnameTtf = CreateFile.createFile('zt_' + curtime + '.ttf',
                                            'DataHub/cv')
        with open(pathnameTtf, 'wb') as f:
            f.write(b)
        pathnameXml = ''
        if isxml:
            font = TTFont(pathnameTtf)
            pathnameXml = CreateFile.createFile('zt_' + curtime + '.xml', 'DataHub/cv')
            font.saveXML(pathnameXml)
        return {'ttf': pathnameTtf, 'xml': pathnameXml}

    except Exception as ex:
        print('utils -> createTtfAndXml(fontsstr) has errors. \n', ex)
        return {'ttf': '', 'xml': ''}


# pathnameTtf = CreateFile.createFile('msyh.ttf', 'DataHub/cv')
# font = TTFont(pathnameTtf)
# pathnameXml = CreateFile.createFile('msyh.xml', 'DataHub/cv')
# font.saveXML(pathnameXml)
