import json
import secrets
from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from flask_login import UserMixin, LoginManager, login_user, current_user, AnonymousUserMixin, logout_user
from itsdangerous import URLSafeTimedSerializer, BadTimeSignature, BadSignature
import bcrypt


app = Flask(__name__)
app.config.from_object("config.ProductionConfig")
db = SQLAlchemy(app)
mail = Mail(app)
login_manager = LoginManager()
login_manager.init_app(app)
reset_url = URLSafeTimedSerializer(secrets.SECRET_KEY_URL)

# Description: Creates class for users not logged in to have an array so their checkboxes in search will be blank
class Anonymous(AnonymousUserMixin):
    def __init__(self):
        self.pokemon_data = []
        for i in range(807):
            self.pokemon_data.append(0)

# Description: User class, gives each user an id, username, email, password, and array of which pokemon have been seen/caught
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
        for i in range(807):
            self.pokemon_data.append(0)

    def __repr__(self):
        return '<User %r>' % self.username


login_manager.anonymous_user = Anonymous

# Description: Returns current user
@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(user_id)

# Description: Loads home page
@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html')

# Description: Loads search page, inserts submitted JSON into database
@app.route('/search', methods=['GET', 'POST'])
def search():
    if current_user.is_authenticated:
        if request.method == 'POST':
            data = request.get_json()
            query = 'UPDATE users SET pokemon_data [' + str(data.get("id")) + '] = ' + str(data.get("status")) + \
                    ' WHERE username = \'' + str(current_user.username) + '\''
            db.session.execute(query)
            db.session.commit()
    else:
        return render_template('search.html', not_logged_in="Please log in for these to save!")
    if 'Content-Type' in request.headers:
        pokearray = current_user.pokemon_data
        return json.dumps(pokearray)
    return render_template('search.html')

# Description: Loads login page, ensures user entered correct username and password, logs in user
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form["login-username"]
        password = request.form["login-password"].encode('utf-8')
        user = db.session.query(Users).filter(
            (Users.username == username.lower()) | (Users.email == username.lower())).first()
        try:
            if bcrypt.checkpw(password, user.password):
                login_user(user, remember=False)
                return redirect(url_for("account"))  # CHANGE TO MY ACCOUNT LATER
            else:
                return render_template('login.html', login_error="Invalid login!")
        except AttributeError:
            return render_template('login.html', login_error="User not found!")
    else:
        return render_template('login.html')

# Description: Loads register page, ensures username and email are unique, hashes password, stores in database, emails user
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form["username"]
        email = request.form["email"]
        if db.session.query(db.exists().where(Users.username == username.lower())).scalar():
            return render_template('register.html', register_error="Error! Username already taken!")
        elif db.session.query(db.exists().where(Users.email == email.lower())).scalar():
            return render_template('register.html', register_error="Error! Email already taken!")
        else:
            password = request.form["password"].encode('utf-8')
            hashed = bcrypt.hashpw(password, bcrypt.gensalt())
            user = Users(username, email, hashed)
            db.session.add(user)
            db.session.commit()
            message = Message("Welcome to Online Pokedex!", recipients=[email], sender=secrets.MAIL_USERNAME)
            message.body = "Dear " + username + ",\nWelcome to the Online Pokedex! With this account, " \
                                                "you can keep track\nof which Pokemon you have seen or captured!\nI hope" \
                                                " you enjoy the website!" \
                                                "\nThanks, Online Pokedex"
            mail.send(message)
            login_user(user, remember=False)
            return redirect(url_for("home"))  # CHANGE TO MY ACCOUNT LATER
    else:
        return render_template('register.html')

# Description: Loads forgot page, if user exists send them reset email
@app.route('/forgot', methods=['GET', 'POST'])
def forgot():
    if request.method == "POST":
        username = request.form["forgot"]
        if db.session.query(db.exists().where(Users.username == username.lower())).scalar() or \
                db.session.query(db.exists().where(Users.email == username.lower())).scalar():
            user = db.session.query(Users).filter((Users.username == username.lower()) |
                                                  (Users.email == username.lower())).first()
            email_url = reset_url.dumps([user.username])
            message = Message("Online Pokedex Password Reset", recipients=[user.email], sender=secrets.MAIL_USERNAME)
            link = url_for('reset', token=email_url, _external=True)
            message.body = "Hello {},\nClick here to reset your password: {}".format(user.username, link)
            mail.send(message)
            return render_template('forgot.html', user_found="Email Sent!")
        else:
            return render_template('forgot.html', user_found="User not found!")
    else:
        return render_template('forgot.html')

# Description: Loads reset page, ensures token is valid and changes password to new password entered
@app.route('/reset', defaults={'token': ""}, methods=['GET', 'POST'])
@app.route('/reset/<token>', methods=['GET', 'POST'])
def reset(token):
    try:
        username = reset_url.loads(token, max_age=100)[0]
        user = db.session.query(Users).filter((Users.username == username.lower()) |
                                              (Users.email == username.lower())).first()
    except (BadTimeSignature, BadSignature):
        return render_template('reset.html', too_old="Expired token!")
    if request.method == "POST":
        password = request.form["reset-password"].encode('utf-8')
        user.password = bcrypt.hashpw(password, bcrypt.gensalt())
        db.session.commit()
        return redirect(url_for("login"))  # CHANGE TO MY ACCOUNT LATER
    else:
        return render_template('reset.html', token=token)

# Description: Loads account page, if user is logged in: display their information
@app.route('/account', methods=['GET', 'POST'])
def account():
    if not current_user.is_authenticated:
        return redirect(url_for('home'))
    user = current_user
    seen = 0
    caught = 0
    for pokemon in user.pokemon_data:
        if pokemon == 1:
            seen += 1
        if pokemon == 2:
            seen += 1
            caught += 1
    if request.method == 'POST':
        if 'update-info' in request.form:
            return redirect(url_for('update'))
        else:
            logout_user()
            return redirect(url_for('home'))
    return render_template('account.html', seen=seen, caught=caught, username=user.username, email=user.email)

# Description: Load update page, update database based on what user entered
@app.route('/update', methods=['GET', 'POST'])
def update():
    if request.method == 'POST':
        user = current_user
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        if username != "":
            if db.session.query(db.exists().where(Users.username == username.lower())).scalar():
                return render_template('update.html', update_error="Username already taken!")
            else:
                user.username = username
        if email != "":
            if db.session.query(db.exists().where(Users.email == email.lower())).scalar():
                return render_template('update.html', update_error="Email already taken!")
            else:
                user.email = email
        if password != "":
            user.password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        db.session.commit()
        return redirect(url_for('home'))
    return render_template('update.html')


if __name__ == '__main__':
    app.run()