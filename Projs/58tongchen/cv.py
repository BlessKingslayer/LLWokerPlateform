import hashlib
import io
import json
import os
import pickle
import platform
import re
import sys
import threading
import time

import chardet
import memcache
import requests
import threadpool
from fontTools.ttLib import TTFont
from lxml import etree
from pymemcache import serde
from pymemcache.client.base import Client
from redis import StrictRedis

ProRootDir = 'H:\\PrivateCodePlates\\LLWokerPlateform\\' \
                if platform.system() == 'Windows' else '/Users/wangjiawei/justpython/'
sys.path.append(ProRootDir + "Utils")
import CreateFile
import fontface
# sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='gb18030')


Headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
    'Authority': 'hz.58.com',
    'Path': '/qzitjishuweihu/?PGTID=0d303349-0004-ffe2-1a2c-3cf60cddc6aa&ClickID=2',
    'Cookie': 'f=n; commontopbar_new_city_info=79%7C%E6%9D%AD%E5%B7%9E%7Chz; commontopbar_ipcity=hz%7C%E6%9D%AD%E5%B7%9E%7C0; id58=c5/nn1q9rMMHrw73HJ1sAg==; sessionid=c15c852e-19ec-4782-b76c-b519d3ca5eeb; param8616=1; param8716kop=1; 58tj_uuid=f0858893-5046-4aa5-a4ae-67ad7c738198; new_uv=1; utm_source=; spm=; init_refer=; als=0; wmda_uuid=302a4f628bb6dab38719f7d2932a7e57; wmda_new_uuid=1; wmda_session_id_1731916484865=1539571148358-aedaac55-d282-f346; wmda_visited_projects=%3B1731916484865; f=n; isSmartSortTipShowed=true; new_session=0; xxzl_deviceid=TxAH5kPMpIkrRzi7xbJidgmkdt%2BLxLL9Kx1yK2tFjpF8nij6GlCJ6V5puwl3r8Nm; 58cooper="userid=58911192361743&username=nrmclfi2d&cooperkey=d31acdaaba1eb16c748c7eeb081d84a3"; Hm_lvt_a3013634de7e7a5d307653e15a0584cf=1539571148,1539571776; JSESSIONID=4B8CC110DB572488BAD15EEEF20B9A35; jl_list_left_banner=7; Hm_lpvt_a3013634de7e7a5d307653e15a0584cf=1539572209; xxzl_smartid=8b4aa36aa71d5e65c67dd6f951a8c0e8; ppStore_fingerprint=E9E8AACCAE891A2B3072877331F73822DAA26A6ED9089137%EF%BC%BF1539572250603; PPU="UID=58911192361743&UN=nrmclfi2d&TT=42c03ae3998da1377ee8afffe5ae3d23&PBODY=MfeY_JXcjH2s0yCosNq9CdF4bnDoNY0Xuxgm8EboPp9pgLNnnKaOv5kYqWZI5eR6i5U2OzTNE-w6v5QU3p3XnYzy4nWms5gQeasNOlMc1yzzoOHWfNbrBuCFf1-0f7EjGIU1IX0l6mmZTswv9-j2B3c2WsCYqq12uJcZXSmMr9k&VER=1"; www58com="AutoLogin=true&UserID=58911192361743&UserName=nrmclfi2d&CityID=0&Email=&AllMsgTotal=0&CommentReadTotal=0&CommentUnReadTotal=0&MsgReadTotal=0&MsgUnReadTotal=0&RequireFriendReadTotal=0&RequireFriendUnReadTotal=0&SystemReadTotal=0&SystemUnReadTotal=0&UserCredit=0&UserScore=0&PurviewID=&IsAgency=false&Agencys=null&SiteKey=3FFB2E44A074375AA1D7440012AB38A6940D72ACD87D16741&Phone=&WltUrl=&UserLoginVer=1FC200CCC2CA2C7E985EFDA6D29953708&LT=1539572247160"; ljrzfc=1; showPTTip=1'
}
MainUrl = 'https://hz.58.com/qzitjishuweihu/?PGTID=0d303349-0004-ffe2-1a2c-3cf60cddc6aa&ClickID=2'


