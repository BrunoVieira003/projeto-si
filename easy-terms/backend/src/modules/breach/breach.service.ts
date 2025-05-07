import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateBreachDto } from './dto/create-breach.dto';
import { EmailService } from '../email/email.service';
import { UserEntity } from '../user/entities/user.entity';
import { BreachIncident } from './entities/breach.entity';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class BreachService {
  constructor(
    @InjectRepository(BreachIncident) private breachRepo: Repository<BreachIncident>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private emailService: EmailService,
  ) {}

  async reportIncident(dto: CreateBreachDto) {
    try {
      // Usando 'In' para buscar múltiplos usuários por IDs
      const users = await this.userRepo.find({
        where: {
          id: In(dto.affectedUserIds.map(id => id.toString())), // Transformando IDs para string, se necessário
        },
      });

      if (users.length !== dto.affectedUserIds.length) {
        throw new BadRequestException('Alguns usuários não foram encontrados.');
      }

      const breach = this.breachRepo.create({
        description: dto.description,
        date: new Date(),
        affectedUsers: users,
      });
      await this.breachRepo.save(breach);

      // Enviar e-mails de notificação
      for (const user of users) {
        await this.emailService.sendEmail(
          user.email,
          'Notificação de Incidente de Dados',
          `<p>Olá, ${user.name},</p>
           <p>Identificamos um incidente que pode ter afetado seus dados: <strong>${dto.description}</strong>.</p>
           <p>Recomendamos alterar sua senha e acompanhar seu acesso.</p>`
        );
      }

      return { message: 'Incidente registrado e notificações enviadas.' };
    } catch (error) {
      // Log de erro e exceção
      throw new BadRequestException('Ocorreu um erro ao processar o incidente: ' + error.message);
    }
  }
}
