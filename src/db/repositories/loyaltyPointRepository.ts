import { MoreThan, Repository } from "typeorm";
import { LoyaltyPoint } from "../models/LoyaltyPoints";

export class LoyaltyPointRepository {
  private repository: Repository<LoyaltyPoint>;

  constructor(_repository: Repository<LoyaltyPoint>) {
    this.repository = _repository;
  }

  // Thêm một điểm thưởng cho khách hàng
  async addLoyaltyPoint(
    customerId: number,
    points: number,
    expirationDate: Date
  ): Promise<LoyaltyPoint> {
    const loyaltyPoint = this.repository.create({
      customerId: customerId, // Tạo quan hệ với khách hàng
      points,
      expirationDate
    });
    return await this.repository.save(loyaltyPoint);
  }

  // Cập nhật điểm thưởng của khách hàng
  async updateLoyaltyPoint(
    loyaltyPointId: number,
    points: number,
    expirationDate: Date
  ): Promise<LoyaltyPoint> {
    const loyaltyPoint = await this.repository.findOne({
      where: { id: loyaltyPointId },
      relations: ["customer"]
    });
    if (loyaltyPoint) {
      loyaltyPoint.points = points;
      loyaltyPoint.expirationDate = expirationDate;
      return await this.repository.save(loyaltyPoint);
    }
    throw new Error("Loyalty Point not found");
  }

  // Lấy tất cả điểm thưởng
  async getAllLoyaltyPoints(): Promise<LoyaltyPoint[]> {
    return await this.repository.find({ relations: ["customer"] });
  }

  // Lấy điểm thưởng theo ID
  async getLoyaltyPointById(loyaltyPointId: number): Promise<LoyaltyPoint> {
    const loyaltyPoint = await this.repository.findOne({
      where: { id: loyaltyPointId },
      relations: ["customer"]
    });
    if (!loyaltyPoint) {
      throw new Error("Loyalty Point not found");
    }
    return loyaltyPoint;
  }

  // Xóa điểm thưởng của khách hàng
  async deleteLoyaltyPoint(loyaltyPointId: number): Promise<void> {
    const loyaltyPoint = await this.repository.findOne({
      where: { id: loyaltyPointId },
      relations: ["customer"]
    });
    if (!loyaltyPoint) {
      throw new Error("Loyalty Point not found");
    }
    await this.repository.remove(loyaltyPoint);
  }

  // Tìm kiếm điểm thưởng theo khách hàng
  async getLoyaltyPointsByCustomerId(
    customerId: number
  ): Promise<LoyaltyPoint[]> {
    return await this.repository.find({
      where: { customerId: customerId },
      relations: ["customer"]
    });
  }

  // Tìm kiếm điểm thưởng còn hiệu lực (chưa hết hạn)
  async getValidLoyaltyPoints(): Promise<LoyaltyPoint[]> {
    const currentDate = new Date();
    return await this.repository.find({
      where: { expirationDate: MoreThan(currentDate) },
      relations: ["customer"]
    });
  }

  // Cập nhật điểm thưởng cho một khách hàng (thêm vào số điểm hiện tại)
  async updateCustomerPoints(
    customerId: number,
    additionalPoints: number
  ): Promise<LoyaltyPoint> {
    const loyaltyPoint = await this.repository.findOne({
      where: { customerId: customerId },
      relations: ["customer"]
    });
    if (!loyaltyPoint) {
      throw new Error("Loyalty Point not found for this customer");
    }
    loyaltyPoint.points += additionalPoints;
    return await this.repository.save(loyaltyPoint);
  }
}
