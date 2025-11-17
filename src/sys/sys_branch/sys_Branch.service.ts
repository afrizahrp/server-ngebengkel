import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Sys_CreateBranchDto } from './dto/sys_CreateBranch.dto';
import { Sys_UpdateBranchDto } from './dto/sys_UpdateBranch.dto';
import { Sys_ResponseBranchDto } from './dto/sys_ResponseBranch.dto';

@Injectable()
export class Sys_BranchService {
  constructor(private prisma: PrismaService) {}

  async create(
    createBranchDto: Sys_CreateBranchDto,
  ): Promise<Sys_ResponseBranchDto> {
    const branch = await this.prisma.sys_Branch.create({
      data: {
        ...createBranchDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return this.mapToResponseDto(branch);
  }

  async findAll(): Promise<Sys_ResponseBranchDto[]> {
    const branches = await this.prisma.sys_Branch.findMany({
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    return branches.map(this.mapToResponseDto);
  }

  async findByCompanyId(company_id: string): Promise<Sys_ResponseBranchDto[]> {
    const branches = await this.prisma.sys_Branch.findMany({
      where: { company_id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    return branches.map(this.mapToResponseDto);
  }

  async findOne(id: string): Promise<Sys_ResponseBranchDto> {
    const branch = await this.prisma.sys_Branch.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }
    return this.mapToResponseDto(branch);
  }

  async update(
    id: string,
    updateBranchDto: Sys_UpdateBranchDto,
  ): Promise<Sys_ResponseBranchDto> {
    const branch = await this.prisma.sys_Branch.findUnique({
      where: { id },
    });
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }
    const updatedBranch = await this.prisma.sys_Branch.update({
      where: { id },
      data: updateBranchDto,
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return this.mapToResponseDto(updatedBranch);
  }

  async remove(id: string): Promise<void> {
    const branch = await this.prisma.sys_Branch.findUnique({
      where: { id },
    });
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }
    await this.prisma.sys_Branch.delete({
      where: { id },
    });
  }

  private mapToResponseDto(branch: any): Sys_ResponseBranchDto {
    return {
      id: branch.id?.trim(),
      name: branch.name?.trim(),
      slug: branch.slug?.trim(),
      iStatus: branch.iStatus,
      remarks: branch.remarks?.trim(),
      company_id: branch.company_id?.trim(),
      isMain: branch.isMain ?? false,
      company: branch.company
        ? {
            id: branch.company.id?.trim(),
            name: branch.company.name?.trim(),
          }
        : undefined,
    };
  }
}