def get_xpath_obj(url):
    global Headers
    response = requests.get(url, headers=Headers)

    # curtime = time.strftime("%Y%m%d_%H%M%S")
    # pathname = CreateFile.createFile('page_' + curtime + '.html', 'DataHub/allhtml')
    # with open(pathname, 'w') as f:
    #     f.write(response.text)
    print(chardet.detect(response.content))
    html = etree.HTML(response.content)

    return html


loop = 0
starttime = time.time();

# 简单比较两个字体
def cmp_font_glyph(a, b):
    global loop
    loop += 1
    print('start: ',loop)
    try:
        if a.coordinates == b.coordinates and a.endPtsOfContours == b.endPtsOfContours \
            and a.flags == b.flags and a.xMax == b.xMax and a.xMin == b.xMin \
            and a.yMax == b.yMax and a.yMin == b.yMin:
            return True
        print('end:',loop)
    except:
        print('end:', loop)
        pass
    return False


# 获取本地字体库数据
def get_base_fonts():
    pathname = CreateFile.createFile('msyh.ttf', 'DataHub/cv')
    baseFonts = TTFont(pathname)
    base_uni_list = baseFonts.getGlyphOrder()[1:]
    return [baseFonts, base_uni_list]


# 在basefonts中寻找匹配字体
def search_match_font(i, curfont, baseFonts, base_uni_list, tmp):
    for j in base_uni_list:
        baseGlyph = baseFonts['glyf'][j]
        if cmp_font_glyph(curfont, baseGlyph):
            try:
                unistr = '\\u' + j[3:7].lower()
                realstr = unistr.encode('utf-8').decode('unicode_escape')
                tmp[i.lower()] = realstr
            except:
                tmp[i.lower()] = j.lower()
            finally:
                break


def create_new_obj(baseGlyph):
    try:
        newobjstr = str(baseGlyph.coordinates.array.tolist()) + \
            str(baseGlyph.coordinates._a.tolist()) + \
            str(baseGlyph.endPtsOfContours) + \
            str(baseGlyph.flags.tolist()) + str(baseGlyph.xMax) + str(baseGlyph.xMin) + str(baseGlyph.yMax) + str(baseGlyph.yMin)
    except:
        newobjstr = ''
    return newobjstr


# 生成字体文件
def create_ttf_xml(html):
    tmp = {}
    fontstr = html.xpath('//style[1]/text()')[0]
    pattern = re.compile('^.*?base64,(.*?)\).*?format', re.S)
    result = re.match(pattern, fontstr)
    str = result.group(1)
    dic = fontface.createTtfAndXml(str, False)
    if dic['ttf'] == '':
        raise RuntimeError('字体文件不存在！')
    fonts = TTFont(dic['ttf'])
    uni_list = fonts.getGlyphOrder()[1:]
    redis = StrictRedis(host='localhost', port=6379, db=1)

    for i in uni_list:
        onlineGlyph = fonts['glyf'][i]
        newobjstr = create_new_obj(onlineGlyph)
        if newobjstr == '':
            continue
        hashstr = hashlib.md5(newobjstr.encode("utf-8")).hexdigest()
        try:
            tmp[i.lower()] = redis.get(hashstr).decode('utf-8')
        except Exception as ex:
            # print(ex)
            tmp[i.lower()] = "unknown code"

    # if os.path.exists(dic['ttf']):
    #     os.remove(dic['ttf'])
    return tmp


def get_main_list(url):
    html = get_xpath_obj(url)
    nodes = html.xpath('//div[@id="infolist"]/dl/dd/text()')
    fontDic = create_ttf_xml(html)
    print(fontDic)

def main():
    global MainUrl, starttime
    get_main_list(MainUrl)
    print(time.time() - starttime)

if __name__ == '__main__':
    main()
