import smtplib, ssl

context = ssl.create_default_context()

# TODO Mail config
def confirmation_email(user_email, token):
    sender = "m@smtp.mailtrap.io"
    receiver = user_email
    header = 'From: %s\n' % sender
    header += 'To: %s\n' % user_email
    header += 'Subject: %s\n\n' % 'none'
    message = header + f"Hi to confirm your account go to https://new.openml.org/confirm/?token={token}"
    server = smtplib.SMTP("smtp.mailtrap.io", 2525)
    server.login("84be287eed57de", "6a38ff008fe618")
    problems = server.sendmail(sender, receiver, message)
    server.quit()


def forgot_password_email(user_email, token):
    sender = "m@smtp.mailtrap.io"
    receiver = user_email
    header = 'From: %s\n' % sender
    header += 'To: %s\n' % user_email
    header += 'Subject: %s\n\n' % 'none'
    message = header + f"Hi to reset you password go to https://new.openml.org/resetpass/?&token={token}"

    server = smtplib.SMTP("smtp.mailtrap.io", 2525)
    server.login("84be287eed57de", "6a38ff008fe618")
    server.sendmail(sender, receiver, message)
    server.quit()
