import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateCustomerDto {
  @IsOptional()
  @IsString()
  personId?: string;

  @IsOptional()
  @IsString({ message: 'Tên khách hàng phải là chuỗi văn bản' })
  fullName?: string;

  @IsOptional()
  @IsString({ message: 'Tên hiển thị phải là chuỗi văn bản' })
  displayName?: string;

  @IsOptional()
  @IsString({ message: 'Tên phải là chuỗi văn bản' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Công ty phải là chuỗi văn bản' })
  companyName?: string;

  @IsOptional()
  @IsString({ message: 'Chức danh phải là chuỗi văn bản' })
  jobTitle?: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Email phải là chuỗi' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi văn bản' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi văn bản' })
  note?: string;

  @IsOptional()
  @IsString({ message: 'Quy mô giao dịch phải là chuỗi' })
  pipelineAmount?: string;

  @IsOptional()
  @IsString({ message: 'Giá trị hợp đồng phải là chuỗi' })
  dealValue?: string;

  @IsOptional()
  @IsString({ message: 'Giai đoạn phải là chuỗi' })
  stage?: string;

  @IsOptional()
  @IsArray({ message: 'Nhãn phải là danh sách chuỗi' })
  tags?: string[];
}
