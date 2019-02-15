import sys, io, platform
from urllib.request import urlopen, Request
from bs4 import BeautifulSoup
import urllib.error
import string
from collections import OrderedDict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='gb18030')
ProRootDir = 'I:\\PrivateProjects\\LLWokerPlateform\\' \
                if platform.system() == 'Windows' else '/Users/wangjiawei/justpython/'
sys.path.append(ProRootDir + "Utils\\filetool")
import CreateFile
import socket
import re
socket.setdefaulttimeout(20)  # 设置socket层的超时时间为20秒


def cleanInput(input):
    input = re.sub('\n+', " ", input)  # 换行符替换成空格
    input = re.sub('\[[0-9]*\]', "", input) # 剔除维基百科的引用标记(方括号包裹的数字, [1])
    input = re.sub(' +', " ", input) # 多个空格替换成单空格
    input = bytes(content, "UTF-8") # 把内容转换成utf-8
    input = input.decode("ascii", "ignore")  # 消除转义符
    cleanInput = []
    input = input.split(' ')
    for item in input:
        # strip([chars]) 去除字符串首尾字符（[chars] 列表中所有字符）
        item = item.strip(string.punctuation) # string.punctuation python所有的标点符号
        # 保留a或者i单字母，其余单字符单词删除
        if len(item) > 1 or (item.lower() == 'a' or item.lower() == 'i'):
            cleanInput.append(item)
    return cleanInput


def ngrams(input, n):
    input = cleanInput(input)
    output = []

    #region 手动加入统计数据版本
    output_dic_num = {}
    # output_dic_copy = {}
    # 统计每个映射出现的次数
    for i in range(len(input) - n + 1):
        key = str(input[i:i + n])
        if key not in output_dic_num.keys():
            output_dic_num[key] = 1
            # output_dic_copy[key] = input[i:i + n]
        else:
            output_dic_num[key] += 1
    for k,v in output_dic_num.items():
        output.append((k, v))  # 组装成 ('[]', 数目) 格式
    #endregion

    #region 原版代码
    # for i in range(len(input) - n + 1):
    #     output.append(input[i:i + n])
    #endregion
    return output


url = 'https://en.wikipedia.org/wiki/Java'
url = 'https://en.wikipedia.org/wiki/Python_(programming_language)'

headers = {
    'User-Agent': 'Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)',
}
req = Request(url, headers=headers, method='GET')
try:
    html = urlopen(req)
    bsObj = BeautifulSoup(html, 'lxml')
    html.close()
    content = bsObj.find('div', {'id': 'mw-content-text'}).get_text();

    # filepath = CreateFile.createFile('Python_wiki.txt', 'DataHub/')
    # with open(filepath, 'w', encoding='utf-8') as file:
    #     file.write(content)

    ngrams = ngrams(content, 2)
    ngrams = OrderedDict(sorted(ngrams, key=lambda t: t[1], reverse=True))
    # print(ngrams)
    filepath = CreateFile.createFile('Python_wiki_ngram_rate.txt', 'DataHub/')
    with open(filepath, 'w', encoding='utf-8') as file:
        allstr = ''
        for item in ngrams:
            allstr += (str((item, ngrams[item])) + '\n')
        file.write(allstr)

    print("2-grams count is: "+str(len(ngrams)))
except urllib.error.URLError as e:
    print(e.reason)
