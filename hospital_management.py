import mysql.connector 
import os
from faker import Faker 
import random

db = mysql.connector.connect(
    host="localhost",
    user="root",
    # password="*********",
    password = os.getenv('MYSQL_PASSWORD'),
    database="Hospital_Management"
    
)

cursor = db.cursor()

fake = Faker()

diagnoses = [
    'Flu', 'Cold', 'Pneumonia', 'Asthma', 'Diabetes',
    'Hypertension', 'Migraine', 'Gastroenteritis', 'Back Pain', 'Bronchitis'
]

num_of_records = 1500

for _ in range(num_of_records):
    fn = fake.first_name()
    ln = fake.last_name()
    gender = random.choice(['MALE','FEMALE','OTHER'])
    age = random.randint(1,100)
    contact = ''.join(random.choices('0123456789',k=10))
    date_admit = fake.date_between(start_date='-10y', end_date='today')
    dgn = random.choice(diagnoses)
    
    sql = """
    INSERT INTO Patients (FirstName, LastName, Gender, Age, Contact, Date_Admitted, Diagnosis)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    values = (fn, ln, gender, age, contact, date_admit, dgn)
    cursor.execute(sql, values)


db.commit()

cursor.close()

db.close()

print("record inserted")