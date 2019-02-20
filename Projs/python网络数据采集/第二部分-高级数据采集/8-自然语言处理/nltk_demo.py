from nltk import word_tokenize
from nltk import Text

token = word_tokenize("Here is some not very interesting text")
text = Text(token)

print(text)