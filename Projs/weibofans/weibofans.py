import requests
import time
import re
from bs4 import BeautifulSoup

url = 'https://weibo.com/p/1005051641417650/follow?relate=fans&page=1'

payload = ""
headers = {
    'Accept':
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    'Accept-Encoding':
    "gzip, deflate, br",
    'Accept-Language':
    "zh-CN,zh;q=0.9,ko-KR;q=0.8,ko;q=0.7,en;q=0.6",
    'Cache-Control':
    "max-age=0",
    'Connection':
    "keep-alive",
    'Cookie':
    "SINAGLOBAL=7768639631428.897.1521710638641; UOR=,,www.baidu.com; UM_distinctid=167c626b2fa1ba-07aa6bae011c6a-3a3a5f0c-100200-167c626b2fd690; Ugrow-G0=968b70b7bcdc28ac97c8130dd353b55e; login_sid_t=5e8ae5f18dcd1be987598098ce6457f8; cross_origin_proto=SSL; YF-V5-G0=bcfc495b47c1efc5be5998b37da5d0e4; WBStorage=f3685954b8436f62|undefined; wb_view_log=1440*9001; _s_tentry=passport.weibo.com; Apache=1556645058473.9377.1551235074901; ULV=1551235074912:5:1:1:1556645058473.9377.1551235074901:1548912763037; YF-Page-G0=70942dbd611eb265972add7bc1c85888; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9WFsJTb.3eX26AGFm2EwRiFB5JpX5K2hUgL.Fo2c1KeRSo2ESoM2dJLoI0qLxKqL1h.L1KeLxKnL1hBLBonLxKBLBonL12BLxK-L1h-L1h-LxKnL1heL1KqLxK-LB-BL1K5t; SSOLoginState=1551235092; ALF=1582771114; SCF=AiSUwJMc4oTJJ3FxlrjGwayfbG3bjGA4UwNyTj5AF0T0YNoo6bfMXQwOWVBsqNUnh_6inTRIlDWpb3_cireS56g.; SUB=_2A25xcYh-DeRhGedI4lEZ9i_OzTuIHXVSBv62rDV8PUNbmtAKLWfykW9NVp1dlxiP1byxPZhmIXPVCDx7HPuWtJ9s; SUHB=0TPEbyVAMgqwzk; un=wangjjwangww@sina.com; wb_view_log_1693861267=1440*9001; webim_unReadCount=%7B%22time%22%3A1551235465196%2C%22dm_pub_total%22%3A31%2C%22chat_group_pc%22%3A69%2C%22allcountNum%22%3A100%2C%22msgbox%22%3A0%7D",
    'Host':
    "weibo.com",
    'Referer':
    "https://s.weibo.com/weibo/%E7%99%BD%E9%B8%A6?topnav=1&wvr=6&topsug=1",
    'Upgrade-Insecure-Requests':
    "1",
    'User-Agent':
    "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36"
}


def MakeParams(page):
    urlbase = 'https://weibo.com/p/1005051641417650/follow'
    querystring = {
        'pids': 'Pl_Official_HisRelation__59',
        'relate': 'fans',
        'page': page,
        'ajaxpagelet': 1,
        'ajaxpagelet_v6': 1,
        '__ref': '/p/1005051641417650/follow?relate=fans&page={0}#Pl_Official_HisRelation__59'.format(page - 1),
        '_t': 'FM_' + str(int(time.time() * 1000))
    }
    return querystring


def GetData():
    global url
    querystring = {}
    for i in range(1, 2):
        if i > 1:
            querystring = MakeParams(i)
            url = 'https://weibo.com/p/1005051641417650/follow'
        response = requests.request(
            "GET", url, data=payload, headers=headers, params=querystring)
        html = response.content
        # bsObj = BeautifulSoup(html, 'lxml')
        # lock = bsObj.find_all(name='dd', class_='mod_info', recursive=True)
        with open("baidu2.html","w", encoding='utf-8') as f:
            f.write(response.text)



GetData()