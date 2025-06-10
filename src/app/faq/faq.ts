import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer';

interface FaqItem {
  question: string;
  reponse: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent],
  templateUrl: './faq.html',
  styleUrl: './faq.css'
})
export class FaqComponent {
  faqItems: FaqItem[] = [
    {
      question: "Comment fonctionnent les enchères sur EnchereBeta ?",
      reponse: "Les enchères sur EnchereBeta fonctionnent de manière simple : chaque participant peut placer des offres sur les articles mis en vente. L'enchère se termine à une date précise, et le participant ayant fait la meilleure offre remporte l'article. Les frais de participation sont fixés à l'avance et doivent être payés pour participer.",
      isOpen: false
    },
    {
      question: "Quels sont les frais de participation ?",
      reponse: "Les frais de participation varient selon l'enchère. Ils sont clairement indiqués sur chaque fiche d'enchère avant que vous ne décidiez de participer. Ces frais couvrent les coûts d'organisation et garantissent la participation active des membres.",
      isOpen: false
    },
    {
      question: "Comment puis-je participer à une enchère ?",
      reponse: "Pour participer à une enchère, vous devez d'abord créer un compte sur EnchereBeta. Ensuite, sélectionnez l'enchère qui vous intéresse, payez les frais de participation, et vous pourrez commencer à placer vos offres jusqu'à la date de clôture.",
      isOpen: false
    },
    {
      question: "Comment sont sélectionnés les articles mis en enchère ?",
      reponse: "Les articles sont soigneusement sélectionnés par notre équipe pour garantir leur qualité et leur authenticité. Nous travaillons avec des vendeurs vérifiés et nous assurons que chaque article répond à nos critères de qualité avant d'être mis en enchère.",
      isOpen: false
    },
    {
      question: "Que se passe-t-il si je gagne une enchère ?",
      reponse: "Si vous remportez une enchère, vous recevrez une notification par email. Vous aurez alors 48 heures pour finaliser votre paiement. Une fois le paiement confirmé, l'article vous sera expédié dans les plus brefs délais.",
      isOpen: false
    },
    {
      question: "Comment puis-je être sûr de la sécurité des transactions ?",
      reponse: "Toutes les transactions sur EnchereBeta sont sécurisées par des protocoles de cryptage avancés. Nous utilisons des systèmes de paiement fiables et nous ne stockons jamais vos informations bancaires. De plus, chaque transaction est tracée et enregistrée pour votre sécurité.",
      isOpen: false
    }
  ];

  toggleFaq(index: number) {
    this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
  }
}
