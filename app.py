from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///site.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key') 

db = SQLAlchemy(app)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Task {self.id}>'

@app.after_request
def add_no_cache(response):
    """Prevent caching during development"""
    if app.debug: 
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
    return response

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        task_content = request.form.get('content', '').strip()
        
        if not task_content:
            flash('Task content cannot be empty', 'error')
        elif len(task_content) > 200:
            flash('Task content too long (max 200 chars)', 'error')
        else:
            new_task = Task(content=task_content)
            try:
                db.session.add(new_task)
                db.session.commit()
                flash('Task added!', 'success')
            except Exception as e:
                db.session.rollback()
                app.logger.error(f'Error adding task: {str(e)}')
                flash('Error adding task', 'error')
            
        return redirect(url_for('index'))
    
    tasks = Task.query.order_by(Task.date_created).all()
    return render_template('index.html', tasks=tasks)

@app.route('/delete/<int:task_id>')
def delete(task_id):
    task_to_delete = Task.query.get_or_404(task_id)
    
    try:
        db.session.delete(task_to_delete)
        db.session.commit()
        flash('Task terminated successfully!', 'success')
    except Exception as e:
        db.session.rollback()
        app.logger.error(f'Error deleting task {task_id}: {str(e)}')
        flash('Error terminating task', 'error')
    
    return redirect(url_for('index'))

@app.route('/update/<int:task_id>', methods=['GET', 'POST'])
def update(task_id):
    task = Task.query.get_or_404(task_id)
    
    if request.method == 'POST':
        new_content = request.form.get('content', '').strip()
        
        if not new_content:
            flash('Task content cannot be empty', 'error')
        elif len(new_content) > 200:
            flash('Task content too long (max 200 chars)', 'error')
        else:
            task.content = new_content
            try:
                db.session.commit()
                flash('Directive updated successfully!', 'success')
                return redirect(url_for('index'))
            except Exception as e:
                db.session.rollback()
                app.logger.error(f'Error updating task {task_id}: {str(e)}')
                flash('Error updating task', 'error')
        
        return redirect(url_for('update', task_id=task.id))
    
    return render_template('update.html', task=task)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)