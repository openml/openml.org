import smtplib
import ssl
import os
from distutils.util import strtobool

from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from server.extensions import Session

from server.user.models import User

context = ssl.create_default_context()


def confirmation_email(user_email, token):
    """Sending confirmation email with token to user mailbox"""
    sender = str(os.environ.get("EMAIL_SENDER"))
    receiver = user_email
    header = "From: %s\n" % sender
    header += "To: %s\n" % user_email
    header += "Subject: Welcome to OpenML!\n\n"
    link = "https://" + str(os.environ.get("EMAIL_SERVER")) + f"/auth/confirm-page/?token={token}"
    message = header + """\
Hi,

Thank you for signing up to OpenML.
To verify your email address, please click %s
    
If that doesn't work, try copy-pasting it in your browser.
If you run into any issues, please contact us at openmachinelearning@gmail.com

Have a great day, 
The OpenML team
""" % link
    _send_mail(sender, receiver, message)


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
    _send_mail(sender, receiver, message)


def send_feedback(email, feedback):
    sender = str(os.environ.get("EMAIL_SENDER"))
    receiver = "openmachinelearning@gmail.com"
    header = "From: %s\n" % email
    header += "To: %s\n" % "openmachinelearning@gmail.com"
    header += "Subject: %s\n\n" % "OpenML website feedback"
    message = (
        header + "The following feedback was posted by " + email + "\n\n" + feedback
    )
    _send_mail(sender, receiver, message)


def _send_mail(sender, receiver, message):
    with smtplib.SMTP(os.environ.get("SMTP_SERVER"), int(os.environ.get("SMTP_PORT"))) as server:
        if strtobool(os.environ.get("SMTP_USE_TLS", "False")):
            server.starttls()
        if len(os.environ.get("SMTP_LOGIN")) > 0:
            server.login(os.environ.get("SMTP_LOGIN"), os.environ.get("SMTP_PASS"))
        server.sendmail(sender, receiver, message)


def current_user() -> User | None:
    if verify_jwt_in_request():
        jwt_identity = get_jwt_identity()
        with Session() as session:
            return session.query(User).filter_by(email=jwt_identity).first()
