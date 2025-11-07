import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { CreateWaitingListDto } from './dto/create-waiting-list.dto';
import { WaitingListResponseDto } from './dto/response-waiting-list.dto';

@Injectable()
export class WaitingListService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createWaitingListDto: CreateWaitingListDto,
  ): Promise<WaitingListResponseDto> {
    const normalizedEmail = createWaitingListDto.email;

    const existing = await this.prisma.wks_waitingList.findFirst({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictException('Email sudah terdaftar dalam waiting list');
    }

    const id = await this.generateId();

    const data = await this.prisma.wks_waitingList.create({
      data: {
        id,
        name: createWaitingListDto.name,
        address: createWaitingListDto.address,
        city: createWaitingListDto.city,
        district: createWaitingListDto.district,
        province: createWaitingListDto.province,
        email: normalizedEmail,
      },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        district: true,
        province: true,
        email: true,
      },
    });

    return data;
  }

  private async generateId(): Promise<string> {
    const lastEntry = await this.prisma.wks_waitingList.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true },
    });

    if (!lastEntry?.id) {
      return '0000000001';
    }

    const lastNumber = parseInt(lastEntry.id, 10);

    if (Number.isNaN(lastNumber)) {
      throw new InternalServerErrorException(
        'Format ID waiting list tidak valid',
      );
    }

    const nextNumber = lastNumber + 1;
    if (nextNumber > 9999999999) {
      throw new InternalServerErrorException(
        'ID waiting list melebihi batas maksimal',
      );
    }

    return nextNumber.toString().padStart(10, '0');
  }
}

