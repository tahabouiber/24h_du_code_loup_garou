from flask import Flask, request, jsonify, render_template
import random
import numpy as np
from llama_cpp import Llama
import json

MODEL_PATH = "D:/model/models/zephyr-7b-alpha.Q5_K_M.gguf"
MODEL_START_TOKEN = "<|im_start|>system\n"
MODEL_STOP_TOKEN = "<|im_end|>\n"
TEMPERATURE = 0.1

llm = Llama(model_path=MODEL_PATH, n_gpu_layers=100)
llm.verbose = False

app = Flask(__name__)

discussion = ""

class Joueur:
	def __init__(self, nom, role):
		self.nom = nom
		self.role = role

	def est_loup_garou(self):
		return self.role == "wolf"

class PartieLoupGarou:
    discussion = ""
    def __init__(self):
        self.joueurs = []

    def ajouter_joueur(self, joueur):
        self.joueurs.append(joueur)

    def nuit(self):
        victime = random.choice([joueur for joueur in self.joueurs if not joueur.est_loup_garou()])
        for joueur in self.joueurs:
            if joueur.est_loup_garou() and joueur.nom == "Vous":
                victime_nom = input("Qui voulez-vous tuer ? Entrez le nom du joueur : ")
                victime = [joueur for joueur in self.joueurs if joueur.nom == victime_nom][0]
                break
        print(f"Les loups-garous se réveillent et choisissent une victime...")
        print(f"La victime désignée par les loups-garous est : {victime.nom}")
        return victime

    def jour(self, victime, discussion):
        new_day = "C'est le jour. Les villageois se réveillent et découvrent la victime de la nuit...   "
        if victime.est_loup_garou():
            new_day += f"{victime.nom} a été éliminé. Il était un loup-garou."
        else:
            new_day += f"{victime.nom} a été éliminé. Il était un villageois."
        print(new_day)
        discussion += new_day
        self.joueurs.remove(victime)

    
    def jouer(self, discussion, data):
        print("La partie commence ! les joueurs presents sont : ")
        [print(joueur.nom) for joueur in self.joueurs]
        while True:
            if len([joueur for joueur in self.joueurs if joueur.est_loup_garou()]) == 0:
                print("Les villageois ont gagné ! Tous les loups-garous ont été éliminés.")
                break
            elif len([joueur for joueur in self.joueurs if not joueur.est_loup_garou()]) <= len([joueur for joueur in self.joueurs if joueur.est_loup_garou()]):
                print("Les loups-garous ont gagné ! Ils surpassent en nombre les villageois.")
                break

            victime = self.nuit()
            self.jour(victime, discussion)
            votes = [[joueur.nom for joueur in self.joueurs], np.zeros(len(self.joueurs))]
            output_answer = ""
            for joueur in self.joueurs:
                if joueur.nom == "Vous":  # Check if the current player is the user
                    print("C'est votre tour de voter.")
                    while True:
                        vote_player = data['votePlayer']
                        # player_to_kill = input("Qui votez-vous pour éliminer ? Entrez le nom du joueur : ")
                        player_to_kill = vote_player
                        if player_to_kill in [j.nom for j in self.joueurs]:
                            break
                        else:
                            print("Ce joueur n'est pas dans la partie ou vous avez mal tapé le nom.")

                    # Ask for the reason of the vote
                    vote_reason = data['voteReason']
                    # why = input("Pourquoi votez-vous pour éliminer ce joueur ? Entrez une explication : ")
                    why = vote_reason
                    
                else:
                    # For other players, vote using the predefined function
                    player_to_kill, why = vote(joueur.nom, [joueur.nom for joueur in self.joueurs])
                decision_joueur = joueur.nom + " voted to kill " + player_to_kill + " because " + why + '\n'
                print(decision_joueur)
                discussion += decision_joueur
                output_answer += decision_joueur
                
                index = votes[0].index(player_to_kill)
                votes[1][index] += 1
            self.joueurs = [joueur for joueur in self.joueurs if joueur.nom != player_to_kill]
            decision_vote = player_to_kill + " a été éliminé par vote collectif"
            
            print(decision_vote)
            discussion += decision_vote
            # Call the function from your Python script and capture the output
            output_answer += decision_vote

            return output_answer



