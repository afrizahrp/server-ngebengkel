import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import { ThrottleGetEndpoints } from '../../auth/decorators/throttle.decorator';
import { AnonymousIdInterceptor } from '../../common/interceptors/anonymous-id.interceptor';
import { ApiKeyGuard } from '../../auth/guards/api-key.guard';
import { PainPointService } from './pain-point.service';
import { PainPointSeedService } from './services/pain-point-seed.service';
import { QueryPainPointDto } from './dto/query-pain-point.dto';
import { SearchPainPointDto } from './dto/search-pain-point.dto';
import { MatchPainPointDto } from './dto/match-pain-point.dto';
import { SeedPainPointDto } from './dto/seed-pain-point.dto';
import {
  PainPointResponseDto,
  PainPointDetailResponseDto,
  PainPointSearchResultDto,
  PainPointMatchResultDto,
} from './dto/response-pain-point.dto';

@Controller('/pain-points')
@UseInterceptors(AnonymousIdInterceptor) // Extract anonymous_id untuk tracking
export class PainPointController {
  constructor(
    private readonly painPointService: PainPointService,
    private readonly seedService: PainPointSeedService,
  ) {}

  /**
   * GET /api/pain-points
   * List pain points dengan pagination, filtering, sorting
   *
   * Public endpoint - tidak perlu login
   */
  @Get()
  @Public()
  @ThrottleGetEndpoints() // 100 requests per minute
  async findAll(@Query() query: QueryPainPointDto): Promise<{
    message: string;
    data: PainPointResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const result = await this.painPointService.findAll(query);

    return {
      message: 'Daftar pain points berhasil dimuat',
      ...result,
    };
  }

  /**
   * GET /api/pain-points/search?q=...
   * Search pain points dengan full-text search
   *
   * Public endpoint - tidak perlu login
   * 
   * IMPORTANT: Route ini harus SEBELUM @Get(':slug') agar tidak ditangkap sebagai parameter
   */
  @Get('search')
  @Public()
  @ThrottleGetEndpoints() // 100 requests per minute
  async search(@Query() query: SearchPainPointDto): Promise<{
    message: string;
    data: PainPointSearchResultDto[];
  }> {
    const data = await this.painPointService.search(query.q);

    return {
      message: 'Hasil pencarian pain points berhasil dimuat',
      data,
    };
  }

  /**
   * GET /api/pain-points/service-types
   * Helper endpoint untuk melihat service types yang tersedia
   * Berguna untuk keperluan seed data (melihat service type IDs yang bisa digunakan)
   *
   * Public endpoint - tidak perlu login
   * 
   * IMPORTANT: Route ini harus SEBELUM @Get(':slug') agar tidak ditangkap sebagai parameter
   */
  @Get('service-types')
  @Public()
  @ThrottleGetEndpoints() // 100 requests per minute
  async getServiceTypes(@Query('company_id') companyId?: string): Promise<{
    message: string;
    data: Array<{
      company_id: string;
      id: string;
      name: string;
      category: string | null;
      description: string | null;
    }>;
  }> {
    const data = await this.painPointService.getServiceTypes(companyId);

    return {
      message: 'Daftar service types berhasil dimuat',
      data,
    };
  }

  /**
   * GET /api/pain-points/:slug
   * Get pain point detail dengan related data berdasarkan slug
   *
   * Public endpoint - tidak perlu login
   * 
   * IMPORTANT: Route ini harus SETELAH semua route literal (search, service-types)
   * agar route literal tidak ditangkap sebagai parameter
   */
  @Get(':slug')
  @Public()
  @ThrottleGetEndpoints() // 100 requests per minute
  async findOne(@Param('slug') slug: string): Promise<{
    message: string;
    data: PainPointDetailResponseDto;
  }> {
    const data = await this.painPointService.findOne(slug);

    return {
      message: 'Detail pain point berhasil dimuat',
      data,
    };
  }

  /**
   * POST /api/pain-points/match
   * Match query ke pain point dengan confidence score
   *
   * Internal endpoint - perlu API key (tidak perlu user login)
   */
  @Post('match')
  @Public() // Skip global JWT guard
  @UseGuards(ApiKeyGuard) // Hanya ini yang perlu auth (API key)
  async match(@Body() body: MatchPainPointDto): Promise<{
    message: string;
    data: PainPointMatchResultDto | null;
  }> {
    const data = await this.painPointService.match(body.query);

    return {
      message: data
        ? 'Pain point berhasil ditemukan'
        : 'Pain point tidak ditemukan',
      data,
    };
  }

  /**
   * POST /api/internal/pain-points/seed
   * Seed pain points ke database menggunakan OpenAI
   *
   * Internal endpoint - perlu API key (tidak perlu user login)
   */
  @Post('seed')
  @Public() // Skip global JWT guard
  @UseGuards(ApiKeyGuard) // Hanya ini yang perlu auth (API key)
  async seed(@Body() body: SeedPainPointDto): Promise<{
    message: string;
    data: Awaited<ReturnType<typeof this.seedService.seed>>;
  }> {
    const result = await this.seedService.seed(
      body.count ?? 10,
      body.dryRun ?? false,
      body.overwrite ?? false,
    );

    return {
      message: result.message,
      data: result,
    };
  }
}
