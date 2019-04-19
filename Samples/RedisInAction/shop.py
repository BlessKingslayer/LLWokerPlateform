# key               类型          存储值
# recent:          有序集合      token:时间戳
# views:token      集合          浏览的商品id
# cart:token       散列          商品id:数量
# login:           散列          token:用户信息
# schedule:        有序集合       数据行id:执行时间戳    存储调度数据
# delay:           有序集合       数据行:延迟值          存储延迟数据, 小于等于0，删除调度数据
# inv:数据行id      字符串         数据行                存储数据库取出的数据行

import time
import json

QUIT = False
LIMIT = 10000000


def check_token(conn, token):
    return conn.hget('login:', token)


def update_token(conn, token, user, item=None):
    timestamp = time.time()
    conn.hget('login:', token, user)
    conn.zadd('recent:', token, timestamp)
    if item:
        conn.zadd('viewed:' + token, item, timestamp)
        conn.zremrangebyrank('viewed:' + token, 0, -26) # 保留最近25条浏览记录
        conn.zincrby('viewed:', item, -1)   # 每个浏览的商品都有一个初始值-1， 每浏览一次-1, 浏览越多分值越少


def clean_full_sessions(conn):
    while not QUIT:
        size = conn.zcard('recent:')
        if size <= LIMIT:
            time.sleep(1)
            continue

        end_index = min(size - LIMIT, 100)
        sessions = conn.zrange('rencent:', 0, end_index - 1)

        session_keys = []
        for session in sessions:
            session_keys.append('viewd:' + session)
            session_keys.append('cart:' + session)

        conn.delete(*session_keys)
        conn.hdel('login:', *sessions)
        conn.zrem('recent:', *sessions)


def can_cache(conn, request):
    pass


def hash_request(request):
    pass


# 缓存页面
def cache_request(conn, request, callback):
    # 不能缓存的页面，直接调用回调函数获取
    if not can_cache(conn, request):
        callback(request)

    # 将请求转换成字符串键
    page_key = 'cache:' + hash_request(request)
    content = conn.get(page_key)

    # 缓存页面不存在
    if not content:
        content = callback(request)
        conn.setex(page_key, content, 300)

    return content


# 缓存数据行
def cache_rows(conn):
    while not QUIT:
        next = conn.zrange('schedule:', 0, 0, withscores=True)
        now = time.time()

        # 调度数据不存在或者执行时间未到，等待50ms
        if not next or now < next[0][1]:
            time.sleep(0.5)
            continue

        row_id = next[0][0]

        delay = conn.zscore('delay:', row_id) # 提取row_id的延迟值
        if delay <= 0:
            conn.zrem('delay:', row_id)
            conn.zrem('schedule:', row_id)
            conn.delete('inv:' + row_id)
            continue

        row = Inventory.get(row_id)
        conn.zadd('schedule:', now + delay, row_id)
        conn.set('inv:' + row_id, json.dumps(row.to_dict()))


def rescale_viewed(conn):
    while not QUIT:
        conn.zremrangebyrank('viewed:', 0, -20001) # 删除排名20000之外的商品缓存
        conn.zinterstore('viewed:', {'viewed:': .5}) # 将有序集合中的分值乘以指定的数字
        time.sleep(300) # 5分钟
