# 深度优先遍历 dfs 判断是否构成树

numCourses = 20
prerequisites = [ [1, 0], [2, 3], [0, 3], [2, 4], [4, 1] ]

allrel = {i[0]: [] for i in prerequisites} 
for i in prerequisites:
    if i[1] not in allrel[ i[0] ]:
        allrel[ i[0] ].append(i[1])

for label in range(0, numCourses):
    if label not in allrel.keys():
        continue
    nexts = allrel[label]
    visited = set()
    while(nexts and len(nexts) > 0):
        course = nexts.pop()
        visited.add(course)
        if(course == label):
            print(False)
            exit()
        if course in allrel.keys():
            for nnext in allrel[course]:
                if nnext not in visited:
                    nexts.append(nnext)

print(True)