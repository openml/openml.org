import smtplib
import ssl
import os

context = ssl.create_default_context()


def confirmation_email(user_email, token):
    """Sending confirmation email with token to user mailbox"""
    sender = str(os.environ.get("EMAIL_SENDER"))
    receiver = user_email
    header = "From: %s\n" % sender
    header += "To: %s\n" % user_email
    link =  "https://" + str(os.environ.get("EMAIL_SERVER")) + f"/auth/confirm-page/?token={token}"
    message = """\
Subject: Welcome to OpenML!

Hi,

Thank you for signing up to OpenML.
To verify your email address, please click %s
    
If that doesn't work, try copy-pasting it in your browser.
If you run into any issues, please contact us at openmachinelearning@gmail.com

Have a great day, 
The OpenML team
""" % link

    server = smtplib.SMTP(os.environ.get("SMTP_SERVER"), os.environ.get("SMTP_PORT"))
    if len(os.environ.get("SMTP_LOGIN")) > 0:
        server.login(os.environ.get("SMTP_LOGIN"), os.environ.get("SMTP_PASS"))
    problems = server.sendmail(sender, receiver, message)
    print(problems)
    server.quit()


def forgot_password_email(user_email, token):
    """Sending forgot password email with token to user mailbox"""
    sender = str(os.environ.get("EMAIL_SENDER"))
    receiver = user_email
    header = "From: %s\n" % sender
    header += "To: %s\n" % user_email
    header += "Subject: %s\n\n" % "none"
    message = header + "Hi to reset your password go to "
    message = message + "https://" + str(os.environ.get("EMAIL_SERVER"))
    message = message + f"/auth/reset-page/?token={token}"
    server = smtplib.SMTP(os.environ.get("SMTP_SERVER"), os.environ.get("SMTP_PORT"))
    if len(os.environ.get("SMTP_LOGIN")) > 0:
        server.login(os.environ.get("SMTP_LOGIN"), os.environ.get("SMTP_PASS"))
    server.sendmail(sender, receiver, message)
    print("mail sent")
    server.quit()


def send_feedback(email, feedback):
    sender = str(os.environ.get("EMAIL_SENDER"))
    receiver = "openmachinelearning@gmail.com"
    header = "From: %s\n" % email
    header += "To: %s\n" % "openmachinelearning@gmail.com"
    header += "Subject: %s\n\n" % "OpenML website feedback"
    message = (
        header + "The following feedback was posted by " + email + "\n\n" + feedback
    )
    server = smtplib.SMTP(os.environ.get("SMTP_SERVER"), os.environ.get("SMTP_PORT"))
    if len(os.environ.get("SMTP_LOGIN")) > 0:
        server.login(os.environ.get("SMTP_LOGIN"), os.environ.get("SMTP_PASS"))
    server.sendmail(sender, receiver, message)
    print("Email sent")
    server.quit()
