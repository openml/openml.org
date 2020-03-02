import smtplib
import ssl
import os
context = ssl.create_default_context()


def confirmation_email(user_email, token):
    sender = "m@smtp.mailtrap.io"
    receiver = user_email
    header = 'From: %s\n' % sender
    header += 'To: %s\n' % user_email
    header += 'Subject: %s\n\n' % 'none'
    message = header + f"Hi to confirm your account go to " \
        f"https://new.openml.org/auth/confirm-page/?token={token}"

    server = smtplib.SMTP(os.environ.get('SMTP_SERVER'), os.environ.get('SMTP_PORT'))
    server.login("84be287eed57de", "6a38ff008fe618")
    problems = server.sendmail(sender, receiver, message)
    server.quit()


def forgot_password_email(user_email, token):
    sender = "m@smtp.mailtrap.io"
    receiver = user_email
    header = 'From: %s\n' % sender
    header += 'To: %s\n' % user_email
    header += 'Subject: %s\n\n' % 'none'
    message = header + f"Hi to reset you password go to " \
        f"https://new.openml.org/auth/reset-page/?&token={token}"
    server = smtplib.SMTP(os.environ.get('SMTP_SERVER'), os.environ.get('SMTP_PORT'))
    server.login("84be287eed57de", "6a38ff008fe618")
    server.sendmail(sender, receiver, message)
    print('mail sent')
    server.quit()
