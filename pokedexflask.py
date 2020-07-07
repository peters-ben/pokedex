from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from flask_login import UserMixin, LoginManager, login_user, current_user, login_required
import bcrypt
import secrets

app = Flask(__name__)
app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://' + secrets.username + ':' + secrets.password + '@' \
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
login_manager = LoginManager()
login_manager.init_app(app)


class Users(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(300), unique=True, nullable=False)
    password = db.Column(db.Binary(60), unique=False, nullable=False)
    pokemon_data = db.Column(db.ARRAY(db.Integer), unique=False, nullable=False)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password
        self.pokemon_data = []
        for i in range(808):
            self.pokemon_data.append(0)

    def __repr__(self):
        return '<User %r>' % self.username


@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))


@app.route('/index')
@app.route('/index.html')
@login_required
def index():
    flash("The current user is: " + current_user.username)
    return render_template('index.html')


@app.route('/search.html')
@app.route('/search')
def search():
    return render_template('search.html')


@app.route('/')
@app.route('/login', methods=['GET', 'POST'])
@app.route('/login.html', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form["login-username"]
        password = request.form["login-password"].encode('utf-8')
        user = db.session.query(Users).filter(
            (Users.username == username.lower()) | (Users.email == username.lower())).first()
        try:
            if bcrypt.checkpw(password, user.password):
                login_user(user)
                return redirect(url_for("login"))  # CHANGE TO MY ACCOUNT LATER
            else:
                flash("Invalid login!")
                return render_template('/login.html')
        except AttributeError:
            flash("User not found!")
            return render_template('login.html')
    else:
        return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
@app.route('/register.html', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form["username"]
        email = request.form["email"]
        if db.session.query(db.exists().where(Users.username == username.lower())).scalar():
            flash("Error! Username already taken!")
            return render_template('register.html')
        elif db.session.query(db.exists().where(Users.email == email.lower())).scalar():
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
            return redirect(url_for("login"))  # CHANGE TO MY ACCOUNT LATER
    else:
        return render_template('register.html')


@app.route('/reset')
@app.route('/reset.html')
def reset():
    return render_template('reset.html')


if __name__ == '__main__':
    app.run(debug=True)
