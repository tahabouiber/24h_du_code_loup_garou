import torch
from transformers import AutoModelForCausalLM, AutoTokenizer


# Assurez-vous que la configuration par défaut utilise le GPU s'il est disponible
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")


# Charger le modèle Phi-2B et le tokenizer associé
model = AutoModelForCausalLM.from_pretrained("microsoft/phi-2", trust_remote_code=True)
tokenizer = AutoTokenizer.from_pretrained("microsoft/phi-2", trust_remote_code=True)


# Définir le texte d'entrée pour le modèle
input_text = '''show me that you are not the killer
'''


# Tokeniser le texte d'entrée et générer les tokens d'entrée pour le modèle
inputs = tokenizer(input_text, return_tensors="pt", return_attention_mask=False)


# Générer du texte à partir du modèle avec une longueur maximale de 200 tokens
outputs = model.generate(**inputs, max_length=200)


# Décoder les tokens générés en texte lisible
generated_text = tokenizer.batch_decode(outputs)[0]


# Afficher le texte généré
print(generated_text)
