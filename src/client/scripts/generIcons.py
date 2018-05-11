from math import *

def writeSvg(filename, content):
    with open(filename, "w", encoding="utf-8") as file:
        file.write('<svg fill="#3d8b3d" xmlns="http://www.w3.org/2000/svg" '
                'version="1.1" viewBox="-50 -50 100 100">\n')
        file.write(content)
        file.write("</svg>")

def generPath(content):
    return "<path d=\""+content+"\"/>"

def generStar():
    t = ""
    for i in range(10):
        r = 25 if i%2==0 else 50
        d = i*pi*2/10
        t+="L {:.3f} {:.3f} ".format(sin(d)*r,cos(d)*r)
    return generPath("M"+t[1:]+"Z")

def generCloud():
    t=""
    offset= pi/2
    r1=50
    r2=35
    for i in range(5):
        d1=(i+0)*pi/5 + offset
        d2=(i+0.2)*pi/5 + offset
        d3=(i+0.8)*pi/5 + offset
        d4=(i+1)*pi/5 + offset
        t+="C {:.2f},{:.2f} {:.2f},{:.2f} {:.2f},{:.2f} ".format(
            #sin(d1)*r2+50, cos(d1)*r2+50,
            sin(d2)*r1, (cos(d2)*r1+25)*2,
            sin(d3)*r1, (cos(d3)*r1+25)*2,
            sin(d4)*r2, (cos(d4)*r2+25)*2)
    return generPath("M {:.2f} {:.2f}".format(sin(offset)*r2, (cos(offset)*r2+25)*2)+t+"Z"+
                     "M -10 -15 L 10 -15 L 10 20 L 20 20 L 0 45 L -20 20 L -10 20 Z")

if __name__=="__main__":
    writeSvg("../icons/star.svg", generStar())
    #writeSvg("../icons/cloud.svg",generCloud())
