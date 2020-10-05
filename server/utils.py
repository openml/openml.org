import smtplib
import ssl
import os

context = ssl.create_default_context()


def confirmation_email(user_email, token):
    """Sending confirmation email with token to user mailbox"""
    sender = str(os.environ.get('EMAIL_SENDER'))
    receiver = user_email
    header = 'From: %s\n' % sender
    header += 'To: %s\n' % user_email
    header += 'Subject: %s\n\n' % 'none'
    message = header + "Hi to confirm your account go to " \
                       "https://" + str(os.environ.get('EMAIL_SERVER')) + \
              f"/auth/confirm-page/?token={token}"

    server = smtplib.SMTP(os.environ.get('SMTP_SERVER'), os.environ.get('SMTP_PORT'))
    if (len(os.environ.get('SMTP_LOGIN')) > 0):
        server.login(os.environ.get('SMTP_LOGIN'), os.environ.get('SMTP_PASS'))
    problems = server.sendmail(sender, receiver, message)
    print(problems)
    server.quit()


def forgot_password_email(user_email, token):
    """Sending forgot password email with token to user mailbox"""
    sender = str(os.environ.get('EMAIL_SENDER'))
    receiver = user_email
    header = 'From: %s\n' % sender
    header += 'To: %s\n' % user_email
    header += 'Subject: %s\n\n' % 'none'

    message = header + "Hi to reset your password go to " \
                       "https://" + str(os.environ.get('EMAIL_SERVER')) + \
              f"/auth/confirm-page/?token={token}"
    server = smtplib.SMTP(os.environ.get('SMTP_SERVER'), os.environ.get('SMTP_PORT'))
    if (len(os.environ.get('SMTP_LOGIN')) > 0):
        server.login(os.environ.get('SMTP_LOGIN'), os.environ.get('SMTP_PASS'))
    server.sendmail(sender, receiver, message)
    print('mail sent')
    server.quit()


def send_feedback(email, feedback):
    sender = str(os.environ.get('EMAIL_SENDER'))
    receiver = 'openmachinelearning@gmail.com'
    header = 'From: %s\n' % email
    header += 'To: %s\n' % 'openmachinelearning@gmail.com'
    header += 'Subject: %s\n\n' % 'none'
    message = header + feedback +'/ Sender: ' + email
    server = smtplib.SMTP(os.environ.get('SMTP_SERVER'), os.environ.get('SMTP_PORT'))
    if (len(os.environ.get('SMTP_LOGIN')) > 0):
        server.login(os.environ.get('SMTP_LOGIN'), os.environ.get('SMTP_PASS'))
    server.sendmail(sender, receiver, message)
    print('Email sent')
    server.quit()
