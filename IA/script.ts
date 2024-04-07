function envoyerPrompt(prompt: string) {
    // Créer une nouvelle requête
    const xhr = new XMLHttpRequest();
    
    // Définir la méthode et l'URL du serveur Python
    xhr.open('POST', 'http://localhost:5000/generate', true);
    
    // Définir le type de contenu de la requête
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    // Définir la fonction à exécuter lorsque la requête reçoit une réponse
    xhr.onload = function() {
        if (xhr.status === 200) {
            // Extraire la réponse JSON
            const response = JSON.parse(xhr.responseText);
            
            // Afficher la réponse dans l'élément HTML approprié
            const reponseElement = document.getElementById('reponse');
            if (reponseElement !== null) {
                reponseElement.innerText = response.response;
            } else {
                console.error('Element with ID "reponse" not found.');
            }
        } else {
            // Afficher une erreur en cas de problème avec la requête
            console.error('Erreur lors de la requête : ', xhr.statusText);
        }
    };
    
    // Générer un objet JSON contenant le prompt
    const data = JSON.stringify({ prompt: prompt });
    
    // Envoyer la requête avec les données JSON
    xhr.send(data);
}

// Fonction appelée lorsque le formulaire est soumis
function soumettreFormulaire(event: Event) {
    // Empêcher le comportement par défaut du formulaire
    event.preventDefault();
    
    // Récupérer la valeur du champ de texte
    const prompt = (<HTMLInputElement>document.getElementById('prompt')).value;
    
    // Envoyer le prompt au serveur Python
    envoyerPrompt(prompt);
}

// Ajouter un écouteur d'événements pour le formulaire
document.getElementById('formulaire')!.addEventListener('submit', soumettreFormulaire);
