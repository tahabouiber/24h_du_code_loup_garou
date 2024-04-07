class PartieLoupGarou:
    def __init__(self):
        self.joueurs = []

    def ajouter_joueur(self, joueur):
        self.joueurs.append(joueur)

    def nuit(self):
        loups_garous = [joueur for joueur in self.joueurs if joueur.est_loup_garou()]
        victime = random.choice([joueur for joueur in self.joueurs if not joueur.est_loup_garou()])
        print(f"Les loups-garous se réveillent et choisissent une victime...")
        print(f"La victime désignée par les loups-garous est : {victime.nom}")
        return victime

    def jour(self, victime):
        print("C'est le jour. Les villageois se réveillent et découvrent la victime de la nuit...")
        if victime.est_loup_garou():
            print(f"{victime.nom} a été éliminé. Il était un loup-garou.")
        else:
            print(f"{victime.nom} a été éliminé. Il était un villageois.")
        self.joueurs.remove(victime)

    def jouer(self):
        print("La partie commence !")
        while True:
            if len([joueur for joueur in self.joueurs if joueur.est_loup_garou()]) == 0:
                print("Les villageois ont gagné ! Tous les loups-garous ont été éliminés.")
                break
            elif len([joueur for joueur in self.joueurs if not joueur.est_loup_garou()]) <= len([joueur for joueur in self.joueurs if joueur.est_loup_garou()]):
                print("Les loups-garous ont gagné ! Ils surpassent en nombre les villageois.")
                break

            victime = self.nuit()
            self.jour(victime)
            votes = [[joueur.nom for joueur in self.joueurs], np.zeros(len(self.joueurs))]
            for joueur in self.joueurs:
                if joueur.nom == "Vous":  # Check if the current player is the user
                    print("C'est votre tour de voter.")
                    while True:
                        player_to_kill = input("Qui votez-vous pour éliminer ? Entrez le nom du joueur : ")
                        if player_to_kill in [j.nom for j in self.joueurs]:
                            break
                        else:
                            print("Ce joueur n'est pas dans la partie ou vous avez mal tapé le nom.")

                    # Ask for the reason of the vote
                    why = input("Pourquoi votez-vous pour éliminer ce joueur ? Entrez une explication : ")
                else:
                    # For other players, vote using the predefined function
                    player_to_kill, why = vote(joueur.nom, [joueur.nom for joueur in self.joueurs])

                print(joueur.nom + " voted to kill " + player_to_kill + " because " + why)
                index = votes[0].index(player_to_kill)
                votes[1][index] += 1
            self.joueurs = [joueur for joueur in self.joueurs if joueur.nom != player_to_kill]
            print(player_to_kill + " a été éliminé par vote collectif")
