import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Vendor } from './vendor.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepo: Repository<Vendor>,
  ) {}

  async create(dto: CreateVendorDto) {
    const existing = await this.vendorRepo.findOne({
      where: [{ name: dto.name }, { email: dto.email }],
    });

    if (existing) {
      throw new ConflictException(
        'Vendor with same name or email already exists',
      );
    }

    const vendor = this.vendorRepo.create(dto);
    return this.vendorRepo.save(vendor);
  }

  findAll() {
    return this.vendorRepo.find();
  }

  async findOne(id: number) {
    const vendor = await this.vendorRepo.findOne({
      where: { id },
      relations: ['purchaseOrders'], // ✅ ONLY THIS
    });

    if (!vendor) throw new NotFoundException('Vendor not found');

    // 🔥 No payments, no summary, no extra logic
    return vendor;
  }

  async update(id: number, dto: UpdateVendorDto) {
    const vendor = await this.vendorRepo.findOne({ where: { id } });
    if (!vendor) throw new NotFoundException('Vendor not found');

    Object.assign(vendor, dto);
    return this.vendorRepo.save(vendor);
  }
}
