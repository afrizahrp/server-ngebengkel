import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Sys_CreateWhiteListEmailDto } from './dto/sys_CreateWhiteListEmail.dto';
import { Sys_UpdateWhiteListEmailDto } from './dto/sys_UpdateWhiteListEmail.dto';
import { Sys_ResponseWhiteListEmailDto } from './dto/sys_ResponseWhiteListEmail.dto';
import { Sys_CheckEmailDto } from './dto/sys_CheckEmailDto.dto';

@Injectable()
export class Sys_WhiteListEmailService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createWhiteListEmailDto: Sys_CreateWhiteListEmailDto,
  ): Promise<Sys_ResponseWhiteListEmailDto> {
    // Cek apakah email sudah ada
    const existingEmail = await this.prisma.sys_WhiteListEmail.findUnique({
      where: { email: createWhiteListEmailDto.email },
    });

    if (existingEmail) {
      throw new ConflictException('Email sudah ada dalam whitelistxx');
    }

    const whiteListEmail = await this.prisma.sys_WhiteListEmail.create({
      data: {
        ...createWhiteListEmailDto,
        id: Date.now(), // or use a UUID generator if your schema allows
      },
    });

    return whiteListEmail as Sys_ResponseWhiteListEmailDto;
  }

  async findAll(): Promise<Sys_ResponseWhiteListEmailDto[]> {
    const whiteListEmails = await this.prisma.sys_WhiteListEmail.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return whiteListEmails.map(this.mapToResponseDto);
  }

  async findOne(id: number): Promise<Sys_ResponseWhiteListEmailDto> {
    const whiteListEmail = await this.prisma.sys_WhiteListEmail.findUnique({
      where: { id },
    });

    if (!whiteListEmail) {
      throw new NotFoundException(
        `WhiteListEmail dengan ID ${id} tidak ditemukan`,
      );
    }

    return this.mapToResponseDto(whiteListEmail);
  }

  async findByEmail(
    email: string,
  ): Promise<Sys_ResponseWhiteListEmailDto | null> {
    const whiteListEmail = await this.prisma.sys_WhiteListEmail.findUnique({
      where: { email },
    });

    return whiteListEmail ? this.mapToResponseDto(whiteListEmail) : null;
  }

  async update(
    id: number,
    updateWhiteListEmailDto: Sys_UpdateWhiteListEmailDto,
  ): Promise<Sys_ResponseWhiteListEmailDto> {
    const whiteListEmail = await this.prisma.sys_WhiteListEmail.findUnique({
      where: { id },
    });

    if (!whiteListEmail) {
      throw new NotFoundException(
        `WhiteListEmail dengan ID ${id} tidak ditemukan`,
      );
    }

    // Jika email diupdate, cek apakah email baru sudah ada
    if (
      updateWhiteListEmailDto.email &&
      updateWhiteListEmailDto.email !== whiteListEmail.email
    ) {
      const existingEmail = await this.prisma.sys_WhiteListEmail.findUnique({
        where: { email: updateWhiteListEmailDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('Email sudah ada dalam whitelist');
      }
    }

    const updatedWhiteListEmail = await this.prisma.sys_WhiteListEmail.update({
      where: { id },
      data: updateWhiteListEmailDto,
    });

    return this.mapToResponseDto(updatedWhiteListEmail);
  }

  async remove(id: number): Promise<void> {
    const whiteListEmail = await this.prisma.sys_WhiteListEmail.findUnique({
      where: { id },
    });

    if (!whiteListEmail) {
      throw new NotFoundException(
        `WhiteListEmail dengan ID ${id} tidak ditemukan`,
      );
    }

    await this.prisma.sys_WhiteListEmail.delete({
      where: { id },
    });
  }

  /**
   * Method untuk mengecek apakah email ada dalam whitelist
   * Digunakan saat register atau login
   */
  async checkEmailInWhiteList(email: string): Promise<boolean> {
    const whiteListEmail = await this.prisma.sys_WhiteListEmail.findUnique({
      where: { email },
    });

    return !!whiteListEmail;
  }

  /**
   * Method untuk validasi email saat register/login
   * Akan throw error jika email tidak ada dalam whitelist
   */
  async validateEmailForAuth(email: string): Promise<void> {
    const isEmailInWhiteList = await this.checkEmailInWhiteList(email);

    if (!isEmailInWhiteList) {
      throw new BadRequestException(
        'Email tidak terdaftar dalam whitelist. Silakan hubungi administrator untuk mendaftarkan email Anda.',
      );
    }
  }

  private mapToResponseDto(whiteListEmail: any): Sys_ResponseWhiteListEmailDto {
    return {
      id: whiteListEmail.id,
      name: whiteListEmail.name,
      email: whiteListEmail.email,
      createdAt: whiteListEmail.createdAt,
    };
  }
}
