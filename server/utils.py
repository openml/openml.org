import smtplib,ssl
context = ssl.create_default_context()
def confirmation_email(user_email, token):
    with smtplib.SMTP("smtp.mailtrap.io", 2525) as server:
        sender = "Private Person <from@smtp.mailtrap.io>"
        receiver = user_email

        message = f"""\
        Subject: Hi Mailtrap
        To: {receiver}
        From: {sender}

        Welcome to OpenML to confirm your account please click or visit the url: {token}"""

        server.login("051361e49a2cdd", "fe060f7da88271")
        server.sendmail(sender, receiver, message)

def forgot_password_email(user_email, token):

    sender = "Private Person <from@smtp.mailtrap.io>"
    receiver = "aa"

    message = f"""\
    Subject: Hi Mailtrap
    To: {receiver}
    From: {sender}

    This is a test e- message."""

    with smtplib.SMTP("smtp.mailtrap.io", 2525) as server:
        server.login("84be287eed57de", "6a38ff008fe618")
        server.sendmail(sender, receiver, message)

forgot_password_email('aa','token')
