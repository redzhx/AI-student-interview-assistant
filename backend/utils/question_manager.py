# backend/utils/question_manager.py
import json
import random
from pathlib import Path

def get_random_question():
    with open('questions.json', 'r', encoding='utf-8') as file:
        questions = json.load(file)

    if not questions:
        return None

    random_question = random.choice(questions)
    return random_question


def get_random_questions(count=3):
    with open('questions.json', 'r', encoding='utf-8') as file:
        questions = json.load(file)

    if len(questions) < count:
        return None

    random_questions = random.sample(questions, count)
    return random_questions