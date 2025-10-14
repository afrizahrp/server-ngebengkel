import { IsString, IsOptional, IsDate } from 'class-validator';

export class Cms_CreateProductSpecDto {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  itemFunctions: string;

  @IsString()
  @IsOptional()
  item_type: string;

  @IsString()
  @IsOptional()
  item_model: string;

  @IsString()
  @IsOptional()
  construction: string;

  @IsString()
  @IsOptional()
  mattress: string;

  @IsString()
  @IsOptional()
  mattressSize: string;

  @IsString()
  @IsOptional()
  mattressThickness: string;

  @IsString()
  @IsOptional()
  finishing: string;

  @IsString()
  @IsOptional()
  dimension: string;

  @IsString()
  @IsOptional()
  powerSupply: string;

  @IsString()
  @IsOptional()
  loadCapacity: string;

  @IsString()
  @IsOptional()
  systemFilter: string;

  @IsString()
  @IsOptional()
  accessories: string;

  @IsString()
  @IsOptional()
  sideRail: string;

  @IsString()
  @IsOptional()
  ivStand: string;

  @IsString()
  @IsOptional()
  wheels: string;

  @IsString()
  @IsOptional()
  maxLoad: string;

  @IsString()
  @IsOptional()
  size: string;

  @IsString()
  @IsOptional()
  weight: string;

  @IsString()
  @IsOptional()
  standSize: string;

  @IsString()
  @IsOptional()
  position: string;

  @IsString()
  @IsOptional()
  base: string;

  @IsString()
  @IsOptional()
  basePlate: string;

  @IsString()
  @IsOptional()
  cover: string;

  @IsString()
  @IsOptional()
  material: string;

  @IsString()
  @IsOptional()
  coverMaterial: string;

  @IsString()
  @IsOptional()
  typeScreen: string;

  @IsString()
  @IsOptional()
  powerConsumption: string;

  @IsString()
  @IsOptional()
  lamp: string;

  @IsString()
  @IsOptional()
  movers: string;

  @IsString()
  @IsOptional()
  rim: string;

  @IsString()
  @IsOptional()
  custodyFeet: string;

  @IsString()
  @IsOptional()
  foot: string;

  @IsString()
  @IsOptional()
  footWear: string;

  @IsString()
  @IsOptional()
  pole: string;

  @IsString()
  @IsOptional()
  inputVoltage: string;

  @IsString()
  @IsOptional()
  outputVoltage: string;

  @IsString()
  @IsOptional()
  sideGuard: string;

  @IsString()
  @IsOptional()
  footandheadPanel: string;

  @IsString()
  @IsOptional()
  temperatureControl: string;

  @IsString()
  @IsOptional()
  top: string;

  @IsString()
  @IsOptional()
  foodTray: string;

  @IsString()
  @IsOptional()
  traycorpse: string;

  @IsString()
  @IsOptional()
  pillowthecorpse: string;

  @IsString()
  @IsOptional()
  lightPole: string;

  @IsString()
  @IsOptional()
  sterilizing: string;

  @IsString()
  @IsOptional()
  filter: string;

  @IsString()
  @IsOptional()
  bodyFrame: string;

  @IsString()
  @IsOptional()
  underPressure: string;

  @IsString()
  @IsOptional()
  foundationTray: string;

  @IsString()
  @IsOptional()
  door: string;

  @IsString()
  @IsOptional()
  handle: string;

  @IsString()
  @IsOptional()
  medicineBox: string;

  @IsString()
  @IsOptional()
  handleTrolley: string;

  @IsString()
  @IsOptional()
  drawer: string;

  @IsString()
  @IsOptional()
  systemControl: string;

  @IsString()
  @IsOptional()
  bodyFrameWork: string;

  @IsString()
  @IsOptional()
  remarks: string;

  @IsString()
  @IsOptional()
  createdBy: string;

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsString()
  @IsOptional()
  updatedBy?: string;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  @IsString()
  company_id: string;

  @IsOptional()
  @IsString()
  branch_id?: string;
}
