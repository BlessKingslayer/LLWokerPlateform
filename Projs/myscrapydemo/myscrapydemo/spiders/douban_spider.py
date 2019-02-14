# -*- coding: utf-8 -*-
from scrapy import Request
from scrapy.spiders import Spider
from myscrapydemo.items import DoubanMovieItem


class DoubanMovieTop250Spider(Spider):
    # 以下为父类内置属性
    name = 'douban_movie_top250'  # 定义spider名字的字符串(string)。spider的名字定义了Scrapy如何定位(并初始化)spider，所以其必须是唯一的。 不过您可以生成多个相同的spider实例(instance)，这没有任何限制。 name是spider最重要的属性，而且是必须的。
    # start_urls = ['https://movie.douban.com/top250'] # URL列表。当没有制定特定的URL时，spider将从该列表中开始进行爬取。 因此，第一个被获取到的页面的URL将是该列表之一。 后续的URL将会从获取到的数据中提取。
    # allowed_domains = [] # 包含了spider允许爬取的域名(domain)列表(list)。 当 OffsiteMiddleware 启用时， 域名不在列表中的URL不会被跟进。

    # 非父类属性
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
    }


    # 以下为父类内置方法


    # 该方法必须返回一个可迭代对象(iterable)。该对象包含了spider用于爬取的第一个Request。
    # 当spider启动爬取并且未制定URL时，该方法被调用。 当指定了URL时，make_requests_from_url() 将被调用来创建Request对象。
    # 该方法仅仅会被Scrapy调用一次，因此您可以将其实现为生成器。
    # 该方法的默认实现是使用 start_urls 的url生成Request。 前提是未被重载
    def start_requests(self):
        url = 'https://movie.douban.com/top250'
        yield Request(url, headers=self.headers)
        # 可以不用yield, 直接 return [Request(url, headers=self.headers)]
        # 场景： 启动时需要登录网站
    ############################################################################
    # def start_requests(self):
    #     return [scrapy.FormRequest("http://www.example.com/login",
    #                            formdata={'user': 'john', 'pass': 'secret'},
    #                            callback=self.logged_in)]
    # def logged_in(self, response):
    #     # here you would extract links to follow and return Requests for
    #     # each of them, with another callback
    #     pass
    ############################################################################


    # 当response没有指定回调函数时，该方法是Scrapy处理下载的response的默认方法。
    # parse 负责处理response并返回处理的数据以及(/或)跟进的URL。 Spider 对其他的Request的回调函数也有相同的要求。
    # 该方法及其他的Request回调函数必须返回一个包含 Request 及(或) Item 的可迭代的对象。
    def parse(self, response):
        item = DoubanMovieItem()
        movies = response.xpath('//ol[@class="grid_view"]/li')
        for movie in movies:
            item['ranking'] = movie.xpath(
                './/div[@class="pic"]/em/text()').extract()[0]
            item['movie_name'] = movie.xpath(
                './/div[@class="hd"]/a/span[1]/text()').extract()[0]
            item['score'] = movie.xpath(
                './/div[@class="star"]/span[@class="rating_num"]/text()').extract()[0]
            item['score_num'] = movie.xpath(
                './/div[@class="star"]/span/text()').re(r'(\d+)人评价')[0]
            yield item


    # 该方法接受一个URL并返回用于爬取的 Request 对象。 
    # 该方法在初始化request时被 start_requests() 调用，也被用于转化url为request。
    # 默认未被复写(overridden)的情况下，该方法返回的Request对象中， parse() 作为回调函数，dont_filter参数也被设置为开启。 (详情参见 Request).
    # def make_requests_from_url(url):

    
    # 使用 scrapy.log.msg() 方法记录(log)message。 log中自动带上该spider的 name 属性。 更多数据请参见 Logging 。
    # def  log(message[, level, component])
        