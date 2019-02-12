import time,sys


def view_bar(num, total):
    rate = float(num) / float(total)
    rate_num = int(rate * 100)
    r = '\r%s %d%%'%('>'*rate_num,rate_num)
    sys.stdout.write(r)
    sys.stdout.flush()


if __name__ == '__main__':
    for i in range(0, 100):
        time.sleep(0.01)
        view_bar(i, 100)