from summarizer import summarize
from io import StringIO
import json

def handle(req):
    title = "From Kali to Krishna : A love song"
    sentences = summarize(title, req, count=15)
    '''
    output = ""
    format = "[[{}]]\n"
    for sentence in sentences:
        output += format.format(sentence)
    '''
    fileObj = StringIO()
    json.dump(sentences, fileObj)
    return str(fileObj.getvalue())
