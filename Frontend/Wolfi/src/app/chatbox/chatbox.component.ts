import { Component, OnInit ,Input} from '@angular/core';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit {
  @Input() nightMode: boolean =false;
  messages: { content: string, type: 'incoming' | 'outgoing' }[] = [];
  newMessage: string = '';

  constructor() { }

  ngOnInit() { }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.messages.push({ content: this.newMessage, type: 'outgoing' });
      // Logique pour envoyer le message au serveur ou le gérer localement
      this.newMessage = '';

      // Logique pour recevoir une réponse des IA (exemple)
      // Supposons que vous recevez une réponse sous forme de tableau de messages
      const iaMessages: any[] = [/* Array of IA messages received */];
      iaMessages.forEach(message => {
        this.messages.push({ content: message, type: 'incoming' });
      });
    }
  }

  togglePrivateChat() {
    // Logique pour basculer entre le chat privé et public
  }
}