def vote(player_name, other_players):
    # Construire le texte d'appel pour le LLM
    # Expliquez ce que vous attendez du LLM
    # Notez que l'on demande au LLM de répondre avec un JSON respectant un certain format
    # Cela facilite la réutilisation du résultat du LLM
    input_text = MODEL_START_TOKEN
    input_text += "Your name is " + player_name + ". You live in a village and people die every night to the werewolves.\n"
    input_text += "You are a villager and you have to vote to kill who you suspect is a werewolf.\n"
    input_text += "Here is the list of players still alife:\n"
    for p in other_players:
        input_text += p + "\n"
    input_text += "It's your turn to vote, who do you vote to kill ? Think step by step. Answer with a JSON following : \
         ( why : 'make a short explanation of your choice here', \
           who : 'name the player you vote to kill or None if you don't vote', \
         ) Answer with the JSON and nothing else before of after.\n"
    input_text += "Here is the whole discussion and all the events until now : " + discussion
    input_text += MODEL_STOP_TOKEN

    # Appel du LLM
    #print("DEBUG : Calling LLM with input : " + input_text + "\n")
    output = llm(input_text, max_tokens=None, temperature=TEMPERATURE)
    #print("DEBUG : Ouput is : " + str(output) + "\n")

    # Extraire le JSON de la réponse
    llm_output = output["choices"][0]["text"]

    # Récupérer le JSON, en verifiant qu'il est bien au format attendu
    try:
        llm_output = json.loads(llm_output)
    except ValueError as e:
        print("ERROR : no valid JSON found in answer")
    # Si le JSON est valide alors récupérer les variables
    if "who" in llm_output:
        player_to_kill = str(llm_output["who"])
    else:
        player_to_kill = None
    if "why" in llm_output:
        why = str(llm_output["why"])
    else:
        why = None

    # Contrôler que le joueur à tuer est bien dans la liste des autres joueurs
    if player_to_kill not in other_players:
        print("ERROR : LLM output contains an invalid player name")
        player_to_kill = None

    return player_to_kill, why

def generate_names(n):
   
    input_text = MODEL_START_TOKEN
    input_text += "generate "+ str(n) +"different firstnames .\n"
    input_text += "u have to return the result in a list of strings.\n"
    input_text += "Here is the example of a list of 4 fristnames :\n"
    input_text += "['Jcole', 'Eminem', 'Drake', 'Travis'] Answer with the list in the specified format and nothing else before of after."
    input_text += MODEL_STOP_TOKEN


   
    output = llm(input_text, max_tokens=None, temperature=TEMPERATURE)
    llm_output = output["choices"][0]["text"]


    joined = ''.join(llm_output).split('\n')
    processed_output = [phrase.split(' ') for phrase in joined]
    final=[]


    for i in processed_output:
        if len(i) > 1:
            final.append(i[1])
    return final

def generate_players(wolves_nb,villagers_nb):
    players_List=[]
    total=wolves_nb+villagers_nb
    names=generate_names(total)
    for i in range(wolves_nb):
      random_name=random.choice(names)
      new_player=Joueur(random_name,"wolf")
      players_List.append(new_player)
      names.remove(random_name)
    for i in range(villagers_nb):
      random_name=random.choice(names)
      new_player= Joueur(random_name,"villager")
      players_List.append(new_player)
      names.remove(random_name)
    return players_List

partie = PartieLoupGarou()

def lancer_partie(wolves_nb, villagers_nb, user_role):
    # Generate players including the user
    players = generate_players(wolves_nb - 1 if user_role == "wolf" else wolves_nb, villagers_nb)
    # Add the user to the player list
    user_player = Joueur("Vous", user_role)
    players.append(user_player)

    for player in players:
        partie.ajouter_joueur(player)
    return [player.nom for player in players]
            



@app.route('/')
def index():
    return render_template("index.html")

@app.route('/lancer_partie', methods=['POST'])
def lancer_partie_2():
    data = request.get_json()
    wolves_nb = data['wolvesNb']
    villagers_nb = data['villagersNb']
    user_role = data['userRole']
    
    # Call the function from your Python script and capture the output
    output = lancer_partie(wolves_nb, villagers_nb, user_role)

    return jsonify({'output': output})

@app.route('/jouer', methods=['POST'])
def jouer_2():
    data = request.get_json()
    # Call the function from your Python script and capture the output
    output_answer = partie.jouer(discussion, data)

    return jsonify({'output_answer': output_answer})

if __name__ == "__main__":
    app.run(port=5001)  # Utilisez un port disponible