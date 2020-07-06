from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
import bcrypt
import secrets
app = Flask(__name__)
app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://' + secrets.username + ':' + secrets.password + '@'\
                                        + secrets.address
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SECRET_KEY'] = secrets.SECRET_KEY
app.config['MAIL_SERVER'] = secrets.MAIL_SERVER
app.config['MAIL_PORT'] = secrets.MAIL_PORT
app.config['MAIL_USERNAME'] = secrets.MAIL_USERNAME
app.config['MAIL_PASSWORD'] = secrets.MAIL_PASSWORD
app.config['MAIL_USE_SSL'] = secrets.MAIL_USE_SSL
app.config['MAIL_USE_TLS'] = secrets.MAIL_USE_TLS
db = SQLAlchemy(app)
mail = Mail(app)

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(300), unique=True, nullable=False)
    password = db.Column(db.String(300), unique=False, nullable=False)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

    def __repr__(self):
        return '<User %r>' % self.username


@app.route('/')
@app.route('/index')
@app.route('/index.html')
def index():
    return render_template('index.html')


@app.route('/search.html')
@app.route('/search')
def search():
    return render_template('search.html')


@app.route('/login')
@app.route('/login.html')
def login():
    return render_template('login.html')


@app.route('/register')
@app.route('/register.html', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form["username"]
        email = request.form["email"]
        if db.session.query(db.exists().where(Users.username == username)).scalar():
            flash("Error! Username already taken!")
            return render_template('register.html')
        elif db.session.query(db.exists().where(Users.email == email)).scalar():
            flash("Error! Email already taken!")
            return render_template('register.html')
        else:
            password = request.form["password"]
            hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            user = Users(username, email, hashed)
            db.session.add(user)
            db.session.commit()
            message = Message("Welcome to Online Pokedex!", recipients=[email], sender=secrets.MAIL_USERNAME)
            message.body = "Dear " + username + ",\nWelcome to the Online Pokedex! With this account, " \
                                               "you can keep track\nof which Pokemon you have seen or captured!\nI hope" \
                                               " you enjoy the website!" \
                                               "\nThanks, Online Pokedex"
            mail.send(message)
            return redirect(url_for("index"))
    else:
        return render_template('register.html')


@app.route('/reset')
@app.route('/reset.html')
def reset():
    return render_template('reset.html')


if __name__ == '__main__':
    app.run(debug=True)
