import math

m = 8
n = 15

if m == 0:
    print(0)
    exit()

x = int(math.log(m, 2))
y = int(math.log(n, 2))
r = 0
while(x == y):
    r = 2**x + r
    m = m - 2**x
    n = n - 2**y
    if m < 1:
        break
    x = int(math.log(m, 2))
    y = int(math.log(n, 2))

print(r)