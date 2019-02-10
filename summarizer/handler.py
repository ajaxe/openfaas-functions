from summarizer import summarize

def handle(req):
    title = "From Kali to Krishna : A love song"
    sentences = summarize(title, req, count=15)
    output = ""

    for sentence in sentences:
        output += sentence + "\n"
    return output
