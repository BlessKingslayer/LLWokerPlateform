from redis import StrictRedis
import time

# time: zset  voted:article_id set  score: zset  article:article_id hash

#region -- article:文章id ------ hash--记录文章信息--
#-  title 标题1                
#-  link  https://链接         
#-  poster user:user_id       
#-  time  Unix时间(1970.1.1 至今的秒数)
#-  votes 投票数
#-  dissvotes 反对数
#-------------------------------
#endregion

ONE_WEEK_IN_SECONDS = 7 * 86400
VOTE_SCORE = 432
ARTICLES_PER_PAGE = 25


# 给文章投票
def article_vote(conn, user, article, diss=False):
    cutoff = time.time() - ONE_WEEK_IN_SECONDS
    if conn.zscore('time:', article) < cutoff:
        return
    article_id = article.partition(':')[-1] # 根据指定的分隔符将字符串进行分割
    if not diss and conn.sadd('voted:' + article_id, user):
        conn.zincrby('score:', article, VOTE_SCORE) # 评分加VOTE_SCORE
        conn.hincrby(article, 'votes', 1) # 投票加1
    elif diss and conn.sadd('dissvoted:' + article_id, user):
        conn.zincrby('score:', article, VOTE_SCORE) # 评分减VOTE_SCORE
        conn.hincrby()


# 发布新文章
def post_article(conn, user, title, link):
    article_id = str(conn.incr('article:')) # 生成一个新的文章id, 计数器 增加1
    
    voted = 'voted:' + article_id
    conn.sadd(voted, user)
    conn.expire(voted, ONE_WEEK_IN_SECONDS) # 设置一个过期时间

    now = time.time()
    article = 'article:' + article_id
    conn.hmset(article, {
        'title': title,
        'link': link,
        'poster': user,
        'time': now,
        'votes': 0,
        'dissvotes': 0,
    })
    conn.zadd('score:', now + VOTE_SCORE, article)
    conn.zadd('time:', now, article)

    return article_id


# 获取文章 按照指定信息排序
def get_articles(conn, page, order='score:'):
    start = (page-1) * ARTICLES_PER_PAGE
    end = start + ARTICLES_PER_PAGE - 1

    ids = conn.zrevrange(order, start, end)
    articles = []
    for id in ids:
        article_data = conn.hgetall(id)
        article_data['id'] = id
        articles.append(article_data)

    return articles


# 添加/删除 群组
def add_remove_groups(conn, article_id, to_add=[], to_remove=[]):
    article = 'article:' + article_id
    for group in to_add:
        conn.sadd('group:' + group, article)
    for group in to_remove:
        conn.srem('group:' + group, article)


# 获取分组内的文章 按照指定属性排序
def get_group_articles(conn, group, page, order='score:'):
    key = order + group
    if not conn.exists(key):
        conn.zinterstore(key, ['group:' + group, order], aggregate='max',)
        conn.expire(key, 60) # 60秒后删除该结果
    return get_articles(conn, page, key)


if __name__ == "__main__":
    conn = StrictRedis(host='localhost', port=6379, db=2)
    # user = 'user:0001'
    # article_id = post_article(conn, user, '我是title1', 'https://link1')
    # print(article_id)

    article_vote(conn, 'user:0002', 'article:2')
    list = get_articles(conn, 1)
    print(list)