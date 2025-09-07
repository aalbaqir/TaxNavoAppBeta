import json

questions = [
    {
        "id": 1,
        "text": "What is your full legal name as it appears on your Social Security card?",
        "explanation": "This is required for IRS identification.",
        "condition": None
    },
    {
        "id": 2,
        "text": "What is your Social Security Number?",
        "explanation": "The IRS uses your SSN to match your tax records.",
        "condition": None
    },
    {
        "id": 3,
        "text": "What was your marital status on December 31, 2024?",
        "explanation": "Your marital status affects your filing status.",
        "condition": None
    },
    {
        "id": 4,
        "text": "Did you support any dependents in 2024?",
        "explanation": "Dependents may qualify you for credits.",
        "condition": None
    },
    {
        "id": 5,
        "text": "If yes, please provide the name and SSN of each dependent:",
        "explanation": "The IRS requires dependent details.",
        "condition": lambda answers: answers.get(4, '').lower() == 'yes'
    },
    {
        "id": 6,
        "text": "Did you have health insurance coverage for all of 2024?",
        "explanation": "Health coverage may affect your taxes.",
        "condition": None
    },
    {
        "id": 7,
        "text": "Did you receive a 1095-A, B, or C form for health coverage?",
        "explanation": "These forms report your health coverage.",
        "condition": lambda answers: answers.get(6, '').lower() == 'no'
    },
]

def ask_question(q, answers):
    print(f"\nQ{q['id']}: {q['text']}")
    user_input = input('> ').strip()
    answers[q['id']] = user_input

def next_question(current_idx, answers):
    for idx in range(current_idx + 1, len(questions)):
        cond = questions[idx]["condition"]
        if cond is None or cond(answers):
            return idx
    return None

def run_questionnaire():
    answers = {}
    idx = 0
    while idx is not None and idx < len(questions):
        ask_question(questions[idx], answers)
        idx = next_question(idx, answers)
    print("\nAll answers:")
    print(json.dumps(answers, indent=2))

if __name__ == "__main__":
    run_questionnaire()
