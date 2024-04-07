from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

app = Flask(__name__)



# Initialize the model
model_path = "beowolx/CodeNinja-1.0-OpenChat-7B"
model = AutoModelForCausalLM.from_pretrained(model_path, device_map="auto")
# Load the OpenChat tokenizer
tokenizer = AutoTokenizer.from_pretrained("openchat/openchat-3.5-1210", use_fast=True)


def generate_one_completion(prompt: str):
    try:
        # Tokenize the prompt
        inputs = tokenizer(prompt, return_tensors="pt", max_length=128, truncation=True)

        # Generate completion
        generate_ids = model.generate(
            input_ids=inputs.input_ids,
            attention_mask=inputs.attention_mask,
            max_length=256,
            pad_token_id=tokenizer.eos_token_id,
            eos_token_id=tokenizer.eos_token_id
        )

        # Decode and post-process the completion
        completion = tokenizer.decode(generate_ids[0], skip_special_tokens=True)
        completion = completion.split("\n\n\n")[0].strip()

        return completion
    except Exception as e:
        print("Error occurred during generation:", e)
        return "Error occurred during generation"


print("result  ::")
print(generate_one_completion("convince me that i shouldn't vote on you and that you are not the wolf"))

@app.route('/generate', methods=['GET', 'POST'])
def generate_response():
    if request.method == 'GET':
        prompt = request.args.get('prompt', '')
    elif request.method == 'POST':
        prompt = request.json.get('prompt', '')

    if prompt:
        response = generate_one_completion(prompt)
        return jsonify({'response': response})
    else:
        return jsonify({'error': 'No prompt provided.'}), 400


if __name__ == '__main__':
    app.run(debug=True)
