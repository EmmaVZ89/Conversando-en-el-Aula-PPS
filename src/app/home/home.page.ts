import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user: any = null;
  newMessage: string = '';
  messageListA: any = [];
  messageListB: any = [];
  pressedButton: boolean = false;
  chat: number = 0;
  soundSendMessage: any = new Audio('../../assets/sendMessage.mp3');

  constructor(
    private authService: AuthService,
    private router: Router,
    private chatService: ChatService
  ) {
    this.soundSendMessage.volume = 0.1;
  } // end of constructor

  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.user = user;
      }
      // else {
      //   this.router.navigate(['/login']);
      // }
    });
    this.chatService.getMessagesA().subscribe((messagesA) => {
      if (messagesA !== null) {
        this.messageListA = messagesA;
        setTimeout(() => {
          this.scrollToTheLastElementByClassName();
        }, 100);
      }
    });
    this.chatService.getMessagesB().subscribe((messagesB) => {
      if (messagesB !== null) {
        this.messageListB = messagesB;
        setTimeout(() => {
          this.scrollToTheLastElementByClassName();
        }, 100);
      }
    });
  } // end of ngOnInit

  logoutUser() {
    this.authService.signOut();
    setTimeout(() => {
      this.chat = 0;
    }, 2000);
  } // end of logoutUser

  showChat4A() {
    this.newMessage = '';
    this.showSpinner(1);
    setTimeout(() => {
      this.scrollToTheLastElementByClassName();
    }, 2100);
  } // endo of showChat4A

  showChat4B() {
    this.newMessage = '';
    this.showSpinner(2);
    setTimeout(() => {
      this.scrollToTheLastElementByClassName();
    }, 2100);
  } // endo of showChat4B

  goToClassrooms() {
    this.newMessage = '';
    this.showSpinner(0);
  } // end of goToClassrooms

  sendMessageA() {
    if (this.newMessage.trim() == '') {
      this.authService.toast('Debes escribir un mensaje', 'warning');
      return;
    } else if (this.newMessage.trim().length > 21) {
      this.authService.toast(
        'El mensaje no puede tener más de 21 caracteres',
        'warning'
      );
      return;
    }
    const date = moment(new Date()).format('DD-MM-YYYY HH:mm:ss');
    const message = {
      user: this.user,
      text: this.newMessage,
      date: date,
    };
    this.chatService.createMessageA(message);
    this.newMessage = '';
    this.scrollToTheLastElementByClassName();
    this.soundSendMessage.play();
  } // end of sendMessageA

  sendMessageB() {
    if (this.newMessage.trim() == '') {
      this.authService.toast('Debes escribir un mensaje', 'warning');
      return;
    } else if (this.newMessage.trim().length > 21) {
      this.authService.toast(
        'El mensaje no puede tener más de 21 caracteres',
        'warning'
      );
      return;
    }

    const date = moment(new Date()).format('DD-MM-YYYY HH:mm:ss');
    const message = {
      user: this.user,
      text: this.newMessage,
      date: date,
    };
    this.chatService.createMessageB(message);
    this.newMessage = '';
    this.scrollToTheLastElementByClassName();
    this.soundSendMessage.play();
  } // end of sendMessageB

  showSpinner(chatOption: number) {
    this.pressedButton = true;
    setTimeout(() => {
      this.pressedButton = false;
      this.chat = chatOption;
    }, 2000);
  } // end of showSpinner

  scrollToTheLastElementByClassName() {
    const elements = document.getElementsByClassName('mensajes');
    const lastElement: any = elements[elements.length - 1];
    const toppos = lastElement.offsetTop;
    document.getElementById('contenedor-mensajes').scrollTop = toppos;
  } // end of scrollToTheLastElementByClassName
}
